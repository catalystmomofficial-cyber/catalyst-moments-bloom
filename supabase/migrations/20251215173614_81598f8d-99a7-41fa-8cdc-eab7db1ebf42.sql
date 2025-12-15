-- Function to check and deduct user credits
CREATE OR REPLACE FUNCTION public.deduct_user_credits(
  p_user_id uuid,
  p_amount integer,
  p_source text,
  p_description text DEFAULT NULL
)
RETURNS TABLE(success boolean, remaining_points integer, error_message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_points INTEGER;
  new_total INTEGER;
BEGIN
  -- Get current points
  SELECT total_points INTO current_points
  FROM user_points
  WHERE user_id = p_user_id;
  
  -- If no record exists, create one with 0 points
  IF current_points IS NULL THEN
    INSERT INTO user_points (user_id, total_points, level)
    VALUES (p_user_id, 0, 1);
    current_points := 0;
  END IF;
  
  -- Check if user has sufficient credits
  IF current_points < p_amount THEN
    RETURN QUERY SELECT false, current_points, 'Insufficient credits'::text;
    RETURN;
  END IF;
  
  -- Deduct points
  new_total := current_points - p_amount;
  
  UPDATE user_points
  SET total_points = new_total, updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Record transaction
  INSERT INTO points_transactions (user_id, points, transaction_type, source, description)
  VALUES (p_user_id, -p_amount, 'spent', p_source, p_description);
  
  RETURN QUERY SELECT true, new_total, NULL::text;
END;
$$;

-- Function to add credits after purchase
CREATE OR REPLACE FUNCTION public.add_purchased_credits(
  p_user_id uuid,
  p_amount integer,
  p_source text,
  p_description text DEFAULT NULL
)
RETURNS TABLE(success boolean, new_total integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_points INTEGER;
  updated_total INTEGER;
BEGIN
  -- Insert or get current points
  INSERT INTO user_points (user_id, total_points, level)
  VALUES (p_user_id, 0, 1)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Get current points
  SELECT total_points INTO current_points
  FROM user_points
  WHERE user_id = p_user_id;
  
  -- Add credits
  updated_total := current_points + p_amount;
  
  UPDATE user_points
  SET total_points = updated_total, updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Record transaction
  INSERT INTO points_transactions (user_id, points, transaction_type, source, description)
  VALUES (p_user_id, p_amount, 'purchased', p_source, p_description);
  
  RETURN QUERY SELECT true, updated_total;
END;
$$;

-- Function to get user credit balance
CREATE OR REPLACE FUNCTION public.get_user_credits(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_points INTEGER;
BEGIN
  SELECT total_points INTO current_points
  FROM user_points
  WHERE user_id = p_user_id;
  
  RETURN COALESCE(current_points, 0);
END;
$$;