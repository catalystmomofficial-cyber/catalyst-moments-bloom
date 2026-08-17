import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Use service-role key so we can read/write the profiles table securely
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // Anon client for auth token verification only
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const body = await req.json().catch(() => ({}));
    const priceId = body.priceId || "price_1S546jCNwyQa1NiQYpl3OjEe";
    const uiMode = body.uiMode || (body.hosted ? 'hosted' : 'embedded');
    logStep("Price ID received", { priceId, uiMode });

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not configured");

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // ── Fast customer lookup: check cached stripe_customer_id in profiles first ──
    let customerId: string | undefined;

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .maybeSingle();

    if (profile?.stripe_customer_id) {
      // Cache hit — skip the Stripe API list call entirely
      customerId = profile.stripe_customer_id;
      logStep("Customer ID from cache", { customerId });
    } else {
      // Cache miss — look up in Stripe and persist for next time
      logStep("Cache miss, looking up in Stripe");
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        // Persist so future calls skip this lookup
        await supabaseAdmin
          .from('profiles')
          .update({ stripe_customer_id: customerId })
          .eq('id', user.id);
        logStep("Existing Stripe customer found and cached", { customerId });
      } else {
        logStep("No existing customer — will be created during checkout");
      }
    }

    const lineItems = [{ price: priceId, quantity: 1 }];

    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    const protocol = req.headers.get("x-forwarded-proto") ?? "https";
    const origin = req.headers.get("origin") ?? (host ? `${protocol}://${host}` : undefined);
    if (!origin) throw new Error("Unable to determine app origin for redirect URLs");

    let session;
    if (uiMode === 'embedded') {
      session = await stripe.checkout.sessions.create({
        customer: customerId,
        customer_email: customerId ? undefined : user.email,
        line_items: lineItems,
        mode: "subscription",
        ui_mode: "embedded",
        return_url: `${origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      });
      logStep("Checkout session created (embedded)", { sessionId: session.id });
    } else {
      session = await stripe.checkout.sessions.create({
        customer: customerId,
        customer_email: customerId ? undefined : user.email,
        line_items: lineItems,
        mode: "subscription",
        ui_mode: "hosted",
        success_url: `${origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/dashboard?canceled=true`,
      });
      logStep("Checkout session created (hosted)", { sessionId: session.id, url: session.url });
    }

    return new Response(JSON.stringify({
      clientSecret: session.client_secret,
      url: session.url
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});