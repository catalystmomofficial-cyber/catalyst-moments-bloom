ALTER TABLE public.community_posts
ADD COLUMN IF NOT EXISTS is_anonymous boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.community_posts.is_anonymous IS
  'When true, the public feed hides the author name and avatar. The authenticated author id remains stored for ownership, moderation, and safety.';
