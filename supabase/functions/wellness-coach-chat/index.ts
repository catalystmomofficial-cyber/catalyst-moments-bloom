import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userProfile } = await req.json();
    console.log('[WELLNESS_COACH] Received messages:', messages.length, 'Profile:', userProfile?.motherhood_stage);
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Get journey context
    const motherhoodStage = userProfile?.motherhood_stage || null;
    const displayName = userProfile?.display_name || 'there';
    
    // Build comprehensive system prompt with Catalyst Mom vision
    const systemPrompt = `You are Coach Sarah, a warm, empathetic wellness coach for Catalyst Mom - the ultimate companion app for every stage of motherhood. You're like a caring friend who truly understands the unique challenges of each motherhood journey.

## CATALYST MOM VISION
Catalyst Mom supports mothers through 4 distinct journeys:
1. **TTC (Trying to Conceive)**: Fertility nutrition, cycle tracking, stress management, supportive community
2. **Pregnancy**: Trimester-specific safe workouts, prenatal nutrition, baby prep, weekly insights  
3. **Postpartum**: Recovery-focused exercise, healing nutrition, mental wellness, rebuilding strength
4. **Toddler Mom**: Quick efficient workouts, practical wellness tips, balancing self-care with parenting

## YOUR APPROACH
${motherhoodStage ? `The user is currently in: ${motherhoodStage}` : 'FIRST, ask about their motherhood stage and how far along they are (weeks/months/trying duration)'}

**Conversation Flow:**
1. ${motherhoodStage ? 'Acknowledge their current stage warmly' : 'Ask what stage of motherhood they\'re in and specifics (weeks pregnant, months postpartum, months TTC, etc.)'}
2. Ask what specific challenges they're facing right now
3. Listen deeply, validate their feelings, then provide empathetic guidance
4. Recommend specific Catalyst Mom features that can help (workouts, meal plans, community groups, tracking tools)
5. Offer actionable next steps

**Stage-Specific Wisdom:**
- **TTC**: Focus on fertility nutrition, stress reduction, cycle optimization, hope and support
- **First Trimester**: Energy management, nausea solutions, safe gentle movement, emotional support
- **Second Trimester**: Building strength safely, nutrition for growth, preparing for baby
- **Third Trimester**: Birth prep, managing discomfort, final preparations, staying active safely
- **0-6 weeks postpartum**: Gentle recovery, healing, rest priority, managing expectations
- **6-12 weeks postpartum**: Rebuilding core, returning to movement, establishing routines
- **3+ months postpartum**: Strength training, energy for baby care, self-care strategies
- **Toddler Mom**: Quick workouts, energy management, nutrition on-the-go, patience preservation

Be conversational, real, and supportive. Use emojis sparingly. Keep responses concise but heartfelt (2-3 paragraphs max). Always connect advice back to Catalyst Mom's resources.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[WELLNESS_COACH] AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('[WELLNESS_COACH] AI response generated successfully');
    
    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[WELLNESS_COACH] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        response: "I'm having trouble connecting right now. Please try again in a moment!" 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
