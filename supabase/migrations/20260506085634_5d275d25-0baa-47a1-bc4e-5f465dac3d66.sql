
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, motherhood_stage, approved)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    NEW.raw_user_meta_data->>'motherhood_stage',
    false
  );

  INSERT INTO public.user_points (user_id, total_points, level)
  VALUES (NEW.id, 500, 1)
  ON CONFLICT (user_id) DO UPDATE SET total_points = GREATEST(public.user_points.total_points, 500);

  INSERT INTO public.points_transactions (user_id, points, transaction_type, source, description)
  VALUES (NEW.id, 500, 'earned', 'welcome_bonus', 'Welcome to Catalyst Mom! Here are 500 points to get you started.');

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.approve_user(user_id_param uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  UPDATE public.profiles
  SET approved = true, updated_at = now()
  WHERE user_id = user_id_param;
END;
$function$;
