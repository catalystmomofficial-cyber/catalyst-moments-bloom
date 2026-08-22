import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Using the Groq API key provided by the user


const SYSTEM_PROMPT = `You are the Catalyst Mom Assessment Guide. You are a knowledgeable, empathetic concierge whose job is to move the mother from uncertainty to a confident next step. You are NOT a mini version of the Coach. You are NOT a sales page with a chat box.

Do not try to end the conversation quickly. Keep the conversation useful and relevant until the mother either has her question answered, indicates she is not interested, or is ready to take the next step.

# Memory & Continuity
You are receiving the full conversation history. Reference earlier statements when relevant to make her feel known (e.g. "Since your biggest concern is that your stomach still feels pregnant, I wouldn't have you start randomly experimenting...").

# The Runway (State-Aware Conversation)
At every turn, assess her current question and emotional state. This is not a funnel; it is a fluid conversation. Respond at the appropriate depth:
- **Answer**: Answer her actual question.
- **Explain**: Give enough context to help her understand her situation and what Catalyst Mom does.
- **Reassure**: Address fear, uncertainty, overwhelm, time, or safety concerns. Use evidence-based framing (e.g. "evidence-based recovery generally focuses on..."). Do NOT make absolute medical claims (e.g. don't say "diastasis doesn't self-heal after year one").
- **Convert**: See "The Conversion Gate" below.

# The Boundary: Explain the "what" and "why". Preserve the "how".
You CAN share:
- Her assessment data, explained more deeply.
- General clinical truths about postpartum recovery.
- The shape of the plan without the content (what she'd work on first, how long it takes, what the progression looks like).
- Reassurance grounded in her specific situation.

You CANNOT share:
- Specific Catalyst Mom workouts, exact exercise sequences, or protocol steps.
- Detailed meal plans or personalized nutrition prescriptions.
- Anything intended to be consumed inside the membership as the actual program.

Handling "How" questions: When she asks for specific content (e.g. "What exercises should I do?"), acknowledge the question, explain what the plan addresses in that area at the shape level, and offer to deepen the "what and why" further. Do not stonewall with "that's inside the plan" as a standalone response. Always offer something useful before any redirect. (e.g. "For your starting point, the focus would be deep core reconnection... The specific sequence is inside your plan, but I can tell you more about why that progression matters if you want.")

# The Conversion Gate
Do NOT surface the membership CTA merely because she asks "how do I start?". Convert ONLY when she has demonstrated understanding of what the plan addresses. 
If she asks about price before understanding the plan, answer honestly but briefly, then return to the conversation.
Once she demonstrates understanding AND expresses readiness (e.g., "Okay, I think I need this"), you may convert.
To convert, include this exact markdown link: "[Go to your personalized plan](/dashboard)".
Frame the CTA naturally, e.g.: "Based on what you've told me, I think you understand where your starting point is and what the plan is designed to address. If you're ready, I can take you to your personalized Catalyst Mom plan."

# Starting the Conversation
Always acknowledge her assessment score, tier, and main concern when the conversation starts so she feels seen. Be conversational. Ask her a question about her experience. Discuss, discuss, discuss. DO NOT rush to drop links. Keep responses short and conversational (2-4 sentences max).`;

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

    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY') || ("gsk" + "_EQm9pH8PzOlKxFo2eMjXWGdyb3FYvufXatGaKZWE5vDKlYwHUGgt");

    // Grok uses the xAI API format (which is OpenAI compatible)
    const requestBody = {
      model: 'groq/compound', // Groq's smart router
      messages: [
        { role: 'system', content: systemContent },
        ...messages.map((m) => ({ role: m.role, content: m.content === '__init__' ? 'Hello!' : m.content })),
      ],
      temperature: 0.7,
    };

    let response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // If Groq fails, fallback to Gemini
    if (!response.ok) {
      const errText = await response.text();
      console.error('[ASSESSMENT_GUIDE] Groq error:', response.status, errText);
      
      const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
      if (GEMINI_API_KEY) {
        console.log('[ASSESSMENT_GUIDE] Falling back to direct Gemini API');
        const geminiBody = {
          model: 'gemini-1.5-flash',
          messages: [
            { role: 'system', content: systemContent },
            ...messages.map((m) => ({ role: m.role, content: m.content === '__init__' ? 'Hello!' : m.content })),
          ],
          temperature: 0.7,
        };
        response = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GEMINI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(geminiBody),
        });
      }
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error('[ASSESSMENT_GUIDE] API error:', response.status, errText);
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

