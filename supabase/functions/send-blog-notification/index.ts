import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@4.0.0";
import React from "npm:react@18.3.1";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { BlogNotificationEmail } from "./_templates/blog-notification.tsx";
import { checkSharedSecret, forbidden } from "../_shared/auth.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // ---- Authorization -------------------------------------------------------
  // Called by the notify_blog_published DB trigger, which presents the ANON
  // key (not service role), so a service-role/admin check would stop
  // subscriber emails from going out on publish. Gate on a shared secret.
  //
  // Fails OPEN while BLOG_NOTIFICATION_SECRET is unset so deploying this is
  // safe; fails closed once the trigger sends the header and the secret is
  // set. Without this, anyone knowing the URL could blast every subscriber.
  const secretCheck = checkSharedSecret(req, 'BLOG_NOTIFICATION_SECRET');
  if (secretCheck === false) {
    return forbidden(corsHeaders, 403, 'Invalid or missing webhook secret');
  }

  try {
    const { blog_id } = await req.json();
    
    if (!blog_id) {
      return new Response(
        JSON.stringify({ error: 'Blog ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY')!;
    const siteUrl = 'https://catalystmomofficial.com';

    const supabase = createClient(supabaseUrl, supabaseKey);
    const resend = new Resend(resendApiKey);

    // Fetch blog post details
    const { data: blog, error: blogError } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', blog_id)
      .single();

    if (blogError || !blog) {
      throw new Error('Blog post not found');
    }

    // Fetch all active newsletter subscribers
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('is_active', true);

    if (subscribersError) {
      throw subscribersError;
    }

    if (!subscribers || subscribers.length === 0) {
      console.log('No active subscribers found');
      return new Response(
        JSON.stringify({ message: 'No subscribers to notify' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Render email template
    const emailHtml = await renderAsync(
      React.createElement(BlogNotificationEmail, {
        title: blog.title,
        excerpt: blog.excerpt || '',
        featured_image_url: blog.featured_image_url || undefined,
        slug: blog.slug || blog.id,
        site_url: siteUrl,
      })
    );

    // Send emails in batches to avoid rate limits
    const batchSize = 50;
    const emailBatches = [];
    
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      emailBatches.push(batch);
    }

    let sentCount = 0;
    let failedCount = 0;

    for (const batch of emailBatches) {
      try {
        const { error: sendError } = await resend.emails.send({
          from: 'Catalyst Mom <blog@catalystmom.online>',
          to: batch.map(s => s.email),
          subject: `New from Catalyst Mom: ${blog.title}`,
          html: emailHtml,
        });

        if (sendError) {
          console.error('Batch send error:', sendError);
          failedCount += batch.length;
        } else {
          sentCount += batch.length;
        }
      } catch (error) {
        console.error('Batch error:', error);
        failedCount += batch.length;
      }

      // Small delay between batches
      if (emailBatches.indexOf(batch) < emailBatches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`Email notification sent to ${sentCount} subscribers, ${failedCount} failed`);

    return new Response(
      JSON.stringify({ 
        success: true,
        sent: sentCount,
        failed: failedCount,
        message: `Blog notification sent to ${sentCount} subscribers`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-blog-notification function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
