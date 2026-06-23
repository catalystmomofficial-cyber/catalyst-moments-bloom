-- Function for admins to verify the blog-publishing cron job is actually registered and running
CREATE OR REPLACE FUNCTION public.check_blog_scheduler_status()
RETURNS TABLE(
  job_exists boolean,
  schedule text,
  active boolean,
  last_run_at timestamp with time zone,
  last_run_status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Only allow admins to access this function
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT
    true AS job_exists,
    j.schedule,
    j.active,
    r.start_time AS last_run_at,
    r.status AS last_run_status
  FROM cron.job j
  LEFT JOIN LATERAL (
    SELECT start_time, status
    FROM cron.job_run_details
    WHERE jobid = j.jobid
    ORDER BY start_time DESC
    LIMIT 1
  ) r ON true
  WHERE j.jobname = 'publish-scheduled-blogs-hourly';

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::text, NULL::boolean, NULL::timestamp with time zone, NULL::text;
  END IF;
END;
$function$;
