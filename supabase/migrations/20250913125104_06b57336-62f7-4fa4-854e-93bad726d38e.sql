-- Update affiliate application function to require valid email and prevent hardcoded fallbacks
CREATE OR REPLACE FUNCTION public.create_affiliate_application(
  full_name_param text, 
  social_media_param text, 
  audience_size_param text, 
  experience_param text, 
  motivation_param text, 
  email_param text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Security validation: Reject hardcoded fallback emails
  IF email_param = 'guest@example.com' OR email_param = 'unknown@example.com' THEN
    RAISE EXCEPTION 'Invalid email address. Please provide a valid email.';
  END IF;
  
  -- Security validation: Ensure email format is valid
  IF email_param !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format. Please provide a valid email address.';
  END IF;
  
  -- Security validation: Prevent empty emails
  IF trim(email_param) = '' OR email_param IS NULL THEN
    RAISE EXCEPTION 'Email address is required.';
  END IF;

  INSERT INTO public.affiliate_applications (
    user_id,
    email,
    full_name,
    social_media_handles,
    audience_size,
    experience,
    motivation,
    status
  ) VALUES (
    auth.uid(),
    email_param,
    full_name_param,
    social_media_param,
    audience_size_param,
    experience_param,
    motivation_param,
    'pending'
  );
END;
$function$

-- Add security constraint to prevent hardcoded emails at database level
ALTER TABLE public.affiliate_applications 
ADD CONSTRAINT check_no_fallback_emails 
CHECK (email NOT IN ('guest@example.com', 'unknown@example.com', 'test@example.com'));