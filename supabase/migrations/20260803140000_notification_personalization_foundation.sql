-- Foundation for timezone-aware, personalized notifications.
--
-- Three gaps this closes:
--
--   1. NO TIMEZONE ANYWHERE. Every reminder fired at a fixed UTC hour, so the
--      "daily workout" nudge scheduled at 08:00 UTC reached US Eastern users
--      at 4am and Sydney users at 7pm. With users across US, Canada, UK,
--      Australia and Asia there is no single hour that is correct.
--
--   2. notification_preferences.reminder_time already existed (default 09:00)
--      and NOTHING read it. Users could set a preferred time that was silently
--      ignored.
--
--   3. The inactivity job used profiles.updated_at as an "last seen" proxy.
--      That column changes on any profile write, so editing a display name
--      counted as activity while genuinely using the app did not. It needs a
--      column that means only one thing.

-- ── 1. Where the user actually is ───────────────────────────────────────────
-- IANA name, e.g. 'America/New_York', 'Australia/Sydney', 'Europe/London'.
-- Captured silently from the browser on login (Intl.DateTimeFormat), never
-- asked for. NULL means we have not seen this user since the change ships;
-- senders treat NULL as America/New_York because the US is the largest cohort.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS timezone TEXT;

COMMENT ON COLUMN public.profiles.timezone IS
  'IANA timezone captured from the browser. NULL = unknown, senders fall back to America/New_York.';

-- ── 2. A last-seen column that means last-seen ──────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;

COMMENT ON COLUMN public.profiles.last_active_at IS
  'Last time the user opened the app. Distinct from updated_at, which changes on any profile write.';

-- Seed it from updated_at so nobody is treated as inactive the moment this
-- ships and gets an unwanted "we miss you" push on day one.
UPDATE public.profiles
   SET last_active_at = COALESCE(last_active_at, updated_at, created_at)
 WHERE last_active_at IS NULL;

-- The inactivity sweep filters on this every hour.
CREATE INDEX IF NOT EXISTS profiles_last_active_at_idx
  ON public.profiles (last_active_at);

-- Hourly sends resolve "whose local time is it right now" against this.
CREATE INDEX IF NOT EXISTS profiles_timezone_idx
  ON public.profiles (timezone) WHERE timezone IS NOT NULL;

-- ── 3. Let users say when, not just whether ─────────────────────────────────
-- reminder_time already exists. These add the two controls that stop a
-- personalization engine from becoming a nuisance.
ALTER TABLE public.notification_preferences
  ADD COLUMN IF NOT EXISTS quiet_hours_start TIME,
  ADD COLUMN IF NOT EXISTS quiet_hours_end   TIME,
  ADD COLUMN IF NOT EXISTS event_reminders_enabled BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS max_pushes_per_day SMALLINT NOT NULL DEFAULT 2;

COMMENT ON COLUMN public.notification_preferences.max_pushes_per_day IS
  'Hard cap enforced by the sender. Prevents stacked triggers from burying a user and driving an uninstall.';

-- ── 4. Delivery ledger ──────────────────────────────────────────────────────
-- Without this there is no way to enforce a daily cap, no way to stop the
-- same nudge repeating hourly once a user matches its condition, and no way
-- to tell whether any of this works.
CREATE TABLE IF NOT EXISTS public.push_delivery_log (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type text     NOT NULL,
  dedupe_key     text        NOT NULL,
  title          text,
  body           text,
  sent_at        timestamptz NOT NULL DEFAULT now(),
  delivered      boolean     NOT NULL DEFAULT true,
  error          text
);

-- The dedupe contract: one send per user per type per key, forever.
-- Callers build the key to encode the window they mean, e.g.
--   daily_workout   -> '2026-08-03'          (once that local day)
--   event_reminder  -> '<event_id>:24h'      (once per event per lead time)
--   inactivity      -> '2026-W31'            (once that week, not every hour)
CREATE UNIQUE INDEX IF NOT EXISTS push_delivery_log_dedupe_idx
  ON public.push_delivery_log (user_id, notification_type, dedupe_key);

-- Supports the per-day cap lookup.
CREATE INDEX IF NOT EXISTS push_delivery_log_user_sent_idx
  ON public.push_delivery_log (user_id, sent_at DESC);

ALTER TABLE public.push_delivery_log ENABLE ROW LEVEL SECURITY;

-- Users may read their own notification history (so the app can show it).
-- Only the service role writes, so there is no INSERT/UPDATE policy at all —
-- edge functions bypass RLS with the service key.
DROP POLICY IF EXISTS "Users view own push history" ON public.push_delivery_log;
CREATE POLICY "Users view own push history"
  ON public.push_delivery_log FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
