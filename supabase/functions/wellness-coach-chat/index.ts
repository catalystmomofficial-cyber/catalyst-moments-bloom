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
    const { messages } = await req.json();
    console.log('[WELLNESS_COACH] Received messages:', messages.length);
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build system prompt for wellness coach
    const systemPrompt = `You are a warm, supportive wellness coach for mothers - like a caring big sister at 2am who's there to listen and guide. Your role is to:

1. Start by asking about their motherhood stage and how far along they are (weeks/months)
2. After they share, ask about specific challenges they're facing
3. Based on their challenges, provide empathetic diagnosis and advice
4. Recommend relevant free resources from CatalystMom app

Be conversational, warm, and supportive. Use their stage and timeframe to personalize your responses. When discussing challenges, be specific about:
- TTC (Trying to Conceive): fertility tracking, nutrition, stress management
- Pregnancy: trimester-specific needs, prenatal fitness, nutrition, preparation
- Postpartum: recovery, self-care, energy management, baby care

Keep responses concise but heartfelt. Always end by mentioning CatalystMom has resources that can help.`;

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
