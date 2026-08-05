-- Postpartum recovery, server-side.
--
-- recovery.ts kept BOTH the birth date ('recovery-birth-date') and every mood
-- check-in ('recovery-checkins') in localStorage and nowhere else. A new phone,
-- a cleared cache, or signing in on a laptop lost her entire recovery
-- timeline — how many weeks postpartum she is, and every check-in behind the
-- safety nudge that watches for a run of hard days.
--
-- There is no legacy shape to preserve: no births table existed, and no birth
-- date has ever been stored server-side. That is the one advantage of finding
-- this now — nothing to migrate, and no second-time mother has hit it yet.

-- ── The birth event ─────────────────────────────────────────────────────────
-- A BIRTH EVENT, not a baby. Twins are one labour, one recovering body, and
-- one timeline — so baby_count sits on the row rather than producing two rows
-- and two recoveries for one person.
--
-- pregnancy_journey_id is NULLABLE on purpose. A woman who joins the app
-- already postpartum has no journey, and that is a segment the product
-- deliberately serves ("the years later"). Requiring a journey would force a
-- fake one just to reach her own recovery.
CREATE TABLE IF NOT EXISTS public.births (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pregnancy_journey_id uuid        REFERENCES public.pregnancy_journeys(id) ON DELETE SET NULL,
  birth_date           date        NOT NULL,
  -- Core Restore and VBAC prep should differ by delivery type, and nothing in
  -- the app has ever recorded it.
  birth_type           text        CHECK (birth_type IN ('vaginal', 'caesarean', 'vbac', 'assisted', 'unknown')),
  baby_count           smallint    NOT NULL DEFAULT 1 CHECK (baby_count BETWEEN 1 AND 5),
  -- Set when a later birth supersedes this one. Never deleted: her first
  -- recovery is part of her history, not something a second baby erases.
  archived_at          timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS births_user_date_idx
  ON public.births (user_id, birth_date DESC);

-- One active recovery at a time. Recording a second birth archives the first
-- (see record_birth) rather than being blocked — silently leaving her on an
-- eleven-month-old timeline while she is two days postpartum with a new baby
-- is its own kind of wrong, and she did press the button.
CREATE UNIQUE INDEX IF NOT EXISTS births_one_active_per_user
  ON public.births (user_id) WHERE archived_at IS NULL;

ALTER TABLE public.births ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own births"   ON public.births;
DROP POLICY IF EXISTS "Users insert own births" ON public.births;
DROP POLICY IF EXISTS "Users update own births" ON public.births;

CREATE POLICY "Users view own births"
  ON public.births FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own births"
  ON public.births FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own births"
  ON public.births FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- ── Check-ins ───────────────────────────────────────────────────────────────
-- One tap a day. These feed evaluateSafetyNudge, which watches for a run of
-- hard days — a safety net that, living in localStorage, silently reset itself
-- every time she changed device. Same class of failure as the kick counter's
-- pattern check.
CREATE TABLE IF NOT EXISTS public.recovery_checkins (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  birth_id   uuid        REFERENCES public.births(id) ON DELETE CASCADE,
  -- Her local date, so "today" means her today wherever she is.
  date       date        NOT NULL,
  mood       text        NOT NULL CHECK (mood IN ('rough', 'okay', 'good')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- One per day, and re-tapping updates rather than stacking.
CREATE UNIQUE INDEX IF NOT EXISTS recovery_checkins_user_date_unique
  ON public.recovery_checkins (user_id, date);

CREATE INDEX IF NOT EXISTS recovery_checkins_user_date_idx
  ON public.recovery_checkins (user_id, date DESC);

ALTER TABLE public.recovery_checkins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own recovery checkins"   ON public.recovery_checkins;
DROP POLICY IF EXISTS "Users insert own recovery checkins" ON public.recovery_checkins;
DROP POLICY IF EXISTS "Users update own recovery checkins" ON public.recovery_checkins;

CREATE POLICY "Users view own recovery checkins"
  ON public.recovery_checkins FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own recovery checkins"
  ON public.recovery_checkins FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own recovery checkins"
  ON public.recovery_checkins FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- ── Recording a birth ───────────────────────────────────────────────────────
-- Archives any previous active birth in the same statement, so the partial
-- unique index can never reject her. This is the constraint's error path
-- handled at the only place that can create it.
CREATE OR REPLACE FUNCTION public.record_birth(
  p_birth_date date,
  p_birth_type text     DEFAULT NULL,
  p_baby_count smallint DEFAULT 1
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    uuid := auth.uid();
  v_journey uuid;
  v_id      uuid;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF p_birth_date > CURRENT_DATE THEN
    RAISE EXCEPTION 'Birth date cannot be in the future';
  END IF;

  -- Supersede the previous recovery rather than blocking on it.
  UPDATE public.births
     SET archived_at = now()
   WHERE user_id = v_user AND archived_at IS NULL;

  -- Attach to her open pregnancy journey if she has one. A woman who joined
  -- already postpartum will not, and that is fine.
  SELECT id INTO v_journey
  FROM public.pregnancy_journeys
  WHERE user_id = v_user AND outcome IS NULL
  ORDER BY started_at DESC LIMIT 1;

  INSERT INTO public.births (user_id, pregnancy_journey_id, birth_date, birth_type, baby_count)
  VALUES (v_user, v_journey, p_birth_date, COALESCE(p_birth_type, 'unknown'), COALESCE(p_baby_count, 1))
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.record_birth(date, text, smallint) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_birth(date, text, smallint) TO authenticated;


-- ── Close the gap in record_pregnancy_outcome ───────────────────────────────
-- It closed the journey and set pregnancy_state, but created no birth row — so
-- "I've given birth" left her with a finished pregnancy and no recovery
-- timeline at all. Exactly the shape of an existing feature meeting a new
-- constraint: the outcome path has to satisfy births_one_active_per_user too.
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
  v_user    uuid := auth.uid();
  v_journey uuid;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF p_outcome NOT IN ('birth', 'loss') THEN
    RAISE EXCEPTION 'Outcome must be birth or loss';
  END IF;

  SELECT id INTO v_journey
  FROM public.pregnancy_journeys
  WHERE user_id = v_user AND outcome IS NULL
  ORDER BY started_at DESC LIMIT 1;

  UPDATE public.pregnancy_journeys
     SET outcome      = p_outcome,
         outcome_at   = now(),
         frozen_week  = p_week,
         frozen_day   = p_day,
         prompt_after = CASE WHEN p_outcome = 'loss'
                             THEN now() + interval '30 days' END
   WHERE id = v_journey;

  UPDATE public.profiles
     SET pregnancy_state = CASE WHEN p_outcome = 'loss' THEN 'holding' ELSE 'none' END,
         delivery_date   = NULL
   WHERE user_id = v_user;

  -- Start her recovery. The date defaults to today; she can correct it, and
  -- correcting it must not create a second birth — the UI updates this row.
  IF p_outcome = 'birth' THEN
    UPDATE public.births SET archived_at = now()
     WHERE user_id = v_user AND archived_at IS NULL;

    INSERT INTO public.births (user_id, pregnancy_journey_id, birth_date, birth_type)
    VALUES (v_user, v_journey, CURRENT_DATE, 'unknown');
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.record_pregnancy_outcome(text, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_pregnancy_outcome(text, integer, integer) TO authenticated;
