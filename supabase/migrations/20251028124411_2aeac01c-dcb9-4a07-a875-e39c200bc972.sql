-- Create blogs table
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT DEFAULT 'Catalyst Mom Team',
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  slug TEXT UNIQUE,
  featured_image_url TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'))
);

-- Enable Row Level Security
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read published blogs
CREATE POLICY "Anyone can view published blogs" 
ON public.blogs 
FOR SELECT 
USING (status = 'published');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER set_blogs_updated_at
BEFORE UPDATE ON public.blogs
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create index for better performance
CREATE INDEX idx_blogs_published_at ON public.blogs(published_at DESC);
CREATE INDEX idx_blogs_status ON public.blogs(status);
CREATE INDEX idx_blogs_slug ON public.blogs(slug);