-- Create user points table
CREATE TABLE public.user_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_points INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create points transactions table to track how points are earned/spent
CREATE TABLE public.points_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL, -- positive for earning, negative for spending
  transaction_type TEXT NOT NULL, -- 'earned' or 'redeemed'
  source TEXT NOT NULL, -- 'workout_complete', 'community_post', 'like_post', 'comment_post', 'course_discount', etc.
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create push notification subscriptions table
CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh_key TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
  is_read BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- User points policies
CREATE POLICY "Users can view their own points" 
ON public.user_points 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own points" 
ON public.user_points 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own points" 
ON public.user_points 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Points transactions policies
CREATE POLICY "Users can view their own transactions" 
ON public.points_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert transactions" 
ON public.points_transactions 
FOR INSERT 
WITH CHECK (true);

-- Push subscriptions policies
CREATE POLICY "Users can manage their own subscriptions" 
ON public.push_subscriptions 
FOR ALL 
USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- Function to add points and update level
CREATE OR REPLACE FUNCTION public.add_user_points(
  p_user_id UUID,
  p_points INTEGER,
  p_source TEXT,
  p_description TEXT DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_points INTEGER;
  new_total INTEGER;
  new_level INTEGER;
BEGIN
  -- Insert into user_points if doesn't exist
  INSERT INTO public.user_points (user_id, total_points, level)
  VALUES (p_user_id, 0, 1)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Get current points
  SELECT total_points INTO current_points
  FROM public.user_points
  WHERE user_id = p_user_id;
  
  -- Calculate new total
  new_total := current_points + p_points;
  
  -- Calculate new level (every 100 points = 1 level)
  new_level := GREATEST(1, (new_total / 100) + 1);
  
  -- Update user points
  UPDATE public.user_points
  SET 
    total_points = new_total,
    level = new_level,
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Record transaction
  INSERT INTO public.points_transactions (user_id, points, transaction_type, source, description)
  VALUES (p_user_id, p_points, CASE WHEN p_points > 0 THEN 'earned' ELSE 'redeemed' END, p_source, p_description);
END;
$$;

-- Function to redeem points for discount
CREATE OR REPLACE FUNCTION public.redeem_points_for_discount(
  p_user_id UUID,
  p_points_to_redeem INTEGER,
  p_description TEXT DEFAULT 'Course discount'
) RETURNS TABLE(success BOOLEAN, discount_percentage INTEGER, remaining_points INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_points INTEGER;
  max_discount_percentage INTEGER := 30;
  discount_percentage INTEGER;
  points_needed INTEGER;
BEGIN
  -- Get current points
  SELECT total_points INTO current_points
  FROM public.user_points
  WHERE user_id = p_user_id;
  
  -- Calculate discount percentage (every 10 points = 1% discount, max 30%)
  discount_percentage := LEAST(max_discount_percentage, p_points_to_redeem / 10);
  points_needed := discount_percentage * 10;
  
  -- Check if user has enough points
  IF current_points < points_needed THEN
    RETURN QUERY SELECT false, 0, current_points;
    RETURN;
  END IF;
  
  -- Deduct points
  PERFORM public.add_user_points(p_user_id, -points_needed, 'course_discount', p_description);
  
  -- Return success and remaining points
  SELECT total_points INTO current_points
  FROM public.user_points
  WHERE user_id = p_user_id;
  
  RETURN QUERY SELECT true, discount_percentage, current_points;
END;
$$;

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_user_points_updated_at
  BEFORE UPDATE ON public.user_points
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_push_subscriptions_updated_at
  BEFORE UPDATE ON public.push_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();