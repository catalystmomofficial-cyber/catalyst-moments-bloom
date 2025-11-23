-- Schedule daily practice reminders to run every hour
-- This checks for users who should receive reminders at this time
select cron.schedule(
  'daily-practice-reminders',
  '0 * * * *', -- Every hour at minute 0
  $$
  select
    net.http_post(
      url:='https://moxxceccaftkeuaowctw.supabase.co/functions/v1/daily-practice-reminders',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1veHhjZWNjYWZ0a2V1YW93Y3R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NTEyOTYsImV4cCI6MjA2MjQyNzI5Nn0.zInlBzKCVwrhKBW-nAc5b7BoxrXmlYF25cuqfippu3U"}'::jsonb,
      body:='{}'::jsonb
    ) as request_id;
  $$
);
