
CREATE TABLE public.event_registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  event_id text NOT NULL,
  event_title text NOT NULL,
  event_date text,
  event_time text,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  questions text,
  experience text,
  notification_pref text DEFAULT 'email',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register for an event"
  ON public.event_registrations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own registrations"
  ON public.event_registrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all registrations"
  ON public.event_registrations FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update registrations"
  ON public.event_registrations FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete registrations"
  ON public.event_registrations FOR DELETE
  USING (public.is_admin(auth.uid()));

CREATE INDEX idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX idx_event_registrations_created_at ON public.event_registrations(created_at DESC);
