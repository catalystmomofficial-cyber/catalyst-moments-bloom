
-- user_points: remove direct user write access (only RPCs/service_role should modify)
DROP POLICY IF EXISTS "Users can insert their own points" ON public.user_points;
DROP POLICY IF EXISTS "Users can update their own points" ON public.user_points;

-- points_transactions: remove permissive insert (RPC SECURITY DEFINER handles inserts)
DROP POLICY IF EXISTS "System can insert transactions" ON public.points_transactions;

-- reminder_logs: remove permissive insert (edge function uses service_role)
DROP POLICY IF EXISTS "System can insert reminder logs" ON public.reminder_logs;

-- notifications: replace with ownership-checked policy
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
CREATE POLICY "Users can insert their own notifications"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- event_registrations: require auth + ownership
DROP POLICY IF EXISTS "Anyone can register for an event" ON public.event_registrations;
CREATE POLICY "Authenticated users can register themselves"
  ON public.event_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- storage.objects: restrict blog-images write access to admins
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;

CREATE POLICY "Admins can upload blog images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update blog images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'blog-images' AND public.is_admin(auth.uid()))
  WITH CHECK (bucket_id = 'blog-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete blog images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'blog-images' AND public.is_admin(auth.uid()));
