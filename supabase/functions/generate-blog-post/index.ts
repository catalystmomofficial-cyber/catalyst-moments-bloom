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

    // Verify admin status
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

    // Check admin status
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

    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured. Please add it to your Supabase project secrets.');
    }

    // Create SEO-optimized prompt
    const keywordList = keywords ? keywords.split(',').map((k: string) => k.trim()).join(', ') : '';
    const systemPrompt = `You are the lead content writer for Catalyst Mom — a maternal wellness platform for new moms ages 25–40 (US-based, first/second-time mothers, educated, overwhelmed, searching Google for REAL answers, not clinical jargon).

BRAND VOICE — non-negotiable:
- Write like a warm, knowledgeable best friend who happens to have medical knowledge.
- Empathetic, real, empowering. NEVER clinical or corporate.
- Use phrases naturally: "nobody tells you this", "real talk", "you are not alone", "this is normal".
- Avoid cold medical language. No "patient", no "subject", no "individuals".
- Tone: warm, supportive, professional-yet-friendly (${tone || 'professional yet friendly'}).

COMPETITIVE POSITIONING — fill the gaps Baby2Body, Maven Clinic, Peanut, The Bloom Method, and MUTU System do NOT cover well. Lean into these angles whenever the topic permits:

1. POSTPARTUM RECOVERY — week-by-week timelines, C-section recovery, hormone crash, pelvic floor recovery, night sweats, lochia timeline, perineal healing, what's normal bleeding.
2. FOURTH TRIMESTER — 12-week roadmap, friendship gap, what your body REALLY looks like after birth, postpartum rage, fourth-trimester essentials, partner support.
3. BREASTFEEDING — week-one pain reality, increasing milk supply naturally, breastfeeding/PPD link, knowing when to stop, combo feeding, cluster feeding survival, engorgement, mastitis.
4. POSTPARTUM MENTAL HEALTH — PPA vs PPD, mom loneliness, intrusive thoughts, postpartum OCD (1 in 25), asking for help without guilt, postpartum rage, matrescence.
5. MATERNAL WELLNESS PROTOCOLS — postpartum nutrition for healing/energy, iron-rich foods, hair loss, diastasis recti self-check, safe exercise 6+ weeks, beginner pelvic-floor exercises, sleep deprivation coping, return to exercise after C-section.
6. NEW MOM SELF-CARE — 10-min routines, showering with a newborn, self-care that isn't bubble baths, identity rebuilding, family boundaries, working-mom guilt.

TOPIC PRIORITY ORDER (when ambiguous): 1) postpartum recovery & fourth trimester → 2) breastfeeding → 3) mental health → 4) wellness/nutrition → 5) self-care/identity.

SEO REQUIREMENTS — every post MUST follow these:
- Minimum 1200 words of body content (do not pad with fluff).
- ONE <h1> containing the primary keyword naturally.
- <h2> tags use secondary keywords (postpartum recovery, fourth trimester, new mom, maternal wellness, breastfeeding tips, etc.).
- <h3> tags for sub-sections with supporting keywords.
- Meta title under 60 chars, contains primary keyword.
- Meta description under 160 chars, includes a benefit AND a call to action.
- Include an internal link in the body using EXACT anchor "personalized postpartum assessment" pointing to https://catalystmomofficial.com/assessment.
- End EVERY post with a clear CTA paragraph inviting the reader to take the Catalyst Mom personalized postpartum assessment (link to https://catalystmomofficial.com/assessment).
- Author is always "Catalyst Mom Team".
- FAQ section at the bottom with 5 questions REAL moms actually search on Google (use natural, conversational question phrasing).

CRITICAL FORMATTING INSTRUCTIONS:
- Output clean HTML only (no markdown, no asterisks, no hashtags, no \`\`\`html fences).
- Start the content with ONE <h1> containing the SEO title.
- Right after the H1, include: <p class="post-meta"><span class="read-time">⏱ {readTime} min read</span> · <span class="author">By Catalyst Mom Team</span> · <span class="category">{category}</span></p>
- Use <h2> / <h3> for structure, <p> for paragraphs, <ul>/<ol>+<li> for lists.
- Include the assessment link in the body as: <a href="https://catalystmomofficial.com/assessment">personalized postpartum assessment</a>
- Final CTA paragraph must also link to https://catalystmomofficial.com/assessment.
- End with the FAQ section:
  <h2>Frequently Asked Questions</h2>
  <div class="faq">
    <h3>Question 1?</h3><p>Answer 1.</p>
    <h3>Question 2?</h3><p>Answer 2.</p>
    <h3>Question 3?</h3><p>Answer 3.</p>
    <h3>Question 4?</h3><p>Answer 4.</p>
    <h3>Question 5?</h3><p>Answer 5.</p>
  </div>

Return ONLY valid JSON with this exact structure:
{
  "title": "SEO-optimized H1 title under 60 characters",
  "metaTitle": "SEO meta title under 60 characters",
  "metaDescription": "SEO meta description under 160 characters",
  "category": "One of: Postpartum Recovery | Maternal Wellness | Fourth Trimester | Self-Care | Breastfeeding | Pregnancy | TTC",
  "readTime": 7,
  "content": "Full blog post HTML beginning with <h1>, including <h2>/<h3>, <p>, lists, the meta line, and the FAQ section at the end",
  "excerpt": "Brief 150-character summary",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "faqs": [
    {"question": "Q1?", "answer": "A1"},
    {"question": "Q2?", "answer": "A2"},
    {"question": "Q3?", "answer": "A3"},
    {"question": "Q4?", "answer": "A4"},
    {"question": "Q5?", "answer": "A5"}
  ]
}`;

    const userPrompt = `Write a blog post about: ${topic}${keywordList ? `\n\nTarget keywords: ${keywordList}` : ''}`;

    console.log('Generating blog post with Claude...');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 8192,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 401) {
        return new Response(
          JSON.stringify({ error: 'Invalid ANTHROPIC_API_KEY. Please check your Supabase project secrets.' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`Anthropic API error: ${response.status} — ${errorText}`);
    }

    const aiData = await response.json();
    const rawContent = aiData.content?.[0]?.text || '';

    // Parse JSON — strip any accidental markdown fences
    const jsonStr = rawContent.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const generatedContent = JSON.parse(jsonStr);

    // Generate slug from title
    const slug = generatedContent.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Build FAQ JSON-LD schema for SEO
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

    // Embed meta info as hidden tags so it travels with the post
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

    // Insert blog post into database
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

    console.log('Blog post created successfully:', blogData.id);

    return new Response(
      JSON.stringify({
        success: true,
        blog: blogData,
        message: 'Blog post generated and saved as draft!'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-blog-post function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
