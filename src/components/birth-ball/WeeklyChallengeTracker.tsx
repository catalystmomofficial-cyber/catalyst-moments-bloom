import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, CheckCircle2, Trophy, Flame } from 'lucide-react';
import { toast } from 'sonner';

interface ChallengeData {
  startDate: string;
  completedDays: string[];
  currentStreak: number;
  longestStreak: number;
}

const WeeklyChallengeTracker = () => {
  const [challengeData, setChallengeData] = useState<ChallengeData>({
    startDate: new Date().toISOString().split('T')[0],
    completedDays: [],
    currentStreak: 0,
    longestStreak: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem('birthBallChallenge');
    if (saved) {
      setChallengeData(JSON.parse(saved));
    }
  }, []);

  const saveProgress = (data: ChallengeData) => {
    localStorage.setItem('birthBallChallenge', JSON.stringify(data));
    setChallengeData(data);
  };

  const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date.toISOString().split('T')[0];
    });
  };

  const weekDates = getWeekDates();
  const today = new Date().toISOString().split('T')[0];
  const todayCompleted = challengeData.completedDays.includes(today);
  const weekProgress = weekDates.filter(date => challengeData.completedDays.includes(date)).length;

  const calculateStreak = (completedDays: string[]) => {
    if (completedDays.length === 0) return 0;
    
    const sortedDays = [...completedDays].sort().reverse();
    let streak = 0;
    const todayDate = new Date();
    
    for (let i = 0; i < sortedDays.length; i++) {
      const checkDate = new Date(todayDate);
      checkDate.setDate(todayDate.getDate() - i);
      const checkDateStr = checkDate.toISOString().split('T')[0];
      
      if (sortedDays.includes(checkDateStr)) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const checkInToday = () => {
    if (todayCompleted) {
      toast.info('Already checked in today!');
      return;
    }

    const newCompletedDays = [...challengeData.completedDays, today];
    const newStreak = calculateStreak(newCompletedDays);
    const newLongestStreak = Math.max(newStreak, challengeData.longestStreak);

    saveProgress({
      ...challengeData,
      completedDays: newCompletedDays,
      currentStreak: newStreak,
      longestStreak: newLongestStreak
    });

    toast.success('Great job! Practice logged for today 🎉', {
      description: `Current streak: ${newStreak} day${newStreak !== 1 ? 's' : ''}`
    });
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Weekly Practice Challenge
            </CardTitle>
            <CardDescription className="mt-2">
              Commit to daily birth ball practice • Build consistency
            </CardDescription>
          </div>
          {challengeData.currentStreak > 0 && (
            <Badge variant="secondary" className="gap-1">
              <Flame className="h-3 w-3" />
              {challengeData.currentStreak} day streak
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Week Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">This Week</span>
              <span className="text-sm text-muted-foreground">{weekProgress}/7 days</span>
            </div>
            <Progress value={(weekProgress / 7) * 100} className="h-2" />
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, index) => {
              const isCompleted = challengeData.completedDays.includes(date);
              const isToday = date === today;
              const isPast = new Date(date) < new Date(today);

              return (
                <div
                  key={date}
                  className={`
                    aspect-square rounded-lg flex flex-col items-center justify-center text-center p-2 transition-all duration-200
                    ${isCompleted ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted'}
                    ${isToday && !isCompleted ? 'ring-2 ring-primary ring-offset-2' : ''}
                    ${isPast && !isCompleted ? 'opacity-50' : ''}
                  `}
                >
                  <div className="text-xs font-medium mb-1">{getDayName(date)}</div>
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <div className="text-xs">{new Date(date).getDate()}</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Check In Button */}
          <Button 
            onClick={checkInToday} 
            disabled={todayCompleted}
            className="w-full"
            size="lg"
          >
            {todayCompleted ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Completed Today!
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Log Today's Practice
              </>
            )}
          </Button>

          {/* Stats */}
          {challengeData.longestStreak > 0 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
              <span>Best Streak:</span>
              <span className="font-semibold text-foreground">{challengeData.longestStreak} days</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyChallengeTracker;
