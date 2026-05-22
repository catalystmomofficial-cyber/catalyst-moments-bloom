
CREATE TABLE IF NOT EXISTS public.digital_product_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_slug text NOT NULL,
  payment_method text NOT NULL,
  points_used integer NOT NULL DEFAULT 0,
  amount_paid_cents integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_slug)
);

ALTER TABLE public.digital_product_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own digital purchases"
  ON public.digital_product_purchases FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own digital purchases"
  ON public.digital_product_purchases FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.purchase_digital_product(
  p_product_slug text,
  p_payment_method text,
  p_points_used integer,
  p_amount_paid_cents integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_balance integer;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  IF EXISTS (SELECT 1 FROM public.digital_product_purchases
             WHERE user_id = v_user_id AND product_slug = p_product_slug) THEN
    RETURN jsonb_build_object('success', true, 'already_owned', true);
  END IF;

  IF p_points_used > 0 THEN
    SELECT total_points INTO v_balance FROM public.user_points WHERE user_id = v_user_id;
    IF COALESCE(v_balance, 0) < p_points_used THEN
      RETURN jsonb_build_object('success', false, 'error', 'Insufficient points');
    END IF;
    PERFORM public.add_user_points(
      v_user_id,
      -p_points_used,
      'digital_product_purchase',
      'Purchased ' || p_product_slug
    );
  END IF;

  INSERT INTO public.digital_product_purchases
    (user_id, product_slug, payment_method, points_used, amount_paid_cents)
  VALUES (v_user_id, p_product_slug, p_payment_method, p_points_used, p_amount_paid_cents);

  RETURN jsonb_build_object('success', true);
END;
$$;
