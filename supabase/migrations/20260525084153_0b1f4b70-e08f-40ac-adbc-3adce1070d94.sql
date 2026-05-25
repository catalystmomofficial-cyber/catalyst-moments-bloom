CREATE POLICY "Admins can view all user points"
ON public.user_points
FOR SELECT
USING (public.is_admin(auth.uid()));