import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Utensils, Heart, Clock, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface MealPlanState {
  motherhoodStage: string;
  dietaryGoal: string;
  cravings: string[];
  restrictions: string[];
  cookingTime: string;
  mealPrep: string;
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
  field: keyof MealPlanState;
  multiple?: boolean;
  isTextInput?: boolean;
}

const MealPlanCreator = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<MealPlanState>({
    motherhoodStage: profile?.motherhood_stage || '',
    dietaryGoal: '',
    cravings: [],
    restrictions: [],
    cookingTime: '',
    mealPrep: '',
    additionalNotes: ''
  });
  const [showPlan, setShowPlan] = useState(false);

  const totalSteps = 6;

  const handleOptionSelect = (field: keyof MealPlanState, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field: keyof MealPlanState, option: string) => {
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
      case 1: return answers.dietaryGoal !== '';
      case 2: return true; // cravings optional
      case 3: return true; // restrictions optional
      case 4: return answers.cookingTime !== '';
      case 5: return answers.mealPrep !== '';
      default: return false;
    }
  };

  const getStageSpecificQuestions = (): Question[] => {
    const baseQuestions = [
      {
        title: "What's your current stage?",
        subtitle: "Let's create a meal plan that fits your journey",
        options: [
          { value: 'ttc', label: 'Trying to Conceive', emoji: '💕', description: 'Fertility-boosting nutrition' },
          { value: 'pregnant', label: 'Currently Pregnant', emoji: '🤱', description: 'Safe, nourishing meals for you & baby' },
          { value: 'postpartum-0-3', label: 'Postpartum (0-3 months)', emoji: '👶', description: 'Recovery-focused nutrition' },
          { value: 'postpartum-3-12', label: 'Postpartum (3-12 months)', emoji: '🍼', description: 'Energy & wellness meals' },
          { value: 'general', label: 'General Mom Wellness', emoji: '💪', description: 'Balanced family nutrition' }
        ],
        field: 'motherhoodStage' as keyof MealPlanState
      }
    ];

    const stageSpecificGoals = {
      'ttc': [
        { value: 'fertility-boost', label: 'Boost fertility naturally', emoji: '🌸' },
        { value: 'hormone-balance', label: 'Balance hormones', emoji: '⚖️' },
        { value: 'reduce-inflammation', label: 'Reduce inflammation', emoji: '🌿' },
        { value: 'healthy-weight', label: 'Maintain healthy weight', emoji: '💚' }
      ],
      'pregnant': [
        { value: 'healthy-pregnancy', label: 'Support healthy pregnancy', emoji: '🤱' },
        { value: 'morning-sickness', label: 'Manage morning sickness', emoji: '🌅' },
        { value: 'energy-boost', label: 'Boost energy levels', emoji: '⚡' },
        { value: 'baby-development', label: 'Support baby development', emoji: '👶' }
      ],
      'postpartum-0-3': [
        { value: 'recovery-healing', label: 'Support recovery & healing', emoji: '🌱' },
        { value: 'breastfeeding', label: 'Support breastfeeding', emoji: '🤱' },
        { value: 'energy-levels', label: 'Boost energy levels', emoji: '🔋' },
        { value: 'mood-support', label: 'Support mood & wellness', emoji: '💚' }
      ],
      'postpartum-3-12': [
        { value: 'lose-baby-weight', label: 'Lose baby weight', emoji: '⚖️' },
        { value: 'increase-energy', label: 'Increase energy', emoji: '⚡' },
        { value: 'family-meals', label: 'Easy family meals', emoji: '👨‍👩‍👧‍👦' },
        { value: 'meal-prep', label: 'Meal prep mastery', emoji: '📦' }
      ],
      'general': [
        { value: 'family-nutrition', label: 'Family nutrition', emoji: '🍽️' },
        { value: 'weight-management', label: 'Weight management', emoji: '⚖️' },
        { value: 'energy-vitality', label: 'Energy & vitality', emoji: '✨' },
        { value: 'quick-meals', label: 'Quick & healthy meals', emoji: '⏰' }
      ]
    };

    const stageCravings = {
      'ttc': [
        { value: 'leafy-greens', label: 'Leafy greens', emoji: '🥬' },
        { value: 'healthy-fats', label: 'Healthy fats', emoji: '🥑' },
        { value: 'antioxidants', label: 'Antioxidant-rich foods', emoji: '🫐' }
      ],
      'pregnant': [
        { value: 'citrus', label: 'Citrus fruits', emoji: '🍊' },
        { value: 'dairy', label: 'Dairy products', emoji: '🥛' },
        { value: 'pickles', label: 'Pickles & sour foods', emoji: '🥒' },
        { value: 'sweets', label: 'Sweet treats', emoji: '🍯' },
        { value: 'comfort-foods', label: 'Comfort foods', emoji: '🍲' }
      ],
      'postpartum-0-3': [
        { value: 'warm-foods', label: 'Warm, nourishing foods', emoji: '🍲' },
        { value: 'easy-snacks', label: 'Easy grab-and-go snacks', emoji: '🥜' },
        { value: 'hydrating-foods', label: 'Hydrating foods', emoji: '🥒' }
      ],
      'postpartum-3-12': [
        { value: 'protein-rich', label: 'Protein-rich meals', emoji: '🥩' },
        { value: 'meal-prep', label: 'Meal prep friendly', emoji: '📦' },
        { value: 'energy-boosting', label: 'Energy boosting foods', emoji: '⚡' }
      ],
      'general': [
        { value: 'balanced-meals', label: 'Balanced family meals', emoji: '🍽️' },
        { value: 'quick-prep', label: 'Quick prep options', emoji: '⏰' },
        { value: 'kid-friendly', label: 'Kid-friendly foods', emoji: '👶' }
      ]
    };

    const goalQuestion = {
      title: "What's your main nutrition goal?",
      subtitle: answers.motherhoodStage === 'pregnant' ? "Let's nourish you and your baby" : "Let's focus on what your body needs most",
      options: stageSpecificGoals[answers.motherhoodStage as keyof typeof stageSpecificGoals] || stageSpecificGoals.general,
      field: 'dietaryGoal' as keyof MealPlanState
    };

    const cravingsQuestion = {
      title: answers.motherhoodStage === 'pregnant' ? "Any specific cravings?" : "What foods appeal to you?",
      subtitle: "We'll incorporate these into your meal plan",
      options: stageCravings[answers.motherhoodStage as keyof typeof stageCravings] || stageCravings.general,
      field: 'cravings' as keyof MealPlanState,
      multiple: true
    };

    return [
      ...baseQuestions,
      goalQuestion,
      cravingsQuestion,
      {
        title: "Any dietary restrictions?",
        subtitle: "Let us know so we can create safe, delicious alternatives",
        options: [
          { value: 'gluten-free', label: 'Gluten-free', emoji: '🌾' },
          { value: 'dairy-free', label: 'Dairy-free', emoji: '🥛' },
          { value: 'vegetarian', label: 'Vegetarian', emoji: '🥗' },
          { value: 'vegan', label: 'Vegan', emoji: '🌱' },
          { value: 'nut-allergies', label: 'Nut allergies', emoji: '🥜' },
          { value: 'low-sodium', label: 'Low sodium', emoji: '🧂' },
          { value: 'none', label: 'No restrictions', emoji: '✅' }
        ],
        field: 'restrictions' as keyof MealPlanState,
        multiple: true
      },
      {
        title: "How much time for cooking?",
        subtitle: "We'll match your schedule with realistic meal prep",
        options: [
          { value: '15-min', label: '15 minutes or less', emoji: '⚡' },
          { value: '30-min', label: '30 minutes', emoji: '⏰' },
          { value: '45-min', label: '45 minutes', emoji: '🍳' },
          { value: 'weekend-prep', label: 'Weekend meal prep', emoji: '📦' }
        ],
        field: 'cookingTime' as keyof MealPlanState
      },
      {
        title: "Meal prep preference?",
        subtitle: "Let's make your week easier",
        options: [
          { value: 'daily-fresh', label: 'Cook fresh daily', emoji: '🍳' },
          { value: 'batch-cook', label: 'Batch cook on weekends', emoji: '📦' },
          { value: 'semi-prep', label: 'Some prep, some fresh', emoji: '⚖️' },
          { value: 'freezer-meals', label: 'Freezer-friendly meals', emoji: '❄️' }
        ],
        field: 'mealPrep' as keyof MealPlanState
      }
    ];
  };

  const generateMealPlan = () => {
    const stageBenefits = {
      'ttc': 'fertility-boosting nutrients like folate, iron, and omega-3s',
      'pregnant': answers.dietaryGoal === 'morning-sickness' ? 'gentle, easy-to-digest foods' : 'essential pregnancy nutrients',
      'postpartum-0-3': 'healing nutrients and easy-to-eat options for busy new moms',
      'postpartum-3-12': 'energy-boosting and metabolism-supporting foods',
      'general': 'balanced nutrition for the whole family'
    };

    return {
      title: `Your Personalized ${answers.motherhoodStage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Meal Plan`,
      description: `7 days of delicious meals featuring ${stageBenefits[answers.motherhoodStage as keyof typeof stageBenefits]}`,
      cookingTime: answers.cookingTime,
      mealPrep: answers.mealPrep,
      stage: answers.motherhoodStage
    };
  };

  if (showPlan) {
    const plan = generateMealPlan();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent/5 to-primary/5 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Utensils className="w-16 h-16 text-accent mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Meal Plan is Ready!</h1>
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
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-accent/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-accent" />
                    <span className="font-medium">Cooking Time</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{answers.cookingTime.replace('-', ' ')}</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-primary" />
                    <span className="font-medium">Meal Prep Style</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{answers.mealPrep.replace('-', ' ')}</p>
                </div>
              </div>

              {answers.cravings.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Including your favorites:</h4>
                  <div className="flex flex-wrap gap-2">
                    {answers.cravings.map(craving => (
                      <Badge key={craving} variant="outline">{craving.replace('-', ' ')}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-center space-y-4">
                <Button size="lg" onClick={() => {
                  toast({
                    title: "Meal Plan Created!",
                    description: "Your personalized meal plan has been saved to your dashboard.",
                  });
                }}>
                  Access My Meal Plan
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
    <div className="min-h-screen bg-gradient-to-br from-accent/5 to-primary/5 p-4">
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
              className="bg-accent h-2 rounded-full transition-all duration-300"
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
          {currentQuestion.options?.map((option) => (
            <Card 
              key={option.value}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                currentQuestion.multiple 
                  ? (answers[currentQuestion.field] as string[])?.includes(option.value)
                    ? 'ring-2 ring-accent bg-accent/5'
                    : 'hover:bg-muted/50'
                  : answers[currentQuestion.field] === option.value
                    ? 'ring-2 ring-accent bg-accent/5'
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
          ))}
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

export default MealPlanCreator;