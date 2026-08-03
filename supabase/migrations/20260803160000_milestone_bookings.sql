-- Move the 2-week milestone booking out of localStorage and into the database.
--
-- MilestoneCheckInModal wrote 'cm_last_milestone_at' to localStorage and
-- nowhere else, and useBiweeklyMilestone read it back from there. Two problems:
--
--   1. It is per-browser. A mom who books on her phone and then opens the app
--      on her laptop is told she still needs to book. Clearing site data has
--      the same effect. There was no server record that a booking ever
--      happened.
--
--   2. Nothing server-side can see it, so no reminder can ever be sent about
--      it — the job would have no way to tell who is due and who has already
--      booked.

CREATE TABLE IF NOT EXISTS public.milestone_bookings (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booked_at    timestamptz NOT NULL DEFAULT now(),
  stage        text,
  event_uri    text,
  invitee_uri  text,
  start_time   timestamptz,
  join_url     text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- "When did she last book" is the only question asked of this table, on every
-- hourly sweep and on every page load of Progress.
CREATE INDEX IF NOT EXISTS milestone_bookings_user_booked_idx
  ON public.milestone_bookings (user_id, booked_at DESC);

-- Calendly can fire its confirmation more than once for a single booking.
-- Without this, a double-fire looks like two bookings and silently resets her
-- 14-day cycle twice.
CREATE UNIQUE INDEX IF NOT EXISTS milestone_bookings_event_uri_unique
  ON public.milestone_bookings (event_uri) WHERE event_uri IS NOT NULL;

ALTER TABLE public.milestone_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own milestone bookings"   ON public.milestone_bookings;
DROP POLICY IF EXISTS "Users insert own milestone bookings" ON public.milestone_bookings;

CREATE POLICY "Users view own milestone bookings"
  ON public.milestone_bookings FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own milestone bookings"
  ON public.milestone_bookings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Deliberately no UPDATE or DELETE policy. A booking is a historical fact;
-- nothing in the app has a reason to rewrite one, and the reminder logic
-- trusts it as an anchor.
