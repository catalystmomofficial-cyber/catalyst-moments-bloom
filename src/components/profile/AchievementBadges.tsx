import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Crown, 
  Users, 
  Calendar,
  Flame,
  Star,
  Heart,
  Zap,
  Share2
} from 'lucide-react';
import { ShareModal } from '@/components/social/ShareModal';
import { AchievementBadge as AchievementBadgeDisplay } from '@/components/social/AchievementBadge';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  earned: boolean;
  earnedDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const AchievementBadges = () => {
  const { user, profile } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [shareModalOpen, setShareModalOpen] = useState(false);
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
        icon: Trophy,
        color: 'from-yellow-400 to-orange-500',
        earned: isProfileComplete,
        rarity: 'epic',
      },
      {
        id: 'early_adopter',
        title: 'Early Adopter',
        description: 'Joined during the launch period',
        icon: Crown,
        color: 'from-purple-400 to-pink-500',
        earned: isEarlyAdopter,
        earnedDate: profile.created_at,
        rarity: 'legendary',
      },
      {
        id: 'community_member',
        title: 'Community Member',
        description: 'Active member of Catalyst Mom',
        icon: Users,
        color: 'from-blue-400 to-cyan-500',
        earned: true, // All registered users get this
        earnedDate: profile.created_at,
        rarity: 'common',
      },
      {
        id: 'first_steps',
        title: 'First Steps',
        description: 'Logged your first progress check-in',
        icon: Calendar,
        color: 'from-green-400 to-emerald-500',
        earned: hasFirstCheckIn,
        earnedDate: checkIns?.[0]?.created_at,
        rarity: 'common',
      },
      {
        id: 'dedicated',
        title: 'Dedicated Tracker',
        description: 'Completed 3 weekly check-ins',
        icon: Flame,
        color: 'from-orange-400 to-red-500',
        earned: hasMultipleCheckIns,
        rarity: 'rare',
      },
      {
        id: 'consistency_champion',
        title: 'Consistency Champion',
        description: 'Completed 5+ weekly check-ins',
        icon: Star,
        color: 'from-yellow-300 to-amber-500',
        earned: hasConsistentCheckIns,
        rarity: 'epic',
      },
      {
        id: 'level_5',
        title: 'Rising Star',
        description: 'Reached Level 5',
        icon: Zap,
        color: 'from-indigo-400 to-purple-500',
        earned: userLevel >= 5,
        rarity: 'rare',
      },
      {
        id: 'points_500',
        title: 'Points Collector',
        description: 'Earned 500+ total points',
        icon: Heart,
        color: 'from-pink-400 to-rose-500',
        earned: totalPoints >= 500,
        rarity: 'rare',
      },
      // Add monthly challenge badges
      ...(challengeBadges || []).map((badge: any) => ({
        id: `challenge_${badge.challenge?.name}`,
        title: badge.challenge?.name || 'Catalyst Crown',
        description: 'Limited edition monthly challenge winner',
        icon: Crown,
        color: badge.challenge?.badge_color || 'from-yellow-400 to-amber-600',
        earned: true,
        earnedDate: badge.completed_at,
        rarity: 'legendary' as const,
      })),
    ];

    setAchievements(allAchievements);
  };

  const handleShareAchievement = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setShareModalOpen(true);
  };

  const earnedAchievements = achievements.filter(a => a.earned);
  const lockedAchievements = achievements.filter(a => !a.earned);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-purple-600 bg-purple-100 border-purple-300';
      case 'epic': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'rare': return 'text-blue-600 bg-blue-100 border-blue-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
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
        <CardContent className="space-y-6">
          {/* Earned Achievements */}
          {earnedAchievements.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Earned Badges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {earnedAchievements.map((achievement) => {
                  const Icon = achievement.icon;
                  
                  return (
                    <div
                      key={achievement.id}
                      className="relative group p-4 rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-sm">{achievement.title}</h4>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getRarityColor(achievement.rarity)} capitalize`}
                            >
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {achievement.description}
                          </p>
                          {achievement.earnedDate && (
                            <p className="text-xs text-muted-foreground">
                              Earned {new Date(achievement.earnedDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-3"
                        onClick={() => handleShareAchievement(achievement)}
                      >
                        <Share2 className="w-3 h-3 mr-2" />
                        Share Badge
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Locked Achievements */}
          {lockedAchievements.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">Locked Badges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lockedAchievements.map((achievement) => {
                  const Icon = achievement.icon;
                  
                  return (
                    <div
                      key={achievement.id}
                      className="p-4 rounded-lg border border-border bg-muted/30 opacity-60"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-sm text-muted-foreground">
                              {achievement.title}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              Locked
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Share Modal */}
      {selectedAchievement && (
        <ShareModal
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
          content={
            <AchievementBadgeDisplay
              achievement={{
                id: selectedAchievement.id,
                title: selectedAchievement.title,
                description: selectedAchievement.description,
                icon: selectedAchievement.id, // Use id as icon key
                date: selectedAchievement.earnedDate,
              }}
            />
          }
          shareText={`I just earned the "${selectedAchievement.title}" badge on Catalyst Mom! 🎉`}
          fileName={`catalyst-mom-${selectedAchievement.id}`}
        />
      )}
    </>
  );
};
