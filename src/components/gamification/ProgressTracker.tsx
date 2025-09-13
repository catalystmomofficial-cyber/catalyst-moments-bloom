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
  const [totalPoints, setTotalPoints] = useState(() => {
    const saved = localStorage.getItem('userPoints');
    return saved ? parseInt(saved) : 0;
  });
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('userStreak');
    const lastActive = localStorage.getItem('lastActiveDate');
    const today = new Date().toDateString();
    
    // Check if user skipped a day - if so, reset streak
    if (lastActive && lastActive !== today) {
      const lastActiveDate = new Date(lastActive);
      const todayDate = new Date(today);
      const daysDiff = Math.floor((todayDate.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff > 1) {
        // Skipped a day, reset streak
        localStorage.setItem('userStreak', '0');
        return 0;
      }
    }
    
    return saved ? parseInt(saved) : 0;
  });
  const [level, setLevel] = useState(() => {
    const points = localStorage.getItem('userPoints');
    const pointsNum = points ? parseInt(points) : 0;
    return Math.floor(pointsNum / 100) + 1;
  });
  const [nextLevelPoints, setNextLevelPoints] = useState(() => {
    const points = localStorage.getItem('userPoints');
    const pointsNum = points ? parseInt(points) : 0;
    const currentLevel = Math.floor(pointsNum / 100) + 1;
    return currentLevel * 100;
  });

  // Update localStorage when points change
  useEffect(() => {
    localStorage.setItem('userPoints', totalPoints.toString());
    localStorage.setItem('userStreak', streak.toString());
    
    const newLevel = Math.floor(totalPoints / 100) + 1;
    if (newLevel !== level) {
      setLevel(newLevel);
      setNextLevelPoints(newLevel * 100);
    }
  }, [totalPoints, streak, level]);

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first workout',
      icon: <Zap className="w-4 h-4" />,
      progress: 0,
      maxProgress: 1,
      completed: false,
      points: 10
    },
    {
      id: '2',
      title: 'Consistency Champion',
      description: 'Complete 7 days in a row',
      icon: <Flame className="w-4 h-4" />,
      progress: 0,
      maxProgress: 7,
      completed: false,
      points: 25
    },
    {
      id: '3',
      title: 'Community Helper',
      description: 'Help 5 other moms with advice',
      icon: <Star className="w-4 h-4" />,
      progress: 0,
      maxProgress: 5,
      completed: false,
      points: 20
    },
    {
      id: '4',
      title: 'Nutrition Guru',
      description: 'Log meals for 14 days',
      icon: <Target className="w-4 h-4" />,
      progress: 0,
      maxProgress: 14,
      completed: false,
      points: 30
    },
    {
      id: '5',
      title: 'Wellness Warrior',
      description: 'Complete 30 wellness activities',
      icon: <Award className="w-4 h-4" />,
      progress: 0,
      maxProgress: 30,
      completed: false,
      points: 50
    }
  ];

  const weeklyGoals = [
    {
      title: 'Complete 3 workouts',
      progress: 0,
      maxProgress: 3,
      icon: '💪',
      points: 20
    },
    {
      title: 'Log meals daily',
      progress: 0,
      maxProgress: 7,
      icon: '🍎',
      points: 25
    },
    {
      title: 'Track mood 5 times',
      progress: 0,
      maxProgress: 5,
      icon: '😊',
      points: 15
    },
    {
      title: 'Connect with community',
      progress: 0,
      maxProgress: 3,
      icon: '💬',
      points: 20
    }
  ];

  // Calculate weekly points (capped at 100)
  const weeklyPoints = Math.min(
    weeklyGoals.reduce((total, goal) => {
      const completionRatio = goal.progress / goal.maxProgress;
      return total + Math.floor(completionRatio * goal.points);
    }, 0),
    100
  );

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
              <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
              <span className="text-sm font-medium">{streak} day streak</span>
              {streak > 0 && (
                <span style={{ fontSize: `${Math.min(12 + streak * 2, 24)}px` }}>🔥</span>
              )}
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
          <CardTitle className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Weekly Goals
            </div>
            <Badge variant="secondary">
              {weeklyPoints}/100 pts
            </Badge>
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