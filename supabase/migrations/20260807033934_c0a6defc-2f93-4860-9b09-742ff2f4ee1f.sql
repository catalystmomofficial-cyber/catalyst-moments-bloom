CREATE TABLE public.kick_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE NOT NULL,
  kick_count INTEGER NOT NULL DEFAULT 0,
  duration_min INTEGER NOT NULL DEFAULT 0,
  week INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX kick_sessions_user_started_key
  ON public.kick_sessions (user_id, started_at);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.kick_sessions TO authenticated;
GRANT ALL ON public.kick_sessions TO service_role;

ALTER TABLE public.kick_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own kick sessions"
  ON public.kick_sessions FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.diastasis_measurements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recovery_id UUID REFERENCES public.recoveries(id) ON DELETE SET NULL,
  measured_on DATE NOT NULL DEFAULT CURRENT_DATE,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'fingers' CHECK (unit IN ('fingers','cm')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX diastasis_measurements_user_day_key
  ON public.diastasis_measurements (user_id, measured_on);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.diastasis_measurements TO authenticated;
GRANT ALL ON public.diastasis_measurements TO service_role;

ALTER TABLE public.diastasis_measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own diastasis measurements"
  ON public.diastasis_measurements FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_diastasis_measurements_updated_at
  BEFORE UPDATE ON public.diastasis_measurements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();