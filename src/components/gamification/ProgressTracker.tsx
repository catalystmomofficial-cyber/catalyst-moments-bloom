import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Flame, Award, Zap } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  maxProgress: number;
  completed: boolean;
  points: number;
}

interface ProgressTrackerProps {
  userStage?: string;
}

export const ProgressTracker = ({ userStage }: ProgressTrackerProps) => {
  const [totalPoints, setTotalPoints] = useState(125);
  const [streak, setStreak] = useState(5);
  const [level, setLevel] = useState(2);
  const [nextLevelPoints, setNextLevelPoints] = useState(200);

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first workout',
      icon: <Zap className="w-4 h-4" />,
      progress: 1,
      maxProgress: 1,
      completed: true,
      points: 10
    },
    {
      id: '2',
      title: 'Consistency Champion',
      description: 'Complete 7 days in a row',
      icon: <Flame className="w-4 h-4" />,
      progress: 5,
      maxProgress: 7,
      completed: false,
      points: 25
    },
    {
      id: '3',
      title: 'Community Helper',
      description: 'Help 5 other moms with advice',
      icon: <Star className="w-4 h-4" />,
      progress: 3,
      maxProgress: 5,
      completed: false,
      points: 20
    },
    {
      id: '4',
      title: 'Nutrition Guru',
      description: 'Log meals for 14 days',
      icon: <Target className="w-4 h-4" />,
      progress: 8,
      maxProgress: 14,
      completed: false,
      points: 30
    },
    {
      id: '5',
      title: 'Wellness Warrior',
      description: 'Complete 30 wellness activities',
      icon: <Award className="w-4 h-4" />,
      progress: 12,
      maxProgress: 30,
      completed: false,
      points: 50
    }
  ];

  const weeklyGoals = [
    {
      title: 'Complete 3 workouts',
      progress: 2,
      maxProgress: 3,
      icon: '💪'
    },
    {
      title: 'Log meals daily',
      progress: 5,
      maxProgress: 7,
      icon: '🍎'
    },
    {
      title: 'Track mood 5 times',
      progress: 3,
      maxProgress: 5,
      icon: '😊'
    },
    {
      title: 'Connect with community',
      progress: 1,
      maxProgress: 3,
      icon: '💬'
    }
  ];

  const getLevelTitle = (level: number) => {
    const titles = [
      'New Mom',
      'Growing Strong',
      'Wellness Explorer',
      'Healthy Habit Builder',
      'Wellness Champion',
      'Mom Mentor'
    ];
    return titles[Math.min(level - 1, titles.length - 1)] || 'Wellness Legend';
  };

  const progressToNextLevel = (totalPoints / nextLevelPoints) * 100;

  return (
    <div className="space-y-6">
      {/* Level & Points Overview */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span>Level {level} - {getLevelTitle(level)}</span>
            </div>
            <Badge variant="secondary" className="bg-primary/20">
              {totalPoints} points
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress to Level {level + 1}</span>
              <span>{totalPoints}/{nextLevelPoints} points</span>
            </div>
            <Progress value={progressToNextLevel} className="h-3" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">{streak} day streak</span>
            </div>
            <Badge variant="outline" className="text-xs">
              Keep it up! 💪
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Weekly Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {weeklyGoals.map((goal, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{goal.icon}</span>
                  <span className="text-sm font-medium">{goal.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {goal.progress}/{goal.maxProgress}
                </span>
              </div>
              <Progress 
                value={(goal.progress / goal.maxProgress) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`p-3 rounded-lg border transition-all duration-200 ${
                achievement.completed 
                  ? 'bg-primary/5 border-primary/20' 
                  : 'bg-muted/30 border-muted'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    achievement.completed 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
                <Badge variant={achievement.completed ? "default" : "outline"} className="text-xs">
                  {achievement.points} pts
                </Badge>
              </div>
              
              {!achievement.completed && (
                <div className="ml-11">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.maxProgress}</span>
                  </div>
                  <Progress 
                    value={(achievement.progress / achievement.maxProgress) * 100} 
                    className="h-2"
                  />
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Wins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted/30 rounded-lg text-center">
              <div className="text-2xl mb-1">📝</div>
              <div className="text-xs font-medium">Log Today's Mood</div>
              <div className="text-xs text-muted-foreground">+5 points</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg text-center">
              <div className="text-2xl mb-1">💬</div>
              <div className="text-xs font-medium">Share Experience</div>
              <div className="text-xs text-muted-foreground">+10 points</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg text-center">
              <div className="text-2xl mb-1">🏃‍♀️</div>
              <div className="text-xs font-medium">Complete Workout</div>
              <div className="text-xs text-muted-foreground">+15 points</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg text-center">
              <div className="text-2xl mb-1">👥</div>
              <div className="text-xs font-medium">Help Another Mom</div>
              <div className="text-xs text-muted-foreground">+20 points</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};