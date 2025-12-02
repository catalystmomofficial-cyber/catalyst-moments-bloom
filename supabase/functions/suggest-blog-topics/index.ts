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
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { focusArea } = await req.json();

    const systemPrompt = `You are a strategic content marketing expert specializing in the maternal wellness, pregnancy fitness, and women's health industry. Your goal is to suggest blog topics that will:

1. RANK HIGH in Google search results (SEO-optimized, targeting high-volume keywords)
2. CONVERT readers into customers (for fitness apps, digital wellness products, birth ball guides, postpartum programs)
3. BUILD BRAND AUTHORITY in the maternal wellness space
4. DRIVE ORGANIC TRAFFIC that can scale the business to $100M+ revenue

Brand context:
- Catalyst Mom is a comprehensive maternal wellness platform
- Products include: Birth Ball Guide (pregnancy exercises), Postpartum Glow Up programs, TTC (trying to conceive) support, meal plans, workout programs
- Target audience: Pregnant women, new moms, women trying to conceive, postpartum recovery
- Competitors: The Bloom Method, Expecting and Empowered, MUTU System

For each topic suggestion, consider:
- Search intent (informational, commercial, transactional)
- Keyword difficulty vs. search volume balance
- Content gaps competitors haven't filled
- Seasonal relevance and evergreen potential
- Lead generation and conversion opportunities`;

    const userPrompt = `Generate 5 strategic blog post topics${focusArea ? ` focused on: ${focusArea}` : ' across pregnancy, postpartum, and TTC niches'}.

For each topic, provide:
1. Title (SEO-optimized, compelling, 50-60 characters ideal)
2. Target keywords (primary + 2-3 secondary)
3. Search intent type
4. Why it will rank (competitive advantage)
5. Conversion angle (how it sells our products)
6. Estimated monthly search volume range

Format as JSON array:
[{
  "title": "...",
  "keywords": ["primary", "secondary1", "secondary2"],
  "searchIntent": "informational|commercial|transactional",
  "rankingRationale": "...",
  "conversionAngle": "...",
  "estimatedSearchVolume": "low|medium|high",
  "productTieIn": "Birth Ball Guide|Postpartum Program|TTC Support|Meal Plans|General"
}]

Return ONLY the JSON array, no other text.`;

    console.log('[suggest-blog-topics] Calling Lovable AI...');

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
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits depleted. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('[suggest-blog-topics] AI error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from AI');
    }

    console.log('[suggest-blog-topics] Raw AI response:', content);

    // Parse JSON from response (handle potential markdown code blocks)
    let suggestions;
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON array found in response');
      }
    } catch (parseError) {
      console.error('[suggest-blog-topics] Parse error:', parseError);
      throw new Error('Failed to parse AI suggestions');
    }

    console.log('[suggest-blog-topics] Parsed suggestions:', suggestions.length);

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[suggest-blog-topics] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
