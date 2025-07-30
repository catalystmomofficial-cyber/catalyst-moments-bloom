import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Users, Calendar, Target, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  duration: string;
  participants: number;
  progress: number;
  maxProgress: number;
  type: 'tracking' | 'wellness' | 'education' | 'community';
  reward: string;
  enrolled: boolean;
  daysLeft: number;
}

export const TTCCommunityChallenge = () => {
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<CommunityChallenge[]>([
    {
      id: '1',
      title: '7-Day Cycle Tracking Challenge',
      description: 'Track your cycle daily for a week and learn about your fertility patterns',
      duration: '7 days',
      participants: 234,
      progress: 5,
      maxProgress: 7,
      type: 'tracking',
      reward: 'Fertility insights report',
      enrolled: true,
      daysLeft: 2
    },
    {
      id: '2',
      title: 'Stress-Free TTC Week',
      description: 'Complete daily stress-reduction activities to support your fertility journey',
      duration: '7 days',
      participants: 189,
      progress: 0,
      maxProgress: 7,
      type: 'wellness',
      reward: 'Premium meditation sessions',
      enrolled: false,
      daysLeft: 7
    },
    {
      id: '3',
      title: 'Fertility Nutrition Bootcamp',
      description: 'Learn and implement fertility-boosting nutrition habits',
      duration: '14 days',
      participants: 156,
      progress: 8,
      maxProgress: 14,
      type: 'education',
      reward: 'Personalized meal plan',
      enrolled: true,
      daysLeft: 6
    },
    {
      id: '4',
      title: 'TTC Support Circle',
      description: 'Share experiences and support other moms on their TTC journey',
      duration: '30 days',
      participants: 78,
      progress: 0,
      maxProgress: 30,
      type: 'community',
      reward: 'Community mentor badge',
      enrolled: false,
      daysLeft: 30
    }
  ]);

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'tracking': return <Calendar className="h-4 w-4" />;
      case 'wellness': return <Target className="h-4 w-4" />;
      case 'education': return <Trophy className="h-4 w-4" />;
      case 'community': return <Users className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getChallengeColor = (type: string) => {
    switch (type) {
      case 'tracking': return 'bg-blue-100 text-blue-800';
      case 'wellness': return 'bg-green-100 text-green-800';
      case 'education': return 'bg-purple-100 text-purple-800';
      case 'community': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleJoinChallenge = (challengeId: string) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, enrolled: true, participants: challenge.participants + 1 }
          : challenge
      )
    );
    
    toast({
      title: "Challenge joined!",
      description: "You're now part of this TTC community challenge. Good luck! 🌟",
    });
  };

  const handleCompleteDaily = (challengeId: string) => {
    setChallenges(prev =>
      prev.map(challenge =>
        challenge.id === challengeId
          ? { ...challenge, progress: Math.min(challenge.progress + 1, challenge.maxProgress) }
          : challenge
      )
    );

    toast({
      title: "Daily task completed!",
      description: "Great job staying consistent! 💪",
    });
  };

  const activechallenges = challenges.filter(c => c.enrolled);
  const availableChallenges = challenges.filter(c => !c.enrolled);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5" />
          TTC Community Challenges
        </CardTitle>
        <CardDescription>
          Join challenges with other moms for motivation and support
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active Challenges */}
        {activechallenges.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-sm flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
              Your Active Challenges
            </h3>
            
            {activechallenges.map((challenge) => (
              <Card key={challenge.id} className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Badge className={getChallengeColor(challenge.type)}>
                            <span className="flex items-center space-x-1">
                              {getChallengeIcon(challenge.type)}
                              <span>{challenge.type}</span>
                            </span>
                          </Badge>
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{challenge.daysLeft} days left</span>
                          </div>
                        </div>
                        <h4 className="font-medium">{challenge.title}</h4>
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{challenge.progress}/{challenge.maxProgress} days</span>
                      </div>
                      <Progress 
                        value={(challenge.progress / challenge.maxProgress) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{challenge.participants} participants</span>
                      </div>
                      
                      <Button 
                        size="sm" 
                        onClick={() => handleCompleteDaily(challenge.id)}
                        disabled={challenge.progress >= challenge.maxProgress}
                      >
                        Complete Today
                      </Button>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      🏆 Reward: {challenge.reward}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Available Challenges */}
        {availableChallenges.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-sm flex items-center">
              <Target className="mr-2 h-4 w-4 text-blue-600" />
              Available Challenges
            </h3>
            
            {availableChallenges.map((challenge) => (
              <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge className={getChallengeColor(challenge.type)}>
                            <span className="flex items-center space-x-1">
                              {getChallengeIcon(challenge.type)}
                              <span>{challenge.type}</span>
                            </span>
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {challenge.duration}
                          </Badge>
                        </div>
                        <h4 className="font-medium">{challenge.title}</h4>
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleJoinChallenge(challenge.id)}
                      >
                        Join
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Users className="h-3 w-3" />
                        <span>{challenge.participants} participants</span>
                      </div>
                      <span>🏆 {challenge.reward}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Community Stats */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-lg font-bold text-primary">1,247</div>
              <div className="text-xs text-muted-foreground">Active Members</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-green-600">89%</div>
              <div className="text-xs text-muted-foreground">Completion Rate</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-purple-600">42</div>
              <div className="text-xs text-muted-foreground">Success Stories</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};