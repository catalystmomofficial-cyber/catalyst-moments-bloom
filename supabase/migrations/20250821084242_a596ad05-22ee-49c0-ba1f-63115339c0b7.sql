-- Fix search path security issues for functions
CREATE OR REPLACE FUNCTION public.add_user_points(
  p_user_id UUID,
  p_points INTEGER,
  p_source TEXT,
  p_description TEXT DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
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

-- Fix search path for redeem points function
CREATE OR REPLACE FUNCTION public.redeem_points_for_discount(
  p_user_id UUID,
  p_points_to_redeem INTEGER,
  p_description TEXT DEFAULT 'Course discount'
) RETURNS TABLE(success BOOLEAN, discount_percentage INTEGER, remaining_points INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
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