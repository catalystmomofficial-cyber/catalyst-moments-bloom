import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Crown, 
  Users, 
  Calendar,
  Flame,
  Star,
  Heart,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { AchievementModal } from '@/components/gamification/AchievementModal';

type AchievementIcon = 'trophy' | 'crown' | 'users' | 'calendar' | 'flame' | 'star' | 'heart' | 'zap';

const iconMap: Record<AchievementIcon, LucideIcon> = {
  trophy: Trophy,
  crown: Crown,
  users: Users,
  calendar: Calendar,
  flame: Flame,
  star: Star,
  heart: Heart,
  zap: Zap,
};

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: AchievementIcon;
  earned: boolean;
  earnedDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const AchievementBadges = () => {
  const { user, profile } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    if (user && profile) {
      checkAchievements();
      
      // Set up realtime listener for challenge progress updates
      const channel = supabase
        .channel('achievement_updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_challenge_progress',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            // Refresh achievements when challenge progress updates
            checkAchievements();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, profile]);

  const checkAchievements = async () => {
    if (!user || !profile) return;

    // Check profile completion
    const isProfileComplete = !!(
      profile.display_name &&
      profile.motherhood_stage &&
      profile.motherhood_stage !== 'none' &&
      profile.bio
    );

    // Check if user has first check-in
    const { data: checkIns } = await supabase
      .from('weekly_checkins')
      .select('id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    const hasFirstCheckIn = (checkIns?.length ?? 0) > 0;
    const hasMultipleCheckIns = (checkIns?.length ?? 0) >= 3;
    const hasConsistentCheckIns = (checkIns?.length ?? 0) >= 5;

    // Check account age (early adopter = created within first month)
    const accountCreated = new Date(profile.created_at);
    const oneMonthAfterLaunch = new Date('2025-02-15'); // Adjust based on your launch date
    const isEarlyAdopter = accountCreated <= oneMonthAfterLaunch;

    // Check points level
    const { data: pointsData } = await supabase
      .from('user_points')
      .select('total_points, level')
      .eq('user_id', user.id)
      .maybeSingle();

    const totalPoints = pointsData?.total_points ?? 0;
    const userLevel = pointsData?.level ?? 1;

    // Check monthly challenge badges
    const { data: challengeBadges } = await supabase
      .from('user_challenge_progress')
      .select(`
        awarded,
        completed_at,
        challenge:monthly_challenges (
          name,
          badge_color
        )
      `)
      .eq('user_id', user.id)
      .eq('awarded', true);

    const allAchievements: Achievement[] = [
      {
        id: 'profile_complete',
        title: '100% Profile Complete',
        description: 'Completed all profile information',
        icon: 'trophy',
        earned: isProfileComplete,
        rarity: 'epic',
      },
      {
        id: 'early_adopter',
        title: 'Early Adopter',
        description: 'Joined during the launch period',
        icon: 'crown',
        earned: isEarlyAdopter,
        earnedDate: profile.created_at,
        rarity: 'legendary',
      },
      {
        id: 'community_member',
        title: 'Community Member',
        description: 'Active member of Catalyst Mom',
        icon: 'users',
        earned: true, // All registered users get this
        earnedDate: profile.created_at,
        rarity: 'common',
      },
      {
        id: 'first_steps',
        title: 'First Steps',
        description: 'Logged your first progress check-in',
        icon: 'calendar',
        earned: hasFirstCheckIn,
        earnedDate: checkIns?.[0]?.created_at,
        rarity: 'common',
      },
      {
        id: 'dedicated',
        title: 'Dedicated Tracker',
        description: 'Completed 3 weekly check-ins',
        icon: 'flame',
        earned: hasMultipleCheckIns,
        rarity: 'rare',
      },
      {
        id: 'consistency_champion',
        title: 'Consistency Champion',
        description: 'Completed 5+ weekly check-ins',
        icon: 'star',
        earned: hasConsistentCheckIns,
        rarity: 'epic',
      },
      {
        id: 'level_5',
        title: 'Rising Star',
        description: 'Reached Level 5',
        icon: 'zap',
        earned: userLevel >= 5,
        rarity: 'rare',
      },
      {
        id: 'points_500',
        title: 'Points Collector',
        description: 'Earned 500+ total points',
        icon: 'heart',
        earned: totalPoints >= 500,
        rarity: 'rare',
      },
      // Add monthly challenge badges
      ...(challengeBadges || []).map((badge: any) => ({
        id: `challenge_${badge.challenge?.name}`,
        title: badge.challenge?.name || 'Catalyst Crown',
        description: 'Limited edition monthly challenge winner',
          icon: 'crown' as const,
        earned: true,
        earnedDate: badge.completed_at,
        rarity: 'legendary' as const,
      })),
    ];

    setAchievements(allAchievements);
  };

  const earnedAchievements = useMemo(() => achievements.filter((achievement) => achievement.earned), [achievements]);
  const lockedCount = achievements.length - earnedAchievements.length;

  const getModalLevel = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'legendary':
        return 4;
      case 'epic':
        return 3;
      case 'rare':
        return 2;
      default:
        return 1;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <CardTitle>Achievement Badges</CardTitle>
            </div>
            <Badge variant="secondary">
              {earnedAchievements.length}/{achievements.length}
            </Badge>
          </div>
          <CardDescription>
            Earn badges by completing milestones and share them with the community
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {earnedAchievements.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Trophy className="mx-auto mb-3 h-10 w-10 opacity-50" />
              <p className="text-sm">Complete check-ins and milestones to unlock your first badge.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {earnedAchievements.map((achievement) => {
                const Icon = iconMap[achievement.icon] || Trophy;

                return (
                  <button
                    key={achievement.id}
                    type="button"
                    onClick={() => setSelectedAchievement(achievement)}
                    className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 text-center transition-all duration-200 hover:bg-accent/50 hover:shadow-sm active:scale-95"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="line-clamp-2 text-[11px] font-medium leading-tight">
                      {achievement.title}
                    </span>
                    {achievement.rarity !== 'common' && (
                      <Badge variant="secondary" className="h-4 px-1.5 text-[9px] capitalize">
                        {achievement.rarity}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {lockedCount > 0 && (
            <p className="text-xs text-muted-foreground">
              {lockedCount} more badge{lockedCount === 1 ? '' : 's'} still locked.
            </p>
          )}
        </CardContent>
      </Card>

      {selectedAchievement && (
        <AchievementModal
          achievement={{
            id: selectedAchievement.id,
            achievement_id: selectedAchievement.id,
            title: selectedAchievement.title,
            description: selectedAchievement.description,
            icon: selectedAchievement.icon,
            level: getModalLevel(selectedAchievement.rarity),
            earned_at: selectedAchievement.earnedDate || new Date().toISOString(),
          }}
          open={!!selectedAchievement}
          onOpenChange={(open) => {
            if (!open) setSelectedAchievement(null);
          }}
        />
      )}
    </>
  );
};
