import { useParams, useNavigate } from 'react-router-dom';
import { useWorkoutPlans } from '@/hooks/useWorkoutPlans';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Dumbbell, 
  Clock, 
  Calendar, 
  Target, 
  CheckCircle,
  Play
} from 'lucide-react';

const WorkoutPlanDetail = () => {
  const { planId } = useParams<{ planId: string }>();
  const { getPlan } = useWorkoutPlans();
  const navigate = useNavigate();

  const plan = planId ? getPlan(planId) : null;

  if (!plan) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Workout Plan Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The workout plan you're looking for doesn't exist or has been deleted.
            </p>
            <Button onClick={() => navigate('/saved-workout-plans')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Plans
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStageDisplayName = (stage: string) => {
    const stageNames: { [key: string]: string } = {
      'ttc': 'Trying to Conceive',
      'pregnant': 'Pregnancy',
      'postpartum-0-3': 'Early Postpartum',
      'postpartum-3-12': 'Postpartum Recovery',
      'general': 'General Mom Wellness'
    };
    return stageNames[stage] || stage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getWeeklySchedule = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const frequency = plan.frequency;
    
    let workoutDays: string[] = [];
    
    if (frequency === '2-days') {
      workoutDays = ['Tuesday', 'Friday'];
    } else if (frequency === '3-days') {
      workoutDays = ['Monday', 'Wednesday', 'Friday'];
    } else if (frequency === '4-days') {
      workoutDays = ['Monday', 'Tuesday', 'Thursday', 'Friday'];
    } else if (frequency === '5-plus') {
      workoutDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    } else if (frequency === 'flexible') {
      workoutDays = ['Flexible Schedule'];
    }

    return workoutDays;
  };

  const getSampleWorkouts = () => {
    const stage = plan.stage;
    const preferences = plan.preferences;
    
    const workoutTypes: { [key: string]: string[] } = {
      'ttc': ['Fertility Yoga', 'Gentle Cardio', 'Strength Training', 'Stress Relief Walks'],
      'pregnant': ['Prenatal Yoga', 'Swimming', 'Walking', 'Prenatal Pilates'],
      'postpartum-0-3': ['Gentle Stretching', 'Walking', 'Core Breathing', 'Posture Exercises'],
      'postpartum-3-12': ['Core Restoration', 'Strength Training', 'Cardio Intervals', 'Yoga Flow'],
      'general': ['Strength Training', 'HIIT Workouts', 'Yoga', 'Running/Walking']
    };

    return workoutTypes[stage] || workoutTypes.general;
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/saved-workout-plans')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Plans
            </Button>
            
            <div className="flex items-center gap-3 mb-2">
              <Dumbbell className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">{plan.title}</h1>
            </div>
            <p className="text-muted-foreground">{plan.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">{getStageDisplayName(plan.stage)}</Badge>
              <span className="text-sm text-muted-foreground">
                Created {formatDate(plan.createdAt)}
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Plan Overview */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Plan Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-medium">Duration</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {plan.timePerSession.replace('-', ' ')}
                      </p>
                    </div>
                    <div className="p-4 bg-accent/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-accent" />
                        <span className="font-medium">Frequency</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {plan.frequency.replace('-', ' ')}
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-foreground" />
                        <span className="font-medium">Intensity</span>
                      </div>
                      <p className="text-sm text-muted-foreground capitalize">
                        {plan.intensity}
                      </p>
                    </div>
                  </div>

                  {plan.preferences.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium mb-3">Your Preferred Activities:</h4>
                      <div className="flex flex-wrap gap-2">
                        {plan.preferences.map(pref => (
                          <Badge key={pref} variant="outline">
                            {pref.replace('-', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {plan.additionalNotes && (
                    <div className="p-4 bg-muted/20 rounded-lg">
                      <h4 className="font-medium mb-2">Special Considerations:</h4>
                      <p className="text-sm text-muted-foreground">{plan.additionalNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Weekly Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Weekly Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getWeeklySchedule().map((day, index) => (
                      <div key={day} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                            {day.charAt(0)}
                          </div>
                          <span className="font-medium">{day}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {plan.frequency === 'flexible' ? 'As needed' : plan.timePerSession.replace('-', ' ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sample Workouts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Sample Workouts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {getSampleWorkouts().map((workout, index) => (
                      <div key={workout} className="p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-primary" />
                          <span className="font-medium">{workout}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {plan.timePerSession.replace('-', ' ')} session
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" onClick={() => navigate('/workouts')}>
                    <Play className="w-4 h-4 mr-2" />
                    Start Workout
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/wellness')}>
                    Track Progress
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tips for Success</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <p>Start with shorter sessions and gradually increase intensity</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <p>Listen to your body and rest when needed</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <p>Stay consistent with your schedule</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <p>Track your progress and celebrate small wins</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default WorkoutPlanDetail;