-- Create helper functions for affiliate operations
CREATE OR REPLACE FUNCTION public.get_affiliate_status(user_id_param uuid)
RETURNS TABLE(status text) AS $$
BEGIN
  RETURN QUERY
  SELECT aa.status
  FROM public.affiliate_applications aa
  WHERE aa.user_id = user_id_param;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO '';

CREATE OR REPLACE FUNCTION public.create_affiliate_application(
  full_name_param text,
  social_media_param text,
  audience_size_param text,
  experience_param text,
  motivation_param text,
  email_param text
)
RETURNS void AS $$
BEGIN
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
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO '';