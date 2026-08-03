-- Send a shared-secret header from the two email triggers.
--
-- send-welcome-email and send-blog-notification had no caller authentication:
-- anyone knowing the URL could fire welcome emails for arbitrary user ids or
-- blast every subscriber. Both are called from DB triggers that present the
-- ANON key, so a service-role/admin check would have broken them. They now
-- accept a shared secret instead, and these triggers supply it.
--
-- SAFE TO RUN NOW: while WELCOME_EMAIL_SECRET / BLOG_NOTIFICATION_SECRET are
-- unset in Supabase, the functions ignore the header and behave exactly as
-- before. Enforcement begins only when you set those secrets.
--
-- BEFORE RUNNING: replace both REPLACE_WITH_* placeholders below with real
-- random values (openssl rand -hex 32), then set the SAME values as Supabase
-- edge-function secrets. See docs/security/edge-function-lockdown.md.

-- ── Welcome email on email verification ─────────────────────────────────────
CREATE OR REPLACE FUNCTION public.send_welcome_email_on_verification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    PERFORM
      net.http_post(
        url := 'https://moxxceccaftkeuaowctw.supabase.co/functions/v1/send-welcome-email',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1veHhjZWNjYWZ0a2V1YW93Y3R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NTEyOTYsImV4cCI6MjA2MjQyNzI5Nn0.zInlBzKCVwrhKBW-nAc5b7BoxrXmlYF25cuqfippu3U',
          'x-webhook-secret', 'REPLACE_WITH_WELCOME_EMAIL_SECRET'
        ),
        body := jsonb_build_object('user_id', NEW.id::text)
      );
  END IF;

  RETURN NEW;
END;
$$;

-- ── Subscriber notification when a blog is published ────────────────────────
CREATE OR REPLACE FUNCTION public.notify_blog_published()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status = 'draft' AND NEW.status = 'published' THEN
    PERFORM
      net.http_post(
        url := 'https://moxxceccaftkeuaowctw.supabase.co/functions/v1/send-blog-notification',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1veHhjZWNjYWZ0a2V1YW93Y3R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NTEyOTYsImV4cCI6MjA2MjQyNzI5Nn0.zInlBzKCVwrhKBW-nAc5b7BoxrXmlYF25cuqfippu3U',
          'x-webhook-secret', 'REPLACE_WITH_BLOG_NOTIFICATION_SECRET'
        ),
        body := jsonb_build_object('blog_id', NEW.id::text)
      );
  END IF;

  RETURN NEW;
END;
$$;
