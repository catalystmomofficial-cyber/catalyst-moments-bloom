import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Hardcoded for immediate use as requested (can be moved to Deno.env later)
const GROK_API_KEY = Deno.env.get("GROK_API_KEY");

const SYSTEM_PROMPT = `You are the Catalyst Mom Assessment Guide. You are a conversational, helpful promotional guide standing at the front door of the Catalyst Mom app.

Your #1 job is to be a guardrail: give the user a taste of their personalized results based on their assessment score, explain what it means, but DO NOT give them a full workout or meal plan. 

Instead, you must connect their assessment score and concerns to the app, and always guide them to unlock the full experience by clicking the dashboard link.

Rules:
1. ALWAYS acknowledge their assessment score and tier.
2. Tell them what their score indicates (e.g., if their score is low, they need foundational recovery).
3. Do not give away the actual program content. Give them high-level direction (e.g., "We need to start by rebuilding your core connection...").
4. Keep responses short and punchy.
5. In your responses, include a markdown link to the dashboard when urging them to continue: "[Unlock your plan here](/dashboard)" or "[Go to your dashboard](/dashboard)".

Example tone: "Hey [Name]! I see your assessment score is [Score]/100. That means you are in the [Tier] phase. Based on your main concern about [Concern], your Catalyst Mom plan is going to start by focusing on gentle core restoration. To see the exact daily steps and workouts I've prepared for you, [head over to your dashboard](/dashboard) to unlock the full plan!"`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Verify user auth
    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const messages: { role: string; content: string }[] = body.messages ?? [];

    if (!messages.length) {
      return new Response(JSON.stringify({ error: 'No messages provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch assessment data from profile
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: profile } = await admin
      .from('profiles')
      .select('display_name, motherhood_stage, assessment_data, assessment_concern, assessment_reflection')
      .eq('user_id', user.id)
      .maybeSingle();

    const ad = (profile?.assessment_data ?? {}) as Record<string, string>;
    const concern = profile?.assessment_concern ?? ad.concern ?? null;
    const firstName = profile?.display_name?.split(' ')[0] ?? null;

    const contextLines: string[] = [];
    if (firstName) contextLines.push(`Name: ${firstName}`);
    if (ad.score) contextLines.push(`Assessment Score: ${ad.score}/100`);
    if (ad.tier) contextLines.push(`Assessment Tier: ${ad.tier}`);
    if (concern) contextLines.push(`Main Concern: ${concern}`);
    if (ad.stage) contextLines.push(`Stage: ${ad.stage}`);

    const systemContent = contextLines.length > 0
      ? `${SYSTEM_PROMPT}\n\n## User Context (DO NOT IGNORE):\n${contextLines.join('\n')}`
      : SYSTEM_PROMPT;

    // Grok uses the xAI API format (which is OpenAI compatible)
    const requestBody = {
      model: 'grok-beta', // or grok-2-latest
      messages: [
        { role: 'system', content: systemContent },
        ...messages.map((m) => ({ role: m.role, content: m.content === '__init__' ? 'Hello!' : m.content })),
      ],
      temperature: 0.7,
    };

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[ASSESSMENT_GUIDE] xAI error:', response.status, errText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? '';

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('[ASSESSMENT_GUIDE] Error:', err);
    return new Response(JSON.stringify({ error: 'Something went wrong.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

