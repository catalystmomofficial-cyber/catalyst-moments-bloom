import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Flame, Star, Crown, Target } from 'lucide-react';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { toast } from 'sonner';
import { AchievementModal } from '@/components/gamification/AchievementModal';

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
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    if (user) loadAchievements();
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

      if (previousCount > 0 && newAchievements.length > previousCount) {
        vibrate('success');
        playSound('achievement');
        toast.success(`🏆 Achievement Unlocked: "${newAchievements[0].title}"`);
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
    <>
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
          <div className="grid gap-3 grid-cols-3 sm:grid-cols-4">
            {achievements.map((achievement) => {
              const Icon = iconMap[achievement.icon] || Trophy;
              return (
                <button
                  key={achievement.id}
                  onClick={() => {
                    vibrate('light');
                    playSound('click');
                    setSelectedAchievement(achievement);
                  }}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border bg-card hover:bg-accent/50 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <div className="p-2.5 rounded-full bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[11px] font-medium text-center leading-tight line-clamp-2">
                    {achievement.title}
                  </span>
                  {achievement.level > 1 && (
                    <Badge variant="outline" className="text-[9px] px-1 h-4">
                      Lv.{achievement.level}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <AchievementModal
        achievement={selectedAchievement}
        open={!!selectedAchievement}
        onOpenChange={(open) => !open && setSelectedAchievement(null)}
      />
    </>
  );
};
