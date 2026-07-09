-- Wire up the existing wellness_entries table for the app's daily tracking.
-- Run this in the Supabase SQL Editor.
--
-- The table (and its RLS policies) already exist from migration
-- 20250710032537. This migration only:
--   1. Widens mood/energy/stress from a 1-5 scale to the app's 1-10 sliders.
--   2. Adds a UNIQUE (user_id, entry_date) constraint so the app can upsert
--      one row per day (log mood, then sleep, then water into the same row).
--   3. Adds a DELETE policy so users can clear their own entries.
--
-- Safe to run more than once (guards with IF EXISTS / IF NOT EXISTS).

-- 1. Widen the 1-5 checks to 1-10 (app sliders use /10).
alter table public.wellness_entries drop constraint if exists wellness_entries_mood_rating_check;
alter table public.wellness_entries drop constraint if exists wellness_entries_energy_level_check;
alter table public.wellness_entries drop constraint if exists wellness_entries_stress_level_check;

alter table public.wellness_entries
  add constraint wellness_entries_mood_rating_check
  check (mood_rating is null or (mood_rating between 1 and 10));
alter table public.wellness_entries
  add constraint wellness_entries_energy_level_check
  check (energy_level is null or (energy_level between 1 and 10));
alter table public.wellness_entries
  add constraint wellness_entries_stress_level_check
  check (stress_level is null or (stress_level between 1 and 10));

-- 2. One row per user per day (required for the app's daily upsert).
alter table public.wellness_entries
  drop constraint if exists wellness_entries_user_date_unique;
alter table public.wellness_entries
  add constraint wellness_entries_user_date_unique unique (user_id, entry_date);

-- 3. Let users delete their own entries (SELECT/INSERT/UPDATE already exist).
drop policy if exists "Users can delete their own wellness entries" on public.wellness_entries;
create policy "Users can delete their own wellness entries"
  on public.wellness_entries
  for delete
  using (auth.uid() = user_id);

-- Verify:
-- select conname from pg_constraint where conrelid = 'public.wellness_entries'::regclass;
