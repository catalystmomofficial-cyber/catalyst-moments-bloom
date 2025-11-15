-- Create monthly challenges table
CREATE TABLE IF NOT EXISTS public.monthly_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  motherhood_stage TEXT NOT NULL CHECK (motherhood_stage IN ('postpartum', 'pregnant', 'ttc', 'general')),
  challenge_type TEXT NOT NULL DEFAULT 'workout_count',
  target_count INTEGER NOT NULL DEFAULT 7,
  max_winners INTEGER NOT NULL DEFAULT 50,
  current_winners INTEGER NOT NULL DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  badge_icon TEXT DEFAULT 'crown',
  badge_color TEXT DEFAULT 'from-yellow-400 to-amber-600',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user challenge progress table
CREATE TABLE IF NOT EXISTS public.user_challenge_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  challenge_id UUID REFERENCES public.monthly_challenges(id) ON DELETE CASCADE,
  current_count INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  awarded BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Enable RLS
ALTER TABLE public.monthly_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for monthly_challenges
CREATE POLICY "Users can view active challenges for their stage"
  ON public.monthly_challenges
  FOR SELECT
  TO authenticated
  USING (
    is_active = true 
    AND (
      motherhood_stage = 'general' 
      OR motherhood_stage = (
        SELECT motherhood_stage 
        FROM public.profiles 
        WHERE user_id = auth.uid()
      )
    )
  );

-- RLS Policies for user_challenge_progress
CREATE POLICY "Users can view their own challenge progress"
  ON public.user_challenge_progress
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own challenge progress"
  ON public.user_challenge_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own challenge progress"
  ON public.user_challenge_progress
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Function to increment challenge progress
CREATE OR REPLACE FUNCTION public.increment_challenge_progress(
  p_user_id UUID,
  p_challenge_type TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_challenge_id UUID;
  v_target_count INTEGER;
  v_current_count INTEGER;
BEGIN
  -- Get active challenge for user's stage and type
  SELECT c.id, c.target_count INTO v_challenge_id, v_target_count
  FROM monthly_challenges c
  JOIN profiles p ON p.user_id = p_user_id
  WHERE c.is_active = true
    AND c.challenge_type = p_challenge_type
    AND c.start_date <= now()
    AND c.end_date >= now()
    AND (c.motherhood_stage = p.motherhood_stage OR c.motherhood_stage = 'general')
  LIMIT 1;

  IF v_challenge_id IS NOT NULL THEN
    -- Upsert progress
    INSERT INTO user_challenge_progress (user_id, challenge_id, current_count, updated_at)
    VALUES (p_user_id, v_challenge_id, 1, now())
    ON CONFLICT (user_id, challenge_id)
    DO UPDATE SET
      current_count = user_challenge_progress.current_count + 1,
      updated_at = now();

    -- Check if completed
    SELECT current_count INTO v_current_count
    FROM user_challenge_progress
    WHERE user_id = p_user_id AND challenge_id = v_challenge_id;

    IF v_current_count >= v_target_count THEN
      UPDATE user_challenge_progress
      SET completed = true, completed_at = now()
      WHERE user_id = p_user_id AND challenge_id = v_challenge_id AND completed = false;
    END IF;
  END IF;
END;
$$;

-- Function to award challenge badges (called by cron)
CREATE OR REPLACE FUNCTION public.award_challenge_badges()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_challenge RECORD;
  v_progress RECORD;
BEGIN
  -- Loop through all active challenges that have ended
  FOR v_challenge IN 
    SELECT * FROM monthly_challenges 
    WHERE is_active = true 
      AND end_date < now()
      AND current_winners < max_winners
  LOOP
    -- Award badges to completed users who haven't been awarded yet
    FOR v_progress IN
      SELECT user_id, completed_at
      FROM user_challenge_progress
      WHERE challenge_id = v_challenge.id
        AND completed = true
        AND awarded = false
      ORDER BY completed_at ASC
      LIMIT (v_challenge.max_winners - v_challenge.current_winners)
    LOOP
      -- Mark as awarded
      UPDATE user_challenge_progress
      SET awarded = true
      WHERE user_id = v_progress.user_id AND challenge_id = v_challenge.id;

      -- Award points
      PERFORM add_user_points(
        p_user_id := v_progress.user_id,
        p_points := 200,
        p_source := 'monthly_challenge',
        p_description := 'Completed ' || v_challenge.name
      );

      -- Increment winner count
      UPDATE monthly_challenges
      SET current_winners = current_winners + 1
      WHERE id = v_challenge.id;
    END LOOP;
  END LOOP;
END;
$$;

-- Insert November 2025 Catalyst Crown challenges
INSERT INTO public.monthly_challenges (
  name,
  description,
  motherhood_stage,
  challenge_type,
  target_count,
  max_winners,
  start_date,
  end_date,
  badge_icon,
  badge_color
) VALUES
  (
    'Catalyst Crown - November Edition',
    'Complete 7 workouts this week to earn your crown! Only 50 spots available.',
    'postpartum',
    'workout_count',
    7,
    50,
    '2025-11-01 00:00:00+00',
    '2025-11-07 23:59:59+00',
    'crown',
    'from-yellow-400 to-amber-600'
  ),
  (
    'Catalyst Crown - November Edition',
    'Complete 7 workouts this week to earn your crown! Only 50 spots available.',
    'pregnant',
    'workout_count',
    7,
    50,
    '2025-11-01 00:00:00+00',
    '2025-11-07 23:59:59+00',
    'crown',
    'from-yellow-400 to-amber-600'
  ),
  (
    'Catalyst Crown - November Edition',
    'Complete 7 workouts this week to earn your crown! Only 50 spots available.',
    'ttc',
    'workout_count',
    7,
    50,
    '2025-11-01 00:00:00+00',
    '2025-11-07 23:59:59+00',
    'crown',
    'from-yellow-400 to-amber-600'
  );