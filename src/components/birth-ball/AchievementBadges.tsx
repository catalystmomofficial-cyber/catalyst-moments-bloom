import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Flame, Star, Crown, Target } from 'lucide-react';
import { format } from 'date-fns';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { toast } from '@/hooks/use-toast';

interface Achievement {
  id: string;
  achievement_id: string;
  title: string;
  description: string;
  icon: string;
  level: number;
  earned_at: string;
}

const iconMap: Record<string, typeof Trophy> = {
  trophy: Trophy,
  award: Award,
  flame: Flame,
  star: Star,
  crown: Crown,
  target: Target,
};

export const AchievementBadges = () => {
  const { user } = useAuth();
  const { vibrate } = useHapticFeedback();
  const { playSound } = useSoundEffects();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [previousCount, setPreviousCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadAchievements();
    }
  }, [user]);

  const loadAchievements = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;

      const newAchievements = data || [];
      
      // Check if new achievement was earned
      if (previousCount > 0 && newAchievements.length > previousCount) {
        const latestAchievement = newAchievements[0];
        
        // Play celebration feedback
        vibrate('success');
        playSound('achievement');
        
        toast({
          title: '🏆 Achievement Unlocked!',
          description: `You earned "${latestAchievement.title}"`,
        });
      }

      setAchievements(newAchievements);
      setPreviousCount(newAchievements.length);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Loading achievements...</div>
        </CardContent>
      </Card>
    );
  }

  if (achievements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <CardTitle>Your Achievements</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-2">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
            <p className="text-muted-foreground">
              Complete weekly goals to earn your first badge!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <CardTitle>Your Achievements</CardTitle>
          </div>
          <Badge variant="secondary">{achievements.length} earned</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {achievements.map((achievement) => {
            const Icon = iconMap[achievement.icon] || Trophy;
            
            return (
              <div
                key={achievement.id}
                className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-300 hover:scale-105 animate-fade-in cursor-pointer"
                onClick={() => {
                  vibrate('light');
                  playSound('click');
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    vibrate('light');
                    playSound('click');
                  }
                }}
              >
                <div className="p-2 rounded-full bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm">{achievement.title}</h4>
                    {achievement.level > 1 && (
                      <Badge variant="outline" className="text-xs">
                        Level {achievement.level}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {achievement.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Earned {format(new Date(achievement.earned_at), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
