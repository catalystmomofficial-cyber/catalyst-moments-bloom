-- Run this manually in the Supabase SQL editor to set up push notification cron jobs.
-- Requires pg_cron and pg_net extensions to be enabled.

-- Daily Workout — every day at 8:00 AM UTC
select cron.schedule(
  'push-daily-workout',
  '0 8 * * *',
  $$
  select net.http_post(
    url := 'https://moxxceccaftkeuaowctw.supabase.co/functions/v1/send-lifecycle-notifications',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1veHhjZWNjYWZ0a2V1YW93Y3R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NTEyOTYsImV4cCI6MjA2MjQyNzI5Nn0.zInlBzKCVwrhKBW-nAc5b7BoxrXmlYF25cuqfippu3U'
    ),
    body := jsonb_build_object('type', 'daily_workout')
  );
  $$
);

-- Meal Reminder — 11:30 AM and 6:00 PM UTC
select cron.schedule(
  'push-meal-reminder-lunch',
  '30 11 * * *',
  $$
  select net.http_post(
    url := 'https://moxxceccaftkeuaowctw.supabase.co/functions/v1/send-lifecycle-notifications',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1veHhjZWNjYWZ0a2V1YW93Y3R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NTEyOTYsImV4cCI6MjA2MjQyNzI5Nn0.zInlBzKCVwrhKBW-nAc5b7BoxrXmlYF25cuqfippu3U'
    ),
    body := jsonb_build_object('type', 'meal_reminder')
  );
  $$
);

select cron.schedule(
  'push-meal-reminder-dinner',
  '0 18 * * *',
  $$
  select net.http_post(
    url := 'https://moxxceccaftkeuaowctw.supabase.co/functions/v1/send-lifecycle-notifications',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1veHhjZWNjYWZ0a2V1YW93Y3R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NTEyOTYsImV4cCI6MjA2MjQyNzI5Nn0.zInlBzKCVwrhKBW-nAc5b7BoxrXmlYF25cuqfippu3U'
    ),
    body := jsonb_build_object('type', 'meal_reminder')
  );
  $$
);

-- Inactivity nudge — daily at 5:00 PM UTC, targets users inactive 48h+
select cron.schedule(
  'push-inactivity-nudge',
  '0 17 * * *',
  $$
  select net.http_post(
    url := 'https://moxxceccaftkeuaowctw.supabase.co/functions/v1/send-lifecycle-notifications',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1veHhjZWNjYWZ0a2V1YW93Y3R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NTEyOTYsImV4cCI6MjA2MjQyNzI5Nn0.zInlBzKCVwrhKBW-nAc5b7BoxrXmlYF25cuqfippu3U'
    ),
    body := jsonb_build_object('type', 'inactivity')
  );
  $$
);

-- To remove a job: select cron.unschedule('push-daily-workout');
