-- Paid content buckets are now private. Access is decided here, per request,
-- rather than by whoever happens to hold a URL.

CREATE OR REPLACE FUNCTION public.can_read_paid_content()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL AND (
    public.is_admin(auth.uid())
    OR public.user_has_active_subscription()
    OR public.is_premium_user()
    OR EXISTS (SELECT 1 FROM public.digital_product_purchases p WHERE p.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.user_course_progress c WHERE c.user_id = auth.uid())
  );
$$;

REVOKE ALL ON FUNCTION public.can_read_paid_content() FROM anon;
GRANT EXECUTE ON FUNCTION public.can_read_paid_content() TO authenticated, service_role;

DROP POLICY IF EXISTS "Paid content readable by paying members" ON storage.objects;
CREATE POLICY "Paid content readable by paying members"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id IN ('catalystcourses', 'Digital guide', 'product covers', 'catalyst mom demo')
  AND public.can_read_paid_content()
);

DROP POLICY IF EXISTS "Admins manage paid content" ON storage.objects;
CREATE POLICY "Admins manage paid content"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id IN ('catalystcourses', 'Digital guide', 'product covers', 'catalyst mom demo')
  AND public.is_admin(auth.uid())
)
WITH CHECK (
  bucket_id IN ('catalystcourses', 'Digital guide', 'product covers', 'catalyst mom demo')
  AND public.is_admin(auth.uid())
);