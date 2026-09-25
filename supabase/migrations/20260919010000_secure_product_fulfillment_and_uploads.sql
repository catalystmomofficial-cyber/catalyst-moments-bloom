-- Deploy together with verify-product-payment and create-product-payment.
BEGIN;
DROP POLICY IF EXISTS "Users insert own digital purchases" ON public.digital_product_purchases;
REVOKE INSERT, UPDATE, DELETE ON public.digital_product_purchases FROM anon, authenticated;

CREATE TABLE IF NOT EXISTS public.verified_product_payments (
  session_id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  product_slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.verified_product_payments ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.verified_product_payments FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.verified_product_payments TO service_role;

CREATE OR REPLACE FUNCTION public.fulfill_verified_product_payment(
  p_user_id uuid, p_product_slug text, p_session_id text,
  p_points_used integer, p_amount_paid_cents integer
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_price integer; v_balance integer;
BEGIN
  v_price := CASE p_product_slug WHEN 'momodoro-planner' THEN 1200 WHEN 'busy-mom-self-care' THEN 1700 ELSE NULL END;
  IF p_user_id IS NULL OR v_price IS NULL OR p_points_used IS NULL OR p_points_used < 0
     OR p_amount_paid_cents IS NULL OR p_amount_paid_cents < 0
     OR p_points_used::bigint + p_amount_paid_cents::bigint <> v_price THEN
    RAISE EXCEPTION 'Invalid purchase amounts';
  END IF;
  -- Serialize purchases per user so points cannot be spent twice concurrently.
  PERFORM pg_advisory_xact_lock(hashtextextended(p_user_id::text,0));
  IF EXISTS(SELECT 1 FROM digital_product_purchases WHERE user_id=p_user_id AND product_slug=p_product_slug) THEN
    RETURN jsonb_build_object('success',true,'already_owned',true);
  END IF;
  IF p_amount_paid_cents > 0 THEN
    IF p_session_id IS NULL OR p_session_id NOT LIKE 'cs_%' THEN RAISE EXCEPTION 'Verified payment required'; END IF;
    INSERT INTO verified_product_payments(session_id,user_id,product_slug) VALUES(p_session_id,p_user_id,p_product_slug);
  END IF;
  IF p_points_used > 0 THEN
    UPDATE user_points SET total_points=total_points-p_points_used,updated_at=now()
      WHERE user_id=p_user_id AND total_points>=p_points_used RETURNING total_points INTO v_balance;
    IF v_balance IS NULL THEN RAISE EXCEPTION 'Insufficient points; contact support if payment was collected'; END IF;
    INSERT INTO points_transactions(user_id,points,transaction_type,source,description)
      VALUES(p_user_id,-p_points_used,'spent','digital_product_purchase','Purchased '||p_product_slug);
  END IF;
  INSERT INTO digital_product_purchases(user_id,product_slug,payment_method,points_used,amount_paid_cents)
    VALUES(p_user_id,p_product_slug,CASE WHEN p_amount_paid_cents>0 THEN 'stripe' ELSE 'points' END,p_points_used,p_amount_paid_cents);
  RETURN jsonb_build_object('success',true);
END; $$;
REVOKE ALL ON FUNCTION public.fulfill_verified_product_payment(uuid,text,text,integer,integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.fulfill_verified_product_payment(uuid,text,text,integer,integer) TO service_role;

CREATE OR REPLACE FUNCTION public.purchase_digital_product(
  p_product_slug text,p_payment_method text,p_points_used integer,p_amount_paid_cents integer
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF p_payment_method IS DISTINCT FROM 'points' OR p_amount_paid_cents IS DISTINCT FROM 0 THEN
    RAISE EXCEPTION 'Cash payments must be verified by the server';
  END IF;
  RETURN public.fulfill_verified_product_payment(auth.uid(),p_product_slug,NULL,p_points_used,0);
END; $$;
REVOKE ALL ON FUNCTION public.purchase_digital_product(text,text,integer,integer) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.purchase_digital_product(text,text,integer,integer) TO authenticated;

-- Storage-service enforcement: browser validation alone can be bypassed.
UPDATE storage.buckets SET
 allowed_mime_types=ARRAY['image/jpeg','image/png','image/webp','image/gif','image/heic','image/heif'],
 file_size_limit=CASE WHEN id='avatars' THEN 5242880 ELSE 10485760 END
WHERE id IN ('avatars','progress-photos','journal-photos','blog-images');
-- Restrictive policies AND with existing ownership/admin policies.
CREATE POLICY "Image upload extension allowlist" ON storage.objects AS RESTRICTIVE FOR INSERT TO authenticated
WITH CHECK (bucket_id NOT IN ('avatars','progress-photos','journal-photos','blog-images')
 OR lower(storage.extension(name)) IN ('jpg','jpeg','png','webp','gif','heic','heif'));
CREATE POLICY "Image update extension allowlist" ON storage.objects AS RESTRICTIVE FOR UPDATE TO authenticated
USING (true) WITH CHECK (bucket_id NOT IN ('avatars','progress-photos','journal-photos','blog-images')
 OR lower(storage.extension(name)) IN ('jpg','jpeg','png','webp','gif','heic','heif'));
COMMIT;
