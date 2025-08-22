-- Fix RLS policies for course_content to restrict premium content to subscribed users only

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Course content is viewable by everyone" ON public.course_content;

-- Create policy for free content (available to everyone)
CREATE POLICY "free_content_viewable_by_everyone" ON public.course_content
FOR SELECT
USING (is_premium = false);

-- Create policy for premium content (only for subscribed users)
CREATE POLICY "premium_content_for_subscribers_only" ON public.course_content
FOR SELECT
USING (
  is_premium = true 
  AND auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE user_id = auth.uid() 
    AND subscribed = true 
    AND (subscription_end IS NULL OR subscription_end > now())
  )
);

-- Create a security definer function to check subscription status safely
CREATE OR REPLACE FUNCTION public.user_has_active_subscription()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE user_id = auth.uid() 
    AND subscribed = true 
    AND (subscription_end IS NULL OR subscription_end > now())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Alternative policy using the security definer function (more efficient for repeated checks)
DROP POLICY IF EXISTS "premium_content_for_subscribers_only" ON public.course_content;

CREATE POLICY "premium_content_for_subscribers_only" ON public.course_content
FOR SELECT
USING (
  is_premium = true 
  AND auth.uid() IS NOT NULL 
  AND public.user_has_active_subscription() = true
);

-- Add comment to document security implementation
COMMENT ON TABLE public.course_content IS 'Premium content restricted to active subscribers. Free content available to all users.';