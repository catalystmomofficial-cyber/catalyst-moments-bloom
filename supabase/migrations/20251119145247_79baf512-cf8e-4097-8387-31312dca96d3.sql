-- Create function to automatically notify subscribers when a blog is published
CREATE OR REPLACE FUNCTION notify_blog_published()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger when status changes from draft to published
  IF OLD.status = 'draft' AND NEW.status = 'published' THEN
    PERFORM
      net.http_post(
        url := 'https://moxxceccaftkeuaowctw.supabase.co/functions/v1/send-blog-notification',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1veHhjZWNjYWZ0a2V1YW93Y3R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NTEyOTYsImV4cCI6MjA2MjQyNzI5Nn0.zInlBzKCVwrhKBW-nAc5b7BoxrXmlYF25cuqfippu3U'
        ),
        body := jsonb_build_object('blog_id', NEW.id::text)
      );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger on blogs table
CREATE TRIGGER on_blog_published
  AFTER UPDATE ON blogs
  FOR EACH ROW
  EXECUTE FUNCTION notify_blog_published();