ALTER TABLE public.newsletter_subscribers
  ADD COLUMN IF NOT EXISTS interest text NOT NULL DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'website';

ALTER TABLE public.newsletter_subscribers
  DROP CONSTRAINT IF EXISTS newsletter_subscribers_interest_check;

ALTER TABLE public.newsletter_subscribers
  ADD CONSTRAINT newsletter_subscribers_interest_check
  CHECK (interest IN ('general', 'ttc', 'pregnancy', 'postpartum', 'nutrition', 'fitness', 'wellness'));

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_interest
  ON public.newsletter_subscribers(interest)
  WHERE is_active = true;
