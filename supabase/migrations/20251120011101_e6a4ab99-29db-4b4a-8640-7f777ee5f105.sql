-- Allow admins to view all blogs including drafts
CREATE POLICY "Admins can view all blogs including drafts"
ON public.blogs
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));