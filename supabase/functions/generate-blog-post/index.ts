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

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Create SEO-optimized prompt
    const keywordList = keywords ? keywords.split(',').map((k: string) => k.trim()).join(', ') : '';
    const systemPrompt = `You are an expert SEO blog writer for Catalyst Mom, a wellness platform for mothers. Write comprehensive, engaging blog posts that:
- Are 1200-1500 words long
- Include natural keyword placement (never force keywords)
- Have clear H2 and H3 headings for structure
- Include actionable tips and practical advice
- Are written in a warm, supportive ${tone || 'professional yet friendly'} tone
- End with a clear call-to-action
- Are optimized for Google search

Format the response as JSON with this structure:
{
  "title": "SEO-optimized title under 60 characters",
  "metaDescription": "Compelling meta description under 160 characters",
  "content": "Full blog post content in markdown format with ## for H2 and ### for H3",
  "excerpt": "Brief 150-character summary",
  "tags": ["tag1", "tag2", "tag3"]
}`;

    const userPrompt = `Write a blog post about: ${topic}${keywordList ? `\n\nTarget keywords: ${keywordList}` : ''}`;

    console.log('Generating blog post with Lovable AI...');

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
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your Lovable AI workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const generatedContent = JSON.parse(aiData.choices[0].message.content);

    // Generate slug from title
    const slug = generatedContent.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Insert blog post into database
    const { data: blogData, error: blogError } = await supabase
      .from('blogs')
      .insert({
        title: generatedContent.title,
        content: generatedContent.content,
        slug: slug,
        excerpt: generatedContent.excerpt,
        meta_description: generatedContent.metaDescription,
        tags: generatedContent.tags,
        author: user.email,
        published_at: new Date().toISOString(),
        status: 'published'
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
        message: 'Blog post generated and published successfully!' 
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
