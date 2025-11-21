-- Add assessment score fields to lead_responses table
ALTER TABLE public.lead_responses 
ADD COLUMN IF NOT EXISTS overall_score INTEGER,
ADD COLUMN IF NOT EXISTS tier TEXT,
ADD COLUMN IF NOT EXISTS category_scores JSONB,
ADD COLUMN IF NOT EXISTS assessment_results JSONB;

-- Add comment for documentation
COMMENT ON COLUMN public.lead_responses.overall_score IS 'Overall wellness assessment score (0-100)';
COMMENT ON COLUMN public.lead_responses.tier IS 'Assessment tier: low, medium, or high';
COMMENT ON COLUMN public.lead_responses.category_scores IS 'Scores by category: fitness, nutrition, mental_health, etc.';
COMMENT ON COLUMN public.lead_responses.assessment_results IS 'Complete assessment results including recommendations and insights';