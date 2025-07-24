import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Activity, TrendingUp, Target, Calendar } from 'lucide-react';
import { useWellnessData } from '@/hooks/useWellnessData';
import { Link } from 'react-router-dom';

export const WeeklyProgress = () => {
  const { workoutSessions, weeklyWorkoutProgress, weeklyWorkoutGoal, loading } = useWellnessData();
  
  const completedWorkouts = workoutSessions.length;
  const totalMinutesThisWeek = workoutSessions.reduce((sum, session) => sum + session.duration_minutes, 0);
  const averageIntensity = workoutSessions.length > 0 
    ? workoutSessions.reduce((sum, session) => sum + session.intensity_level, 0) / workoutSessions.length
    : 0;

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Weekly Workout Progress
        </CardTitle>
        <CardDescription>
          Your fitness journey this week
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Weekly Goal</span>
            <span className="text-lg font-bold">{completedWorkouts}/{weeklyWorkoutGoal}</span>
          </div>
          <Progress value={weeklyWorkoutProgress} className="h-3" />
          <p className="text-xs text-muted-foreground">
            {weeklyWorkoutProgress.toFixed(0)}% of your weekly goal completed
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div className="text-lg font-bold">{totalMinutesThisWeek}</div>
            <div className="text-xs text-muted-foreground">Total Minutes</div>
          </div>
          
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-lg font-bold">{averageIntensity.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">Avg Intensity</div>
          </div>
        </div>

        {/* Recent Workouts */}
        {workoutSessions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Workouts</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {workoutSessions.slice(0, 3).map((session) => (
                <div key={session.id} className="flex items-center justify-between text-xs p-2 bg-muted/20 rounded">
                  <span className="font-medium">{session.workout_type}</span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>{session.duration_minutes}min</span>
                    <Target className="h-3 w-3" />
                    <span>{session.intensity_level}/10</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button 
          variant={completedWorkouts >= weeklyWorkoutGoal ? "outline" : "default"}
          className="w-full" 
          asChild
        >
          <Link to="/workouts">
            {completedWorkouts >= weeklyWorkoutGoal ? "Goal Achieved! 🎉" : "Start Workout"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};