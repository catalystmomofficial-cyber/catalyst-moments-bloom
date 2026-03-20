
-- Update handle_new_user to award 50 welcome credits on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, display_name, motherhood_stage, approved)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    NEW.raw_user_meta_data->>'motherhood_stage',
    false
  );

  -- Award 50 welcome credits
  INSERT INTO public.user_points (user_id, total_points, level)
  VALUES (NEW.id, 50, 1)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.points_transactions (user_id, points, transaction_type, source, description)
  VALUES (NEW.id, 50, 'earned', 'welcome_credits', 'Welcome to Catalyst Mom! Here are 50 free credits to try our Wellness Coach.');

  RETURN NEW;
END;
$function$;
