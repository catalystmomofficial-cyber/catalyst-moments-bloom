import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BRAND_COPPER = "#B5651D";
const BRAND_CREAM = "#FDF6EE";
const BRAND_CHARCOAL = "#2C2218";

const wrap = (inner: string) => `
<!doctype html><html><body style="margin:0;padding:0;background:${BRAND_CREAM};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:${BRAND_CHARCOAL};">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    ${inner}
    <p style="text-align:center;color:#9b8270;font-size:12px;margin-top:32px;">Catalyst Mom · catalystmomofficial.com</p>
  </div>
</body></html>`;

const applicationReceived = (name: string) => wrap(`
  <div style="background:#fff;border-radius:16px;padding:32px;border:1px solid #f0e4d6;">
    <h1 style="color:${BRAND_COPPER};font-size:26px;margin:0 0 12px;">Application received, ${name} 🌸</h1>
    <p style="font-size:15px;line-height:1.6;">Thanks for applying to the Catalyst Mom Partner Program. Your application is under review — we'll get back to you within 48 hours.</p>
    <p style="font-size:15px;line-height:1.6;">Once approved you'll get your unique referral link and earn <strong>$29</strong> for every mama who stays past month two.</p>
  </div>`);

const applicationApproved = (name: string, link: string) => wrap(`
  <div style="background:#fff;border-radius:16px;padding:32px;border:1px solid #f0e4d6;">
    <h1 style="color:${BRAND_COPPER};font-size:26px;margin:0 0 12px;">You're in, ${name} 🎉</h1>
    <p style="font-size:15px;line-height:1.6;">Your affiliate account is active. Here's your unique referral link:</p>
    <div style="background:${BRAND_CREAM};border-radius:8px;padding:14px;margin:16px 0;word-break:break-all;font-weight:600;color:${BRAND_CHARCOAL};">${link}</div>
    <div style="text-align:center;margin:24px 0;">
      <a href="${link.replace('/signup?ref=', '/affiliate/dashboard?welcome=')}" style="display:inline-block;background:${BRAND_COPPER};color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;">Open Your Dashboard →</a>
    </div>
    <p style="font-size:13px;color:#6b5544;line-height:1.5;">You earn $29 after your referral completes their 2nd month. Payouts process 7 days after the 2nd payment clears.</p>
  </div>`);

const payoutReady = (name: string, totalEarnings: string) => wrap(`
  <div style="background:#fff;border-radius:16px;padding:32px;border:1px solid #f0e4d6;">
    <h1 style="color:${BRAND_COPPER};font-size:26px;margin:0 0 12px;">You earned $29 🎉</h1>
    <p style="font-size:15px;line-height:1.6;">Hey ${name}, your referral has been confirmed — they completed their 2nd month with Catalyst Mom.</p>
    <p style="font-size:15px;line-height:1.6;">Your <strong>$29</strong> payout will be sent via PayPal or bank transfer within 7 days.</p>
    <div style="background:${BRAND_CREAM};border-radius:8px;padding:16px;margin:20px 0;text-align:center;">
      <div style="font-size:13px;color:#6b5544;">Total earnings to date</div>
      <div style="font-size:28px;font-weight:700;color:${BRAND_COPPER};">${totalEarnings}</div>
    </div>
    <p style="font-size:13px;color:#6b5544;">Make sure your PayPal email is set on your affiliate dashboard so we know where to send it.</p>
  </div>`);

interface Body {
  type: "application_received" | "application_approved" | "payout_ready";
  to: string;
  name: string;
  link?: string;
  totalEarnings?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not set");

    const body = (await req.json()) as Body;
    if (!body.to || !body.type || !body.name) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let subject = "";
    let html = "";
    if (body.type === "application_received") {
      subject = "We received your Catalyst Mom Partner application";
      html = applicationReceived(body.name);
    } else if (body.type === "application_approved") {
      subject = "🎉 You're approved — Catalyst Mom Partner Program";
      html = applicationApproved(body.name, body.link || "");
    } else if (body.type === "payout_ready") {
      subject = "You earned $29 — your payout is ready";
      html = payoutReady(body.name, body.totalEarnings || "$29.00");
    } else {
      return new Response(JSON.stringify({ error: "Unknown type" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Catalyst Mom Partners <onboarding@resend.dev>",
        to: [body.to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Resend ${res.status}: ${txt}`);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[send-affiliate-email]", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
