-- Bind user-facing credit, challenge, and event mutations to the JWT identity.
-- Never authorize a SECURITY DEFINER function from a caller-supplied user id.

CREATE OR REPLACE FUNCTION public.deduct_user_credits(
  p_user_id uuid, p_amount integer, p_source text, p_description text DEFAULT NULL
)
RETURNS TABLE(success boolean, remaining_points integer, error_message text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_uid uuid := auth.uid(); v_remaining integer;
BEGIN
  IF v_uid IS NULL OR v_uid <> p_user_id THEN RAISE EXCEPTION 'Access denied'; END IF;
  IF p_amount IS NULL OR p_amount <= 0 OR p_amount > 100000 THEN
    RETURN QUERY SELECT false, COALESCE((SELECT total_points FROM public.user_points WHERE user_id=v_uid),0), 'Invalid amount'::text;
    RETURN;
  END IF;
  INSERT INTO public.user_points(user_id,total_points,level) VALUES(v_uid,0,1)
    ON CONFLICT(user_id) DO NOTHING;
  UPDATE public.user_points SET total_points=total_points-p_amount, updated_at=now()
  WHERE user_id=v_uid AND total_points>=p_amount RETURNING total_points INTO v_remaining;
  IF v_remaining IS NULL THEN
    RETURN QUERY SELECT false, COALESCE((SELECT total_points FROM public.user_points WHERE user_id=v_uid),0), 'Insufficient credits'::text;
    RETURN;
  END IF;
  INSERT INTO public.points_transactions(user_id,points,transaction_type,source,description)
  VALUES(v_uid,-p_amount,'spent',left(coalesce(p_source,'credit_spend'),100),left(p_description,500));
  RETURN QUERY SELECT true,v_remaining,NULL::text;
END; $$;

CREATE OR REPLACE FUNCTION public.increment_challenge_progress(p_user_id uuid, p_challenge_type text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_uid uuid := auth.uid(); v_challenge_id uuid; v_target integer; v_count integer;
BEGIN
  IF v_uid IS NULL OR v_uid <> p_user_id THEN RAISE EXCEPTION 'Access denied'; END IF;
  IF length(coalesce(p_challenge_type,'')) NOT BETWEEN 1 AND 80 THEN RAISE EXCEPTION 'Invalid challenge type'; END IF;
  SELECT c.id,c.target_count INTO v_challenge_id,v_target
  FROM public.monthly_challenges c JOIN public.profiles p ON p.user_id=v_uid
  WHERE c.is_active AND c.challenge_type=p_challenge_type
    AND c.start_date<=now() AND c.end_date>=now()
    AND (c.motherhood_stage=p.motherhood_stage OR c.motherhood_stage='general') LIMIT 1;
  IF v_challenge_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.user_challenge_progress(user_id,challenge_id,current_count,updated_at)
  VALUES(v_uid,v_challenge_id,1,now())
  ON CONFLICT(user_id,challenge_id) DO UPDATE
    SET current_count=LEAST(public.user_challenge_progress.current_count+1,v_target),updated_at=now()
  RETURNING current_count INTO v_count;
  IF v_count>=v_target THEN
    UPDATE public.user_challenge_progress SET completed=true,completed_at=COALESCE(completed_at,now())
    WHERE user_id=v_uid AND challenge_id=v_challenge_id;
  END IF;
END; $$;

-- The current UI calls the eleven-argument overload. All identity and event
-- details are now sourced server-side. Cash registrations are rejected here;
-- a verified payment webhook must create those registrations.
CREATE OR REPLACE FUNCTION public.register_for_event(
  p_event_id text, p_user_id text, p_payment_method text, p_points_used integer,
  p_amount_paid integer, p_event_title text DEFAULT NULL, p_event_date text DEFAULT NULL,
  p_event_time text DEFAULT NULL, p_first_name text DEFAULT NULL,
  p_last_name text DEFAULT NULL, p_email text DEFAULT NULL
)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid uuid := auth.uid(); v_event public.events%ROWTYPE; v_registration_id uuid;
  v_balance integer; v_name text; v_email text; v_first text; v_last text;
BEGIN
  IF v_uid IS NULL OR v_uid::text <> p_user_id THEN RAISE EXCEPTION 'Access denied'; END IF;
  IF p_payment_method NOT IN ('points','free','member_free') THEN
    RETURN json_build_object('success',false,'error','Payment must be verified before registration');
  END IF;
  SELECT * INTO v_event FROM public.events WHERE id::text=p_event_id FOR UPDATE;
  IF NOT FOUND THEN RETURN json_build_object('success',false,'error','Event not found'); END IF;
  IF EXISTS(SELECT 1 FROM public.event_registrations WHERE event_id=p_event_id AND user_id=v_uid) THEN
    RETURN json_build_object('success',false,'error','Already registered for this event');
  END IF;
  IF coalesce(v_event.current_attendees,0)>=coalesce(v_event.max_capacity,0) THEN
    RETURN json_build_object('success',false,'error','Event is fully booked');
  END IF;
  IF p_payment_method='points' THEN
    IF coalesce(p_points_used,0)<>coalesce(v_event.points_cost,0) OR coalesce(v_event.points_cost,0)<=0 THEN
      RETURN json_build_object('success',false,'error','Invalid points amount');
    END IF;
    UPDATE public.user_points SET total_points=total_points-v_event.points_cost,updated_at=now()
    WHERE user_id=v_uid AND total_points>=v_event.points_cost RETURNING total_points INTO v_balance;
    IF v_balance IS NULL THEN RETURN json_build_object('success',false,'error','Insufficient points'); END IF;
    INSERT INTO public.points_transactions(user_id,points,transaction_type,source,description)
    VALUES(v_uid,-v_event.points_cost,'spent','event_registration','Registered for '||v_event.title);
  ELSIF p_payment_method='member_free' THEN
    IF NOT coalesce(v_event.is_free_for_members,false) OR NOT public.is_premium_user() THEN
      RETURN json_build_object('success',false,'error','Membership does not include this event');
    END IF;
  ELSIF coalesce(v_event.price_non_member,0)>0 THEN
    RETURN json_build_object('success',false,'error','Payment required');
  END IF;
  SELECT display_name INTO v_name FROM public.profiles WHERE user_id=v_uid;
  SELECT email INTO v_email FROM auth.users WHERE id=v_uid;
  v_first:=split_part(coalesce(v_name,v_email,'Member'),' ',1);
  v_last:=coalesce(nullif(btrim(substr(coalesce(v_name,''),length(v_first)+1)),''),'-');
  INSERT INTO public.event_registrations(event_id,user_id,event_title,event_date,event_time,
    payment_method,points_used,amount_paid,attended,first_name,last_name,email)
  VALUES(p_event_id,v_uid,v_event.title,coalesce(v_event.event_date::text,''),coalesce(v_event.time_display,''),
    p_payment_method,CASE WHEN p_payment_method='points' THEN v_event.points_cost ELSE 0 END,0,false,
    v_first,v_last,coalesce(v_email,'')) RETURNING id INTO v_registration_id;
  UPDATE public.events SET current_attendees=coalesce(current_attendees,0)+1 WHERE id=v_event.id;
  RETURN json_build_object('success',true,'registration_id',v_registration_id);
END; $$;

REVOKE EXECUTE ON FUNCTION public.deduct_user_credits(uuid,integer,text,text) FROM PUBLIC,anon;
REVOKE EXECUTE ON FUNCTION public.increment_challenge_progress(uuid,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.deduct_user_credits(uuid,integer,text,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_challenge_progress(uuid,text) TO authenticated;
