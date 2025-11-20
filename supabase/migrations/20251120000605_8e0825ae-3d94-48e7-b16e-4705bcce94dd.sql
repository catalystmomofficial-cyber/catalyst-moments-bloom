-- Allow admins to manage blogs
CREATE POLICY "Admins can insert blogs" ON public.blogs
  FOR INSERT 
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update blogs" ON public.blogs
  FOR UPDATE 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete blogs" ON public.blogs
  FOR DELETE 
  USING (public.is_admin(auth.uid()));