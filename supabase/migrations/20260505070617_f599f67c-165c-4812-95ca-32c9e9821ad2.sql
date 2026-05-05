CREATE TABLE public.coach_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  stage TEXT NOT NULL,
  score INTEGER NOT NULL,
  priority_gap TEXT,
  urgency_level TEXT NOT NULL,
  time_of_day TEXT NOT NULL,
  user_state TEXT NOT NULL,
  coach_message TEXT NOT NULL,
  action_label TEXT NOT NULL,
  action_to TEXT NOT NULL,
  was_subscribed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.coach_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own coach messages"
  ON public.coach_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coach messages"
  ON public.coach_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own coach messages"
  ON public.coach_messages FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_coach_messages_user_created
  ON public.coach_messages(user_id, created_at DESC);