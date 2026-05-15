import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, keywords, tone } = await req.json();

    if (!topic) {
      return new Response(
        JSON.stringify({ error: 'Topic is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authHeader = req.headers.get('Authorization')!;
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: adminData } = await supabase
      .from('admin_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!adminData) {
      return new Response(
        JSON.stringify({ error: 'Access denied. Admin privileges required.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured.');
    }

    const keywordList = keywords ? keywords.split(',').map((k: string) => k.trim()).join(', ') : '';
    const systemPrompt = `You are the lead content writer for Catalyst Mom - a maternal wellness platform for new moms ages 25-40 (US-based, first/second-time mothers, educated, overwhelmed, searching Google for REAL answers, not clinical jargon).

BRAND VOICE - non-negotiable:
- Write like a warm, knowledgeable best friend who happens to have medical knowledge.
- Empathetic, real, empowering. NEVER clinical or corporate.
- Use phrases naturally: "nobody tells you this", "real talk", "you are not alone", "this is normal".
- Avoid cold medical language. No "patient", no "subject", no "individuals".
- Tone: ${tone || 'professional yet friendly'}.

SEO REQUIREMENTS:
- Minimum 1200 words of body content.
- ONE <h1> with primary keyword. <h2>/<h3> for structure.
- Meta title <60 chars, meta description <160 chars.
- Include link <a href="https://catalystmomofficial.com/assessment">personalized postpartum assessment</a> in the body.
- End with CTA paragraph linking to https://catalystmomofficial.com/assessment.
- Author always "Catalyst Mom Team".
- FAQ section at the bottom with 5 real questions.

FORMATTING:
- Output clean HTML only (no markdown, no fences).
- Start with <h1>, then <p class="post-meta"><span class="read-time">Reading time: {readTime} min</span> - <span class="author">By Catalyst Mom Team</span> - <span class="category">{category}</span></p>
- End with: <h2>Frequently Asked Questions</h2><div class="faq"><h3>Q?</h3><p>A.</p>...</div>

Return ONLY valid JSON (no markdown fences) with this exact structure:
{
  "title": "...",
  "metaTitle": "...",
  "metaDescription": "...",
  "category": "Postpartum Recovery | Maternal Wellness | Fourth Trimester | Self-Care | Breastfeeding | Pregnancy | TTC",
  "readTime": 7,
  "content": "<h1>...full HTML...</div>",
  "excerpt": "...",
  "tags": ["tag1","tag2","tag3","tag4","tag5"],
  "faqs": [{"question":"Q?","answer":"A"}, ...5 total]
}`;

    const userPrompt = `Write a blog post about: ${topic}${keywordList ? `\n\nTarget keywords: ${keywordList}` : ''}`;

    console.log('Generating blog post via Lovable AI Gateway...');

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const callGateway = () => fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        response_format: { type: 'json_object' },
      }),
    });

    const callGeminiDirect = () => {
      const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
      if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured for fallback');
      return fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GEMINI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gemini-2.5-flash',
          messages,
          response_format: { type: 'json_object' },
        }),
      });
    };

    let response = await callGateway();

    if (!response.ok && (response.status === 402 || response.status === 429)) {
      const status = response.status;
      console.log('[generate-blog-post] Lovable AI unavailable, falling back to Gemini direct');
      try {
        response = await callGeminiDirect();
      } catch (fallbackError) {
        const message = status === 402
          ? 'AI credits depleted. Please add credits to continue.'
          : 'Rate limit exceeded. Please try again in a moment.';
        return new Response(JSON.stringify({ error: message }), {
          status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI error:', response.status, errorText);
      throw new Error(`AI error: ${response.status} - ${errorText}`);
    }

    const aiData = await response.json();
    const rawContent = aiData.choices?.[0]?.message?.content || '';

    if (!rawContent) {
      throw new Error('AI returned empty response');
    }

    const jsonStr = rawContent.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const generatedContent = JSON.parse(jsonStr);

    const slug = generatedContent.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const faqSchema = Array.isArray(generatedContent.faqs) && generatedContent.faqs.length > 0 ? `
<script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": generatedContent.faqs.map((f: any) => ({
    "@type": "Question",
    "name": f.question,
    "acceptedAnswer": { "@type": "Answer", "text": f.answer }
  }))
})}
</script>` : '';

    const metaBlock = `
<meta name="title" content="${(generatedContent.metaTitle || generatedContent.title).replace(/"/g, '&quot;')}" />
<meta name="description" content="${(generatedContent.metaDescription || generatedContent.excerpt || '').slice(0, 160).replace(/"/g, '&quot;')}" />
<meta name="category" content="${(generatedContent.category || 'Maternal Wellness').replace(/"/g, '&quot;')}" />
<meta name="read-time" content="${generatedContent.readTime || 7}" />
<meta name="author" content="Catalyst Mom Team" />`;

    const finalContent = `${metaBlock}\n${generatedContent.content}\n${faqSchema}`;

    const finalTags = Array.from(new Set([
      ...(generatedContent.tags || []),
      generatedContent.category || 'Maternal Wellness'
    ]));

    const { data: blogData, error: blogError } = await supabase
      .from('blogs')
      .insert({
        title: generatedContent.title,
        content: finalContent,
        slug: slug,
        excerpt: (generatedContent.metaDescription || generatedContent.excerpt || '').slice(0, 160),
        tags: finalTags,
        author: 'Catalyst Mom Team',
        published_at: null,
        status: 'draft',
        featured_image_url: null,
      })
      .select()
      .single();

    if (blogError) {
      console.error('Database error:', blogError);
      throw blogError;
    }

    console.log('Blog post created:', blogData.id);

    return new Response(
      JSON.stringify({ success: true, blog: blogData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-blog-post:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
