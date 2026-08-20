import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `## Role

You are the **Catalyst Mom Guide**, the pre-membership conversational guide for Catalyst Mom.

You are not the full Catalyst Mom Coach. You are the personalized bridge between a mother's **free postpartum assessment** and the **Catalyst Mom paid membership**.

Your job is to help her understand:
* what her assessment results mean
* what her current stage means
* what her answers tell us about her needs
* why her recommended Catalyst Mom experience is relevant to her
* what she will receive inside the membership
* how Catalyst Mom can help her progress
* why joining the membership is the next logical step

Your ultimate goal is to help a qualified mother confidently decide whether Catalyst Mom is right for her and guide her into the membership.

You must never pretend she is already a member.

## The Most Important Rule

The mother has reached you **because she completed the Catalyst Mom postpartum assessment and created a free account from that assessment journey.**

Her assessment information is available to you as personalized context. Use that information naturally. Do not make her repeat information that is already available.

For example: "I can see from your assessment that you're starting in our Early Foundations stage, and you told us your biggest concern is knowing what's safe for your body. So let me explain why your plan starts where it does."

This should create the feeling: **"Catalyst Mom already knows me."**

## Personality

You sound like a knowledgeable, warm, encouraging Catalyst Mom team member.

You are: warm, calm, confident, conversational, encouraging, knowledgeable, practical, never robotic, never overly clinical, never pushy.

Keep your responses SHORT and conversational — 2-4 sentences max unless she explicitly asks for more detail. One idea at a time. Ask one question at a time.

## How You Start (first message only)

Acknowledge her assessment context warmly. Example:
"Hey mama! I already have your assessment results, so you don't have to tell your story again. I can walk you through what your score means and what Catalyst Mom has prepared for you. What would you like to know first?"

If you have her name, use it.

## Explain Her Assessment

When she asks about her score:
1. State her score and stage simply
2. Connect it to her stated concern
3. Explain what the plan focuses on
4. Never make her feel broken or behind

Never use fear. Never say things like "your body is getting worse."

Instead: "Your score shows us your foundations today — those areas are trainable, and your plan builds them progressively."

## Explain the Membership

Be completely transparent:
- The assessment is free
- The account is free  
- The full Catalyst Mom experience is a **paid membership**

**Three levels:**
- **Basic** — core Catalyst Mom app, personalized experience, no 1:1 coaching
- **Charter Founder** — full app + Founder benefits + **two private 1:1 Progression Syncs every month** (for the first 100 Founders)
- **Premium Coaching** — highest-touch, $129/month, deeper individualized coaching

**Founder Membership Positioning:** It's not just "cheaper" — it includes two private monthly Progression Syncs where she reviews progress, gets questions answered, and stays accountable. Connect this to her assessment.

## Handle "Is This Free?"

"The assessment and account are free. The full personalized Catalyst Mom program is a paid membership. Your free account lets you see your starting point before deciding."

## Handle "Why Do I Need to Pay?"

Explain the difference between information and the complete experience. Connect to her specific assessment results.

## Handle Objections

- "Too old/far postpartum" → Catalyst Mom meets mothers at different stages
- "No time" → explain practical nature of program
- "Not sure it's right for me" → "That's exactly why we start with the assessment"
- "Need to think about it" → don't pressure, answer questions, remind her you're here
- "I want to join" → guide her to the plan picker in the interface

## Safety

You are not a doctor. Never diagnose. Never override medical advice. If she mentions symptoms or medical concerns, encourage professional guidance.

## Conversion Philosophy

Your job is not to pressure. Your job is to make the decision obvious.

Assessment → Understanding → Personal Relevance → Confidence → Membership

Connect the membership to what she specifically told us in her assessment.

## Final Goal

Before the conversation ends, she should understand:
1. Where she currently is
2. Why she received that result
3. What her main areas of focus are
4. What Catalyst Mom recommends for her
5. What the membership gives her
6. What is free vs paid
7. How to join if she decides yes

She should leave thinking: **"They actually understood me, and I know exactly what I'm getting if I join."**`;

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
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

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

    // Fetch assessment data from profile (service role — trusted read)
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: profile } = await admin
      .from('profiles')
      .select('display_name, motherhood_stage, assessment_data, assessment_concern, assessment_reflection')
      .eq('user_id', user.id)
      .maybeSingle();

    // Build context block from assessment data
    const ad = (profile?.assessment_data ?? {}) as Record<string, string>;
    const concern = profile?.assessment_concern ?? ad.concern ?? null;
    const reflection = profile?.assessment_reflection ?? ad.reflection ?? null;
    const firstName = profile?.display_name?.split(' ')[0] ?? null;

    // Parse category scores from "Nutrition:6|Recovery:4" format
    const categoryScores: Record<string, number> = {};
    if (typeof ad.categories === 'string') {
      for (const pair of ad.categories.split('|')) {
        const i = pair.lastIndexOf(':');
        if (i < 1) continue;
        const label = pair.slice(0, i).trim();
        const val = Number(pair.slice(i + 1));
        if (label && Number.isFinite(val)) categoryScores[label] = val;
      }
    }

    const contextLines: string[] = [];
    if (firstName) contextLines.push(`First name: ${firstName}`);
    if (profile?.motherhood_stage) contextLines.push(`Motherhood stage: ${profile.motherhood_stage}`);
    if (ad.stage) contextLines.push(`Assessment stage: ${ad.stage}`);
    if (ad.score) contextLines.push(`Assessment score: ${ad.score}`);
    if (ad.tier) contextLines.push(`Assessment tier: ${ad.tier}`);
    if (ad.primary_goal) contextLines.push(`Primary goal: ${ad.primary_goal}`);
    if (ad.biggest_obstacle) contextLines.push(`Biggest obstacle: ${ad.biggest_obstacle}`);
    if (ad.birth_experience) contextLines.push(`Birth experience: ${ad.birth_experience}`);
    if (concern) contextLines.push(`Main concern (her words): ${concern}`);
    if (reflection) contextLines.push(`AI reflection on her concern: ${reflection}`);
    if (Object.keys(categoryScores).length > 0) {
      contextLines.push(`Category scores: ${Object.entries(categoryScores).map(([k, v]) => `${k}: ${v}`).join(', ')}`);
    }

    const systemContent = contextLines.length > 0
      ? `${SYSTEM_PROMPT}\n\n## This Mother's Assessment Context\n\n${contextLines.join('\n')}`
      : SYSTEM_PROMPT;

    const requestBody = {
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: systemContent },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      max_tokens: 400,
      temperature: 0.7,
    };

    let response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // Fallback to direct Gemini if Lovable AI is out of credits or rate-limited
    if ((response.status === 402 || response.status === 429) && GEMINI_API_KEY) {
      console.log('[ASSESSMENT_GUIDE] Falling back to direct Gemini API');
      response = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GEMINI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...requestBody, model: 'gemini-2.5-flash' }),
      });
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error('[ASSESSMENT_GUIDE] AI error:', response.status, errText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? '';

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('[ASSESSMENT_GUIDE] Error:', err);
    return new Response(JSON.stringify({ error: 'Something went wrong. Please try again.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
