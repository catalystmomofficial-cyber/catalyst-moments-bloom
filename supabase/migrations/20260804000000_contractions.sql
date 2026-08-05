-- Contractions belong in the database, written as they happen.
--
-- ContractionTracker kept the whole labour in localStorage under
-- 'contractionLog' and nowhere else. There was no contractions table at all.
--
-- Why this is stricter than the kick counter fix: a kick session is short and
-- repeatable — "I'll count again later" is a real answer. Labour happens once,
-- runs for hours, and the data drives a triage decision in real time. Closing
-- the tab, a refresh, or a flat battery at 3am erased the entire record, and
-- the record is what she is asked for at triage: when did they start, how far
-- apart, how long.
--
-- Two writes per contraction, both required:
--   1. on start  — INSERT with ended_at NULL, returning the id
--   2. on end    — UPDATE that row with ended_at, duration and interval
--
-- The open row is also how a refresh mid-contraction recovers: the client
-- queries WHERE ended_at IS NULL and restores the running timer from
-- started_at. Batching at session end is exactly what she would lose.
--
-- Not a medical device. This records what she observed; her provider decides.

CREATE TABLE IF NOT EXISTS public.contractions (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at       timestamptz NOT NULL,
  ended_at         timestamptz,                        -- NULL while running
  duration_seconds integer     CHECK (duration_seconds >= 0),
  -- Start of this contraction to start of the previous one. START TO START is
  -- the obstetric definition and the "5" in 5-1-1; the gap between the end of
  -- one and the start of the next is a different, always smaller number.
  interval_seconds integer     CHECK (interval_seconds >= 0),
  intensity        smallint    CHECK (intensity BETWEEN 1 AND 10),
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- Every read is "her contractions, newest first", including the recovery query.
CREATE INDEX IF NOT EXISTS contractions_user_started_idx
  ON public.contractions (user_id, started_at DESC);

-- At most one contraction running at a time. Without this, a double tap on
-- start leaves two open rows and the recovery query cannot tell which timer to
-- restore.
CREATE UNIQUE INDEX IF NOT EXISTS contractions_one_open_per_user
  ON public.contractions (user_id) WHERE ended_at IS NULL;

ALTER TABLE public.contractions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own contractions"   ON public.contractions;
DROP POLICY IF EXISTS "Users insert own contractions" ON public.contractions;
DROP POLICY IF EXISTS "Users update own contractions" ON public.contractions;
DROP POLICY IF EXISTS "Users delete own contractions" ON public.contractions;

CREATE POLICY "Users view own contractions"
  ON public.contractions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own contractions"
  ON public.contractions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- UPDATE is required: the second write closes the row that the first opened.
CREATE POLICY "Users update own contractions"
  ON public.contractions FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- She can remove a mis-tap. Deleting one changes every interval downstream, so
-- the UI confirms first and names what it will recalculate.
CREATE POLICY "Users delete own contractions"
  ON public.contractions FOR DELETE TO authenticated
  USING (auth.uid() = user_id);


-- Close a contraction and compute both figures server-side, so the numbers
-- driving triage are not whatever the client happened to calculate.
CREATE OR REPLACE FUNCTION public.end_contraction(
  p_id        uuid,
  p_intensity smallint DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user  uuid := auth.uid();
  v_start timestamptz;
  v_prev  timestamptz;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT started_at INTO v_start
  FROM public.contractions
  WHERE id = p_id AND user_id = v_user AND ended_at IS NULL;

  IF v_start IS NULL THEN
    RETURN; -- already closed, or not hers. Nothing to do.
  END IF;

  -- The most recent contraction that started before this one.
  SELECT started_at INTO v_prev
  FROM public.contractions
  WHERE user_id = v_user AND started_at < v_start AND ended_at IS NOT NULL
  ORDER BY started_at DESC
  LIMIT 1;

  UPDATE public.contractions
     SET ended_at         = now(),
         duration_seconds = GREATEST(0, EXTRACT(EPOCH FROM (now() - v_start))::int),
         interval_seconds = CASE WHEN v_prev IS NOT NULL
                                 THEN GREATEST(0, EXTRACT(EPOCH FROM (v_start - v_prev))::int) END,
         intensity        = COALESCE(p_intensity, intensity)
   WHERE id = p_id AND user_id = v_user;
END;
$$;

REVOKE ALL ON FUNCTION public.end_contraction(uuid, smallint) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.end_contraction(uuid, smallint) TO authenticated;


-- Deleting a contraction invalidates the interval of the one that followed it.
-- Recomputing here keeps the stored numbers consistent with the source of
-- truth rather than leaving a stale figure the triage view would read.
CREATE OR REPLACE FUNCTION public.recompute_contraction_intervals()
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

  WITH ordered AS (
    SELECT id,
           started_at,
           LAG(started_at) OVER (ORDER BY started_at) AS prev_started
    FROM public.contractions
    WHERE user_id = v_user AND ended_at IS NOT NULL
  )
  UPDATE public.contractions c
     SET interval_seconds = CASE WHEN o.prev_started IS NOT NULL
                                 THEN GREATEST(0, EXTRACT(EPOCH FROM (o.started_at - o.prev_started))::int) END
    FROM ordered o
   WHERE c.id = o.id AND c.user_id = v_user;
END;
$$;

REVOKE ALL ON FUNCTION public.recompute_contraction_intervals() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.recompute_contraction_intervals() TO authenticated;
