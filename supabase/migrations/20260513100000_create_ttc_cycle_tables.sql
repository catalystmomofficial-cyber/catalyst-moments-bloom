-- TTC cycle settings (one row per user)
CREATE TABLE IF NOT EXISTS public.ttc_cycle_settings (
  id          uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_period_start    date,
  average_cycle_length integer,
  period_length        integer,
  updated_at  timestamptz DEFAULT now(),
  UNIQUE (user_id)
);
ALTER TABLE public.ttc_cycle_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own cycle settings"
  ON public.ttc_cycle_settings FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- TTC cycle logs (one row per user per day)
CREATE TABLE IF NOT EXISTS public.ttc_cycle_logs (
  id        uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id   uuid    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date      date    NOT NULL,
  cycle_day integer,
  symptoms  text[]  DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, date)
);
ALTER TABLE public.ttc_cycle_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own cycle logs"
  ON public.ttc_cycle_logs FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
