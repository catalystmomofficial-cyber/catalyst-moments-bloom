-- Create courses table
CREATE TABLE public.courses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  duration_weeks integer NOT NULL DEFAULT 4,
  category text NOT NULL DEFAULT 'fitness',
  difficulty_level text NOT NULL DEFAULT 'beginner',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create course weeks table
CREATE TABLE public.course_weeks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  week_number integer NOT NULL,
  title text NOT NULL,
  description text,
  focus_areas text[],
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(course_id, week_number)
);

-- Create course content table
CREATE TABLE public.course_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  week_id uuid NOT NULL REFERENCES public.course_weeks(id) ON DELETE CASCADE,
  day_number integer NOT NULL,
  title text NOT NULL,
  content_type text NOT NULL DEFAULT 'workout', -- workout, nutrition, education, challenge
  description text,
  instructions text,
  video_url text,
  image_url text,
  duration_minutes integer,
  calories_target integer,
  equipment_needed text[],
  difficulty_level text DEFAULT 'beginner',
  is_premium boolean NOT NULL DEFAULT false,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(week_id, day_number)
);

-- Create user course progress table
CREATE TABLE public.user_course_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  current_week integer NOT NULL DEFAULT 1,
  current_day integer NOT NULL DEFAULT 1,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create user content completion table
CREATE TABLE public.user_content_completion (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  content_id uuid NOT NULL REFERENCES public.course_content(id) ON DELETE CASCADE,
  completed_at timestamp with time zone NOT NULL DEFAULT now(),
  notes text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, content_id)
);

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_content_completion ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for courses (public read)
CREATE POLICY "Courses are viewable by everyone" ON public.courses FOR SELECT USING (is_active = true);

-- Create RLS policies for course_weeks (public read)
CREATE POLICY "Course weeks are viewable by everyone" ON public.course_weeks FOR SELECT USING (true);

-- Create RLS policies for course_content (public read)
CREATE POLICY "Course content is viewable by everyone" ON public.course_content FOR SELECT USING (true);

-- Create RLS policies for user_course_progress
CREATE POLICY "Users can view their own course progress" ON public.user_course_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own course progress" ON public.user_course_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own course progress" ON public.user_course_progress FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for user_content_completion
CREATE POLICY "Users can view their own content completion" ON public.user_content_completion FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own content completion" ON public.user_content_completion FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own content completion" ON public.user_content_completion FOR UPDATE USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_course_weeks_updated_at BEFORE UPDATE ON public.course_weeks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_course_content_updated_at BEFORE UPDATE ON public.course_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_course_progress_updated_at BEFORE UPDATE ON public.user_course_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the 30 days glow up challenge course
INSERT INTO public.courses (title, description, duration_weeks, category, difficulty_level) VALUES 
('30 Days Glow Up Challenge', 'Transform your postpartum journey with our comprehensive 4-week glow up challenge designed specifically for new mothers.', 4, 'postpartum', 'beginner');

-- Get the course ID for week insertion
DO $$
DECLARE
    course_uuid uuid;
BEGIN
    SELECT id INTO course_uuid FROM public.courses WHERE title = '30 Days Glow Up Challenge';
    
    -- Insert weeks
    INSERT INTO public.course_weeks (course_id, week_number, title, description, focus_areas) VALUES 
    (course_uuid, 1, 'Foundation Week', 'Building healthy habits and establishing your routine', ARRAY['gentle movement', 'nutrition basics', 'mindfulness']),
    (course_uuid, 2, 'Strength Week', 'Introducing strength training and core recovery', ARRAY['strength training', 'core recovery', 'meal planning']),
    (course_uuid, 3, 'Energy Week', 'Boosting energy levels and metabolism', ARRAY['cardio workouts', 'energy foods', 'sleep optimization']),
    (course_uuid, 4, 'Glow Week', 'Final push towards your glow up goals', ARRAY['full body workouts', 'confidence building', 'goal achievement']);
END $$;