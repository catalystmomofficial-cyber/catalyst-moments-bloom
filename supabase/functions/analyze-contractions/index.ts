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

  for (let i = 1; i < contractions.length; i++) {
    const interval =
      (new Date(contractions[i].startTime).getTime() -
        new Date(contractions[i - 1].endTime).getTime()) / 1000;
    intervals.push(interval);
  }
  contractions.forEach((c) => durations.push(c.duration));

  const avgInterval = average(intervals);
  const avgDuration = average(durations);
  const consistency = variance(intervals);

  if (avgInterval <= 300 && avgDuration >= 60 && consistency < 30) return 'READY';
  if (avgInterval <= 360 && avgDuration >= 50) return 'PREPARE';
  if (avgInterval <= 480) return 'BUILDING';
  return 'EARLY';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json();
    const contractions = body?.contractions;

    if (!Array.isArray(contractions)) {
      return new Response(
        JSON.stringify({ error: 'contractions must be an array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    for (const c of contractions) {
      if (
        c == null ||
        c.startTime == null ||
        c.endTime == null ||
        typeof c.duration !== 'number'
      ) {
        return new Response(
          JSON.stringify({ error: 'each contraction needs startTime, endTime, duration' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
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

    return new Response(
      JSON.stringify({ state, message, count: contractions.length }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
