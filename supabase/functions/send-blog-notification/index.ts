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

const generateToken = () => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
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
  // Fail closed: otherwise anyone knowing the URL could blast subscribers
  // whenever the secret was missing or misconfigured.
  const secretCheck = checkSharedSecret(req, 'BLOG_NOTIFICATION_SECRET');
  if (secretCheck !== true) {
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

    const stageTags = ['ttc', 'pregnancy', 'postpartum'];
    const blogTags = Array.isArray(blog.tags)
      ? blog.tags.map((tag: string) => tag.toLowerCase())
      : [];
    const stage = stageTags.find((tag) => blogTags.includes(tag));

    // General readers receive the whole publication. Readers who selected a
    // motherhood stage only receive posts for that stage (plus general posts).
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('email, interest')
      .eq('is_active', true)
      .in('interest', stage ? ['general', stage] : ['general', 'ttc', 'pregnancy', 'postpartum', 'nutrition', 'fitness', 'wellness']);

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

    let sentCount = 0;
    let failedCount = 0;

    // Each subscriber receives an individual email. This keeps addresses
    // private and lets every message carry its own unsubscribe token.
    for (const subscriber of subscribers) {
      try {
        const normalizedEmail = subscriber.email.trim().toLowerCase();
        const { data: suppressed, error: suppressionError } = await supabase
          .from('suppressed_emails')
          .select('id')
          .eq('email', normalizedEmail)
          .maybeSingle();

        if (suppressionError) throw suppressionError;
        if (suppressed) {
          console.log('Skipping suppressed newsletter subscriber', { email: normalizedEmail });
          continue;
        }

        const { data: existingToken, error: tokenLookupError } = await supabase
          .from('email_unsubscribe_tokens')
          .select('token, used_at')
          .eq('email', normalizedEmail)
          .maybeSingle();

        if (tokenLookupError) throw tokenLookupError;

        let unsubscribeToken = existingToken?.token;
        if (!unsubscribeToken || existingToken?.used_at) {
          unsubscribeToken = generateToken();
          const { error: tokenError } = await supabase
            .from('email_unsubscribe_tokens')
            .upsert(
              { email: normalizedEmail, token: unsubscribeToken, used_at: null },
              { onConflict: 'email' },
            );
          if (tokenError) throw tokenError;
        }

        const unsubscribeUrl = `${siteUrl}/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;
        const emailHtml = await renderAsync(
          React.createElement(BlogNotificationEmail, {
            title: blog.title,
            excerpt: blog.excerpt || '',
            featured_image_url: blog.featured_image_url || undefined,
            slug: blog.slug || blog.id,
            site_url: siteUrl,
            unsubscribe_url: unsubscribeUrl,
          })
        );

        const { error: sendError } = await resend.emails.send({
          from: 'Catalyst Mom <newsletter@catalystmomofficial.com>',
          replyTo: 'hello@catalystmomofficial.com',
          to: normalizedEmail,
          subject: `New from Catalyst Mom: ${blog.title}`,
          html: emailHtml,
          headers: {
            'List-Unsubscribe': `<${unsubscribeUrl}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        });

        if (sendError) {
          console.error('Newsletter send error:', sendError);
          failedCount += 1;
        } else {
          sentCount += 1;
        }
      } catch (error) {
        console.error('Newsletter recipient error:', error);
        failedCount += 1;
      }

      // Resend's default API limit is two requests per second.
      await new Promise(resolve => setTimeout(resolve, 550));
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
