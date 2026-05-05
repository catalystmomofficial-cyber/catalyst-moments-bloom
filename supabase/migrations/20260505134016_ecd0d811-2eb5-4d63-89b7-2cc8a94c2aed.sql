CREATE TABLE public.not_found_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_not_found_logs_path ON public.not_found_logs(path);
CREATE INDEX idx_not_found_logs_created_at ON public.not_found_logs(created_at DESC);

ALTER TABLE public.not_found_logs ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous) can log a 404
CREATE POLICY "Anyone can log 404s"
ON public.not_found_logs
FOR INSERT
WITH CHECK (true);

-- Only admins can view 404 logs
CREATE POLICY "Admins can view 404 logs"
ON public.not_found_logs
FOR SELECT
USING (public.is_admin(auth.uid()));

-- Only admins can update (mark resolved)
CREATE POLICY "Admins can update 404 logs"
ON public.not_found_logs
FOR UPDATE
USING (public.is_admin(auth.uid()));

-- Only admins can delete
CREATE POLICY "Admins can delete 404 logs"
ON public.not_found_logs
FOR DELETE
USING (public.is_admin(auth.uid()));