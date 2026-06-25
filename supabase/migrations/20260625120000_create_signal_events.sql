-- Intent signal banner tracking: one row per time a signal is shown to a user.
-- instance_key scopes "never show this exact instance again" (e.g. a specific
-- last_period_start or milestone cycle); signal_type alone is used for the
-- 72h per-type frequency cap.
CREATE TABLE IF NOT EXISTS public.signal_events (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  signal_type   text        NOT NULL,
  instance_key  text        NOT NULL,
  shown_at      timestamptz NOT NULL DEFAULT now(),
  dismissed_at  timestamptz,
  actioned_at   timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS signal_events_user_type_idx
  ON public.signal_events (user_id, signal_type, shown_at DESC);

ALTER TABLE public.signal_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own signal events"
  ON public.signal_events FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
