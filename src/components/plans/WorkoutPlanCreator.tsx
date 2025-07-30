import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Dumbbell, Target, Clock, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface WorkoutPlanState {
  motherhoodStage: string;
  fitnessGoal: string;
  experienceLevel: string;
  timeAvailable: string;
  daysPerWeek: string;
  preferences: string[];
  additionalNotes: string;
}

interface QuestionOption {
  value: string;
  label: string;
  emoji: string;
  description?: string;
}

interface Question {
  title: string;
  subtitle: string;
  options?: QuestionOption[];
  field: keyof WorkoutPlanState;
  multiple?: boolean;
  isTextInput?: boolean;
}

const WorkoutPlanCreator = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<WorkoutPlanState>({
    motherhoodStage: profile?.motherhood_stage || '',
    fitnessGoal: '',
    experienceLevel: '',
    timeAvailable: '',
    daysPerWeek: '',
    preferences: [],
    additionalNotes: ''
  });
  const [showPlan, setShowPlan] = useState(false);

  const totalSteps = 7;

  const handleOptionSelect = (field: keyof WorkoutPlanState, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field: keyof WorkoutPlanState, option: string) => {
    setAnswers(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(option)
        ? (prev[field] as string[]).filter(item => item !== option)
        : [...(prev[field] as string[]), option]
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowPlan(true);
    }
  };

  const prevStep = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return answers.motherhoodStage !== '';
      case 1: return answers.fitnessGoal !== '';
      case 2: return answers.experienceLevel !== '';
      case 3: return answers.timeAvailable !== '';
      case 4: return answers.daysPerWeek !== '';
      case 5: return true; // preferences optional
      case 6: return true; // notes optional
      default: return false;
    }
  };

  const getStageSpecificQuestions = (): Question[] => {
    const baseQuestions = [
      {
        title: "What's your current stage?",
        subtitle: "Let's create a safe, effective workout plan for you",
        options: [
          { value: 'ttc', label: 'Trying to Conceive', emoji: '💕', description: 'Fertility-supporting fitness' },
          { value: 'pregnant', label: 'Currently Pregnant', emoji: '🤱', description: 'Safe prenatal workouts' },
          { value: 'postpartum-0-3', label: 'Postpartum (0-3 months)', emoji: '👶', description: 'Gentle recovery exercises' },
          { value: 'postpartum-3-12', label: 'Postpartum (3-12 months)', emoji: '🍼', description: 'Rebuilding strength' },
          { value: 'general', label: 'General Mom Wellness', emoji: '💪', description: 'Busy mom fitness' }
        ],
        field: 'motherhoodStage' as keyof WorkoutPlanState
      }
    ];

    const stageSpecificGoals = {
      'ttc': [
        { value: 'fertility-support', label: 'Support fertility', emoji: '🌸' },
        { value: 'stress-relief', label: 'Reduce stress', emoji: '🧘‍♀️' },
        { value: 'weight-management', label: 'Healthy weight management', emoji: '⚖️' },
        { value: 'overall-wellness', label: 'Overall wellness', emoji: '✨' }
      ],
      'pregnant': [
        { value: 'healthy-pregnancy', label: 'Maintain healthy pregnancy', emoji: '🤱' },
        { value: 'birth-prep', label: 'Prepare for birth', emoji: '🌟' },
        { value: 'energy-boost', label: 'Boost energy', emoji: '⚡' },
        { value: 'reduce-discomfort', label: 'Reduce pregnancy discomfort', emoji: '💆‍♀️' }
      ],
      'postpartum-0-3': [
        { value: 'gentle-recovery', label: 'Gentle recovery', emoji: '🌱' },
        { value: 'core-healing', label: 'Core & pelvic floor healing', emoji: '💝' },
        { value: 'energy-return', label: 'Regain energy', emoji: '🔋' },
        { value: 'mood-support', label: 'Support mood & wellness', emoji: '🌈' }
      ],
      'postpartum-3-12': [
        { value: 'lose-baby-weight', label: 'Lose baby weight', emoji: '⚖️' },
        { value: 'rebuild-strength', label: 'Rebuild strength', emoji: '💪' },
        { value: 'tone-sculpt', label: 'Tone & sculpt', emoji: '✨' },
        { value: 'increase-stamina', label: 'Increase stamina', emoji: '🔥' }
      ],
      'general': [
        { value: 'maintain-fitness', label: 'Maintain fitness', emoji: '🎯' },
        { value: 'build-strength', label: 'Build strength', emoji: '💪' },
        { value: 'weight-loss', label: 'Weight loss', emoji: '⚖️' },
        { value: 'stress-relief', label: 'Stress relief', emoji: '🧘‍♀️' }
      ]
    };

    const stageSpecificExperience = {
      'ttc': [
        { value: 'beginner', label: 'New to fitness', emoji: '🌱' },
        { value: 'some-experience', label: 'Some experience', emoji: '🌸' },
        { value: 'experienced', label: 'Regular exerciser', emoji: '💪' }
      ],
      'pregnant': [
        { value: 'new-to-prenatal', label: 'New to prenatal fitness', emoji: '🌱' },
        { value: 'some-prenatal', label: 'Some prenatal experience', emoji: '🌸' },
        { value: 'experienced-prenatal', label: 'Experienced with prenatal', emoji: '🤱' }
      ],
      'postpartum-0-3': [
        { value: 'new-mom', label: 'First time postpartum', emoji: '👶' },
        { value: 'second-time', label: 'Not my first baby', emoji: '👶👶' },
        { value: 'cleared-by-doctor', label: 'Cleared for exercise', emoji: '✅' }
      ],
      'postpartum-3-12': [
        { value: 'getting-back', label: 'Getting back into fitness', emoji: '🔄' },
        { value: 'some-routine', label: 'Have some routine', emoji: '📅' },
        { value: 'ready-intensity', label: 'Ready for intensity', emoji: '🔥' }
      ],
      'general': [
        { value: 'beginner', label: 'Beginner', emoji: '🌱' },
        { value: 'intermediate', label: 'Intermediate', emoji: '🌸' },
        { value: 'advanced', label: 'Advanced', emoji: '💪' }
      ]
    };

    const goalQuestion = {
      title: "What's your main fitness goal?",
      subtitle: answers.motherhoodStage === 'pregnant' ? "Let's keep you and baby healthy & strong" : "Let's focus on what your body needs most",
      options: stageSpecificGoals[answers.motherhoodStage as keyof typeof stageSpecificGoals] || stageSpecificGoals.general,
      field: 'fitnessGoal' as keyof WorkoutPlanState
    };

    const experienceQuestion = {
      title: "What's your experience level?",
      subtitle: "We'll match the intensity to where you are",
      options: stageSpecificExperience[answers.motherhoodStage as keyof typeof stageSpecificExperience] || stageSpecificExperience.general,
      field: 'experienceLevel' as keyof WorkoutPlanState
    };

    return [
      ...baseQuestions,
      goalQuestion,
      experienceQuestion,
      {
        title: "How much time do you have?",
        subtitle: "Let's be realistic about your schedule",
        options: [
          { value: '10-15-min', label: '10-15 minutes', emoji: '⚡' },
          { value: '20-30-min', label: '20-30 minutes', emoji: '⏰' },
          { value: '45-min', label: '45 minutes', emoji: '🏃‍♀️' },
          { value: '60-min', label: '60+ minutes', emoji: '🔥' }
        ],
        field: 'timeAvailable' as keyof WorkoutPlanState
      },
      {
        title: "How many days per week?",
        subtitle: "Quality over quantity - what can you realistically commit to?",
        options: [
          { value: '2-days', label: '2 days', emoji: '🗓️' },
          { value: '3-days', label: '3 days', emoji: '📅' },
          { value: '4-days', label: '4 days', emoji: '🔥' },
          { value: '5-plus', label: '5+ days', emoji: '💪' },
          { value: 'flexible', label: 'Depends on the week', emoji: '🤷‍♀️' }
        ],
        field: 'daysPerWeek' as keyof WorkoutPlanState
      },
      {
        title: "What do you enjoy?",
        subtitle: "Select all that appeal to you (or skip if unsure)",
        options: [
          { value: 'strength-training', label: 'Strength training', emoji: '💪' },
          { value: 'yoga-pilates', label: 'Yoga & Pilates', emoji: '🧘‍♀️' },
          { value: 'cardio', label: 'Cardio workouts', emoji: '❤️' },
          { value: 'dance', label: 'Dance fitness', emoji: '💃' },
          { value: 'walking', label: 'Walking/Running', emoji: '🚶‍♀️' },
          { value: 'swimming', label: 'Swimming', emoji: '🏊‍♀️' },
          { value: 'bodyweight', label: 'Bodyweight exercises', emoji: '🤸‍♀️' }
        ],
        field: 'preferences' as keyof WorkoutPlanState,
        multiple: true
      },
      {
        title: "Anything else?",
        subtitle: "Any injuries, concerns, or special considerations?",
        isTextInput: true,
        field: 'additionalNotes' as keyof WorkoutPlanState
      }
    ];
  };

  const generateWorkoutPlan = () => {
    const stageBenefits = {
      'ttc': 'fertility-supporting exercises and stress-reducing movements',
      'pregnant': 'safe prenatal exercises designed for your changing body',
      'postpartum-0-3': 'gentle recovery exercises focusing on core and pelvic floor healing',
      'postpartum-3-12': 'progressive workouts to rebuild strength and energy',
      'general': 'efficient workouts designed for busy moms'
    };

    const intensityLevel = {
      'beginner': 'gentle',
      'new-to-prenatal': 'gentle',
      'new-mom': 'gentle',
      'getting-back': 'gentle to moderate',
      'some-experience': 'moderate',
      'some-prenatal': 'moderate',
      'second-time': 'moderate',
      'some-routine': 'moderate',
      'experienced': 'moderate to challenging',
      'experienced-prenatal': 'moderate',
      'cleared-by-doctor': 'progressive',
      'ready-intensity': 'challenging',
      'intermediate': 'moderate',
      'advanced': 'challenging'
    };

    return {
      title: `Your Personalized ${answers.motherhoodStage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Workout Plan`,
      description: `${answers.daysPerWeek.replace('-', ' ')} featuring ${stageBenefits[answers.motherhoodStage as keyof typeof stageBenefits]}`,
      timePerSession: answers.timeAvailable,
      frequency: answers.daysPerWeek,
      intensity: intensityLevel[answers.experienceLevel as keyof typeof intensityLevel] || 'moderate',
      stage: answers.motherhoodStage
    };
  };

  if (showPlan) {
    const plan = generateWorkoutPlan();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Dumbbell className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Workout Plan is Ready!</h1>
            <p className="text-muted-foreground">Designed specifically for your {answers.motherhoodStage.replace('-', ' ')} journey</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                {plan.title}
              </CardTitle>
              <p className="text-muted-foreground">{plan.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-medium">Duration</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{answers.timeAvailable.replace('-', ' ')}</p>
                </div>
                <div className="p-4 bg-accent/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span className="font-medium">Frequency</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{answers.daysPerWeek.replace('-', ' ')}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-foreground" />
                    <span className="font-medium">Intensity</span>
                  </div>
                  <p className="text-sm text-muted-foreground capitalize">{plan.intensity}</p>
                </div>
              </div>

              {answers.preferences.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Including your favorite activities:</h4>
                  <div className="flex flex-wrap gap-2">
                    {answers.preferences.map(pref => (
                      <Badge key={pref} variant="outline">{pref.replace('-', ' ')}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {answers.additionalNotes && (
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-medium mb-2">Special considerations:</h4>
                  <p className="text-sm text-muted-foreground">{answers.additionalNotes}</p>
                </div>
              )}

              <div className="text-center space-y-4">
                <Button size="lg" onClick={() => {
                  toast({
                    title: "Workout Plan Created!",
                    description: "Your personalized workout plan has been saved to your dashboard.",
                  });
                }}>
                  Access My Workout Plan
                </Button>
                <Button variant="ghost" onClick={() => {
                  setShowPlan(false);
                  setCurrentStep(0);
                }}>
                  Create Different Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const questions = getStageSpecificQuestions();
  const currentQuestion = questions[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="max-w-md mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Question {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(((currentStep + 1) / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {currentQuestion.title}
          </h1>
          <p className="text-muted-foreground text-sm">
            {currentQuestion.subtitle}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {currentQuestion.isTextInput ? (
            <Card>
              <CardContent className="p-4">
                <textarea
                  className="w-full p-3 border-none outline-none resize-none bg-transparent"
                  rows={4}
                  placeholder="Tell us about any injuries, concerns, or modifications you need..."
                  value={answers.additionalNotes}
                  onChange={(e) => handleOptionSelect('additionalNotes', e.target.value)}
                />
              </CardContent>
            </Card>
          ) : (
            currentQuestion.options?.map((option) => (
              <Card 
                key={option.value}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  currentQuestion.multiple 
                    ? (answers[currentQuestion.field] as string[])?.includes(option.value)
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                    : answers[currentQuestion.field] === option.value
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                }`}
                onClick={() => {
                  if (currentQuestion.multiple) {
                    handleMultiSelect(currentQuestion.field, option.value);
                  } else {
                    handleOptionSelect(currentQuestion.field, option.value);
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{option.emoji}</span>
                    <div className="flex-1">
                      <span className="font-medium">{option.label}</span>
                      {option.description && (
                        <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          
          <Button 
            onClick={nextStep}
            disabled={!canProceed()}
            className="flex items-center"
          >
            {currentStep === totalSteps - 1 ? 'Create Plan' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanCreator;