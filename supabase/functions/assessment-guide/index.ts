import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Hardcoded for immediate use as requested (can be moved to Deno.env later)
const GROK_API_KEY = Deno.env.get("GROK_API_KEY");

const SYSTEM_PROMPT = `You are the Catalyst Mom Assessment Guide. You are a conversational, empathetic, and knowledgeable guide chatting with a mother who just got her free postpartum assessment results.

Your #1 job is to discuss her personalized results, unpack what they mean, and build trust BEFORE introducing the app. 

Rules:
1. ALWAYS acknowledge her assessment score, tier, and main concern when the conversation starts. Let her know you have her data so she feels seen.
2. DISCUSS her results. If her score is low, validate that it's normal and explain *why* she feels that way based on her stage.
3. BE CONVERSATIONAL. Ask her a question about her experience. Discuss, discuss, discuss. DO NOT rush to drop links.
4. DO NOT give away a full workout or meal plan. Give high-level direction (e.g., "We need to start by rebuilding your core connection...").
5. Keep responses short and conversational (2-4 sentences max).
6. WAIT for her to ask "How can I do that?" or "What's next?" or show intent BEFORE you drop the paywall link. 
7. ONLY when she is ready or asks for the plan, include a markdown link to the dashboard: "[Go to your dashboard](/dashboard)". Do NOT push the link in your very first message.

Example of a great first response: "Hey [Name]! I see you scored a [Score]/100 and you're in the [Tier] phase. You mentioned your biggest concern is [Concern]. First off, I want to say that is completely normal and you are not alone in feeling that way. Tell me a little bit more about how that has been affecting your day-to-day?"`;

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

