CREATE OR REPLACE FUNCTION public.admin_update_blog(blog_id uuid, blog_title text, blog_content text, blog_slug text, blog_status text, blog_author text, blog_excerpt text, blog_featured_image_url text, blog_tags text[])
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  current_status text;
  current_published_at timestamptz;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  SELECT status, published_at INTO current_status, current_published_at
  FROM public.blogs WHERE id = blog_id;

  UPDATE public.blogs
  SET
    title = blog_title,
    content = blog_content,
    slug = blog_slug,
    status = blog_status,
    author = blog_author,
    excerpt = blog_excerpt,
    featured_image_url = blog_featured_image_url,
    tags = blog_tags,
    updated_at = now(),
    published_at = CASE
      -- Transitioning into published: stamp with current time
      WHEN blog_status = 'published' AND COALESCE(current_status, '') <> 'published' THEN now()
      -- Already published: keep original publish date
      WHEN blog_status = 'published' THEN current_published_at
      -- Not published: clear the date so it re-stamps on next publish
      ELSE NULL
    END
  WHERE id = blog_id;
END;
$function$;