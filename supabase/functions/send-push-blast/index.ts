import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function base64UrlEncode(data: Uint8Array | string): string {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s+/g, '');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

interface ServiceAccount {
  client_email: string;
  private_key: string;
  project_id: string;
  token_uri?: string;
}

async function getAccessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: sa.token_uri || 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };
  const encHeader = base64UrlEncode(JSON.stringify(header));
  const encPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encHeader}.${encPayload}`;
  const keyData = pemToArrayBuffer(sa.private_key.replace(/\\n/g, '\n'));
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    keyData,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuf = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signingInput)
  );
  const jwt = `${signingInput}.${base64UrlEncode(new Uint8Array(sigBuf))}`;
  const res = await fetch(sa.token_uri || 'https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  if (!res.ok) throw new Error(`OAuth token error: ${res.status} ${await res.text()}`);
  const json = await res.json();
  return json.access_token;
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANON = Deno.env.get('SUPABASE_ANON_KEY')!;

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

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { title, body, image_url, url, user_ids, stages } = await req.json();

    if (!title || !body) {
      return new Response(JSON.stringify({ error: 'title and body required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const jsonResp = (status: number, payload: unknown) =>
      new Response(JSON.stringify(payload), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    // ---- Authorization (never trust the request to decide this) ----
    // Legitimate callers:
    //   1. Internal/cron functions using the service-role key -> full access
    //   2. An authenticated admin -> full access (broadcasts, stage segments)
    //   3. An authenticated user notifying ONLY themselves
    //      (e.g. analyze-contractions forwards the user's own JWT)
    const authHeader = req.headers.get('Authorization') || '';
    const bearer = authHeader.replace(/^Bearer\s+/i, '');
    const isServiceRole = bearer.length > 0 && bearer === SERVICE_ROLE;

    let isAdmin = false;
    let callerId: string | null = null;
    if (!isServiceRole) {
      if (!authHeader) return jsonResp(401, { error: 'Unauthorized' });
      const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: { apikey: ANON, Authorization: authHeader },
      });
      if (!userRes.ok) return jsonResp(401, { error: 'Invalid token' });
      const u = await userRes.json();
      callerId = u.id;
      const adminRes = await sbFetch(
        `/rest/v1/admin_roles?user_id=eq.${u.id}&role=eq.admin&select=role`
      );
      const adminRows = await adminRes.json();
      isAdmin = Array.isArray(adminRows) && adminRows.length > 0;
    }

    // A non-admin, non-service caller may target only their own user id —
    // no broadcasts, no stage segments, no other users.
    if (!isServiceRole && !isAdmin) {
      const onlySelf =
        Array.isArray(user_ids) &&
        user_ids.length > 0 &&
        (!Array.isArray(stages) || stages.length === 0) &&
        user_ids.every((id: string) => id === callerId);
      if (!onlySelf) {
        return jsonResp(403, { error: 'Not authorized to send to other users' });
      }
    }

    const sa: ServiceAccount = JSON.parse(Deno.env.get('FIREBASE_SERVICE_ACCOUNT')!);

    // Resolve target user IDs from explicit list + stage segments
    let targetIds: string[] | null = null;
    if (Array.isArray(user_ids) && user_ids.length > 0) {
      targetIds = [...user_ids];
    }
    if (Array.isArray(stages) && stages.length > 0) {
      const stageList = stages
        .filter((s: string) => ['ttc', 'pregnancy', 'postpartum', 'none'].includes(s))
        .map((s: string) => `"${s}"`)
        .join(',');
      if (stageList) {
        const profRes = await sbFetch(
          `/rest/v1/profiles?motherhood_stage=in.(${stageList})&select=user_id`
        );
        const profs: { user_id: string }[] = await profRes.json();
        const stageIds = profs.map((p) => p.user_id);
        targetIds = targetIds ? [...new Set([...targetIds, ...stageIds])] : stageIds;
      }
    }

    if (targetIds && targetIds.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0, failed: 0, total: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build target token list
    let query = `/rest/v1/push_subscriptions?fcm_token=not.is.null&select=user_id,fcm_token`;
    if (targetIds) {
      query += `&user_id=in.(${targetIds.join(',')})`;
    }
    const subsRes = await sbFetch(query);
    const subs: { user_id: string; fcm_token: string }[] = await subsRes.json();
    if (subs.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0, failed: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const accessToken = await getAccessToken(sa);
    const fcmUrl = `https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`;
    const icon = '/catalyst-mom-logo.png';

    const results = await Promise.allSettled(
      subs.map(async (sub) => {
        const message: any = {
          message: {
            token: sub.fcm_token,
            notification: { title, body, ...(image_url ? { image: image_url } : {}) },
            data: {
              url: url || '/',
              icon,
              title,
              body,
              ...(image_url ? { image: image_url } : {}),
            },
            webpush: {
              fcm_options: { link: url || '/' },
              notification: {
                icon,
                badge: icon,
                ...(image_url ? { image: image_url } : {}),
              },
            },
          },
        };
        const r = await fetch(fcmUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });
        if (!r.ok) {
          const errText = await r.text();
          if (r.status === 404 || r.status === 400) {
            await sbFetch(
              `/rest/v1/push_subscriptions?fcm_token=eq.${encodeURIComponent(sub.fcm_token)}`,
              { method: 'DELETE' }
            );
          }
          throw new Error(`FCM ${r.status}: ${errText}`);
        }
        return sub.user_id;
      })
    );

    const sent = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.length - sent;
    // Same reasoning as send-push-notifications: surface why sends failed
    // instead of only logging server-side, so a project-ID mismatch or an
    // expired key shows up directly in the admin panel.
    const errors = Array.from(new Set(
      results
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .map((r) => (r.reason instanceof Error ? r.reason.message : String(r.reason)))
    )).slice(0, 5);
    results.forEach((r) => {
      if (r.status === 'rejected') console.error('FCM send failed:', r.reason);
    });
    return new Response(JSON.stringify({ success: true, sent, failed, total: subs.length, ...(errors.length ? { errors } : {}) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('send-push-blast error:', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
