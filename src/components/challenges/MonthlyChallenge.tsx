import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Crown, Users, Target, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Challenge {
  id: string;
  name: string;
  description: string;
  target_count: number;
  max_winners: number;
  current_winners: number;
  start_date: string;
  end_date: string;
  badge_color: string;
}

interface ChallengeProgress {
  current_count: number;
  completed: boolean;
  awarded: boolean;
}

export const MonthlyChallenge = () => {
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [progress, setProgress] = useState<ChallengeProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchChallenge();
      
      // Set up realtime listener for progress updates
      const channel = supabase
        .channel('challenge_progress')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_challenge_progress',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            // Refresh challenge data when progress updates
            fetchChallenge();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchChallenge = async () => {
    if (!user) return;

    try {
      // Fetch active challenge for user's stage
      const { data: challengeData, error: challengeError } = await supabase
        .from('monthly_challenges')
        .select('*')
        .eq('is_active', true)
        .lte('start_date', new Date().toISOString())
        .gte('end_date', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (challengeError) throw challengeError;

      if (challengeData) {
        setChallenge(challengeData);

        // Fetch user's progress for this challenge
        const { data: progressData, error: progressError } = await supabase
          .from('user_challenge_progress')
          .select('current_count, completed, awarded')
          .eq('user_id', user.id)
          .eq('challenge_id', challengeData.id)
          .maybeSingle();

        if (progressError && progressError.code !== 'PGRST116') throw progressError;

        setProgress(progressData || { current_count: 0, completed: false, awarded: false });
      }
    } catch (error) {
      console.error('Error fetching challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !challenge) {
    return null;
  }

  const spotsRemaining = challenge.max_winners - challenge.current_winners;
  const progressPercentage = ((progress?.current_count || 0) / challenge.target_count) * 100;
  const isCompleted = progress?.completed || false;
  const isAwarded = progress?.awarded || false;

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${challenge.badge_color} flex items-center justify-center shadow-lg`}>
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {challenge.name}
                {isAwarded && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-amber-600 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    Earned
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>{challenge.description}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Ends {format(new Date(challenge.end_date), 'MMM dd')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Your Progress</span>
            <span className="font-semibold">
              {progress?.current_count || 0} / {challenge.target_count}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          {isCompleted && !isAwarded && (
            <p className="text-xs text-green-600 font-medium">
              ✓ Challenge completed! Badge will be awarded when challenge ends.
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50">
            <Users className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Spots Left</p>
              <p className="font-bold text-lg">{spotsRemaining}/{challenge.max_winners}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-background/50">
            <Target className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Goal</p>
              <p className="font-bold text-lg">{challenge.target_count} workouts</p>
            </div>
          </div>
        </div>

        {/* Warning */}
        {spotsRemaining <= 10 && spotsRemaining > 0 && (
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <p className="text-xs text-amber-800 dark:text-amber-200 font-medium">
              🔥 Only {spotsRemaining} spots remaining! Complete your workouts to secure your crown.
            </p>
          </div>
        )}

        {spotsRemaining === 0 && !isAwarded && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
            <p className="text-xs text-red-800 dark:text-red-200 font-medium">
              All spots have been claimed. Check back next month for a new challenge!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
