-- ============================================================
-- Replace 4 demo events with 8 real events.
-- event_date is computed relative to the migration run date so
-- events are always upcoming.  day offsets are chosen so each
-- weekday maps to the next occurrence from a Sunday baseline.
-- ============================================================

DELETE FROM public.events;

INSERT INTO public.events
  (title, description, event_date, time_display, location_type,
   specialist_name, specialist_title, category, stage_filter,
   max_capacity, current_attendees, is_featured,
   price_non_member, price_member, points_cost, is_free_for_members, status)
VALUES

  -- 1. Pelvic Floor Truth — all stages — Wednesday 7 PM (+3 days)
  (
    'Pelvic Floor Truth — What Every Mom Must Know',
    'Whether you''re TTC, pregnant, or postpartum — your pelvic floor affects everything. Women''s health physio Dr. Amara Osei answers the questions your doctor never has time for.',
    (CURRENT_DATE + interval '3 days' + interval '19 hours')::timestamptz,
    '7:00 PM', 'virtual', 'Dr. Amara Osei', 'Women''s Health Physiotherapist',
    'masterclass', 'all', 50, 0, true,
    2700, 1400, 1400, false, 'upcoming'
  ),

  -- 2. Sleep Reset — all stages — Thursday 8 PM (+4 days) — free
  (
    'Sleep Reset for Moms — Reclaim Your Rest',
    'Sleep deprivation is not a badge of honour. Sleep specialist Dr. Nina Patel breaks down why moms can''t sleep and gives you a real protocol to fix it — whatever stage you''re in.',
    (CURRENT_DATE + interval '4 days' + interval '20 hours')::timestamptz,
    '8:00 PM', 'virtual', 'Dr. Nina Patel', 'Sleep Medicine Specialist',
    'qa', 'all', 100, 0, false,
    0, 0, 0, true, 'upcoming'
  ),

  -- 3. Core Reconnection — postpartum — Saturday 10 AM (+6 days)
  (
    'Core Reconnection Workshop — Live with a Physio',
    'Diastasis recti, leaking, back pain — these are not permanent. Follow along live as women''s health physio Coach Sarah walks you through the exact protocol to reconnect and heal your core.',
    (CURRENT_DATE + interval '6 days' + interval '10 hours')::timestamptz,
    '10:00 AM', 'virtual', 'Coach Sarah Mitchell', 'Women''s Health Physio',
    'fitness', 'postpartum', 30, 0, false,
    4700, 2700, 2700, false, 'upcoming'
  ),

  -- 4. Fertility & Your Cycle — ttc — Tuesday 6 PM (+9 days)
  (
    'Fertility & Your Cycle — Ask an OBGYN',
    'Understanding your cycle is the most underrated fertility tool you have. OBGYN Dr. Fatima Hassan answers your specific questions about ovulation, timing, cycle health, and when to seek help.',
    (CURRENT_DATE + interval '9 days' + interval '18 hours')::timestamptz,
    '6:00 PM', 'virtual', 'Dr. Fatima Hassan', 'OBGYN & Fertility Specialist',
    'qa', 'ttc', 40, 0, false,
    3700, 1900, 1900, false, 'upcoming'
  ),

  -- 5. Birth Ready Workshop — pregnant — Sunday 11 AM (+7 days)
  (
    'Birth Ready Workshop — Movement, Breathing & Positioning',
    'Your body already knows how to birth. This hands-on workshop with certified midwife Kezia Addo teaches you the movement, breathing, and positioning techniques that actually prepare you for labour.',
    (CURRENT_DATE + interval '7 days' + interval '11 hours')::timestamptz,
    '11:00 AM', 'virtual', 'Kezia Addo', 'Certified Midwife & Birth Educator',
    'workshop', 'pregnant', 35, 0, false,
    4700, 2700, 2700, false, 'upcoming'
  ),

  -- 6. Stress & Cortisol — all stages — Monday 7:30 PM (+8 days)
  (
    'Stress, Cortisol & Why You''re Not Recovering',
    'High cortisol blocks fertility, disrupts pregnancy, and stalls postpartum healing. Functional medicine doctor Dr. Priya Sharma explains the hormonal connection and gives you a simple daily reset protocol.',
    (CURRENT_DATE + interval '8 days' + interval '19 hours' + interval '30 minutes')::timestamptz,
    '7:30 PM', 'virtual', 'Dr. Priya Sharma', 'Functional Medicine Doctor',
    'masterclass', 'all', 50, 0, false,
    2700, 1400, 1400, false, 'upcoming'
  ),

  -- 7. The Mental Load — all stages — Wednesday 8 PM (+10 days)
  (
    'The Mental Load — Ask a Perinatal Therapist',
    'Overwhelm, resentment, invisible labour, burnout — this is real and it has a name. Perinatal therapist Dr. Lena Brooks holds a safe, honest space for the emotional side of motherhood nobody talks about.',
    (CURRENT_DATE + interval '10 days' + interval '20 hours')::timestamptz,
    '8:00 PM', 'virtual', 'Dr. Lena Brooks', 'Perinatal Therapist',
    'qa', 'all', 40, 0, false,
    3700, 1900, 1900, false, 'upcoming'
  ),

  -- 8. Nutrition for Conception — ttc — Saturday 12 PM (+13 days)
  (
    'Nutrition for Conception — What to Eat, What to Stop',
    'What you eat in the 90 days before conception matters more than most women know. Fertility nutritionist Amy Chen gives you the exact protocol — foods, supplements, what to cut — backed by current research.',
    (CURRENT_DATE + interval '13 days' + interval '12 hours')::timestamptz,
    '12:00 PM', 'virtual', 'Amy Chen', 'Fertility Nutritionist',
    'workshop', 'ttc', 40, 0, false,
    3700, 1900, 1900, false, 'upcoming'
  );
