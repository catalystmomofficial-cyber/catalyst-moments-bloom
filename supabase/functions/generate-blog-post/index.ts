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
    const systemPrompt = `You are an expert SEO blog writer for Catalyst Mom, a wellness platform for mothers.

Write a 1000-word SEO-optimized blog post that:
- Targets the provided keyword naturally throughout the content
- Naturally mentions and promotes the Catalyst Mom app and our protocol
- Talks about our personalized assessment (link: https://catalystmom.online/)
- Is written in a warm, supportive ${tone || 'professional yet friendly'} tone
- Ends with a clear call-to-action

CRITICAL FORMATTING INSTRUCTIONS:
- Format everything in clean HTML
- Use <h2> for subheadings
- Use <p> for paragraphs
- Use <ul>/<ol> and <li> for bullet or numbered lists
- Hyperlink all tools and product links using <a href="URL">text</a> tags
- Include the Catalyst Mom assessment link as: <a href="https://catalystmom.online/">personalized assessment</a>
- Do NOT include markdown, asterisks, hashtags, or "***html" text anywhere
- At the end, include: <p style="display:none;">Meta description: [Insert a 150-character SEO summary]</p>

Format the response as JSON with this structure:
{
  "title": "SEO-optimized title under 60 characters",
  "content": "Full blog post content in clean HTML format with <h2>, <p>, <ul>/<ol>, and <a> tags",
  "excerpt": "Brief 150-character summary",
  "tags": ["tag1", "tag2", "tag3"],
  "imagePrompt": "A professional, high-quality image description that represents the blog topic (for AI image generation)"
}`;

    const userPrompt = `Write a blog post about: ${topic}${keywordList ? `\n\nTarget keyword: ${keywordList}` : ''}`;

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

    console.log('Generating featured image with Gemini AI...');

    // Generate image using Gemini AI
    const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: generatedContent.imagePrompt || `Professional, high-quality image representing: ${topic}`
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    let featuredImageUrl = null;
    
    if (imageResponse.ok) {
      const imageData = await imageResponse.json();
      const base64Image = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      
      if (base64Image) {
        // Convert base64 to blob
        const base64Data = base64Image.split(',')[1];
        const imageBlob = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        
        // Upload to Supabase storage
        const fileName = `blog-${Date.now()}.png`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(fileName, imageBlob, {
            contentType: 'image/png',
            upsert: false
          });

        if (!uploadError && uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('blog-images')
            .getPublicUrl(fileName);
          featuredImageUrl = publicUrl;
          console.log('Image uploaded successfully:', featuredImageUrl);
        } else {
          console.error('Image upload error:', uploadError);
        }
      }
    } else {
      console.error('Image generation failed:', await imageResponse.text());
    }

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
        tags: generatedContent.tags,
        author: user.email,
        published_at: null,
        status: 'draft',
        featured_image_url: featuredImageUrl
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
