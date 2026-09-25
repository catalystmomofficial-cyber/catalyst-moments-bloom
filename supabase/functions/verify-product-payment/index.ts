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

  try {
    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("Missing sessionId");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabase.auth.getUser(token);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const paid =
      session.mode === 'payment' && session.payment_status === 'paid' && session.currency === 'usd';

    if (!paid) {
      return new Response(
        JSON.stringify({
          paid: false,
          status: session.payment_status,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    }

    const meta = session.metadata ?? {};
    if (meta.user_id !== user.id) {
      throw new Error("Session does not belong to this user");
    }

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { data, error } = await serviceClient.rpc(
      "fulfill_verified_product_payment",
      {
        p_product_slug: meta.product_slug,
        p_user_id: user.id,
        p_session_id: session.id,
        p_points_used: Number(meta.points_used ?? 0),
        p_amount_paid_cents: session.amount_total,
      } as any,
    );

    if (error) throw error;
    if (!data?.success) throw new Error(data?.error ?? 'Purchase could not be fulfilled');

    return new Response(
      JSON.stringify({
        paid: true,
        productSlug: meta.product_slug,
        result: data,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[VERIFY-PRODUCT-PAYMENT]", msg);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
