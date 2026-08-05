-- Move her to postpartum when she tells us the baby arrived.
--
-- record_pregnancy_outcome('birth') cleared delivery_date and set
-- pregnancy_state, but left motherhood_stage untouched — and motherhood_stage
-- is what Dashboard reads to choose which tracker to render.
--
-- So tapping "I've given birth" produced this: the pregnancy tracker still on
-- screen, now asking her to add a due date, while her actual recovery timeline
-- sat in the database unreachable. The handoff between the two stages simply
-- did not happen.
--
-- Loss is unaffected: HoldingCard wins over every stage branch on the
-- dashboard, so motherhood_stage is irrelevant there and is deliberately left
-- alone — holding is not a stage.

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
         delivery_date   = NULL,
         -- The actual handoff. useContentFilter maps anything containing
         -- 'postpartum' with '0-6' to the first recovery phase, which is where
         -- a woman on day one belongs.
         motherhood_stage = CASE WHEN p_outcome = 'birth'
                                 THEN 'postpartum_0-6'
                                 ELSE motherhood_stage END
   WHERE user_id = v_user;

  IF p_outcome = 'birth' THEN
    PERFORM public.record_birth(CURRENT_DATE, 'unknown', 1::smallint, 'live');
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.record_pregnancy_outcome(text, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_pregnancy_outcome(text, integer, integer) TO authenticated;
