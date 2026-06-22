
-- 1. event_registrations: forbid NULL user_id (anon cannot insert PII)
ALTER TABLE public.event_registrations ALTER COLUMN user_id SET NOT NULL;

-- 2. Storage: drop broad SELECT policies that allow LISTING public buckets.
-- Files remain accessible via their public URLs (served by Storage CDN, bypassing RLS).
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Blog images are publicly accessible" ON storage.objects;

-- 3. Replace "WITH CHECK (true)" policies with meaningful constraints.
DROP POLICY IF EXISTS "Anyone can insert blog analytics" ON public.blog_analytics;
CREATE POLICY "Anyone can insert blog analytics"
  ON public.blog_analytics FOR INSERT TO anon, authenticated
  WITH CHECK (
    blog_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM public.blogs b WHERE b.id = blog_analytics.blog_id AND b.status = 'published')
  );

DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscribers FOR INSERT TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND length(email) BETWEEN 5 AND 254
    AND email ~* '^[A-Za-z0-9._%%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );

DROP POLICY IF EXISTS "Anyone can log 404s" ON public.not_found_logs;
CREATE POLICY "Anyone can log 404s"
  ON public.not_found_logs FOR INSERT TO anon, authenticated
  WITH CHECK (
    path IS NOT NULL
    AND length(path) BETWEEN 1 AND 2048
  );

DROP POLICY IF EXISTS "Service role can insert lead responses" ON public.lead_responses;
CREATE POLICY "Service role can insert lead responses"
  ON public.lead_responses FOR INSERT TO public
  WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- 4. Revoke anonymous EXECUTE on all public functions (anon should never call RPCs directly).
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM anon;

-- 4b. Revoke EXECUTE from end-users on trigger-only / server-only functions that should
-- never be called via the API.
REVOKE EXECUTE ON FUNCTION public.handle_new_user()                       FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.send_welcome_email_on_verification()    FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_blog_published()                 FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at()                     FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column()              FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_affiliate_application_email()  FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.award_challenge_badges()                FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.process_affiliate_payouts()             FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.mark_referral_payment(uuid)             FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.attach_referral_on_signup(uuid, text)   FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_admin_action(text, uuid, text)      FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.add_user_points(uuid, integer, text, text)        FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.add_purchased_credits(uuid, integer, text, text)  FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.deduct_user_credits(uuid, integer, text, text)    FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_unique_referral_code(text)     FROM anon, authenticated;

-- 5. Restrict Realtime channel subscriptions: only authenticated sessions may read or
-- send messages. Underlying postgres_changes still enforce per-row RLS on the source tables.
DO $$
BEGIN
  IF to_regclass('realtime.messages') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "Authenticated can read realtime messages" ON realtime.messages';
    EXECUTE 'CREATE POLICY "Authenticated can read realtime messages" ON realtime.messages FOR SELECT TO authenticated USING (true)';
    EXECUTE 'DROP POLICY IF EXISTS "Authenticated can send realtime messages" ON realtime.messages';
    EXECUTE 'CREATE POLICY "Authenticated can send realtime messages" ON realtime.messages FOR INSERT TO authenticated WITH CHECK (true)';
  END IF;
END$$;
