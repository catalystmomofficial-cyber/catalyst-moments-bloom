import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Clock, Calendar, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWorkoutPlans } from '@/hooks/useWorkoutPlans';

const WEEKLY_SCHEDULE = [
  { day: 'Monday', focus: 'Core & Pelvic Floor', detail: 'Deep belly breathing, pelvic tilts, glute bridges, bird-dog' },
  { day: 'Tuesday', focus: 'Gentle Cardio', detail: '20-minute brisk walk or light cycling' },
  { day: 'Wednesday', focus: 'Strength', detail: 'Bodyweight squats, wall push-ups, step-ups, standing rows' },
  { day: 'Thursday', focus: 'Rest / Mobility', detail: 'Stretching, foam rolling, or a restorative yoga flow' },
  { day: 'Friday', focus: 'Full-Body Strength', detail: 'Lunges, glute bridges, modified planks, resistance band rows' },
  { day: 'Saturday', focus: 'Active Recovery', detail: 'Walk, swim, or light dance for 15-20 minutes' },
  { day: 'Sunday', focus: 'Rest', detail: 'Full rest or gentle stretching' },
];

const WorkoutPlanCreator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { savePlan } = useWorkoutPlans();

  const handleSavePlan = () => {
    const savedPlanId = savePlan({
      title: 'Your Catalyst Mom Workout Plan',
      description: '4 days a week, mixing core/pelvic floor recovery, gentle cardio, and full-body strength',
      timePerSession: '20-30-min',
      frequency: '4-days',
      intensity: 'moderate',
      stage: 'general',
      preferences: [],
      additionalNotes: '',
    });

    if (savedPlanId) {
      toast({
        title: 'Workout Plan Saved!',
        description: 'Your workout plan has been saved successfully.',
      });
      navigate(`/saved-workout-plans/${savedPlanId}`);
    } else {
      toast({
        title: 'Error',
        description: 'There was an issue saving your workout plan. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Dumbbell className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Workout Plan</h1>
          <p className="text-muted-foreground">
            A balanced weekly routine built around core and pelvic floor recovery, gentle cardio, and full-body strength.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Catalyst Mom Weekly Workout Plan
            </CardTitle>
            <p className="text-muted-foreground">4 days a week of focused training, with rest and recovery built in</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-medium">Duration</span>
                </div>
                <p className="text-sm text-muted-foreground">20-30 minutes</p>
              </div>
              <div className="p-4 bg-accent/5 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span className="font-medium">Frequency</span>
                </div>
                <p className="text-sm text-muted-foreground">4 days a week</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-foreground" />
                  <span className="font-medium">Intensity</span>
                </div>
                <p className="text-sm text-muted-foreground">Moderate</p>
              </div>
            </div>

            <div className="space-y-3">
              {WEEKLY_SCHEDULE.map((item) => (
                <div key={item.day} className="flex items-start gap-3 p-3 rounded-lg border">
                  <Badge variant="outline" className="shrink-0 mt-0.5">{item.day}</Badge>
                  <div>
                    <p className="font-medium">{item.focus}</p>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button size="lg" onClick={handleSavePlan}>
                Save This Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkoutPlanCreator;
