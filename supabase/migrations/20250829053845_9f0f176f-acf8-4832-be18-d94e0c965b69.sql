-- Create function to approve all pending affiliate applications
CREATE OR REPLACE FUNCTION public.approve_all_pending_affiliates()
RETURNS TABLE(updated_count integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  update_count INTEGER;
BEGIN
  -- Only allow admins to access this function
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Update all pending applications to approved
  UPDATE public.affiliate_applications
  SET 
    status = 'approved',
    updated_at = now()
  WHERE status = 'pending';
  
  GET DIAGNOSTICS update_count = ROW_COUNT;
  
  -- Log the admin action
  PERFORM public.log_admin_action(
    'bulk_approve_affiliates',
    NULL,
    CONCAT('Approved ', update_count, ' pending affiliate applications')
  );
  
  RETURN QUERY SELECT update_count;
END;
$function$;