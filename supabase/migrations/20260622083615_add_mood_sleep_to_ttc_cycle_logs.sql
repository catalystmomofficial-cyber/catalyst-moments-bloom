-- Add dedicated mood + sleep tracking to the per-day TTC cycle log.
-- Safe to run multiple times.
ALTER TABLE public.ttc_cycle_logs
  ADD COLUMN IF NOT EXISTS mood        text,
  ADD COLUMN IF NOT EXISTS sleep_hours numeric;
