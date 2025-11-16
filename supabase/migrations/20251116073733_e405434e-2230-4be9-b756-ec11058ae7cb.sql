-- Create a function to send welcome email when user email is verified
CREATE OR REPLACE FUNCTION public.send_welcome_email_on_verification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only proceed if email_confirmed_at changed from null to a timestamp
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    -- Call the edge function to send welcome email
    PERFORM
      net.http_post(
        url := 'https://moxxceccaftkeuaowctw.supabase.co/functions/v1/send-welcome-email',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1veHhjZWNjYWZ0a2V1YW93Y3R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NTEyOTYsImV4cCI6MjA2MjQyNzI5Nn0.zInlBzKCVwrhKBW-nAc5b7BoxrXmlYF25cuqfippu3U'
        ),
        body := jsonb_build_object('user_id', NEW.id::text)
      );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users for email verification
DROP TRIGGER IF EXISTS on_user_email_verified ON auth.users;
CREATE TRIGGER on_user_email_verified
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.send_welcome_email_on_verification();