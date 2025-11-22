-- Create table for birth ball practice email reminders
CREATE TABLE IF NOT EXISTS public.birth_ball_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  reminder_time TIME NOT NULL DEFAULT '09:00:00',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.birth_ball_reminders ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own reminders
CREATE POLICY "Users can view their own reminders"
  ON public.birth_ball_reminders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own reminders
CREATE POLICY "Users can create their own reminders"
  ON public.birth_ball_reminders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own reminders
CREATE POLICY "Users can update their own reminders"
  ON public.birth_ball_reminders
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to delete their own reminders
CREATE POLICY "Users can delete their own reminders"
  ON public.birth_ball_reminders
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_birth_ball_reminders_updated_at
  BEFORE UPDATE ON public.birth_ball_reminders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();