-- Add scheduled publishing column to blogs table
ALTER TABLE blogs ADD COLUMN scheduled_publish_at timestamp with time zone;

-- Create blog_analytics table to track views and engagement
CREATE TABLE blog_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id uuid NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  user_id uuid,
  view_date timestamp with time zone NOT NULL DEFAULT now(),
  session_id text,
  time_spent_seconds integer,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_blog_analytics_blog_id ON blog_analytics(blog_id);
CREATE INDEX idx_blog_analytics_view_date ON blog_analytics(view_date);

-- Enable RLS on blog_analytics
ALTER TABLE blog_analytics ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert analytics (for tracking)
CREATE POLICY "Anyone can insert blog analytics"
ON blog_analytics FOR INSERT
TO public
WITH CHECK (true);

-- Only admins can view analytics
CREATE POLICY "Admins can view blog analytics"
ON blog_analytics FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- Create function to get blog analytics summary
CREATE OR REPLACE FUNCTION get_blog_analytics_summary(days_back integer DEFAULT 30)
RETURNS TABLE(
  blog_id uuid,
  blog_title text,
  total_views bigint,
  unique_visitors bigint,
  avg_time_spent numeric
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id as blog_id,
    b.title as blog_title,
    COUNT(ba.id) as total_views,
    COUNT(DISTINCT ba.user_id) as unique_visitors,
    ROUND(AVG(ba.time_spent_seconds)::numeric, 2) as avg_time_spent
  FROM blogs b
  LEFT JOIN blog_analytics ba ON b.id = ba.blog_id
    AND ba.view_date >= now() - (days_back || ' days')::interval
  WHERE b.status = 'published'
  GROUP BY b.id, b.title
  ORDER BY total_views DESC;
END;
$$;