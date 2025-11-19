-- Create blog comments table
CREATE TABLE IF NOT EXISTS public.blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID NOT NULL REFERENCES public.blogs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  is_approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog comment likes table
CREATE TABLE IF NOT EXISTS public.blog_comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

-- Enable RLS
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comment_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_comments
CREATE POLICY "Anyone can view approved comments"
  ON public.blog_comments
  FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Authenticated users can create comments"
  ON public.blog_comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.blog_comments
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.blog_comments
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all comments"
  ON public.blog_comments
  FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update any comment"
  ON public.blog_comments
  FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete any comment"
  ON public.blog_comments
  FOR DELETE
  USING (is_admin(auth.uid()));

-- RLS Policies for blog_comment_likes
CREATE POLICY "Anyone can view comment likes"
  ON public.blog_comment_likes
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like comments"
  ON public.blog_comment_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes"
  ON public.blog_comment_likes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_blog_comments_blog_id ON public.blog_comments(blog_id);
CREATE INDEX idx_blog_comments_user_id ON public.blog_comments(user_id);
CREATE INDEX idx_blog_comments_parent_id ON public.blog_comments(parent_id);
CREATE INDEX idx_blog_comment_likes_comment_id ON public.blog_comment_likes(comment_id);
CREATE INDEX idx_blog_comment_likes_user_id ON public.blog_comment_likes(user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_blog_comments_updated_at
  BEFORE UPDATE ON public.blog_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();