CREATE OR REPLACE FUNCTION public.register_for_event(
  p_event_id text,
  p_user_id text,
  p_payment_method text,
  p_points_used integer,
  p_amount_paid integer,
  p_event_title text DEFAULT NULL,
  p_event_date text DEFAULT NULL,
  p_event_time text DEFAULT NULL,
  p_first_name text DEFAULT NULL,
  p_last_name text DEFAULT NULL,
  p_email text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_user_id UUID;
  v_current_attendees INTEGER;
  v_max_capacity INTEGER;
  v_existing_registration UUID;
  v_registration_id UUID;
  v_title TEXT;
  v_first TEXT;
  v_last TEXT;
  v_email TEXT;
  v_profile_name TEXT;
  v_user_email TEXT;
BEGIN
  v_user_id := p_user_id::UUID;

  SELECT id INTO v_existing_registration
  FROM public.event_registrations
  WHERE event_id = p_event_id AND user_id = v_user_id;

  IF v_existing_registration IS NOT NULL THEN
    RETURN json_build_object('success', false, 'error', 'Already registered for this event');
  END IF;

  SELECT current_attendees, max_capacity, COALESCE(p_event_title, title)
  INTO v_current_attendees, v_max_capacity, v_title
  FROM public.events
  WHERE id::TEXT = p_event_id;

  IF v_title IS NULL THEN
    v_title := COALESCE(p_event_title, 'Event');
  END IF;

  IF v_current_attendees >= v_max_capacity THEN
    RETURN json_build_object('success', false, 'error', 'Event is fully booked');
  END IF;

  -- Pull fallback name/email from profile + auth.users
  SELECT display_name INTO v_profile_name FROM public.profiles WHERE user_id = v_user_id LIMIT 1;
  SELECT email INTO v_user_email FROM auth.users WHERE id = v_user_id LIMIT 1;

  v_first := COALESCE(NULLIF(p_first_name, ''), split_part(COALESCE(v_profile_name, v_user_email, 'Member'), ' ', 1));
  v_last  := COALESCE(NULLIF(p_last_name, ''), NULLIF(split_part(COALESCE(v_profile_name, ''), ' ', 2), ''), '-');
  v_email := COALESCE(NULLIF(p_email, ''), v_user_email, 'unknown@example.com');

  IF p_points_used > 0 THEN
    UPDATE public.user_points
    SET total_points = total_points - p_points_used
    WHERE user_id = v_user_id;
  END IF;

  INSERT INTO public.event_registrations (
    event_id, user_id, payment_method, points_used, amount_paid, attended, created_at,
    event_title, event_date, event_time, first_name, last_name, email
  ) VALUES (
    p_event_id, v_user_id, p_payment_method, p_points_used, p_amount_paid, false, NOW(),
    v_title, p_event_date, p_event_time, v_first, v_last, v_email
  ) RETURNING id INTO v_registration_id;

  UPDATE public.events
  SET current_attendees = current_attendees + 1
  WHERE id::TEXT = p_event_id;

  UPDATE public.user_points
  SET total_points = total_points + 50
  WHERE user_id = v_user_id;

  RETURN json_build_object('success', true, 'registration_id', v_registration_id);

EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$function$;