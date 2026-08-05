import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Contraction {
  startTime: string | number;
  endTime: string | number;
  duration: number;
}

const average = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
const variance = (arr: number[]) => {
  const avg = average(arr);
  return average(arr.map((x) => Math.pow(x - avg, 2)));
};

function analyzeContractions(contractions: Contraction[]) {
  if (contractions.length < 3) return 'EARLY';

  const intervals: number[] = [];
  const durations: number[] = [];

  // Interval is START to START — the obstetric definition, and what the "5" in
  // 5-1-1 means. This used to measure startTime[i] - endTime[i-1], which is
  // the REST GAP between contractions: a different and always smaller number.
  // The client measured start-to-start, so the two engines were never
  // comparing the same quantity — that, not the thresholds, is why they
  // disagreed. It also over-escalated: contractions six minutes apart lasting
  // a minute leave a 300-second gap, which used to read as 5-1-1.
  for (let i = 1; i < contractions.length; i++) {
    intervals.push(
      (new Date(contractions[i].startTime).getTime() -
        new Date(contractions[i - 1].startTime).getTime()) / 1000,
    );
  }
  contractions.forEach((c) => durations.push(c.duration));

  const avgInterval = average(intervals);
  const avgDuration = average(durations);

  // Regularity as a standard deviation in seconds, not a raw variance. The old
  // gate was `variance(intervals) < 30` — variance is in SECONDS SQUARED, so
  // it demanded a standard deviation under about 5.5 seconds. Labour does not
  // run to a metronome: a woman in a genuine 5-1-1 pattern varying by half a
  // minute has a variance near 900 and could never reach READY. That is a
  // false negative, and false negatives keep her at home too long.
  const sd = Math.sqrt(variance(intervals));

  // All three parts of 5-1-1: five minutes apart, one minute long, holding
  // steady. The duration floor is the part most timers omit — contractions
  // every five minutes lasting twenty seconds are early labour, and sending
  // her in on interval alone gets her sent home again.
  if (avgInterval <= 300 && avgDuration >= 60 && sd <= 90) return 'READY';
  if (avgInterval <= 360 && avgDuration >= 50) return 'PREPARE';
  if (avgInterval <= 480) return 'BUILDING';
  return 'EARLY';
}

const COPY: Record<string, { title: string; body: string }> = {
  BUILDING: { title: 'Labor Progressing', body: "You're doing great 💛 Your contractions are getting closer." },
  PREPARE:  { title: 'Time to Prepare',   body: 'Things are progressing. You may want to start preparing.' },
  READY:    { title: 'Strong Pattern',    body: 'Your pattern looks consistent. Consider contacting your provider.' },
};

async function sendNotification(userId: string, state: string, authHeader: string) {
  const copy = COPY[state];
  if (!copy) return { skipped: true };
  const url = `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-push-blast`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
      apikey: Deno.env.get('SUPABASE_ANON_KEY')!,
    },
    body: JSON.stringify({
      title: copy.title,
      body: copy.body,
      url: '/pregnancy-tracker',
      user_ids: [userId],
    }),
  });
  return { ok: res.ok, status: res.status };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json();
    const contractions = body?.contractions;
    const lastNotifiedState: string | null = body?.lastNotifiedState ?? null;

    if (!Array.isArray(contractions)) {
      return new Response(JSON.stringify({ error: 'contractions must be an array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    for (const c of contractions) {
      if (!c || c.startTime == null || c.endTime == null || typeof c.duration !== 'number') {
        return new Response(JSON.stringify({ error: 'each contraction needs startTime, endTime, duration' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    const state = analyzeContractions(contractions as Contraction[]);

    let message = '';
    switch (state) {
      case 'READY': message = '5-1-1 pattern reached. Time to head to your birth place.'; break;
      case 'PREPARE': message = 'Active labor approaching. Get your bag and call your provider.'; break;
      case 'BUILDING': message = 'Labor is building. Rest, hydrate, and conserve energy.'; break;
      default: message = 'Early signs. Keep tracking — patterns will emerge.';
    }

    // Fire push if state escalated to BUILDING/PREPARE/READY and changed since last notify
    let notified: { state: string; ok?: boolean; status?: number; skipped?: boolean } | null = null;
    const authHeader = req.headers.get('Authorization');
    const triggerable = state === 'BUILDING' || state === 'PREPARE' || state === 'READY';
    if (triggerable && state !== lastNotifiedState && authHeader?.startsWith('Bearer ')) {
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_ANON_KEY')!,
          { global: { headers: { Authorization: authHeader } } },
        );
        const token = authHeader.replace('Bearer ', '');
        const { data, error } = await supabase.auth.getClaims(token);
        if (!error && data?.claims?.sub) {
          const r = await sendNotification(data.claims.sub, state, authHeader);
          notified = { state, ...r };
        }
      } catch (e) {
        console.error('notify error', e);
      }
    }

    return new Response(
      JSON.stringify({ state, message, count: contractions.length, notified }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
