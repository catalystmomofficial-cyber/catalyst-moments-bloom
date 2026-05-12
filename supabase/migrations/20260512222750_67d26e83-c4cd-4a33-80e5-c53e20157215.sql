-- TTC cycle settings (baseline, one row per user)
CREATE TABLE IF NOT EXISTS public.ttc_cycle_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  last_period_start DATE,
  average_cycle_length INTEGER NOT NULL DEFAULT 28,
  average_period_length INTEGER NOT NULL DEFAULT 5,
  ttc_start_date DATE,
  months_trying INTEGER NOT NULL DEFAULT 0,
  known_conditions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ttc_cycle_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own cycle settings" ON public.ttc_cycle_settings
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER ttc_cycle_settings_updated_at BEFORE UPDATE ON public.ttc_cycle_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- TTC cycle logs (per-day cycle data)
CREATE TABLE IF NOT EXISTS public.ttc_cycle_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  cycle_day INTEGER,
  period_status TEXT,
  flow_intensity TEXT,
  basal_body_temp DECIMAL(4,2),
  cervical_mucus TEXT,
  ovulation_test TEXT,
  symptoms TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ttc_cycle_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own cycle logs" ON public.ttc_cycle_logs
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_ttc_cycle_logs_user_date ON public.ttc_cycle_logs(user_id, log_date DESC);

-- TTC daily check-ins (one per day per user)
CREATE TABLE IF NOT EXISTS public.ttc_daily_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checkin_date DATE NOT NULL,
  cycle_day INTEGER,
  energy_score INTEGER CHECK (energy_score BETWEEN 1 AND 10),
  mood TEXT,
  skin_status TEXT,
  symptoms_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, checkin_date)
);
ALTER TABLE public.ttc_daily_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own daily checkins" ON public.ttc_daily_checkins
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_ttc_daily_checkins_user_date ON public.ttc_daily_checkins(user_id, checkin_date DESC);

-- TTC bloodwork
CREATE TABLE IF NOT EXISTS public.ttc_bloodwork (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_date DATE NOT NULL,
  cycle_day INTEGER,
  fsh DECIMAL(8,3),
  lh DECIMAL(8,3),
  estradiol DECIMAL(8,3),
  progesterone DECIMAL(8,3),
  amh DECIMAL(8,3),
  prolactin DECIMAL(8,3),
  testosterone DECIMAL(8,3),
  tsh DECIMAL(8,3),
  t3 DECIMAL(8,3),
  t4 DECIMAL(8,3),
  vitamin_d DECIMAL(8,3),
  ferritin DECIMAL(8,3),
  b12 DECIMAL(8,3),
  cortisol DECIMAL(8,3),
  insulin DECIMAL(8,3),
  notes TEXT,
  lab_source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ttc_bloodwork ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own bloodwork" ON public.ttc_bloodwork
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_ttc_bloodwork_user_date ON public.ttc_bloodwork(user_id, test_date DESC);

-- TTC AI pattern reports & doctor prep
CREATE TABLE IF NOT EXISTS public.ttc_pattern_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  data_days_analyzed INTEGER,
  report_json JSONB,
  doctor_prep_text TEXT,
  suggested_questions TEXT[] DEFAULT '{}',
  flags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ttc_pattern_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own pattern reports" ON public.ttc_pattern_reports
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_ttc_pattern_reports_user ON public.ttc_pattern_reports(user_id, generated_at DESC);