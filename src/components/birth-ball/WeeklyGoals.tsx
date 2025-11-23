import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Flame, Award } from 'lucide-react';

interface WeeklyGoal {
  id: string;
  label: string;
  target: number;
  current: number;
  unit: string;
  icon: typeof Trophy;
}

const TRIMESTER_GOALS = {
  1: [
    { id: 'sessions', label: 'Practice Sessions', target: 3, unit: 'sessions', icon: Target },
    { id: 'minutes', label: 'Total Minutes', target: 30, unit: 'min', icon: Flame },
    { id: 'variety', label: 'Different Exercises', target: 5, unit: 'exercises', icon: Award },
  ],
  2: [
    { id: 'sessions', label: 'Practice Sessions', target: 4, unit: 'sessions', icon: Target },
    { id: 'minutes', label: 'Total Minutes', target: 45, unit: 'min', icon: Flame },
    { id: 'variety', label: 'Different Exercises', target: 6, unit: 'exercises', icon: Award },
  ],
  3: [
    { id: 'sessions', label: 'Practice Sessions', target: 5, unit: 'sessions', icon: Target },
    { id: 'minutes', label: 'Total Minutes', target: 60, unit: 'min', icon: Flame },
    { id: 'variety', label: 'Different Exercises', target: 7, unit: 'exercises', icon: Award },
  ],
};

export const WeeklyGoals = () => {
  const { user, profile } = useAuth();
  const [goals, setGoals] = useState<WeeklyGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekStreak, setWeekStreak] = useState(0);

  useEffect(() => {
    if (user) {
      loadWeeklyProgress();
    }
  }, [user, profile]);

  const getWeekStart = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day;
    const weekStart = new Date(now.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  };

  const loadWeeklyProgress = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const weekStart = getWeekStart();
      
      const { data: logs } = await supabase
        .from('birth_ball_exercise_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_at', weekStart.toISOString());

      // Determine user's trimester
      const userTrimester = profile?.motherhood_stage?.includes('pregnancy') ? 2 : 2;
      const trimesterGoals = TRIMESTER_GOALS[userTrimester as 1 | 2 | 3] || TRIMESTER_GOALS[2];

      // Calculate current progress
      const uniqueSessions = new Set(logs?.map(l => l.session_id) || []).size;
      const totalMinutes = Math.round((logs?.reduce((sum, l) => sum + (l.duration_seconds || 0), 0) || 0) / 60);
      const uniqueExercises = new Set(logs?.map(l => l.exercise_id) || []).size;

      const progress = trimesterGoals.map(goal => ({
        ...goal,
        current: goal.id === 'sessions' ? uniqueSessions :
                 goal.id === 'minutes' ? totalMinutes :
                 uniqueExercises
      }));

      setGoals(progress);

      // Check if all goals are complete and award badge
      const allComplete = progress.every(g => g.current >= g.target);
      if (allComplete) {
        await checkAndAwardBadge();
      }

      // Calculate week streak
      const { data: allLogs } = await supabase
        .from('birth_ball_exercise_logs')
        .select('completed_at')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (allLogs && allLogs.length > 0) {
        let streak = 0;
        const today = new Date();
        let currentWeekStart = getWeekStart();
        
        for (let i = 0; i < 52; i++) {
          const weekEnd = new Date(currentWeekStart);
          weekEnd.setDate(weekEnd.getDate() + 7);
          
          const hasActivity = allLogs.some(log => {
            const logDate = new Date(log.completed_at);
            return logDate >= currentWeekStart && logDate < weekEnd;
          });

          if (hasActivity) {
            streak++;
            currentWeekStart.setDate(currentWeekStart.getDate() - 7);
          } else {
            break;
          }
        }
        
        setWeekStreak(streak);
      }
    } catch (error) {
      console.error('Error loading weekly progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAndAwardBadge = async () => {
    if (!user) return;

    try {
      // Get previous weeks' completions to determine streak
      const { data: previousWeeks, error } = await supabase
        .from('birth_ball_exercise_logs')
        .select('completed_at')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(1000);

      if (error) throw error;

      // Count consecutive weeks with activity
      let consecutiveWeeks = 0;
      let currentWeekStart = getWeekStart();
      
      for (let i = 0; i < 12; i++) {
        const weekEnd = new Date(currentWeekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        
        const hasActivity = previousWeeks?.some(log => {
          const logDate = new Date(log.completed_at);
          return logDate >= currentWeekStart && logDate < weekEnd;
        });

        if (hasActivity) {
          consecutiveWeeks++;
          currentWeekStart.setDate(currentWeekStart.getDate() - 7);
        } else {
          break;
        }
      }

      // Award badges based on consecutive weeks
      const badges = [
        { weeks: 1, id: 'first_week', title: 'First Week Champion', description: 'Completed your first weekly goal!', icon: 'target' },
        { weeks: 2, id: 'two_week_streak', title: 'Two Week Warrior', description: 'Completed goals for 2 consecutive weeks', icon: 'flame' },
        { weeks: 4, id: 'monthly_master', title: 'Monthly Master', description: 'Completed goals for 4 consecutive weeks', icon: 'star' },
        { weeks: 8, id: 'consistency_champion', title: 'Consistency Champion', description: 'Completed goals for 8 consecutive weeks', icon: 'award' },
        { weeks: 12, id: 'dedication_legend', title: 'Dedication Legend', description: 'Completed goals for 12 consecutive weeks!', icon: 'crown', level: 2 },
      ];

      for (const badge of badges) {
        if (consecutiveWeeks >= badge.weeks) {
          // Check if already awarded
          const { data: existing } = await supabase
            .from('user_achievements')
            .select('id')
            .eq('user_id', user.id)
            .eq('achievement_id', badge.id)
            .single();

          if (!existing) {
            await supabase.from('user_achievements').insert({
              user_id: user.id,
              achievement_id: badge.id,
              title: badge.title,
              description: badge.description,
              icon: badge.icon,
              level: badge.level || 1,
            });

            // Create notification
            await supabase.from('notifications').insert({
              user_id: user.id,
              type: 'achievement',
              title: 'New Achievement Unlocked! 🏆',
              message: `You earned the "${badge.title}" badge!`,
              action_url: '/birth-ball-guide',
            });
          }
        }
      }
    } catch (error) {
      console.error('Error checking badges:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Loading your weekly goals...</div>
        </CardContent>
      </Card>
    );
  }

  const allGoalsComplete = goals.every(g => g.current >= g.target);

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <CardTitle>This Week's Goals</CardTitle>
          </div>
          {weekStreak > 0 && (
            <Badge variant="secondary" className="gap-1">
              <Flame className="w-3 h-3" />
              {weekStreak} week streak
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {allGoalsComplete && (
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-center">
            <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-semibold text-foreground">Amazing! All goals completed! 🎉</p>
            <p className="text-sm text-muted-foreground mt-1">
              You've crushed this week's milestones
            </p>
          </div>
        )}

        <div className="space-y-4">
          {goals.map((goal) => {
            const Icon = goal.icon;
            const progress = Math.min((goal.current / goal.target) * 100, 100);
            const isComplete = goal.current >= goal.target;

            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isComplete ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="font-medium text-sm text-foreground">{goal.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${isComplete ? 'text-primary' : 'text-foreground'}`}>
                      {goal.current}/{goal.target} {goal.unit}
                    </span>
                    {isComplete && (
                      <Badge variant="default" className="text-xs">
                        ✓
                      </Badge>
                    )}
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Goals are personalized based on your trimester and reset weekly
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
