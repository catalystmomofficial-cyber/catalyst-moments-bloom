-- Update all blog posts with inconsistent/legacy author values to "Catalyst Mom Team"
UPDATE public.blogs
SET author = 'Catalyst Mom Team'
WHERE author = 'catalystmomofficial@gmail.com'
   OR author = 'catalyst Mom';

-- Verify the fix
SELECT DISTINCT author FROM public.blogs ORDER BY author;