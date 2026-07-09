-- Rename the postpartum "30 Days Glow Up Challenge" course to Phase 2 branding.
-- Run this in the Supabase SQL Editor.
--
-- Why: the app UI now labels this program "Phase 2: Strength & Stamina" (the
-- strength phase that follows Phase 1, Core Restore Foundations). The course
-- record in the database still carries the old title, so the course detail
-- page header would otherwise show the old name. All app lookups were changed
-- to key off the course id (not the title), so this rename is safe.
--
-- Keyed by id, so it only touches this one course.

update public.courses
set
  title = 'Phase 2: Strength & Stamina',
  description = 'The strength-building phase of your postpartum recovery. A structured 4-week program to safely rebuild strength and stamina after birth — best started once you have completed Phase 1 (Core Restore Foundations).'
where id = '266ae389-409f-4847-9a10-e29a2f3eb3f9';

-- Verify:
-- select id, title from public.courses where id = '266ae389-409f-4847-9a10-e29a2f3eb3f9';
