-- Fix search path security warning for subscription function using CASCADE

DROP FUNCTION IF EXISTS public.user_has_active_subscription() CASCADE;

CREATE OR REPLACE FUNCTION public.user_has_active_subscription()
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER 
STABLE
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE user_id = auth.uid() 
    AND subscribed = true 
    AND (subscription_end IS NULL OR subscription_end > now())
  );
END;
$$;

-- Recreate the policy that was dropped due to CASCADE
CREATE POLICY "premium_content_for_subscribers_only" ON public.course_content
FOR SELECT
USING (
  is_premium = true 
  AND auth.uid() IS NOT NULL 
  AND public.user_has_active_subscription() = true
);