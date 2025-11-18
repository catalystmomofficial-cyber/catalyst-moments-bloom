import { useState, useEffect } from 'react';
import { useAuth, MotherhoodStage } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Target, Heart, TrendingUp, CheckCircle2 } from 'lucide-react';

interface AssessmentData {
  email: string;
  name: string;
  primary_goal: string;
  dietary_preferences: string;
  activity_level: string;
  equipment: string;
  special_notes: any; // JSON containing scores, tier, gaps, etc.
}

export const PersonalizedOnboarding = () => {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);

  // Fetch assessment data if assessment_id is present
  useEffect(() => {
    const assessmentId = searchParams.get('assessment_id');
    
    if (assessmentId && user && profile) {
      fetchAssessmentData(assessmentId);
    }
  }, [searchParams, user, profile]);

  const fetchAssessmentData = async (assessmentId: string) => {
    try {
      const { data, error } = await supabase
        .from('lead_responses')
        .select('*')
        .eq('id', assessmentId)
        .single();

      if (error) throw error;

      if (data) {
        setAssessmentData(data as AssessmentData);
        setOpen(true);
      }
    } catch (error) {
      console.error('Error fetching assessment data:', error);
    }
  };

  const handleContinue = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      setOpen(false);
      navigate('/dashboard');
      
      toast({
        title: 'Welcome to Catalyst Mom! 🎉',
        description: 'Your personalized wellness journey starts now.',
      });
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreInsight = () => {
    if (!assessmentData?.special_notes?.overall_score) return null;
    const score = assessmentData.special_notes.overall_score;
    const tier = assessmentData.special_notes.tier;

    if (tier === 'high') {
      return {
        message: `Amazing! You scored ${score}/100 on your wellness assessment. You're doing great, and we'll help you maintain and optimize your health.`,
        color: 'text-green-600',
        icon: '🌟'
      };
    } else if (tier === 'medium') {
      return {
        message: `You scored ${score}/100 on your wellness assessment. There's room for improvement, and we have the perfect plan to help you thrive!`,
        color: 'text-yellow-600',
        icon: '💪'
      };
    } else {
      return {
        message: `Your assessment score was ${score}/100. Don't worry - you're in exactly the right place! We'll work together to transform your wellness journey.`,
        color: 'text-orange-600',
        icon: '🚀'
      };
    }
  };

  const getTopGaps = () => {
    if (!assessmentData?.special_notes?.category_scores) return [];
    
    const scores = assessmentData.special_notes.category_scores;
    const gaps = Object.entries(scores)
      .map(([category, score]) => ({
        category: category.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        score: score as number
      }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);

    return gaps;
  };

  if (!assessmentData || !open) return null;

  const scoreInsight = getScoreInsight();
  const topGaps = getTopGaps();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome, {assessmentData.name}! 🎉
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <Progress value={(currentStep + 1) * 33.33} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Step {currentStep + 1} of 3
          </p>
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 py-4"
            >
              <div className="text-center space-y-4">
                <div className="text-6xl">{scoreInsight?.icon}</div>
                <h3 className="text-xl font-semibold">Your Wellness Assessment Results</h3>
                <p className={`text-lg ${scoreInsight?.color} font-medium`}>
                  {scoreInsight?.message}
                </p>
              </div>

              <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Your Primary Goal</h4>
                </div>
                <p className="text-muted-foreground">{assessmentData.primary_goal}</p>
              </div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 py-4"
            >
              <div className="text-center space-y-2">
                <TrendingUp className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold">Areas We'll Focus On Together</h3>
                <p className="text-muted-foreground">
                  Based on your assessment, here are your top priority areas:
                </p>
              </div>

              <div className="space-y-3">
                {topGaps.map((gap, index) => (
                  <div key={index} className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{gap.category}</span>
                      <span className="text-sm text-muted-foreground">Score: {gap.score}/10</span>
                    </div>
                    <Progress value={gap.score * 10} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-sm">
                  💡 <strong>Good news!</strong> We have personalized programs and expert guidance specifically designed to help you improve in these areas.
                </p>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 py-4"
            >
              <div className="text-center space-y-2">
                <Sparkles className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold">Your Personalized Experience</h3>
                <p className="text-muted-foreground">
                  Here's what we've set up for you based on your assessment:
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">AI Wellness Coach</h4>
                    <p className="text-sm text-muted-foreground">
                      Your AI coach now understands your specific goals, challenges, and wellness priorities from your assessment.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Tailored Check-Ins</h4>
                    <p className="text-sm text-muted-foreground">
                      Your weekly check-ins will track the specific metrics that matter most for your journey.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Smart Recommendations</h4>
                    <p className="text-sm text-muted-foreground">
                      You'll receive workout plans, meal suggestions, and content focused on your priority areas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-6 rounded-lg text-center">
                <Heart className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="font-medium">
                  Everything in your app is now personalized to help you achieve your wellness goals!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0 || loading}
          >
            Back
          </Button>
          <Button onClick={handleContinue} disabled={loading}>
            {loading ? 'Loading...' : currentStep === 2 ? 'Get Started' : 'Continue'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
