-- Separate the recovery from the birth, and let a birth carry a loss outcome.
--
-- Two corrections to 20260804030000, both structural enough to be worth doing
-- before anyone has data.
--
-- 1. A BIRTH IS NEVER ARCHIVED. It happened. Putting archived_at on births
--    conflated "this birth is superseded" with "this recovery is no longer the
--    active one" — and they are different facts. A recovery is the thing that
--    starts, runs and is superseded; the birth is the event it hangs off.
--
-- 2. A STILLBIRTH IS A BIRTH EVENT. Her body went through labour and the
--    physical recovery is real, and often harder. Recording loss only on
--    pregnancy_journeys.outcome left a woman who delivered a stillborn baby
--    with no birth event and no recovery timeline — the app had no way to
--    acknowledge that her body had done this. Holding covers the emotional
--    axis; recovery covers the physical one. They are not the same axis and
--    one does not substitute for the other.

-- ── Birth outcome ───────────────────────────────────────────────────────────
ALTER TABLE public.births
  ADD COLUMN IF NOT EXISTS outcome TEXT NOT NULL DEFAULT 'live';

DO $$
BEGIN
  ALTER TABLE public.births
    ADD CONSTRAINT births_outcome_check
    CHECK (outcome IN ('live', 'stillbirth', 'neonatal_death'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

COMMENT ON COLUMN public.births.outcome IS
  'live | stillbirth | neonatal_death. A stillbirth is a birth event: the physical recovery is real regardless of outcome. Holding handles the emotional axis separately.';

-- Accept the US spelling the rest of the product uses. Both are kept so the
-- rows already written with the British spelling stay valid.
ALTER TABLE public.births DROP CONSTRAINT IF EXISTS births_birth_type_check;
ALTER TABLE public.births
  ADD CONSTRAINT births_birth_type_check
  CHECK (birth_type IN ('vaginal', 'cesarean', 'caesarean', 'vbac', 'assisted', 'unknown'));

COMMENT ON COLUMN public.births.birth_type IS
  'COLLECTED BUT NOT YET CONSUMED. Core Restore, VBAC prep and cesarean recovery must differ by delivery type; the feature is not built. Do not remove this column as unused — see docs/postpartum-model.md.';


-- ── Recoveries ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.recoveries (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  -- auth.users, NOT profiles.id. In this schema profiles.id is a separate uuid
  -- and profiles.user_id is the auth id; referencing profiles(id) would point
  -- at the wrong column.
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  birth_id    uuid        NOT NULL REFERENCES public.births(id) ON DELETE CASCADE,
  started_at  date        NOT NULL DEFAULT CURRENT_DATE,
  archived_at date,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS recoveries_one_active_per_user
  ON public.recoveries (user_id) WHERE archived_at IS NULL;

CREATE INDEX IF NOT EXISTS recoveries_user_started_idx
  ON public.recoveries (user_id, started_at DESC);

ALTER TABLE public.recoveries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own recoveries"   ON public.recoveries;
DROP POLICY IF EXISTS "Users insert own recoveries" ON public.recoveries;
DROP POLICY IF EXISTS "Users update own recoveries" ON public.recoveries;

CREATE POLICY "Users view own recoveries"
  ON public.recoveries FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own recoveries"
  ON public.recoveries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own recoveries"
  ON public.recoveries FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Backfill one recovery per existing birth, preserving which was active.
INSERT INTO public.recoveries (user_id, birth_id, started_at, archived_at)
SELECT b.user_id, b.id, b.birth_date, b.archived_at::date
FROM public.births b
WHERE NOT EXISTS (SELECT 1 FROM public.recoveries r WHERE r.birth_id = b.id);

-- births.archived_at is now redundant. Left in place rather than dropped so
-- this migration cannot lose the only record of which birth was superseded if
-- it is re-run against a partially migrated database; recoveries.archived_at
-- is the value that is read.
COMMENT ON COLUMN public.births.archived_at IS
  'SUPERSEDED by recoveries.archived_at. Kept only so the backfill is idempotent. Do not read this.';


-- ── Check-ins hang off the recovery ─────────────────────────────────────────
ALTER TABLE public.recovery_checkins
  ADD COLUMN IF NOT EXISTS recovery_id uuid REFERENCES public.recoveries(id) ON DELETE CASCADE;

UPDATE public.recovery_checkins c
   SET recovery_id = r.id
  FROM public.recoveries r
 WHERE c.recovery_id IS NULL AND r.birth_id = c.birth_id;

CREATE INDEX IF NOT EXISTS recovery_checkins_recovery_idx
  ON public.recovery_checkins (recovery_id, date DESC);


-- ── record_birth: atomic, and the archive is the safety net ─────────────────
DROP FUNCTION IF EXISTS public.record_birth(date, text, smallint);

CREATE OR REPLACE FUNCTION public.record_birth(
  p_birth_date date,
  p_birth_type text     DEFAULT NULL,
  p_baby_count smallint DEFAULT 1,
  p_outcome    text     DEFAULT 'live'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    uuid := auth.uid();
  v_journey uuid;
  v_birth   uuid;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF p_birth_date > CURRENT_DATE THEN
    RAISE EXCEPTION 'Birth date cannot be in the future';
  END IF;

  SELECT id INTO v_journey
  FROM public.pregnancy_journeys
  WHERE user_id = v_user AND outcome IS NULL
  ORDER BY started_at DESC LIMIT 1;

  INSERT INTO public.births (user_id, pregnancy_journey_id, birth_date, birth_type, baby_count, outcome)
  VALUES (v_user, v_journey, p_birth_date, COALESCE(p_birth_type, 'unknown'),
          COALESCE(p_baby_count, 1), COALESCE(p_outcome, 'live'))
  RETURNING id INTO v_birth;

  -- The client confirms with her before calling. This is the safety net, not
  -- the decision: the constraint must never be the thing that surfaces as an
  -- error to a woman who has just had a baby.
  UPDATE public.recoveries
     SET archived_at = CURRENT_DATE
   WHERE user_id = v_user AND archived_at IS NULL;

  INSERT INTO public.recoveries (user_id, birth_id, started_at)
  VALUES (v_user, v_birth, p_birth_date);

  RETURN v_birth;
END;
$$;

REVOKE ALL ON FUNCTION public.record_birth(date, text, smallint, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_birth(date, text, smallint, text) TO authenticated;


-- ── record_pregnancy_outcome delegates rather than duplicating ──────────────
-- Its birth branch previously wrote its own births row, which meant two places
-- could create a birth and only one of them knew about recoveries.
CREATE OR REPLACE FUNCTION public.record_pregnancy_outcome(
  p_outcome text,
  p_week    integer DEFAULT NULL,
  p_day     integer DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF p_outcome NOT IN ('birth', 'loss') THEN
    RAISE EXCEPTION 'Outcome must be birth or loss';
  END IF;

  UPDATE public.pregnancy_journeys
     SET outcome      = p_outcome,
         outcome_at   = now(),
         frozen_week  = p_week,
         frozen_day   = p_day,
         prompt_after = CASE WHEN p_outcome = 'loss'
                             THEN now() + interval '30 days' END
   WHERE user_id = v_user AND outcome IS NULL;

  UPDATE public.profiles
     SET pregnancy_state = CASE WHEN p_outcome = 'loss' THEN 'holding' ELSE 'none' END,
         delivery_date   = NULL
   WHERE user_id = v_user;

  -- One creator of births and recoveries, not two.
  IF p_outcome = 'birth' THEN
    PERFORM public.record_birth(CURRENT_DATE, 'unknown', 1::smallint, 'live');
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.record_pregnancy_outcome(text, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_pregnancy_outcome(text, integer, integer) TO authenticated;
