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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const now = new Date().toISOString();

    // Find all blogs scheduled to be published
    const { data: scheduledBlogs, error: fetchError } = await supabase
      .from('blogs')
      .select('*')
      .eq('status', 'draft')
      .not('scheduled_publish_at', 'is', null)
      .lte('scheduled_publish_at', now);

    if (fetchError) {
      throw fetchError;
    }

    if (!scheduledBlogs || scheduledBlogs.length === 0) {
      console.log('No blogs ready to publish');
      return new Response(
        JSON.stringify({ message: 'No blogs scheduled for publishing', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${scheduledBlogs.length} blogs ready to publish`);

    // Publish each blog
    const publishPromises = scheduledBlogs.map(blog =>
      supabase
        .from('blogs')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
          scheduled_publish_at: null
        })
        .eq('id', blog.id)
    );

    const results = await Promise.all(publishPromises);

    const successCount = results.filter(r => !r.error).length;
    const failureCount = results.filter(r => r.error).length;

    console.log(`Successfully published ${successCount} blogs, ${failureCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        published: successCount,
        failed: failureCount,
        message: `Published ${successCount} scheduled blog posts`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in publish-scheduled-blogs function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
