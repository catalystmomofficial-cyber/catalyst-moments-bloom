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

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    // Get request body for plan type
    const { plan } = await req.json().catch(() => ({ plan: 'monthly' }));

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("ERROR: STRIPE_SECRET_KEY not found");
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      logStep("No existing customer found");
    }

    // Resolve a valid Stripe price for the subscription (handle product ID gracefully)
    let priceId: string | undefined;
    try {
      const productId = "prod_T16JB6CXsrZhg5";
      const product = await stripe.products.retrieve(productId);

      if (typeof product.default_price === 'string') {
        priceId = product.default_price;
        logStep("Using product's default price", { priceId });
      } else {
        const prices = await stripe.prices.list({ product: productId, active: true, type: 'recurring', limit: 10 });
        const monthly = prices.data.find(p => p.recurring?.interval === 'month' && p.currency === 'usd');
        if (monthly) {
          priceId = monthly.id;
          logStep("Found monthly price", { priceId, unit_amount: monthly.unit_amount });
        } else {
          const created = await stripe.prices.create({
            unit_amount: 2900,
            currency: 'usd',
            recurring: { interval: 'month' },
            product: productId,
            lookup_key: 'catalystmom_monthly_29usd'
          });
          priceId = created.id;
          logStep("Created monthly price", { priceId, unit_amount: created.unit_amount });
        }
      }
    } catch (e) {
      // If the provided product ID belongs to live mode while using a test key, create a fallback test product/price
      logStep("ERROR resolving price", { message: e instanceof Error ? e.message : String(e) });
      logStep("Falling back to creating a TEST product and $29 monthly price");
      const fallbackProduct = await stripe.products.create({
        name: 'Catalyst Mom Monthly',
        default_price_data: {
          unit_amount: 2900,
          currency: 'usd',
          recurring: { interval: 'month' }
        },
      });
      if (typeof fallbackProduct.default_price === 'string') {
        priceId = fallbackProduct.default_price;
      }
      logStep("Created fallback product and price", { productId: fallbackProduct.id, priceId });
    }

    if (!priceId) {
      throw new Error('Failed to resolve or create a Stripe price for $29/month');
    }

    const lineItems = [
      { price: priceId!, quantity: 1 }
    ];
    
    logStep("Created line items", { plan, priceId });

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: lineItems,
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/dashboard?success=true`,
      cancel_url: `${req.headers.get("origin")}/cancel`,
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
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