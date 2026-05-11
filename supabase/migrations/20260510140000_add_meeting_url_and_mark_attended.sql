-- Add meeting_url column to events table
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS meeting_url text;

-- mark_event_attended: idempotent — marks attendance and returns points earned
-- Returns already_attended=true and points_awarded=0 if called more than once.
CREATE OR REPLACE FUNCTION public.mark_event_attended(
  p_event_id text,
  p_user_id  text
) RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_already   boolean := false;
  v_updated   integer := 0;
BEGIN
  -- Check whether this registration is already marked attended
  SELECT attended INTO v_already
  FROM public.event_registrations
  WHERE event_id = p_event_id
    AND user_id  = p_user_id::uuid;

  IF v_already IS TRUE THEN
    RETURN json_build_object('success', true, 'already_attended', true, 'points_awarded', 0);
  END IF;

  -- Mark attended (no-op if no registration row exists)
  UPDATE public.event_registrations
  SET attended = true
  WHERE event_id = p_event_id
    AND user_id  = p_user_id::uuid;

  GET DIAGNOSTICS v_updated = ROW_COUNT;

  RETURN json_build_object(
    'success',          true,
    'already_attended', false,
    'rows_updated',     v_updated
  );
END;
$$;
