-- Add new measurement columns to weekly_checkins table
ALTER TABLE public.weekly_checkins 
ADD COLUMN waist_measurement DECIMAL(5,2),
ADD COLUMN glute_measurement DECIMAL(5,2), 
ADD COLUMN thigh_measurement DECIMAL(5,2),
ADD COLUMN description TEXT;