import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("Strip key");
    if (!stripeKey) throw new Error("Strip key is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, updating unsubscribed state");
      await supabaseClient.from("subscribers").upsert({
        email: user.email,
        user_id: user.id,
        stripe_customer_id: null,
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionTier = null;
    let subscriptionEnd = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      logStep("Active subscription found", { subscriptionId: subscription.id, endDate: subscriptionEnd });
      const priceId = subscription.items.data[0].price.id;
      const price = await stripe.prices.retrieve(priceId);
      const amount = price.unit_amount || 0;
      if (amount <= 999) {
        subscriptionTier = "Basic";
      } else if (amount <= 4999) {
        subscriptionTier = "Premium";
      } else {
        subscriptionTier = "Enterprise";
      }
      logStep("Determined subscription tier", { priceId, amount, subscriptionTier });
    } else {
      logStep("No active subscription found");
    }

    // Detect transition: was this user previously NOT subscribed?
    const { data: prevRow } = await supabaseClient
      .from("subscribers")
      .select("subscribed")
      .eq("email", user.email)
      .maybeSingle();
    const wasSubscribed = !!prevRow?.subscribed;

    await supabaseClient.from("subscribers").upsert({
      email: user.email,
      user_id: user.id,
      stripe_customer_id: customerId,
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    logStep("Updated database with subscription info", { subscribed: hasActiveSub, subscriptionTier });

    // 🔔 Notify all admins on NEW active subscription
    if (hasActiveSub && !wasSubscribed) {
      try {
        logStep("New subscription detected — notifying admins");

        const { data: profile } = await supabaseClient
          .from("profiles")
          .select("display_name")
          .eq("user_id", user.id)
          .maybeSingle();
        const memberName = profile?.display_name || user.email;

        const { data: adminRows } = await supabaseClient
          .from("admin_roles")
          .select("user_id");
        const adminIds: string[] = (adminRows ?? []).map((r: any) => r.user_id);
        logStep("Admins to notify", { count: adminIds.length });

        if (adminIds.length > 0) {
          const title = "💰 New subscription!";
          const message = `${memberName} just subscribed to ${subscriptionTier ?? 'Premium'}.`;

          // In-app notifications
          const rows = adminIds.map((aid) => ({
            user_id: aid,
            title,
            message,
            type: "success",
            action_url: "/admin",
          }));
          await supabaseClient.from("notifications").insert(rows);

          // Push notifications (best-effort)
          try {
            await supabaseClient.functions.invoke("send-push-notifications", {
              body: {
                title,
                body: message,
                url: "/admin",
                user_ids: adminIds,
              },
            });
          } catch (pushErr) {
            logStep("Push notify error (non-fatal)", { error: String(pushErr) });
          }
        }
      } catch (notifyErr) {
        logStep("Admin notify error (non-fatal)", { error: String(notifyErr) });
      }
    }

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});