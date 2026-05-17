# Affiliate Program — Implementation Plan

A full affiliate system end-to-end. Below is exactly what will be built, in order.

## 1. Database (one migration)

Add to `profiles`:
- `affiliate_status` text ('none' | 'active' | 'pending' | 'rejected'), default 'none'
- `affiliate_code` text unique, nullable
- `referred_by` text, nullable (stores referrer's `affiliate_code`)
- `paypal_email` text, nullable (for payout)

New table `affiliate_referrals`:
- `id`, `affiliate_user_id`, `referred_user_id`, `affiliate_code`
- `status` ('pending' | 'confirmed' | 'paid' | 'invalid')
- `second_payment_at` timestamptz null
- `payout_ready_at` timestamptz null (second_payment_at + 7 days)
- `payout_paid_at` timestamptz null
- `amount_cents` int default 2900
- timestamps

New table `affiliate_payouts`:
- `id`, `affiliate_user_id`, `referral_id`, `amount_cents`, `status`, `notified_at`, `paid_at`

RLS:
- Users can read their own referrals / payouts
- Admins can read/update all
- Service role inserts/updates everything

RPC functions (SECURITY DEFINER):
- `approve_affiliate_application(application_id)` → updates application status + sets profile.affiliate_status='active' + generates unique `affiliate_code` (slug from display_name + 4 random chars, unique check)
- `reject_affiliate_application(application_id)`
- `get_affiliate_stats(user_id)` → returns totals (pending, confirmed, paid, earnings)
- `attach_referral_on_signup(new_user_id, ref_code)` → sets `referred_by`, inserts pending row in `affiliate_referrals`
- `mark_referral_second_payment(referred_user_id)` → updates referral row: status='confirmed', second_payment_at=now, payout_ready_at=now+7d
- `process_ready_payouts()` → returns rows where payout_ready_at < now AND affiliate has active subscription AND not yet paid; marks them ready for notification

## 2. Edge functions

**New: `send-affiliate-email`** — generic sender via Resend with two templates: `application_received`, `payout_ready`.

**New: `approve-affiliate-application`** — admin-callable, calls RPC + sends approval email with referral link.

**Update: `stripe-webhook`** — on `invoice.payment_succeeded` (or `customer.subscription.updated`), count successful payments for that customer. If count == 2, look up the user's `profiles.referred_by`. If set, call `mark_referral_second_payment`. Sends nothing yet — payout email is scheduled.

**New: `process-affiliate-payouts`** — cron-runnable. Picks `confirmed` referrals where `payout_ready_at <= now()` and affiliate has `user_has_active_subscription`. Marks payout status, sends "You earned $29" email. (Cron setup left as SQL the user runs manually per project memory.)

**Update: `AffiliateSignupModal`** flow — already creates application via `create_affiliate_application`. After insert, call `send-affiliate-email` with `application_received`.

## 3. Signup referral capture

- `src/pages/auth/Register.tsx`: read `?ref=` from URL on mount, store in `localStorage('catalyst_ref')`
- After successful signup, call `attach_referral_on_signup` with the stored code
- Clear localStorage after

## 4. Admin UI

In `src/components/admin/` add an `AffiliateApplicationsPanel` (or extend existing) with Accept / Reject buttons calling the new edge function / RPCs. Show pending list.

## 5. Affiliate Dashboard page

New route `/affiliate/dashboard` (protected, requires `affiliate_status='active'`):
- Hero: referral link + copy button + native share
- Stats grid: total / pending / confirmed referrals, total earnings ($29 × confirmed), payout status
- Share Tools section: 3 pre-written captions (Instagram, Story, WhatsApp) with copy buttons, link auto-injected, `[stage]` replaced from profile.motherhood_stage
- Rules card: 3 rules listed
- PayPal email input (saved to profile) for payouts

Link from `AffiliateButton` when `affiliate_status='active'` → goes to `/affiliate/dashboard`.

## 6. Brand colors

Use existing `catalyst-copper`, `catalyst-brown`, `catalyst-gold` tokens (per project memory). Map to the requested copper/cream/charcoal in the dashboard styling.

## Out of scope (not touched)
- TTC dashboard, Wellness page, FAQ page, other edge functions
- Actual money movement (PayPal/bank) — system only marks payouts ready and emails the affiliate

---

After you approve, I'll execute the migration first, then write the edge functions, then the UI.
