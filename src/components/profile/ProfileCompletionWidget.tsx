import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Circle, 
  Award, 
  Sparkles,
  User,
  MessageSquare,
  Calendar,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ProfileCompletion {
  displayName: boolean;
  motherhoodStage: boolean;
  bio: boolean;
  firstCheckIn: boolean;
  totalPercentage: number;
}

interface ProfileMilestone {
  id: string;
  label: string;
  description: string;
  points: number;
  completed: boolean;
  icon: any;
  action?: string;
  route?: string;
}

export const ProfileCompletionWidget = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [completion, setCompletion] = useState<ProfileCompletion>({
    displayName: false,
    motherhoodStage: false,
    bio: false,
    firstCheckIn: false,
    totalPercentage: 0,
  });
  const [milestones, setMilestones] = useState<ProfileMilestone[]>([]);
  const [claimedMilestones, setClaimedMilestones] = useState<string[]>([]);

  useEffect(() => {
    if (user && profile) {
      checkCompletion();
    }
  }, [user, profile]);

  const checkCompletion = async () => {
    if (!user || !profile) return;

    // Check profile fields
    const hasDisplayName = !!profile.display_name;
    const hasMotherhoodStage = !!profile.motherhood_stage && profile.motherhood_stage !== 'none';
    const hasBio = !!profile.bio && profile.bio.trim().length > 0;

    // Check for first check-in
    const { data: checkIns } = await supabase
      .from('weekly_checkins')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    const hasFirstCheckIn = (checkIns?.length ?? 0) > 0;

    // Calculate completion percentage
    const completedFields = [hasDisplayName, hasMotherhoodStage, hasBio, hasFirstCheckIn].filter(Boolean).length;
    const totalFields = 4;
    const percentage = (completedFields / totalFields) * 100;

    setCompletion({
      displayName: hasDisplayName,
      motherhoodStage: hasMotherhoodStage,
      bio: hasBio,
      firstCheckIn: hasFirstCheckIn,
      totalPercentage: percentage,
    });

    // Define milestones
    const profileMilestones: ProfileMilestone[] = [
      {
        id: 'basic_info',
        label: 'Basic Information',
        description: 'Add your name and motherhood stage',
        points: 50,
        completed: hasDisplayName && hasMotherhoodStage,
        icon: User,
        route: '/profile',
      },
      {
        id: 'bio_complete',
        label: 'Tell Your Story',
        description: 'Add a bio to your profile',
        points: 75,
        completed: hasBio,
        icon: MessageSquare,
        route: '/profile',
      },
      {
        id: 'first_checkin',
        label: 'First Check-In',
        description: 'Track your first progress check-in',
        points: 100,
        completed: hasFirstCheckIn,
        icon: Calendar,
        route: '/progress',
      },
      {
        id: 'profile_100',
        label: '100% Profile Complete',
        description: 'Complete all profile fields',
        points: 150,
        completed: percentage === 100,
        icon: Target,
      },
    ];

    setMilestones(profileMilestones);
  };

  const handleClaimReward = async (milestone: ProfileMilestone) => {
    if (!user || !milestone.completed || claimedMilestones.includes(milestone.id)) return;

    try {
      // Award points
      const { error } = await supabase.rpc('add_user_points', {
        p_user_id: user.id,
        p_points: milestone.points,
        p_source: `milestone_${milestone.id}`,
        p_description: `${milestone.label} milestone completed!`,
      });

      if (error) throw error;

      setClaimedMilestones([...claimedMilestones, milestone.id]);

      toast({
        title: `+${milestone.points} Points Earned! 🎉`,
        description: milestone.label,
      });
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast({
        title: 'Error claiming reward',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const incompleteMilestones = milestones.filter(m => !m.completed);
  const completedMilestones = milestones.filter(m => m.completed);

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            <CardTitle>Profile Completion</CardTitle>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {Math.round(completion.totalPercentage)}%
          </Badge>
        </div>
        <CardDescription>
          Complete your profile to unlock rewards and personalized features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={completion.totalPercentage} className="h-3" />
          <p className="text-sm text-muted-foreground">
            {4 - [completion.displayName, completion.motherhoodStage, completion.bio, completion.firstCheckIn].filter(Boolean).length} tasks remaining
          </p>
        </div>

        {/* Completed Milestones */}
        {completedMilestones.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Completed Milestones
            </h3>
            <div className="space-y-2">
              {completedMilestones.map((milestone) => {
                const Icon = milestone.icon;
                const isClaimed = claimedMilestones.includes(milestone.id);
                
                return (
                  <div
                    key={milestone.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{milestone.label}</p>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        </div>
                        <p className="text-xs text-muted-foreground">{milestone.description}</p>
                      </div>
                    </div>
                    {!isClaimed && (
                      <Button
                        size="sm"
                        onClick={() => handleClaimReward(milestone)}
                        className="ml-2"
                      >
                        <Award className="w-3 h-3 mr-1" />
                        +{milestone.points}
                      </Button>
                    )}
                    {isClaimed && (
                      <Badge variant="outline" className="ml-2">
                        Claimed
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Incomplete Milestones */}
        {incompleteMilestones.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
              <Target className="w-4 h-4" />
              Available Rewards
            </h3>
            <div className="space-y-2">
              {incompleteMilestones.map((milestone) => {
                const Icon = milestone.icon;
                
                return (
                  <div
                    key={milestone.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-muted-foreground">{milestone.label}</p>
                          <Circle className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground">{milestone.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <Badge variant="outline">+{milestone.points} pts</Badge>
                      {milestone.route && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(milestone.route!)}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 100% Completion Message */}
        {completion.totalPercentage === 100 && (
          <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20 text-center">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="font-bold text-lg mb-1">Profile Complete! 🎉</p>
            <p className="text-sm text-muted-foreground">
              You've unlocked all personalized features and earned maximum rewards!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
