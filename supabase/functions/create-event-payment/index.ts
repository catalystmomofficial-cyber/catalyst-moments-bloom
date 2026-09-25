import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
  );

  try {
    const { eventId } = await req.json();

    if (typeof eventId !== 'string') {
      throw new Error("Missing/invalid fields: eventId, eventTitle, amountCents (min 50)");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");

    const scoped = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } });
    const { data: event, error: eventError } = await scoped.from('events').select('*').eq('id', eventId).single();
    if (eventError || !event || event.status !== 'upcoming') throw new Error('Event is not available');
    if (event.current_attendees >= event.max_capacity) throw new Error('Event is fully booked');
    const { data: member, error: memberError } = await scoped.rpc('is_premium_user');
    if (memberError) throw memberError;
    const amountCents = member ? (event.is_free_for_members ? 0 : event.price_member) : event.price_non_member;
    if (!Number.isSafeInteger(amountCents) || amountCents < 50) throw new Error('Use the free or points registration option');
    const eventTitle = event.title;
    const pointsUsed = 0;

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not configured");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    const customerId = customers.data[0]?.id;

    const origin = 'https://catalystmomofficial.com';

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: eventTitle,
              metadata: { event_id: String(eventId) },
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/community?event_payment=success&event_id=${encodeURIComponent(eventId)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/community?event_payment=cancelled`,
      metadata: {
        user_id: user.id,
        event_id: String(eventId),
        points_used: String(pointsUsed),
        amount_paid_cents: String(amountCents),
      },
    });

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
