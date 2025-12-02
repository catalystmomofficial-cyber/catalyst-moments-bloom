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

    const { month, year, postsPerWeek } = await req.json();
    
    const targetMonth = month || new Date().getMonth() + 1;
    const targetYear = year || new Date().getFullYear();
    const frequency = postsPerWeek || 3;

    const systemPrompt = `You are a content strategist specializing in the maternal wellness industry. You understand:

SEASONAL TRENDS for maternal wellness:
- January: New Year health goals, "new mom new me", fertility resolutions
- February: Valentine's self-love, partner bonding during pregnancy
- March: Spring renewal, pregnancy announcements (spring babies)
- April: Easter/spring activities, outdoor prenatal fitness
- May: Mother's Day, celebrating all stages of motherhood
- June: Summer body prep, staying cool during pregnancy, vacation fitness
- July: Mid-year check-ins, hydration during pregnancy, summer safety
- August: Back to school (postpartum moms returning), fall prep
- September: Fall routines, pregnancy fitness restart
- October: Halloween (pregnancy costumes), breast cancer awareness month
- November: Thanksgiving gratitude, holiday stress management
- December: Holiday self-care, year-end reflections, preparing for new year baby

OPTIMAL POSTING STRATEGY:
- Best days: Tuesday, Wednesday, Thursday (highest engagement)
- Best times: 9-10 AM, 1-2 PM (when moms take breaks)
- Mix content types: 40% educational, 30% inspirational, 20% product-focused, 10% community
- Include pillar content (comprehensive guides) monthly
- Tie posts to Catalyst Mom products: Birth Ball Guide, Postpartum Programs, TTC Support, Meal Plans

SEO CALENDAR CONSIDERATIONS:
- Plan content 2-3 months ahead of seasonal peaks
- Build topic clusters around pillar content
- Balance evergreen vs. trending topics`;

    const userPrompt = `Create a content calendar for ${getMonthName(targetMonth)} ${targetYear} with ${frequency} posts per week.

For each post, provide:
1. Suggested publish date (day of week + date)
2. Post title (SEO-optimized)
3. Content type (educational, inspirational, product, community, pillar)
4. Target keywords (2-3)
5. Seasonal/trend relevance
6. Product tie-in opportunity
7. Estimated time to create (hours)

Format as JSON:
{
  "month": "${getMonthName(targetMonth)}",
  "year": ${targetYear},
  "seasonalThemes": ["theme1", "theme2"],
  "keyDates": [{"date": "...", "event": "...", "contentOpportunity": "..."}],
  "posts": [
    {
      "weekNumber": 1,
      "publishDate": "Tuesday, ${getMonthName(targetMonth)} X",
      "title": "...",
      "contentType": "educational|inspirational|product|community|pillar",
      "keywords": ["..."],
      "seasonalRelevance": "...",
      "productTieIn": "Birth Ball Guide|Postpartum Program|TTC Support|Meal Plans|General",
      "estimatedHours": 2,
      "priority": "high|medium|low",
      "notes": "..."
    }
  ],
  "monthlyGoals": {
    "totalPosts": X,
    "pillarContent": X,
    "productPosts": X,
    "expectedTraffic": "...",
    "focusKeywords": ["..."]
  }
}

Return ONLY the JSON, no other text.`;

    console.log('[generate-content-calendar] Generating calendar for', targetMonth, targetYear);

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
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits depleted.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from AI');
    }

    let calendar;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        calendar = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch (parseError) {
      console.error('[generate-content-calendar] Parse error:', parseError);
      throw new Error('Failed to parse calendar');
    }

    console.log('[generate-content-calendar] Calendar generated with', calendar.posts?.length, 'posts');

    return new Response(JSON.stringify({ calendar }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[generate-content-calendar] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getMonthName(month: number): string {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month - 1] || 'January';
}
