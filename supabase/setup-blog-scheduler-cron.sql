-- Schedule a cron job to publish scheduled blogs every hour
-- Run this SQL in Supabase SQL Editor to enable automatic publishing

SELECT cron.schedule(
  'publish-scheduled-blogs-hourly',
  '0 * * * *', -- Every hour at minute 0
  $$
  SELECT
    net.http_post(
        url:='https://moxxceccaftkeuaowctw.supabase.co/functions/v1/publish-scheduled-blogs',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1veHhjZWNjYWZ0a2V1YW93Y3R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NTEyOTYsImV4cCI6MjA2MjQyNzI5Nn0.zInlBzKCVwrhKBW-nAc5b7BoxrXmlYF25cuqfippu3U"}'::jsonb
    ) as request_id;
  $$
);

-- To check if the cron job is scheduled, run:
-- SELECT * FROM cron.job;

-- To remove the cron job if needed, run:
-- SELECT cron.unschedule('publish-scheduled-blogs-hourly');
