import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const log = (step: string, details?: any) => {
  console.log(`[STRIPE-WEBHOOK] ${step}${details ? ` - ${JSON.stringify(details)}` : ""}`);
};

const WELCOME_HTML = (name: string, amount: string) => `
<!doctype html>
<html><body style="margin:0;padding:0;background:#fdf8f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#3d2817;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#b87333;font-size:32px;margin:0 0 8px;font-weight:700;">You're In, ${name} 🌸</h1>
      <p style="color:#6b5544;font-size:16px;margin:0;">Your Catalyst Mom recovery starts now.</p>
    </div>
    <div style="background:#fff;border-radius:16px;padding:32px;border:1px solid #f0e4d6;box-shadow:0 4px 12px rgba(184,115,51,0.08);">
      <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">Hey ${name},</p>
      <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">Your payment of <strong style="color:#b87333;">${amount}</strong> went through. You now have full access to every recovery plan, tracker, and live coaching session inside Catalyst Mom.</p>
      <p style="font-size:16px;line-height:1.6;margin:0 0 24px;">No fluff. No "consistency is key." Just the work that actually moves the needle.</p>
      <div style="text-align:center;margin:32px 0;">
        <a href="https://catalystmomofficial.com/login" style="display:inline-block;background:#b87333;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px;">Log In & Start →</a>
      </div>
      <div style="background:#fdf8f3;border-radius:12px;padding:20px;margin-top:24px;">
        <p style="font-size:14px;font-weight:600;margin:0 0 8px;color:#b87333;">📱 One more thing:</p>
        <p style="font-size:14px;line-height:1.5;margin:0;color:#6b5544;">Add Catalyst Mom to your home screen so you get recovery alerts and never miss a session. Open the site on your phone → tap Share → "Add to Home Screen."</p>
      </div>
    </div>
    <p style="text-align:center;color:#9b8270;font-size:13px;margin-top:24px;">Catalyst Mom · catalystmomofficial.com</p>
  </div>
</body></html>`;

async function sendWelcomeEmail(email: string, name: string, amount: string, sessionId: string) {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not set");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `stripe-webhook-${sessionId}`,
    },
    body: JSON.stringify({
      from: "Catalyst Mom <onboarding@resend.dev>",
      to: [email],
      subject: "You're In! Your Catalyst Mom Recovery Starts Now 🌸",
      html: WELCOME_HTML(name, amount),
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Resend ${res.status}: ${txt}`);
  }
  log("Welcome email sent", { email });
}

async function syncToOmnisend(email: string, firstName: string, lastName: string) {
  const OMNISEND_API_KEY = Deno.env.get("OMNISEND_API_KEY");
  if (!OMNISEND_API_KEY) throw new Error("OMNISEND_API_KEY not set");

  const res = await fetch("https://api.omnisend.com/v3/contacts", {
    method: "POST",
    headers: {
      "X-API-KEY": OMNISEND_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      identifiers: [
        {
          type: "email",
          id: email,
          channels: {
            email: { status: "subscribed", statusDate: new Date().toISOString() },
          },
        },
      ],
      firstName,
      lastName,
      tags: ["source: stripe_payment", "status: paid_subscriber"],
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Omnisend ${res.status}: ${txt}`);
  }
  log("Omnisend contact synced", { email });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not set");
    if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const sig = req.headers.get("stripe-signature");
    if (!sig) throw new Error("Missing stripe-signature header");

    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
    log("Event received", { type: event.type, id: event.id });

    if (event.type !== "checkout.session.completed") {
      return new Response(JSON.stringify({ received: true, ignored: event.type }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email || session.customer_details?.email;
    const fullName = session.customer_details?.name || "";
    const [firstName, ...rest] = fullName.split(" ");
    const lastName = rest.join(" ");
    const amount = session.amount_total
      ? `${(session.amount_total / 100).toFixed(2)} ${(session.currency || "usd").toUpperCase()}`
      : "your subscription";

    if (!email) {
      log("No email on session, skipping", { sessionId: session.id });
      return new Response(JSON.stringify({ received: true, skipped: "no_email" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Run both independently — one failing doesn't block the other
    await Promise.allSettled([
      sendWelcomeEmail(email, firstName || "there", amount, session.id).catch((e) =>
        log("Email failed", { error: String(e) })
      ),
      syncToOmnisend(email, firstName || "", lastName || "").catch((e) =>
        log("Omnisend failed", { error: String(e) })
      ),
    ]);

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    log("ERROR", { message: msg });
    return new Response(JSON.stringify({ error: msg }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
