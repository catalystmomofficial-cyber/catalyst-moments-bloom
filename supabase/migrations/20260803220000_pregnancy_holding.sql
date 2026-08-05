-- Pregnancy outcomes, including loss.
--
-- Until now a pregnancy could only ever continue. The ring advanced, the week
-- counter climbed, and the reminders kept firing, whatever had actually
-- happened. Women have reported receiving "You're 25 weeks today!" two days
-- after a loss from apps built this way. That is the failure this migration
-- exists to make structurally impossible.
--
-- Two doors, never one. Giving birth and losing a pregnancy are different
-- events with different needs, and nobody should have to answer "did you give
-- birth or lose the pregnancy?" as a decision tree.
--
-- The word is "loss". Not miscarriage, which is clinical; not "ended" or
-- "changed", which read as the app being uncomfortable — and if the app seems
-- uncomfortable, she learns she should be too.

-- ── Where she is now ────────────────────────────────────────────────────────
-- Deliberately NOT folded into motherhood_stage. That column drives content
-- filtering and stage gating everywhere; holding is not a stage, because
-- stages imply progression and this one does not progress. It is orthogonal:
-- she can sit in holding with no stage at all.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS pregnancy_state TEXT NOT NULL DEFAULT 'none'
    CHECK (pregnancy_state IN ('none', 'active', 'holding'));

COMMENT ON COLUMN public.profiles.pregnancy_state IS
  'none | active | holding. Holding is the state after a loss: the ring is frozen, pregnancy notifications are hard-stopped, and only she can decide when it ends.';

-- Every pregnancy-referencing sender filters on this, so it must be cheap.
CREATE INDEX IF NOT EXISTS profiles_pregnancy_state_idx
  ON public.profiles (pregnancy_state) WHERE pregnancy_state <> 'none';

-- ── The record of each journey ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pregnancy_journeys (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  due_date     date,
  started_at   timestamptz NOT NULL DEFAULT now(),

  outcome      text        CHECK (outcome IN ('birth', 'loss')),
  outcome_at   timestamptz,

  -- The ring is frozen at the moment it stopped, not recomputed from dates
  -- later. She should see exactly the drawing that was on screen, forever.
  frozen_week  integer,
  frozen_day   integer,

  -- What she wants done with her record. NULL means not yet asked: we hold
  -- everything silently for 30 days first, because the moment of a loss is
  -- decision paralysis and every extra choice is a tax.
  data_choice  text        CHECK (data_choice IN ('keep', 'export', 'delete')),
  data_choice_at timestamptz,
  /** When the single, gentle in-app prompt becomes eligible. Never a push. */
  prompt_after timestamptz,

  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS pregnancy_journeys_user_idx
  ON public.pregnancy_journeys (user_id, started_at DESC);

-- Only one journey can be open at a time. Without this, a double submit or a
-- second device leaves two live pregnancies and the ring cannot say which it
-- is drawing.
CREATE UNIQUE INDEX IF NOT EXISTS pregnancy_journeys_one_open
  ON public.pregnancy_journeys (user_id) WHERE outcome IS NULL;

ALTER TABLE public.pregnancy_journeys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own pregnancy journeys"   ON public.pregnancy_journeys;
DROP POLICY IF EXISTS "Users insert own pregnancy journeys" ON public.pregnancy_journeys;
DROP POLICY IF EXISTS "Users update own pregnancy journeys" ON public.pregnancy_journeys;

CREATE POLICY "Users view own pregnancy journeys"
  ON public.pregnancy_journeys FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own pregnancy journeys"
  ON public.pregnancy_journeys FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- She can record an outcome and later change her data choice. No DELETE
-- policy: erasing the row would silently un-stop her notifications, and the
-- deletion she asks for is of her content, handled deliberately elsewhere.
CREATE POLICY "Users update own pregnancy journeys"
  ON public.pregnancy_journeys FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ── Recording an outcome, atomically ────────────────────────────────────────
-- One call closes the journey, freezes the ring and flips the profile state.
-- Doing this as three client writes risks stopping halfway: a closed journey
-- with pregnancy_state still 'active' is precisely the state that sends a
-- week-by-week push after a loss.
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
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF p_outcome NOT IN ('birth', 'loss') THEN
    RAISE EXCEPTION 'Outcome must be birth or loss';
  END IF;

  UPDATE public.pregnancy_journeys
     SET outcome      = p_outcome,
         outcome_at   = now(),
         frozen_week  = p_week,
         frozen_day   = p_day,
         -- 30 days of silence before the one gentle prompt about her data.
         prompt_after = CASE WHEN p_outcome = 'loss'
                             THEN now() + interval '30 days' END
   WHERE user_id = v_user AND outcome IS NULL;

  -- Birth hands her to the postpartum flow, which already exists and already
  -- has its own ring. Loss goes to holding, which nothing advances.
  UPDATE public.profiles
     SET pregnancy_state = CASE WHEN p_outcome = 'loss' THEN 'holding' ELSE 'none' END,
         -- Clear the due date either way: nothing should keep counting toward
         -- a date that is no longer coming.
         delivery_date   = NULL
   WHERE user_id = v_user;
END;
$$;

REVOKE ALL ON FUNCTION public.record_pregnancy_outcome(text, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_pregnancy_outcome(text, integer, integer) TO authenticated;


-- ── Leaving holding ─────────────────────────────────────────────────────────
-- Only ever called because she chose to. Nothing in the product may call this
-- on a timer, and no "it's been 6 weeks, are you ready?" prompt exists to
-- trigger it.
CREATE OR REPLACE FUNCTION public.leave_pregnancy_holding()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  UPDATE public.profiles
     SET pregnancy_state = 'none'
   WHERE user_id = auth.uid() AND pregnancy_state = 'holding';
END;
$$;

REVOKE ALL ON FUNCTION public.leave_pregnancy_holding() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.leave_pregnancy_holding() TO authenticated;


-- ── Backfill ────────────────────────────────────────────────────────────────
-- Anyone with a due date today has an open journey; without this their first
-- outcome would have no row to close.
INSERT INTO public.pregnancy_journeys (user_id, due_date, started_at)
SELECT p.user_id, p.delivery_date, COALESCE(p.created_at, now())
FROM public.profiles p
WHERE p.delivery_date IS NOT NULL
ON CONFLICT DO NOTHING;

UPDATE public.profiles
   SET pregnancy_state = 'active'
 WHERE delivery_date IS NOT NULL AND pregnancy_state = 'none';
