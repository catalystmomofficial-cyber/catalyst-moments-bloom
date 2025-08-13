-- Fix insecure UPDATE policy on public.subscribers
-- 1) Drop the existing overly-permissive policy
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

-- 2) Recreate a secure UPDATE policy limiting updates to the owner's row
CREATE POLICY "update_own_subscription"
ON public.subscribers
FOR UPDATE
TO authenticated
USING ((user_id = auth.uid()) OR (email = auth.email()))
WITH CHECK ((user_id = auth.uid()) OR (email = auth.email()));