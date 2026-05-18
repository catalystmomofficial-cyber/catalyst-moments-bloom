import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const { data, error } = await admin.rpc("process_affiliate_payouts");
    if (error) throw error;

    const results: any[] = [];
    for (const row of (data || []) as any[]) {
      // Fetch affiliate info
      const { data: prof } = await admin
        .from("profiles")
        .select("display_name, user_id")
        .eq("user_id", row.affiliate_user_id)
        .maybeSingle();

      const { data: { user } } = await admin.auth.admin.getUserById(row.affiliate_user_id);
      const email = user?.email;
      if (!email) { results.push({ id: row.payout_id, skipped: "no_email" }); continue; }

      const { data: stats } = await admin.rpc("get_affiliate_stats", { p_user_id: row.affiliate_user_id });
      const totalCents = stats?.[0]?.total_earnings_cents ?? row.amount_cents;
      const totalEarnings = `$${(Number(totalCents) / 100).toFixed(2)}`;

      const r = await fetch(`${SUPABASE_URL}/functions/v1/send-affiliate-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${SERVICE_KEY}` },
        body: JSON.stringify({
          type: "payout_ready",
          to: email,
          name: prof?.display_name || "there",
          totalEarnings,
        }),
      });
      results.push({ id: row.payout_id, emailed: r.ok });
    }

    return new Response(JSON.stringify({ processed: results.length, results }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[process-affiliate-payouts]", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
