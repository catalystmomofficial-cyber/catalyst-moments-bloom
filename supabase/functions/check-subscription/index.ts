import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Use the service role key to perform writes (upsert) in Supabase
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

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

    // Check if user exists in subscribers table
    const { data: existingSubscriber, error: fetchError } = await supabaseClient
      .from("subscribers")
      .select("*")
      .eq("email", user.email)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      logStep("Error fetching subscriber", { error: fetchError });
      throw new Error(`Database error: ${fetchError.message}`);
    }

    if (existingSubscriber) {
      logStep("Found existing subscriber", { 
        subscribed: existingSubscriber.subscribed, 
        tier: existingSubscriber.subscription_tier,
        end: existingSubscriber.subscription_end 
      });

      // Check if subscription is still valid
      const now = new Date();
      const subscriptionEnd = existingSubscriber.subscription_end ? new Date(existingSubscriber.subscription_end) : null;
      const isActive = existingSubscriber.subscribed && (!subscriptionEnd || subscriptionEnd > now);

      return new Response(JSON.stringify({
        subscribed: isActive,
        subscription_tier: existingSubscriber.subscription_tier,
        subscription_end: existingSubscriber.subscription_end
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // No subscriber record found, create one with free status
    logStep("No subscriber found, creating free account");
    await supabaseClient.from("subscribers").insert({
      email: user.email,
      user_id: user.id,
      stripe_customer_id: null,
      subscribed: false,
      subscription_tier: null,
      subscription_end: null,
    });

    logStep("Created free subscriber record");
    return new Response(JSON.stringify({ 
      subscribed: false,
      subscription_tier: null,
      subscription_end: null 
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