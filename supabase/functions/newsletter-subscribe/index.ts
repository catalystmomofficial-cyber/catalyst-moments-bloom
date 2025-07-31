import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubscribeRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: SubscribeRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('email, is_active')
      .eq('email', email)
      .single();

    if (existingSubscriber) {
      if (existingSubscriber.is_active) {
        return new Response(
          JSON.stringify({ message: "You're already subscribed to our newsletter!" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      } else {
        // Reactivate subscription
        await supabase
          .from('newsletter_subscribers')
          .update({ is_active: true, subscribed_at: new Date().toISOString() })
          .eq('email', email);
      }
    } else {
      // Insert new subscriber
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (insertError) {
        console.error('Database error:', insertError);
        return new Response(
          JSON.stringify({ error: "Failed to subscribe. Please try again." }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
    }

    // Send welcome email in background
    const sendWelcomeEmail = async () => {
      try {
        await resend.emails.send({
          from: "Catalyst Mom <info.mom@catalystchamber.com>",
          to: [email],
          subject: "Welcome to Catalyst Mom Newsletter! 🌟",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #2563eb; text-align: center;">Welcome to Catalyst Mom! 🌟</h1>
              
              <p>Thank you for subscribing to our newsletter! We're excited to have you join our community of amazing mothers.</p>
              
              <p>Here's what you can expect:</p>
              <ul>
                <li>🏋️‍♀️ Expert workout tips tailored for every stage of motherhood</li>
                <li>🥗 Nutrition guidance for TTC, pregnancy, and postpartum</li>
                <li>🧘‍♀️ Wellness insights and self-care strategies</li>
                <li>👥 Community highlights and inspiring stories</li>
                <li>📚 Early access to new resources and programs</li>
              </ul>
              
              <p>Stay tuned for our weekly updates filled with valuable content to support your motherhood journey!</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://your-app-url.com" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Explore Catalyst Mom</a>
              </div>
              
              <p style="color: #666; font-size: 14px; text-align: center;">
                If you no longer wish to receive these emails, you can unsubscribe at any time.
              </p>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
              
              <p style="color: #666; font-size: 12px; text-align: center;">
                Catalyst Chamber LLC<br>
                This email was sent to ${email}
              </p>
            </div>
          `,
        });
        console.log("Welcome email sent successfully to:", email);
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
      }
    };

    // Use background task for email sending
    EdgeRuntime.waitUntil(sendWelcomeEmail());

    return new Response(
      JSON.stringify({ 
        message: "Successfully subscribed! Check your email for a welcome message." 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in newsletter-subscribe function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error. Please try again." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);