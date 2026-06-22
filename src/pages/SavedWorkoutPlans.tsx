import { useState } from 'react';
import { useWorkoutPlans } from '@/hooks/useWorkoutPlans';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Dumbbell, 
  Clock, 
  Calendar, 
  Target, 
  Plus, 
  Trash2,
  ChevronRight 
} from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const SavedWorkoutPlans = () => {
  const { savedPlans, isLoading, deletePlan } = useWorkoutPlans();
  const navigate = useNavigate();
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading your workout plans...</div>
        </div>
      </PageLayout>
    );
  }

  const handleDeletePlan = (planId: string) => {
    deletePlan(planId);
    setDeletingPlanId(null);
  };

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

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Dumbbell className="w-8 h-8 text-primary" />
                My Workout Plans
              </h1>
              <p className="text-muted-foreground mt-2">
                Access your personalized workout plans anytime
              </p>
            </div>
            <Button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>

          {savedPlans.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Dumbbell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Workout Plans Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first personalized workout plan to get started on your fitness journey.
                </p>
                <Button onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {savedPlans.map((plan) => (
                <Card key={plan.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 mb-2">
                          <Target className="w-5 h-5 text-primary" />
                          {plan.title}
                        </CardTitle>
                        <p className="text-muted-foreground text-sm mb-3">
                          {plan.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Created {formatDate(plan.createdAt)}</span>
                          <Badge variant="secondary" className="text-xs">
                            {getStageDisplayName(plan.stage)}
                          </Badge>
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setDeletingPlanId(plan.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Workout Plan</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this workout plan? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeletePlan(plan.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Duration:</span>
                        <span className="text-sm text-muted-foreground">
                          {plan.timePerSession.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium">Frequency:</span>
                        <span className="text-sm text-muted-foreground">
                          {plan.frequency.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-foreground" />
                        <span className="text-sm font-medium">Intensity:</span>
                        <span className="text-sm text-muted-foreground capitalize">
                          {plan.intensity}
                        </span>
                      </div>
                    </div>

                    {plan.preferences.length > 0 && (
                      <div className="mb-4">
                        <span className="text-sm font-medium mb-2 block">Preferences:</span>
                        <div className="flex flex-wrap gap-2">
                          {plan.preferences.map((pref) => (
                            <Badge key={pref} variant="outline" className="text-xs">
                              {pref.replace('-', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {plan.additionalNotes && (
                      <div className="mb-4">
                        <span className="text-sm font-medium mb-2 block">Notes:</span>
                        <p className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">
                          {plan.additionalNotes}
                        </p>
                      </div>
                    )}

                    <Separator className="my-4" />

                    <Button 
                      className="w-full justify-between"
                      onClick={() => navigate(`/saved-workout-plans/${plan.id}`)}
                    >
                      <span>View Full Plan</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default SavedWorkoutPlans;