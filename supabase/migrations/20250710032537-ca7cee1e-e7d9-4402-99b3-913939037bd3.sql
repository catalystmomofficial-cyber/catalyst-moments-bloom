-- Create wellness tracking tables
CREATE TABLE public.wellness_entries (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
    sleep_hours DECIMAL(3,1) CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
    stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 5),
    hydration_glasses INTEGER DEFAULT 0,
    self_care_activities TEXT[],
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workout progress tracking
CREATE TABLE public.workout_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    workout_type TEXT NOT NULL,
    workout_name TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    calories_burned INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user preferences and adaptation settings
CREATE TABLE public.user_fitness_profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    motherhood_stage TEXT NOT NULL DEFAULT 'postpartum',
    weeks_postpartum INTEGER,
    fitness_level TEXT NOT NULL DEFAULT 'beginner',
    goals TEXT[] DEFAULT ARRAY['general_wellness'],
    preferred_workout_duration INTEGER DEFAULT 15,
    available_equipment TEXT[] DEFAULT ARRAY[],
    physical_limitations TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create adaptive workout recommendations
CREATE TABLE public.workout_recommendations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    workout_type TEXT NOT NULL,
    workout_name TEXT NOT NULL,
    difficulty_level INTEGER,
    duration_minutes INTEGER,
    recommended_reason TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.wellness_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_fitness_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_recommendations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for wellness_entries
CREATE POLICY "Users can view their own wellness entries" 
ON public.wellness_entries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wellness entries" 
ON public.wellness_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wellness entries" 
ON public.wellness_entries 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for workout_sessions
CREATE POLICY "Users can view their own workout sessions" 
ON public.workout_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout sessions" 
ON public.workout_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout sessions" 
ON public.workout_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for user_fitness_profiles
CREATE POLICY "Users can view their own fitness profile" 
ON public.user_fitness_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fitness profile" 
ON public.user_fitness_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fitness profile" 
ON public.user_fitness_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for workout_recommendations
CREATE POLICY "Users can view their own workout recommendations" 
ON public.workout_recommendations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout recommendations" 
ON public.workout_recommendations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout recommendations" 
ON public.workout_recommendations 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_wellness_entries_updated_at
    BEFORE UPDATE ON public.wellness_entries
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_fitness_profiles_updated_at
    BEFORE UPDATE ON public.user_fitness_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate adaptive workout recommendations
CREATE OR REPLACE FUNCTION public.generate_workout_recommendations(user_uuid UUID)
RETURNS void AS $$
DECLARE
    user_profile record;
    recent_wellness record;
    recent_workouts record;
BEGIN
    -- Get user profile
    SELECT * INTO user_profile FROM user_fitness_profiles WHERE user_id = user_uuid;
    
    -- Get recent wellness data
    SELECT 
        AVG(energy_level) as avg_energy,
        AVG(stress_level) as avg_stress,
        AVG(mood_rating) as avg_mood
    INTO recent_wellness 
    FROM wellness_entries 
    WHERE user_id = user_uuid 
    AND entry_date >= CURRENT_DATE - INTERVAL '7 days';
    
    -- Get recent workout frequency
    SELECT COUNT(*) as workout_count
    INTO recent_workouts
    FROM workout_sessions 
    WHERE user_id = user_uuid 
    AND completed_at >= CURRENT_DATE - INTERVAL '7 days';
    
    -- Clear old recommendations
    DELETE FROM workout_recommendations WHERE user_id = user_uuid;
    
    -- Generate recommendations based on profile and recent data
    IF user_profile.motherhood_stage = 'postpartum' AND COALESCE(user_profile.weeks_postpartum, 0) < 12 THEN
        INSERT INTO workout_recommendations (user_id, workout_type, workout_name, difficulty_level, duration_minutes, recommended_reason)
        VALUES 
            (user_uuid, 'core', 'Gentle Core Recovery', 1, 10, 'Perfect for early postpartum recovery'),
            (user_uuid, 'walking', 'Postnatal Walking', 1, 15, 'Low-impact cardio for new moms');
    END IF;
    
    -- Energy-based recommendations
    IF COALESCE(recent_wellness.avg_energy, 3) < 2.5 THEN
        INSERT INTO workout_recommendations (user_id, workout_type, workout_name, difficulty_level, duration_minutes, recommended_reason)
        VALUES (user_uuid, 'gentle', 'Energy Boost Yoga', 1, 15, 'Gentle movement to increase energy');
    ELSIF COALESCE(recent_wellness.avg_energy, 3) > 3.5 THEN
        INSERT INTO workout_recommendations (user_id, workout_type, workout_name, difficulty_level, duration_minutes, recommended_reason)
        VALUES (user_uuid, 'strength', 'Power Mom HIIT', 3, 20, 'You have great energy - challenge yourself!');
    END IF;
    
    -- Stress-based recommendations
    IF COALESCE(recent_wellness.avg_stress, 3) > 3.5 THEN
        INSERT INTO workout_recommendations (user_id, workout_type, workout_name, difficulty_level, duration_minutes, recommended_reason)
        VALUES (user_uuid, 'mindfulness', 'Stress Relief Yoga', 1, 20, 'Combat stress with mindful movement');
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;