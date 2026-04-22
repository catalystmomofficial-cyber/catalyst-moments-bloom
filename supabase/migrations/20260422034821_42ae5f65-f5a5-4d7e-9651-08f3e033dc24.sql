-- Stage change requests table
CREATE TABLE public.stage_change_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  current_stage text,
  requested_stage text NOT NULL,
  reason text,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_stage_change_requests_user ON public.stage_change_requests(user_id);
CREATE INDEX idx_stage_change_requests_status ON public.stage_change_requests(status);

ALTER TABLE public.stage_change_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own stage requests"
  ON public.stage_change_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users create own stage requests"
  ON public.stage_change_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins view all stage requests"
  ON public.stage_change_requests FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins update stage requests"
  ON public.stage_change_requests FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE TRIGGER update_stage_change_requests_updated_at
  BEFORE UPDATE ON public.stage_change_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Submit a stage change request
CREATE OR REPLACE FUNCTION public.request_stage_change(
  p_requested_stage text,
  p_reason text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_current_stage text;
  v_request_id uuid;
  v_pending_count int;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF p_requested_stage NOT IN ('ttc', 'pregnancy', 'postpartum', 'none') THEN
    RAISE EXCEPTION 'Invalid stage';
  END IF;

  SELECT motherhood_stage INTO v_current_stage
  FROM profiles WHERE user_id = v_user_id;

  IF v_current_stage = p_requested_stage THEN
    RAISE EXCEPTION 'You are already in this stage';
  END IF;

  SELECT count(*) INTO v_pending_count
  FROM stage_change_requests
  WHERE user_id = v_user_id AND status = 'pending';

  IF v_pending_count > 0 THEN
    RAISE EXCEPTION 'You already have a pending stage change request';
  END IF;

  INSERT INTO stage_change_requests (user_id, current_stage, requested_stage, reason)
  VALUES (v_user_id, v_current_stage, p_requested_stage, p_reason)
  RETURNING id INTO v_request_id;

  RETURN v_request_id;
END;
$$;

-- Admin reviews a request
CREATE OR REPLACE FUNCTION public.review_stage_change(
  p_request_id uuid,
  p_decision text,
  p_notes text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_req RECORD;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  IF p_decision NOT IN ('approved', 'rejected') THEN
    RAISE EXCEPTION 'Invalid decision';
  END IF;

  SELECT * INTO v_req FROM stage_change_requests WHERE id = p_request_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Request not found';
  END IF;

  IF v_req.status <> 'pending' THEN
    RAISE EXCEPTION 'Request already reviewed';
  END IF;

  UPDATE stage_change_requests
  SET status = p_decision,
      admin_notes = p_notes,
      reviewed_by = auth.uid(),
      reviewed_at = now(),
      updated_at = now()
  WHERE id = p_request_id;

  IF p_decision = 'approved' THEN
    UPDATE profiles
    SET motherhood_stage = v_req.requested_stage,
        updated_at = now()
    WHERE user_id = v_req.user_id;
  END IF;

  PERFORM public.log_admin_action(
    'review_stage_change',
    v_req.user_id,
    CONCAT('Stage change ', p_decision, ': ', v_req.current_stage, ' -> ', v_req.requested_stage)
  );
END;
$$;

-- Admin lists pending requests
CREATE OR REPLACE FUNCTION public.get_pending_stage_change_requests()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  email text,
  display_name text,
  current_stage text,
  requested_stage text,
  reason text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT
    r.id,
    r.user_id,
    au.email::text,
    p.display_name,
    r.current_stage,
    r.requested_stage,
    r.reason,
    r.created_at
  FROM stage_change_requests r
  LEFT JOIN auth.users au ON au.id = r.user_id
  LEFT JOIN profiles p ON p.user_id = r.user_id
  WHERE r.status = 'pending'
  ORDER BY r.created_at ASC;
END;
$$;