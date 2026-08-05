-- Diastasis measurements — the number that goes inside the recovery ring.
--
-- Every competitor draws the baby during pregnancy and stops at birth. Nobody
-- draws the mother healing. A gap closing week over week is the thing she
-- opens the app to watch, and it is unstealable: Flo and Ovia cannot ship it
-- without becoming a different product.
--
-- NOT A DIAGNOSIS. This records what she measured, the way a bathroom scale
-- records a weight. Nothing here decides whether her separation is normal,
-- whether it is closing fast enough, or whether she needs treatment. The UI
-- defers to her provider or pelvic floor physio, and the copy never
-- congratulates a smaller number or laments a larger one.

CREATE TABLE IF NOT EXISTS public.diastasis_measurements (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Attached to the recovery, so a second baby starts a fresh series rather
  -- than continuing a line drawn from her first.
  recovery_id uuid        REFERENCES public.recoveries(id) ON DELETE CASCADE,
  measured_on date        NOT NULL DEFAULT CURRENT_DATE,
  -- Finger-widths is how the standard self-check is described and how most
  -- physios teach it; centimetres is what a clinician writes down. Storing the
  -- unit rather than converting means her number is shown back the way she
  -- measured it.
  value       numeric(4,1) NOT NULL CHECK (value >= 0 AND value <= 30),
  unit        text        NOT NULL DEFAULT 'fingers' CHECK (unit IN ('fingers', 'cm')),
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- One per day. Re-measuring the same day corrects rather than adds a second
-- point — a wobbly self-check repeated twice should not read as a change.
CREATE UNIQUE INDEX IF NOT EXISTS diastasis_user_date_unique
  ON public.diastasis_measurements (user_id, measured_on);

CREATE INDEX IF NOT EXISTS diastasis_recovery_date_idx
  ON public.diastasis_measurements (recovery_id, measured_on DESC);

ALTER TABLE public.diastasis_measurements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own diastasis"   ON public.diastasis_measurements;
DROP POLICY IF EXISTS "Users insert own diastasis" ON public.diastasis_measurements;
DROP POLICY IF EXISTS "Users update own diastasis" ON public.diastasis_measurements;
DROP POLICY IF EXISTS "Users delete own diastasis" ON public.diastasis_measurements;

CREATE POLICY "Users view own diastasis"
  ON public.diastasis_measurements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own diastasis"
  ON public.diastasis_measurements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own diastasis"
  ON public.diastasis_measurements FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own diastasis"
  ON public.diastasis_measurements FOR DELETE TO authenticated USING (auth.uid() = user_id);
