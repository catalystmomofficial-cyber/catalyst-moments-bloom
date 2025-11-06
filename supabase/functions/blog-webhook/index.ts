import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the user is authenticated
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized: Invalid authentication token');
    }

    const { title, content, excerpt, author, tags, featured_image_url, slug } = await req.json();

    if (!title || !content) {
      throw new Error('Title and content are required');
    }

    // Generate slug if not provided
    const finalSlug = slug || title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Insert blog post
    const { data, error } = await supabase
      .from('blogs')
      .insert({
        title,
        content,
        excerpt: excerpt || content.substring(0, 200) + '...',
        author: author || 'Catalyst Mom Team',
        tags: tags || [],
        featured_image_url,
        slug: finalSlug,
        status: 'published',
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting blog:', error);
      throw error;
    }

    console.log('Blog post created successfully:', data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Blog post published successfully',
        blog: data 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in blog-webhook:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
