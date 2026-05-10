-- ============================================================
-- Events section: create events table, extend event_registrations,
-- add register_for_event RPC, seed the 4 existing events.
-- ============================================================

-- 1. events table
CREATE TABLE IF NOT EXISTS public.events (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title                text        NOT NULL,
  description          text,
  event_date           timestamptz,
  time_display         text,
  location_type        text        DEFAULT 'virtual',
  specialist_name      text,
  specialist_title     text,
  category             text,
  stage_filter         text        DEFAULT 'all',
  max_capacity         integer     DEFAULT 50,
  current_attendees    integer     DEFAULT 0,
  is_featured          boolean     DEFAULT false,
  price_non_member     integer     DEFAULT 0,
  price_member         integer     DEFAULT 0,
  points_cost          integer     DEFAULT 0,
  is_free_for_members  boolean     DEFAULT false,
  replay_available     boolean     DEFAULT false,
  replay_expires_hours integer     DEFAULT 48,
  status               text        DEFAULT 'upcoming',
  created_at           timestamptz DEFAULT now()
);

-- RLS: anyone can read, writes go through service role / RPC
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'events_public_read'
  ) THEN
    CREATE POLICY events_public_read ON public.events FOR SELECT USING (true);
  END IF;
END$$;

-- 2. Extend event_registrations with payment/points columns
--    (table already exists — keep all existing columns intact)
ALTER TABLE public.event_registrations
  ALTER COLUMN first_name  DROP NOT NULL,
  ALTER COLUMN last_name   DROP NOT NULL,
  ALTER COLUMN email       DROP NOT NULL,
  ALTER COLUMN event_title DROP NOT NULL;

ALTER TABLE public.event_registrations
  ADD COLUMN IF NOT EXISTS payment_method  text        DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS points_used     integer     DEFAULT 0,
  ADD COLUMN IF NOT EXISTS amount_paid     integer     DEFAULT 0,
  ADD COLUMN IF NOT EXISTS attended        boolean     DEFAULT false,
  ADD COLUMN IF NOT EXISTS registered_at  timestamptz DEFAULT now();

-- 3. Atomic registration RPC
--    Checks capacity, prevents double-registration, increments attendees.
CREATE OR REPLACE FUNCTION public.register_for_event(
  p_event_id      uuid,
  p_user_id       uuid,
  p_payment_method text    DEFAULT 'free',
  p_points_used   integer DEFAULT 0,
  p_amount_paid   integer DEFAULT 0
) RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_event  record;
  v_reg_id uuid;
BEGIN
  -- Lock the row so concurrent calls don't oversell
  SELECT * INTO v_event FROM public.events WHERE id = p_event_id FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Event not found');
  END IF;

  -- Capacity check
  IF v_event.max_capacity IS NOT NULL
     AND v_event.current_attendees >= v_event.max_capacity THEN
    RETURN json_build_object('success', false, 'error', 'Event is at capacity');
  END IF;

  -- Duplicate registration check
  IF EXISTS (
    SELECT 1 FROM public.event_registrations
    WHERE event_id = p_event_id::text AND user_id = p_user_id
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Already registered for this event');
  END IF;

  -- Insert registration (event_id stored as text to match existing column type)
  INSERT INTO public.event_registrations
    (event_id, user_id, event_title, payment_method, points_used, amount_paid, registered_at)
  VALUES
    (p_event_id::text, p_user_id, v_event.title,
     p_payment_method, p_points_used, p_amount_paid, now())
  RETURNING id INTO v_reg_id;

  -- Increment attendee count atomically
  UPDATE public.events
  SET current_attendees = current_attendees + 1
  WHERE id = p_event_id;

  RETURN json_build_object('success', true, 'registration_id', v_reg_id);
END;
$$;

-- 4. Seed the 4 existing events
--    Use INSERT ... WHERE NOT EXISTS so re-running is safe.
INSERT INTO public.events
  (title, description, event_date, time_display, location_type, specialist_name,
   category, stage_filter, max_capacity, current_attendees, is_featured,
   price_non_member, price_member, points_cost, is_free_for_members, status)
SELECT * FROM (VALUES
  (
    'Virtual Meditation Session',
    'Join us for a peaceful 30-minute guided meditation session designed specifically for busy moms. Learn breathing techniques to manage stress and find your center.',
    (now() + interval '1 day')::timestamptz, '8:00 PM', 'virtual', 'Dr. Sarah Chen',
    'meditation', 'all', 50, 18, true,
    0, 0, 0, true, 'upcoming'
  ),
  (
    'Q&A with Sleep Specialist',
    'Get expert answers to your sleep questions! Dr. Maria Rodriguez will address common sleep challenges for both moms and babies.',
    (now() + interval '3 days')::timestamptz, '1:00 PM', 'virtual', 'Dr. Maria Rodriguez',
    'qa', 'all', 100, 34, false,
    2700, 1400, 1400, false, 'upcoming'
  ),
  (
    'Postpartum Fitness Workshop',
    'Safe and effective exercises for new moms. Learn proper form and modifications for your postpartum fitness journey.',
    (now() + interval '4 days')::timestamptz, '10:00 AM', 'hybrid', 'Coach Jennifer Liu',
    'fitness', 'postpartum', 30, 22, false,
    4700, 2700, 2700, false, 'upcoming'
  ),
  (
    'TTC Nutrition Workshop',
    'Discover fertility-boosting nutrition strategies and meal planning tips to support your TTC journey.',
    (now() + interval '5 days')::timestamptz, '2:00 PM', 'virtual', 'Nutritionist Amy Parker',
    'workshop', 'ttc', 40, 15, false,
    4700, 2700, 2700, false, 'upcoming'
  )
) AS v(title, description, event_date, time_display, location_type, specialist_name,
       category, stage_filter, max_capacity, current_attendees, is_featured,
       price_non_member, price_member, points_cost, is_free_for_members, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.events WHERE public.events.title = v.title
);
