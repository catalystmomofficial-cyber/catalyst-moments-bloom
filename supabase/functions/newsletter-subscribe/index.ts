import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubscribeRequest {
  email: string;
  interest?: string;
  source?: string;
}

const normalizeInterest = (value?: string) => {
  const input = (value || '').trim().toLowerCase();
  if (input.includes('postpartum')) return 'postpartum';
  if (input.includes('pregnan')) return 'pregnancy';
  if (input === 'ttc' || input.includes('conceiv') || input.includes('fertility')) return 'ttc';
  if (input.includes('nutrition')) return 'nutrition';
  if (input.includes('fitness') || input.includes('workout')) return 'fitness';
  if (input.includes('wellness') || input.includes('self-care')) return 'wellness';
  return 'general';
};

const normalizeSource = (value?: string) => {
  const input = (value || 'website').trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
  return input.slice(0, 50) || 'website';
};

const syncToOmnisend = async (email: string, interest: string, source: string) => {
  const apiKey = Deno.env.get('OMNISEND_API_KEY');
  if (!apiKey) throw new Error('OMNISEND_API_KEY not configured');

  const response = await fetch('https://api.omnisend.com/v3/contacts', {
    method: 'POST',
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      identifiers: [{
        type: 'email',
        id: email,
        channels: {
          email: { status: 'subscribed', statusDate: new Date().toISOString() },
        },
      }],
      tags: [
        'newsletter-subscriber',
        `newsletter-interest-${interest}`,
        `newsletter-source-${source}`,
      ],
      customProperties: {
        newsletter_interest: interest,
        newsletter_source: source,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Omnisend contact sync failed (${response.status})`);
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, interest: rawInterest, source: rawSource }: SubscribeRequest = await req.json();
    const normalizedEmail = email?.trim().toLowerCase();
    const interest = normalizeInterest(rawInterest);
    const source = normalizeSource(rawSource);

    if (!normalizedEmail) {
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
    if (!emailRegex.test(normalizedEmail)) {
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
      .eq('email', normalizedEmail)
      .single();

    if (existingSubscriber) {
      if (!existingSubscriber.is_active) {
        // Reactivate subscription
        await supabase
          .from('newsletter_subscribers')
          .update({
            is_active: true,
            subscribed_at: new Date().toISOString(),
            interest,
            source,
          })
          .eq('email', normalizedEmail);
      } else {
        await supabase
          .from('newsletter_subscribers')
          .update({ interest, source })
          .eq('email', normalizedEmail);
      }
    } else {
      // Insert new subscriber
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: normalizedEmail, interest, source }]);

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

    // Omnisend is the newsletter source of truth. Its workflow handles the
    // welcome email and future stage-specific sends; Resend remains reserved
    // for transactional product/account messages.
    EdgeRuntime.waitUntil(
      syncToOmnisend(normalizedEmail, interest, source).catch((syncError) => {
        console.error('Newsletter Omnisend sync failed:', syncError);
      }),
    );

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
