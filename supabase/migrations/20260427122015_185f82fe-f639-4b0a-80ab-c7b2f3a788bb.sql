ALTER TABLE public.push_subscriptions
  ADD COLUMN IF NOT EXISTS fcm_token TEXT,
  ALTER COLUMN endpoint DROP NOT NULL,
  ALTER COLUMN auth_key DROP NOT NULL,
  ALTER COLUMN p256dh_key DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS push_subscriptions_fcm_token_unique
  ON public.push_subscriptions (fcm_token) WHERE fcm_token IS NOT NULL;