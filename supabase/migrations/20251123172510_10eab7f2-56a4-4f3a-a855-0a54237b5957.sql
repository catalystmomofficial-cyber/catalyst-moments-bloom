-- Create reminder logs table to track sent reminders
CREATE TABLE IF NOT EXISTS public.reminder_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  reminder_id UUID REFERENCES public.custom_reminders(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL, -- 'custom' or 'daily_practice'
  title TEXT NOT NULL,
  message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'sent', -- 'sent', 'failed', 'pending'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for reminder_logs
ALTER TABLE public.reminder_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reminder logs"
  ON public.reminder_logs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert reminder logs"
  ON public.reminder_logs
  FOR INSERT
  WITH CHECK (true);

-- Add frequency field to custom_reminders
ALTER TABLE public.custom_reminders
  ADD COLUMN IF NOT EXISTS frequency TEXT NOT NULL DEFAULT 'weekly',
  ADD COLUMN IF NOT EXISTS monthly_day INTEGER;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_reminder_logs_user_id ON public.reminder_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_sent_at ON public.reminder_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_custom_reminders_frequency ON public.custom_reminders(frequency);