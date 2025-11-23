-- Create custom reminders table
CREATE TABLE IF NOT EXISTS public.custom_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  reminder_time TIME NOT NULL DEFAULT '09:00:00',
  days_of_week INTEGER[] DEFAULT ARRAY[1,2,3,4,5,6,7], -- 1=Monday, 7=Sunday
  exercise_id TEXT,
  goal_type TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.custom_reminders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own custom reminders"
  ON public.custom_reminders
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX idx_custom_reminders_user_id ON public.custom_reminders(user_id);
CREATE INDEX idx_custom_reminders_active ON public.custom_reminders(is_active) WHERE is_active = true;

-- Add trigger for updated_at
CREATE TRIGGER update_custom_reminders_updated_at
  BEFORE UPDATE ON public.custom_reminders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();