-- Labour-day contacts.
--
-- The contraction timer detects a 5-1-1 pattern and tells her "it may be time
-- to contact your provider" — with no way to contact anyone. The triage loop
-- stopped one step short of the thing it exists for.
--
-- The number that matters is the TRIAGE line, not the office number. Office
-- lines go to voicemail at 3am, which is when she needs it. Asking for them
-- separately is the difference between a call button that works and one that
-- reaches an answerphone.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS provider_triage_phone TEXT,
  ADD COLUMN IF NOT EXISTS provider_name         TEXT,
  ADD COLUMN IF NOT EXISTS hospital_name         TEXT,
  ADD COLUMN IF NOT EXISTS backup_contact_name   TEXT,
  ADD COLUMN IF NOT EXISTS backup_contact_phone  TEXT;

COMMENT ON COLUMN public.profiles.provider_triage_phone IS
  'After-hours triage line, NOT the office number. This is what the contraction timer call button dials, so it has to be the one answered at 3am.';

COMMENT ON COLUMN public.profiles.backup_contact_phone IS
  'Partner or doula. Second tap when the provider line is engaged.';
