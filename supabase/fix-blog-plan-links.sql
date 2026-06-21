-- Run this in the Supabase SQL Editor against the catalyst-moments-bloom project.
-- Strips links/mentions of /meal-plan and /workout-plan from already-published blog posts.
--
-- 1) Run the SELECT query first to preview which rows will change.
-- 2) Then run the UPDATE statement to apply the fix.

-- Preview affected rows
SELECT id, title, slug
FROM public.blogs
WHERE content ~* '(meal-plan|workout-plan)'
   OR excerpt ~* '(meal-plan|workout-plan)';

-- Apply the fix
UPDATE public.blogs
SET
  content = regexp_replace(
              regexp_replace(
                content,
                -- HTML anchor tags linking to /meal-plan or /workout-plan: unwrap to plain text
                '<a[^>]*href="[^"]*(meal-plan|workout-plan)[^"]*"[^>]*>(.*?)</a>',
                '\2',
                'gi'
              ),
              -- Markdown links: [text](/meal-plan) or (https://.../workout-plan) -> plain text
              '\[([^\]]*)\]\([^)]*(meal-plan|workout-plan)[^)]*\)',
              '\1',
              'gi'
            ),
  excerpt = regexp_replace(
              regexp_replace(
                excerpt,
                '<a[^>]*href="[^"]*(meal-plan|workout-plan)[^"]*"[^>]*>(.*?)</a>',
                '\2',
                'gi'
              ),
              '\[([^\]]*)\]\([^)]*(meal-plan|workout-plan)[^)]*\)',
              '\1',
              'gi'
            )
WHERE content ~* '(meal-plan|workout-plan)'
   OR excerpt ~* '(meal-plan|workout-plan)';
