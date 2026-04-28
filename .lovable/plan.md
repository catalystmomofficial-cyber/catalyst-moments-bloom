## Goal

Add a new Supabase Edge Function `stripe-webhook` that fires on Stripe `checkout.session.completed`, sends a branded welcome email via Resend, and syncs the customer into Omnisend with tags so your "Welcome Sequence" automation triggers.

## What gets built

### 1. New Edge Function: `supabase/functions/stripe-webhook/index.ts`

- **Public endpoint** (no JWT) — Stripe must reach it without an auth header. Will be added to `supabase/config.toml` with `verify_jwt = false`.
- **Raw body capture** — uses `await req.text()` (required for Stripe signature verification).
- **Signature verification** — `stripe.webhooks.constructEventAsync(body, sig, STRIPE_WEBHOOK_SECRET)` (the async variant is required in Deno because `crypto.subtle` is async).
- **Event filter** — only acts on `checkout.session.completed`. Other events return `200` immediately so Stripe doesn't retry.
- **Data extracted from session**: `customer_email` (falls back to `customer_details.email`), `customer_details.name`, `amount_total`, `currency`, `id`.
- **Action A — Resend email** (wrapped in try/catch, logged on failure):
  - From: `Catalyst Mom <onboarding@resend.dev>` (matches your existing `send-welcome-email` sender)
  - Subject: `You're In! Your Catalyst Mom Recovery Starts Now 🌸`
  - HTML body: warm, on-brand (catalyst-copper `#b87333` accents matching your transactional templates), confirms payment amount, CTA button to `https://catalystmomofficial.com/login`, and a "Add to Home Screen" reminder block for PWA recovery alerts.
- **Action B — Omnisend sync** (wrapped in try/catch, logged on failure):
  - `POST https://api.omnisend.com/v3/contacts`
  - Headers: `X-API-KEY: ${OMNISEND_API_KEY}`, `Content-Type: application/json`
  - Body: `{ identifiers: [{ type: "email", id: email, channels: { email: { status: "subscribed", statusDate: <iso> } } }], firstName, lastName, tags: ["source: stripe_payment", "status: paid_subscriber"] }`
- **Independent failure handling** — both actions run; one failing does not block the other. Webhook always returns `200` after attempting both (so Stripe doesn't retry on email/marketing hiccups). Errors are logged to function logs.

### 2. Config: `supabase/config.toml`

Add:
```
[functions.stripe-webhook]
verify_jwt = false
```

### 3. Secrets

Already configured: `STRIPE_SECRET_KEY`, `RESEND_API_KEY`.

Need to add (will prompt you):
- `STRIPE_WEBHOOK_SECRET` — get from Stripe Dashboard → Developers → Webhooks after creating the endpoint
- `OMNISEND_API_KEY` — get from Omnisend → Store settings → Integrations → API keys

### 4. Stripe Dashboard setup (you do this once after deploy)

1. Go to Stripe → Developers → Webhooks → Add endpoint
2. URL: `https://moxxceccaftkeuaowctw.supabase.co/functions/v1/stripe-webhook`
3. Select event: `checkout.session.completed`
4. Copy the signing secret (`whsec_…`) and paste it into `STRIPE_WEBHOOK_SECRET`

## Notes on existing setup

Your project currently sends the customer confirmation email **client-side** from `SubscriptionSuccess.tsx` after polling `check-subscription`. That works only if the user lands on the success page. This webhook becomes a **server-side backup** that fires the moment Stripe confirms payment — so even users who close the tab still get the welcome email and are added to your Omnisend sequence. The two paths are idempotent enough not to cause duplicates: Resend will send a second email if invoked twice, but the existing client-side call uses an `idempotencyKey` (`sub-confirm-${sessionId}`) — the new webhook will use a different key (`stripe-webhook-${sessionId}`) since it's a different template/sender concept. If you want strict dedup, say the word and I'll have the webhook reuse the same idempotency key as the client path.

## What I'll need from you after approval

1. Approve adding the two secrets (`STRIPE_WEBHOOK_SECRET`, `OMNISEND_API_KEY`) — I'll prompt with the add-secret tool.
2. After deploy, register the webhook in Stripe (URL above) and paste the signing secret.

<lov-actions>
<lov-link href="https://supabase.com/dashboard/project/moxxceccaftkeuaowctw/functions">Edge Functions dashboard</lov-link>
</lov-actions>
