CREATE OR REPLACE FUNCTION public.register_for_event(
  p_event_id text,
  p_user_id text,
  p_payment_method text,
  p_points_used integer,
  p_amount_paid integer
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_current_attendees integer;
  v_max_capacity integer;
  v_event_title text;
  v_event_date text;
  v_existing uuid;
  v_registration_id uuid;
  v_user_points integer;
  v_has_row boolean;
BEGIN
  v_user_id := p_user_id::uuid;

  -- Already registered?
  SELECT id INTO v_existing
  FROM public.event_registrations
  WHERE event_id = p_event_id AND user_id = v_user_id;

  IF v_existing IS NOT NULL THEN
    RETURN json_build_object('success', false, 'error', 'Already registered for this event');
  END IF;

  -- Event lookup
  SELECT current_attendees, max_capacity, title, to_char(event_date, 'YYYY-MM-DD')
  INTO v_current_attendees, v_max_capacity, v_event_title, v_event_date
  FROM public.events
  WHERE id::text = p_event_id;

  IF v_current_attendees IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Event not found');
  END IF;

  IF v_current_attendees >= v_max_capacity THEN
    RETURN json_build_object('success', false, 'error', 'Event is fully booked');
  END IF;

  -- Read existing balance WITHOUT inserting first
  SELECT total_points INTO v_user_points
  FROM public.user_points
  WHERE user_id = v_user_id;

  v_has_row := FOUND;

  -- Points validation
  IF COALESCE(p_points_used, 0) > 0 THEN
    IF NOT v_has_row THEN
      RETURN json_build_object('success', false, 'error', 'No points balance found');
    END IF;
    IF COALESCE(v_user_points, 0) < p_points_used THEN
      RETURN json_build_object(
        'success', false,
        'error', 'Insufficient points (have ' || COALESCE(v_user_points, 0) || ', need ' || p_points_used || ')'
      );
    END IF;

    UPDATE public.user_points
    SET total_points = total_points - p_points_used,
        updated_at = now()
    WHERE user_id = v_user_id;
  ELSE
    -- p_points_used = 0: ensure a row exists for the +50 award later
    IF NOT v_has_row THEN
      INSERT INTO public.user_points (user_id, total_points, level)
      VALUES (v_user_id, 0, 1)
      ON CONFLICT (user_id) DO NOTHING;
    END IF;
  END IF;

  -- Insert registration
  INSERT INTO public.event_registrations (
    event_id, user_id, event_title, event_date,
    payment_method, points_used, amount_paid, attended,
    first_name, last_name, email
  )
  VALUES (
    p_event_id, v_user_id, COALESCE(v_event_title, ''), COALESCE(v_event_date, ''),
    p_payment_method, COALESCE(p_points_used, 0), COALESCE(p_amount_paid, 0), false,
    '', '', ''
  )
  RETURNING id INTO v_registration_id;

  -- Increment attendee count
  UPDATE public.events
  SET current_attendees = current_attendees + 1
  WHERE id::text = p_event_id;

  -- Award +50
  UPDATE public.user_points
  SET total_points = total_points + 50,
      updated_at = now()
  WHERE user_id = v_user_id;

  INSERT INTO public.points_transactions (user_id, points, transaction_type, source, description)
  VALUES (v_user_id, 50, 'earned', 'event_registration', 'Registered for ' || COALESCE(v_event_title, 'event'));

  RETURN json_build_object('success', true, 'registration_id', v_registration_id);

EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;