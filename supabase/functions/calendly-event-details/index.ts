// Fetches a Calendly scheduled-event's start time + meeting join URL (Zoom)
// Called from the frontend after `calendly.event_scheduled` fires, using the event URI.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { eventUri } = await req.json().catch(() => ({}));
    if (!eventUri || typeof eventUri !== 'string' || !eventUri.startsWith('https://api.calendly.com/scheduled_events/')) {
      return new Response(JSON.stringify({ error: 'Invalid eventUri' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = Deno.env.get('CALENDLY_API_TOKEN');
    if (!token) {
      return new Response(JSON.stringify({ error: 'Calendly API token not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch(eventUri, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const text = await res.text();
      return new Response(JSON.stringify({ error: 'Calendly fetch failed', detail: text }), {
        status: res.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const data = await res.json();
    const ev = data?.resource ?? {};
    const loc = ev?.location ?? {};
    // Calendly Zoom integration exposes `location.join_url` (and sometimes `location.data.url`)
    const joinUrl: string | null =
      loc?.join_url ??
      loc?.data?.url ??
      (typeof loc?.location === 'string' && loc.location.startsWith('http') ? loc.location : null);

    return new Response(
      JSON.stringify({
        startTime: ev?.start_time ?? null,
        endTime: ev?.end_time ?? null,
        name: ev?.name ?? null,
        joinUrl,
        locationType: loc?.type ?? null,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
