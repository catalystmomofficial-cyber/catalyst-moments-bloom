import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANON = Deno.env.get('SUPABASE_ANON_KEY')!;

type LifecycleType = 'welcome' | 'daily_workout' | 'meal_reminder' | 'inactivity';

const COPY: Record<LifecycleType, { title: string; body: string; url: string; prefField?: string }> = {
  welcome: {
    title: 'Welcome to Catalyst',
    body: 'Your transformation starts now.',
    url: '/dashboard',
  },
  daily_workout: {
    title: 'Your daily movement is ready',
    body: "Let's find your flow.",
    url: '/workouts',
    prefField: 'daily_reminders_enabled',
  },
  meal_reminder: {
    title: 'Time to nourish',
    body: 'Your customized meal plan is waiting.',
    url: '/recipes',
    prefField: 'daily_reminders_enabled',
  },
  inactivity: {
    title: 'Your journey is waiting for you',
    body: 'Come back and refocus.',
    url: '/dashboard',
    prefField: 'daily_reminders_enabled',
  },
};

async function sbFetch(path: string, init: RequestInit = {}) {
  return fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init.headers || {}),
      apikey: ANON,
      Authorization: `Bearer ${SERVICE_ROLE}`,
      'Content-Type': 'application/json',
    },
  });
}

async function getTargetUserIds(type: LifecycleType, explicitUserIds?: string[]): Promise<string[]> {
  if (explicitUserIds?.length) return explicitUserIds;

  if (type === 'inactivity') {
    // Users who haven't been active in 48h based on profiles.updated_at as a proxy
    // Safer: pull push_subscriptions joined to profiles via RPC-less filter
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    const r = await sbFetch(
      `/rest/v1/profiles?select=user_id&updated_at=lt.${cutoff}`
    );
    const rows: { user_id: string }[] = await r.json();
    return rows.map((x) => x.user_id);
  }

  // For scheduled types, target everyone with a push subscription; pref filter happens below
  const r = await sbFetch(`/rest/v1/push_subscriptions?fcm_token=not.is.null&select=user_id`);
  const rows: { user_id: string }[] = await r.json();
  return [...new Set(rows.map((x) => x.user_id))];
}

async function filterByPrefs(userIds: string[], prefField?: string): Promise<string[]> {
  if (!prefField || userIds.length === 0) return userIds;
  const r = await sbFetch(
    `/rest/v1/notification_preferences?user_id=in.(${userIds.join(',')})&${prefField}=eq.false&select=user_id`
  );
  const optedOut: { user_id: string }[] = await r.json();
  const blocked = new Set(optedOut.map((x) => x.user_id));
  return userIds.filter((id) => !blocked.has(id));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { type, user_ids } = await req.json() as { type: LifecycleType; user_ids?: string[] };
    if (!type || !COPY[type]) {
      return new Response(JSON.stringify({ error: 'Invalid lifecycle type' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const copy = COPY[type];
    let targets = await getTargetUserIds(type, user_ids);
    targets = await filterByPrefs(targets, copy.prefField);

    if (targets.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0, type }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Delegate to send-push-blast
    const blastRes = await fetch(`${SUPABASE_URL}/functions/v1/send-push-blast`, {
      method: 'POST',
      headers: {
        apikey: ANON,
        Authorization: `Bearer ${SERVICE_ROLE}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: copy.title,
        body: copy.body,
        url: copy.url,
        user_ids: targets,
      }),
    });
    const result = await blastRes.json();

    return new Response(JSON.stringify({ success: true, type, ...result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('send-lifecycle-notifications error:', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
