-- Emergency RPC hardening following the 2026-09-13 live privilege audit.
-- PostgreSQL grants EXECUTE to PUBLIC on new functions by default. Because
-- anon/authenticated inherit PUBLIC, old SECURITY DEFINER functions were
-- reachable through PostgREST even when their tables had RLS.

-- Close the inheritance path for every existing and future public function.
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC, anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon;

-- Server/trigger-only functions must never be callable by app users.
DO $$
DECLARE f regprocedure;
BEGIN
  FOR f IN
    SELECT p.oid::regprocedure
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = ANY (ARRAY[
        'add_purchased_credits', 'deduct_user_credits',
        'mark_referral_payment', 'process_affiliate_payouts',
        'generate_unique_referral_code', 'handle_new_user',
        'send_welcome_email_on_verification', 'notify_blog_published',
        'validate_affiliate_application_email', 'award_challenge_badges',
        'log_admin_action', 'update_updated_at_column', 'handle_updated_at'
      ])
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', f);
  END LOOP;
END $$;

-- The app historically passed a user id into read RPCs. Keep the API shape
-- stable, but reject cross-account lookups before any protected row is read.
CREATE OR REPLACE FUNCTION public.get_user_credits(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR (auth.uid() <> p_user_id AND NOT public.is_admin(auth.uid())) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  RETURN COALESCE((SELECT total_points FROM public.user_points WHERE user_id = p_user_id), 0);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_affiliate_stats(p_user_id uuid)
RETURNS TABLE(total_referrals int, pending_referrals int, confirmed_referrals int,
              paid_referrals int, total_earnings_cents bigint, paid_earnings_cents bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR (auth.uid() <> p_user_id AND NOT public.is_admin(auth.uid())) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  RETURN QUERY
  SELECT count(*)::int,
    count(*) FILTER (WHERE status='pending')::int,
    count(*) FILTER (WHERE status IN ('confirmed','paid'))::int,
    count(*) FILTER (WHERE status='paid')::int,
    coalesce(sum(amount_cents) FILTER (WHERE status IN ('confirmed','paid')),0)::bigint,
    coalesce(sum(amount_cents) FILTER (WHERE status='paid'),0)::bigint
  FROM public.affiliate_referrals WHERE affiliate_user_id = p_user_id;
END;
$$;

-- Referral attachment may only modify the signed-in user's own profile.
CREATE OR REPLACE FUNCTION public.attach_referral_on_signup(p_user_id uuid, p_ref_code text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_affiliate_id uuid;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN RAISE EXCEPTION 'Access denied'; END IF;
  IF p_ref_code IS NULL OR btrim(p_ref_code) = '' THEN RETURN; END IF;
  SELECT user_id INTO v_affiliate_id FROM public.profiles
  WHERE lower(referral_code) = lower(btrim(p_ref_code)) AND affiliate_status = 'active' LIMIT 1;
  IF v_affiliate_id IS NULL OR v_affiliate_id = p_user_id THEN RETURN; END IF;
  UPDATE public.profiles SET referred_by_code = btrim(p_ref_code), updated_at = now()
  WHERE user_id = p_user_id AND referred_by_code IS NULL;
  INSERT INTO public.affiliate_referrals(affiliate_user_id, referred_user_id, affiliate_code, status)
  VALUES (v_affiliate_id, p_user_id, btrim(p_ref_code), 'pending')
  ON CONFLICT (referred_user_id) DO NOTHING;
END; $$;

CREATE OR REPLACE FUNCTION public.get_affiliate_status(user_id_param uuid)
RETURNS TABLE(status text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR (auth.uid() <> user_id_param AND NOT public.is_admin(auth.uid())) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  RETURN QUERY SELECT aa.status FROM public.affiliate_applications aa
  WHERE aa.user_id = user_id_param;
END; $$;

-- These two event RPCs accepted an arbitrary p_user_id and ran as the owner.
-- Preserve their signatures for the current UI but bind them to auth.uid().
CREATE OR REPLACE FUNCTION public.mark_event_attended(p_event_id text, p_user_id text)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_uid uuid := auth.uid(); v_already boolean; v_updated integer;
BEGIN
  IF v_uid IS NULL OR v_uid::text <> p_user_id THEN RAISE EXCEPTION 'Access denied'; END IF;
  SELECT attended INTO v_already FROM public.event_registrations
  WHERE event_id = p_event_id AND user_id = v_uid;
  IF v_already IS TRUE THEN
    RETURN json_build_object('success', true, 'already_attended', true, 'points_awarded', 0);
  END IF;
  UPDATE public.event_registrations SET attended = true
  WHERE event_id = p_event_id AND user_id = v_uid;
  GET DIAGNOSTICS v_updated = ROW_COUNT;
  IF v_updated = 0 THEN RETURN json_build_object('success', false, 'error', 'Registration not found'); END IF;
  RETURN json_build_object('success', true, 'already_attended', false, 'rows_updated', v_updated);
END; $$;

-- Affiliate applications must belong to the signed-in account and use its
-- verified authentication email, not an arbitrary caller-supplied address.
CREATE OR REPLACE FUNCTION public.create_affiliate_application(
  full_name_param text, social_media_param text, audience_size_param text,
  experience_param text, motivation_param text, email_param text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_uid uuid := auth.uid(); v_email text;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  SELECT email INTO v_email FROM auth.users WHERE id = v_uid;
  IF v_email IS NULL OR lower(v_email) <> lower(btrim(email_param)) THEN
    RAISE EXCEPTION 'Email must match the signed-in account';
  END IF;
  IF length(btrim(full_name_param)) NOT BETWEEN 1 AND 120
     OR length(coalesce(social_media_param,'')) > 300
     OR length(coalesce(motivation_param,'')) > 2000 THEN
    RAISE EXCEPTION 'Invalid application fields';
  END IF;
  INSERT INTO public.affiliate_applications
    (user_id,email,full_name,social_media_handles,audience_size,experience,motivation,status)
  VALUES (v_uid,v_email,btrim(full_name_param),social_media_param,audience_size_param,
          experience_param,motivation_param,'pending');
END; $$;

-- Explicitly expose only app-facing functions. Admin functions remain safe
-- because their bodies perform public.is_admin(auth.uid()) before returning
-- data or mutating state.
DO $$
DECLARE f regprocedure;
BEGIN
  FOR f IN
    SELECT p.oid::regprocedure
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = ANY (ARRAY[
        'is_admin', 'is_premium_user', 'can_read_paid_content',
        'get_user_credits', 'get_affiliate_stats', 'get_affiliate_status',
        'attach_referral_on_signup', 'create_affiliate_application',
        'request_stage_change', 'record_birth', 'record_pregnancy_outcome',
        'leave_pregnancy_holding', 'end_contraction',
        'recompute_contraction_intervals', 'archive_contractions',
        'purchase_digital_product', 'register_for_event', 'mark_event_attended',
        'increment_challenge_progress', 'redeem_points_for_discount',
        'get_all_users_with_points', 'get_all_affiliate_applications',
        'get_pending_users', 'approve_user', 'admin_adjust_user_points',
        'update_affiliate_status', 'approve_all_pending_affiliates',
        'get_all_blogs', 'admin_update_blog', 'admin_delete_blog',
        'get_blog_analytics_summary', 'check_blog_scheduler_status',
        'get_pending_stage_change_requests', 'review_stage_change'
      ])
  LOOP
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated', f);
  END LOOP;
END $$;

GRANT EXECUTE ON FUNCTION public.get_user_credits(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_affiliate_stats(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.attach_referral_on_signup(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_affiliate_status(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_event_attended(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_affiliate_application(text, text, text, text, text, text) TO authenticated;
