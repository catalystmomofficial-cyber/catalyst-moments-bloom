CREATE OR REPLACE FUNCTION public.register_for_event(p_event_id text, p_user_id text, p_payment_method text, p_points_used integer, p_amount_paid integer)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_user_id UUID;
  v_current_attendees INTEGER;
  v_max_capacity INTEGER;
  v_existing_registration UUID;
  v_registration_id UUID;
BEGIN
  v_user_id := p_user_id::UUID;

  SELECT id INTO v_existing_registration
  FROM public.event_registrations
  WHERE event_id = p_event_id AND user_id = v_user_id;

  IF v_existing_registration IS NOT NULL THEN
    RETURN json_build_object('success', false, 'error', 'Already registered for this event');
  END IF;

  SELECT current_attendees, max_capacity
  INTO v_current_attendees, v_max_capacity
  FROM public.events
  WHERE id::TEXT = p_event_id;

  IF v_current_attendees >= v_max_capacity THEN
    RETURN json_build_object('success', false, 'error', 'Event is fully booked');
  END IF;

  IF p_points_used > 0 THEN
    UPDATE public.user_points
    SET total_points = total_points - p_points_used
    WHERE user_id = v_user_id;
  END IF;

  INSERT INTO public.event_registrations (
    event_id, user_id, payment_method, points_used, amount_paid, attended, created_at
  ) VALUES (
    p_event_id, v_user_id, p_payment_method, p_points_used, p_amount_paid, false, NOW()
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