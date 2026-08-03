-- Let one account hold several devices.
--
-- push_subscriptions_user_id_unique (added to fix the subscribe failure) made
-- the table one-row-per-user. Combined with an upsert on user_id, that meant
-- every new device REPLACED the previous one: opting in on a laptop silently
-- unregistered the phone. A send afterwards still reported success, because a
-- valid token existed — it just was not the device the user was looking at.
--
-- fcm_token is the real identity of a subscription, and it already has a
-- unique index. Conflicting on that instead lets a user register a phone, a
-- tablet and a laptop, and re-registering the same device updates its own row
-- rather than evicting someone else's.

-- The constraint that forced one device per user.
DROP INDEX IF EXISTS public.push_subscriptions_user_id_unique;

-- Belt and braces: the same shape may exist as a table constraint depending on
-- how it was originally created.
ALTER TABLE public.push_subscriptions
  DROP CONSTRAINT IF EXISTS push_subscriptions_user_id_unique;

-- fcm_token is what the client now upserts on. It should already exist; this
-- is idempotent and guarantees the upsert has an arbiter to conflict against.
CREATE UNIQUE INDEX IF NOT EXISTS push_subscriptions_fcm_token_unique
  ON public.push_subscriptions (fcm_token) WHERE fcm_token IS NOT NULL;

-- Senders fan out by user, so this is the hot path for every push.
CREATE INDEX IF NOT EXISTS push_subscriptions_user_id_idx
  ON public.push_subscriptions (user_id);

-- Which device is which. Purely for debugging "why did my phone not get it" —
-- without it every row is an opaque token string.
ALTER TABLE public.push_subscriptions
  ADD COLUMN IF NOT EXISTS user_agent  TEXT,
  ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ DEFAULT now();

COMMENT ON COLUMN public.push_subscriptions.user_agent IS
  'Browser UA at subscribe time, so a stale row can be identified as "the old laptop".';

-- Show every registered device per user. If your phone is missing here after
-- opting in on it, the subscribe step failed rather than the send step.
--   SELECT user_id, left(fcm_token,12)||'...', user_agent, last_seen_at
--   FROM public.push_subscriptions ORDER BY user_id, last_seen_at DESC;
