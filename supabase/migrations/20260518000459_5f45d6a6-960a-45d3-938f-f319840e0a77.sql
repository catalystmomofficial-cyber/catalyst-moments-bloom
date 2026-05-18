
DROP FUNCTION IF EXISTS public.update_affiliate_status(uuid, text);

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS affiliate_status text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS paypal_email text;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_referral_code_unique
  ON public.profiles (lower(referral_code))
  WHERE referral_code IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.affiliate_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_user_id uuid NOT NULL,
  referred_user_id uuid NOT NULL UNIQUE,
  affiliate_code text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payment_count int NOT NULL DEFAULT 0,
  second_payment_at timestamptz,
  payout_ready_at timestamptz,
  payout_paid_at timestamptz,
  amount_cents int NOT NULL DEFAULT 2900,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_affiliate ON public.affiliate_referrals(affiliate_user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_status ON public.affiliate_referrals(status);

ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "affiliates_view_own_referrals" ON public.affiliate_referrals;
DROP POLICY IF EXISTS "admins_view_all_referrals" ON public.affiliate_referrals;
DROP POLICY IF EXISTS "service_role_manage_referrals" ON public.affiliate_referrals;

CREATE POLICY "affiliates_view_own_referrals" ON public.affiliate_referrals
  FOR SELECT USING (auth.uid() = affiliate_user_id);
CREATE POLICY "admins_view_all_referrals" ON public.affiliate_referrals
  FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "service_role_manage_referrals" ON public.affiliate_referrals
  FOR ALL USING (((auth.jwt() ->> 'role'::text) = 'service_role'::text))
  WITH CHECK (((auth.jwt() ->> 'role'::text) = 'service_role'::text));

DROP TRIGGER IF EXISTS trg_affiliate_referrals_updated ON public.affiliate_referrals;
CREATE TRIGGER trg_affiliate_referrals_updated
  BEFORE UPDATE ON public.affiliate_referrals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.affiliate_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_user_id uuid NOT NULL,
  referral_id uuid NOT NULL REFERENCES public.affiliate_referrals(id) ON DELETE CASCADE,
  amount_cents int NOT NULL DEFAULT 2900,
  status text NOT NULL DEFAULT 'ready',
  notified_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "affiliates_view_own_payouts" ON public.affiliate_payouts;
DROP POLICY IF EXISTS "admins_view_all_payouts" ON public.affiliate_payouts;
DROP POLICY IF EXISTS "service_role_manage_payouts" ON public.affiliate_payouts;

CREATE POLICY "affiliates_view_own_payouts" ON public.affiliate_payouts
  FOR SELECT USING (auth.uid() = affiliate_user_id);
CREATE POLICY "admins_view_all_payouts" ON public.affiliate_payouts
  FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "service_role_manage_payouts" ON public.affiliate_payouts
  FOR ALL USING (((auth.jwt() ->> 'role'::text) = 'service_role'::text))
  WITH CHECK (((auth.jwt() ->> 'role'::text) = 'service_role'::text));

CREATE OR REPLACE FUNCTION public.generate_unique_referral_code(p_seed text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE base text; candidate text; i int := 0;
BEGIN
  base := regexp_replace(lower(coalesce(p_seed,'mom')), '[^a-z0-9]+', '', 'g');
  IF length(base) < 3 THEN base := base || 'mom'; END IF;
  IF length(base) > 12 THEN base := substr(base, 1, 12); END IF;
  LOOP
    candidate := base || lpad((floor(random()*10000))::int::text, 4, '0');
    PERFORM 1 FROM public.profiles WHERE lower(referral_code) = candidate;
    IF NOT FOUND THEN RETURN candidate; END IF;
    i := i + 1;
    IF i > 20 THEN RETURN base || substr(md5(random()::text), 1, 6); END IF;
  END LOOP;
END; $$;

CREATE OR REPLACE FUNCTION public.update_affiliate_status(application_id uuid, new_status text)
RETURNS TABLE(affiliate_user_id uuid, affiliate_email text, affiliate_name text, affiliate_code text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_app RECORD; v_code text; v_existing text;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN RAISE EXCEPTION 'Access denied. Admin privileges required.'; END IF;
  IF new_status NOT IN ('pending','approved','rejected') THEN RAISE EXCEPTION 'Invalid status'; END IF;

  UPDATE public.affiliate_applications SET status = new_status, updated_at = now()
  WHERE id = application_id RETURNING * INTO v_app;
  IF v_app.id IS NULL THEN RAISE EXCEPTION 'Application not found'; END IF;

  IF new_status = 'approved' THEN
    SELECT referral_code INTO v_existing FROM public.profiles WHERE user_id = v_app.user_id;
    IF v_existing IS NULL OR v_existing = '' THEN
      v_code := public.generate_unique_referral_code(coalesce(v_app.full_name,'mom'));
    ELSE v_code := v_existing; END IF;

    UPDATE public.profiles
    SET affiliate_status = 'active', referral_code = v_code, updated_at = now()
    WHERE user_id = v_app.user_id;

    RETURN QUERY SELECT v_app.user_id, v_app.email, v_app.full_name, v_code;
  ELSIF new_status = 'rejected' THEN
    UPDATE public.profiles SET affiliate_status = 'rejected', updated_at = now()
    WHERE user_id = v_app.user_id;
  END IF;
  RETURN;
END; $$;

CREATE OR REPLACE FUNCTION public.attach_referral_on_signup(p_user_id uuid, p_ref_code text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_affiliate_id uuid;
BEGIN
  IF p_ref_code IS NULL OR p_ref_code = '' THEN RETURN; END IF;
  SELECT user_id INTO v_affiliate_id FROM public.profiles
  WHERE lower(referral_code) = lower(p_ref_code) AND affiliate_status = 'active' LIMIT 1;
  IF v_affiliate_id IS NULL OR v_affiliate_id = p_user_id THEN RETURN; END IF;

  UPDATE public.profiles SET referred_by_code = p_ref_code, updated_at = now()
  WHERE user_id = p_user_id;

  INSERT INTO public.affiliate_referrals(affiliate_user_id, referred_user_id, affiliate_code, status)
  VALUES (v_affiliate_id, p_user_id, p_ref_code, 'pending')
  ON CONFLICT (referred_user_id) DO NOTHING;
END; $$;

CREATE OR REPLACE FUNCTION public.mark_referral_payment(p_referred_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.affiliate_referrals
  SET payment_count = payment_count + 1,
      second_payment_at = CASE WHEN payment_count + 1 = 2 THEN now() ELSE second_payment_at END,
      payout_ready_at  = CASE WHEN payment_count + 1 = 2 THEN now() + interval '7 days' ELSE payout_ready_at END,
      status           = CASE WHEN payment_count + 1 >= 2 AND status = 'pending' THEN 'confirmed' ELSE status END,
      updated_at = now()
  WHERE referred_user_id = p_referred_user_id;
END; $$;

CREATE OR REPLACE FUNCTION public.get_affiliate_stats(p_user_id uuid)
RETURNS TABLE(total_referrals int, pending_referrals int, confirmed_referrals int, paid_referrals int, total_earnings_cents bigint, paid_earnings_cents bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT
    count(*)::int,
    count(*) FILTER (WHERE status='pending')::int,
    count(*) FILTER (WHERE status IN ('confirmed','paid'))::int,
    count(*) FILTER (WHERE status='paid')::int,
    coalesce(sum(amount_cents) FILTER (WHERE status IN ('confirmed','paid')),0)::bigint,
    coalesce(sum(amount_cents) FILTER (WHERE status='paid'),0)::bigint
  FROM public.affiliate_referrals WHERE affiliate_user_id = p_user_id;
$$;

CREATE OR REPLACE FUNCTION public.process_affiliate_payouts()
RETURNS TABLE(payout_id uuid, affiliate_user_id uuid, amount_cents int, referral_id uuid)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r RECORD; v_payout_id uuid;
BEGIN
  FOR r IN
    SELECT ar.* FROM public.affiliate_referrals ar
    WHERE ar.status = 'confirmed' AND ar.payout_ready_at IS NOT NULL AND ar.payout_ready_at <= now()
      AND EXISTS (SELECT 1 FROM public.subscribers s WHERE s.user_id = ar.affiliate_user_id
                   AND s.subscribed = true AND (s.subscription_end IS NULL OR s.subscription_end > now()))
      AND NOT EXISTS (SELECT 1 FROM public.affiliate_payouts p WHERE p.referral_id = ar.id)
  LOOP
    INSERT INTO public.affiliate_payouts(affiliate_user_id, referral_id, amount_cents, status, notified_at)
    VALUES (r.affiliate_user_id, r.id, r.amount_cents, 'ready', now())
    RETURNING id INTO v_payout_id;
    UPDATE public.affiliate_referrals SET status = 'paid', payout_paid_at = now(), updated_at = now() WHERE id = r.id;
    payout_id := v_payout_id; affiliate_user_id := r.affiliate_user_id;
    amount_cents := r.amount_cents; referral_id := r.id;
    RETURN NEXT;
  END LOOP;
END; $$;
