DROP POLICY IF EXISTS "Coach insert" ON public.coach_query_gaps;
ALTER TABLE public.coach_query_gaps ALTER COLUMN user_id SET NOT NULL;
CREATE POLICY "Authenticated users can log their own coach gaps"
  ON public.coach_query_gaps
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);