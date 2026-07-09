-- Create + configure the wellness_entries table for the app's daily tracking.
-- Run this in the Supabase SQL Editor.
--
-- NOTE: the original migration that was supposed to create this table
-- (20250710032537) was never applied to the live database, so this script
-- creates it from scratch with the app's 1-10 scales, a one-row-per-day key,
-- and per-user RLS. Safe to run more than once (idempotent).

create table if not exists public.wellness_entries (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null,
  entry_date date not null default current_date,
  mood_rating integer,
  sleep_hours numeric(3,1),
  energy_level integer,
  stress_level integer,
  hydration_glasses integer default 0,
  self_care_activities text[],
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Scales / ranges (mood, energy, stress use the app's 1-10 sliders)
alter table public.wellness_entries drop constraint if exists wellness_entries_mood_rating_check;
alter table public.wellness_entries drop constraint if exists wellness_entries_energy_level_check;
alter table public.wellness_entries drop constraint if exists wellness_entries_stress_level_check;
alter table public.wellness_entries drop constraint if exists wellness_entries_sleep_hours_check;
alter table public.wellness_entries
  add constraint wellness_entries_mood_rating_check check (mood_rating is null or mood_rating between 1 and 10);
alter table public.wellness_entries
  add constraint wellness_entries_energy_level_check check (energy_level is null or energy_level between 1 and 10);
alter table public.wellness_entries
  add constraint wellness_entries_stress_level_check check (stress_level is null or stress_level between 1 and 10);
alter table public.wellness_entries
  add constraint wellness_entries_sleep_hours_check check (sleep_hours is null or (sleep_hours >= 0 and sleep_hours <= 24));

-- One row per user per day (needed for the daily upsert)
alter table public.wellness_entries drop constraint if exists wellness_entries_user_date_unique;
alter table public.wellness_entries add constraint wellness_entries_user_date_unique unique (user_id, entry_date);

-- Row Level Security: each user only sees/edits their own rows
alter table public.wellness_entries enable row level security;

drop policy if exists "Users can view their own wellness entries" on public.wellness_entries;
create policy "Users can view their own wellness entries"
  on public.wellness_entries for select using (auth.uid() = user_id);

drop policy if exists "Users can insert their own wellness entries" on public.wellness_entries;
create policy "Users can insert their own wellness entries"
  on public.wellness_entries for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own wellness entries" on public.wellness_entries;
create policy "Users can update their own wellness entries"
  on public.wellness_entries for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own wellness entries" on public.wellness_entries;
create policy "Users can delete their own wellness entries"
  on public.wellness_entries for delete using (auth.uid() = user_id);

-- Verify:
-- select conname from pg_constraint where conrelid = 'public.wellness_entries'::regclass;
