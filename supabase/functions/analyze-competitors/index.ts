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

    const { competitors, niche } = await req.json();

    const defaultCompetitors = [
      'The Bloom Method',
      'Expecting and Empowered', 
      'MUTU System',
      'Every Mother',
      'Knocked Up Fitness',
      'Mommy Moves',
      'Birthfit',
      'Girls Gone Strong',
    ];

    const competitorList = competitors?.length > 0 ? competitors : defaultCompetitors;
    const focusNiche = niche || 'maternal wellness, pregnancy fitness, postpartum recovery';

    const systemPrompt = `You are a competitive intelligence analyst specializing in the maternal wellness and pregnancy fitness industry. Your expertise includes:
- SEO and content marketing analysis
- Identifying content gaps and market opportunities
- Understanding search intent and keyword strategies
- Analyzing competitor positioning and content themes

You have deep knowledge of these major competitors:
- The Bloom Method: Prenatal/postnatal fitness, pelvic floor focus
- Expecting and Empowered: Pregnancy workouts, strength training
- MUTU System: Diastasis recti, core restoration programs
- Every Mother: Evidence-based prenatal/postnatal programs
- Knocked Up Fitness: Prenatal fitness certification, workouts
- Birthfit: Functional fitness for pregnancy/postpartum
- Girls Gone Strong: Women's fitness, prenatal certification

Your analysis should help Catalyst Mom (a maternal wellness platform with Birth Ball Guide, postpartum programs, TTC support, meal plans) find opportunities competitors are missing.`;

    const userPrompt = `Analyze these competitors in the ${focusNiche} space: ${competitorList.join(', ')}

Provide a comprehensive competitor analysis including:

1. **TOP RANKING TOPICS** - What content themes are these competitors ranking well for?
2. **CONTENT GAPS** - Topics they're NOT covering well that have search demand
3. **KEYWORD OPPORTUNITIES** - Specific keywords with medium-high volume that competitors rank poorly for
4. **UNIQUE ANGLES** - Fresh perspectives or underserved audiences we can target
5. **PRODUCT TIE-IN OPPORTUNITIES** - How our products (Birth Ball Guide, Postpartum Programs, TTC Support, Meal Plans) can fill these gaps

Format as JSON:
{
  "competitorStrengths": [
    { "competitor": "...", "topTopics": ["..."], "contentStyle": "...", "weaknesses": ["..."] }
  ],
  "contentGaps": [
    { "topic": "...", "searchVolume": "low|medium|high", "competition": "low|medium|high", "opportunity": "...", "suggestedTitle": "...", "productTieIn": "..." }
  ],
  "keywordOpportunities": [
    { "keyword": "...", "monthlySearches": "...", "difficulty": "low|medium|high", "currentRankers": "...", "ourAngle": "..." }
  ],
  "uniqueAngles": [
    { "angle": "...", "targetAudience": "...", "differentiator": "...", "contentIdeas": ["..."] }
  ],
  "actionPriorities": [
    { "action": "...", "impact": "high|medium|low", "effort": "low|medium|high", "timeline": "..." }
  ]
}

Return ONLY the JSON, no other text.`;

    console.log('[analyze-competitors] Calling Lovable AI...');

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
      console.error('[analyze-competitors] AI error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from AI');
    }

    console.log('[analyze-competitors] Raw AI response length:', content.length);

    // Parse JSON from response
    let analysis;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON object found in response');
      }
    } catch (parseError) {
      console.error('[analyze-competitors] Parse error:', parseError);
      console.error('[analyze-competitors] Content preview:', content.substring(0, 500));
      throw new Error('Failed to parse competitor analysis');
    }

    console.log('[analyze-competitors] Analysis parsed successfully');

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[analyze-competitors] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
