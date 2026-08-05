-- Archiving a run of contractions.
--
-- At some point she stops using the app because she is at the hospital, or the
-- contractions stopped, or it was a false start. The timer had no way to
-- accept that: a session ran indefinitely, so the next time she opened it the
-- pattern was computed across two unrelated stretches.
--
-- Archive, not "end". "End" implies the labour ended, which during real labour
-- is the wrong thing to tell her. "Pause" implies she will resume, which she
-- may not. Archive is neutral: stop tracking, keep everything, start fresh
-- whenever she wants.
--
-- Nothing archives automatically. She might be in the car, in triage, or
-- genuinely done, and the app cannot tell which.

ALTER TABLE public.contractions
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

COMMENT ON COLUMN public.contractions.archived_at IS
  'Set when she archives a run. The row is kept forever — triage asks when contractions started, and that answer must survive. Only the live view filters on this.';

-- The live view is "her contractions that are not archived, newest first".
CREATE INDEX IF NOT EXISTS contractions_user_live_idx
  ON public.contractions (user_id, started_at DESC) WHERE archived_at IS NULL;

-- Archive everything currently live, including a contraction still running:
-- if she left mid-contraction and came back hours later, that open row must
-- not sit there forever blocking the one-open-row constraint.
CREATE OR REPLACE FUNCTION public.archive_contractions()
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

  -- Close any still-open contraction first, so it is not left dangling.
  UPDATE public.contractions
     SET ended_at         = COALESCE(ended_at, now()),
         duration_seconds = COALESCE(duration_seconds,
                              GREATEST(0, EXTRACT(EPOCH FROM (now() - started_at))::int))
   WHERE user_id = v_user AND ended_at IS NULL;

  UPDATE public.contractions
     SET archived_at = now()
   WHERE user_id = v_user AND archived_at IS NULL;
END;
$$;

REVOKE ALL ON FUNCTION public.archive_contractions() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.archive_contractions() TO authenticated;
