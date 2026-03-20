-- Run this in the Supabase SQL Editor to set up monthly subscriber credits
-- Awards 50 bonus credits to all active subscribers on the 1st of each month

select
cron.schedule(
  'monthly-subscriber-credits',
  '0 0 1 * *',
  $$
  select
    net.http_post(
        url:='https://moxxceccaftkeuaowctw.supabase.co/functions/v1/monthly-subscriber-credits',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1veHhjZWNjYWZ0a2V1YW93Y3R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NTEyOTYsImV4cCI6MjA2MjQyNzI5Nn0.zInlBzKCVwrhKBW-nAc5b7BoxrXmlYF25cuqfippu3U"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);
