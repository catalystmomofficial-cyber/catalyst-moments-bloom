-- Create newsletter subscribers table
CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting new subscribers (public)
CREATE POLICY "Anyone can subscribe to newsletter" 
ON public.newsletter_subscribers 
FOR INSERT 
WITH CHECK (true);

-- Create policy for viewing subscribers (admin only - will need admin role later)
CREATE POLICY "Only admins can view subscribers" 
ON public.newsletter_subscribers 
FOR SELECT 
USING (false); -- For now, no one can view. Can be updated when admin system is implemented

-- Create index for email lookups
CREATE INDEX idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribers_active ON public.newsletter_subscribers(is_active);