import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trophy, Star, Coins, Gift, TrendingUp } from 'lucide-react';
import { usePointsSystem } from '@/hooks/usePointsSystem';

export const PointsDisplay = () => {
  const { userPoints, transactions, loading, getDiscountInfo } = usePointsSystem();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userPoints) {
    return null;
  }

  const nextLevelPoints = userPoints.level * 100;
  const progressToNextLevel = ((userPoints.total_points % 100) / 100) * 100;
  const { discountPercentage, pointsNeeded } = getDiscountInfo(userPoints.total_points);

  const getLevelTitle = (level: number) => {
    const titles = [
      'Newcomer',
      'Rising Star', 
      'Wellness Explorer',
      'Health Enthusiast',
      'Fitness Champion',
      'Community Leader',
      'Wellness Guru'
    ];
    return titles[Math.min(level - 1, titles.length - 1)] || 'Wellness Legend';
  };

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span>Level {userPoints.level} - {getLevelTitle(userPoints.level)}</span>
            </div>
            <Badge variant="secondary" className="bg-primary/20">
              <Coins className="w-3 h-3 mr-1" />
              {userPoints.total_points} points
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress to Level {userPoints.level + 1}</span>
              <span>{userPoints.total_points % 100}/100 points</span>
            </div>
            <Progress value={progressToNextLevel} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Redemption Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Redeem Points
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Course Discount</span>
              <Badge variant="outline" className="text-primary">
                Up to 30% OFF
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Use points to get discounts on premium courses. Every 10 points = 1% discount.
            </p>
            {userPoints.total_points >= 10 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Available discount: {discountPercentage}% ({pointsNeeded} points)
                </p>
                <Button size="sm" className="w-full">
                  <Gift className="w-4 h-4 mr-2" />
                  Apply Discount
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Need {10 - userPoints.total_points} more points for first discount
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* How to Earn Points */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Earn More Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted/30 rounded-lg text-center">
              <div className="text-2xl mb-1">🏃‍♀️</div>
              <div className="text-xs font-medium">Complete Workout</div>
              <div className="text-xs text-muted-foreground">+15 points</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg text-center">
              <div className="text-2xl mb-1">💬</div>
              <div className="text-xs font-medium">Community Post</div>
              <div className="text-xs text-muted-foreground">+10 points</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg text-center">
              <div className="text-2xl mb-1">❤️</div>
              <div className="text-xs font-medium">Like/Comment</div>
              <div className="text-xs text-muted-foreground">+5 points</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg text-center">
              <div className="text-2xl mb-1">📚</div>
              <div className="text-xs font-medium">Complete Course</div>
              <div className="text-xs text-muted-foreground">+50 points</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction, index) => (
                <div key={transaction.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.transaction_type === 'earned' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.transaction_type === 'earned' ? '+' : '-'}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {transaction.description || transaction.source}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={transaction.transaction_type === 'earned' ? 'default' : 'secondary'}>
                      {transaction.transaction_type === 'earned' ? '+' : '-'}{Math.abs(transaction.points)} pts
                    </Badge>
                  </div>
                  {index < 4 && <Separator className="mt-3" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};