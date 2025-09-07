import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWellnessData } from '@/hooks/useWellnessData';
import { useContentFilter } from '@/hooks/useContentFilter';
import { wellnessAI } from '@/services/wellnessAI';
import { useToast } from '@/hooks/use-toast';

interface PersonalizedRecommendation {
  id: string;
  type: 'nutrition' | 'exercise' | 'mindfulness' | 'self-care' | 'sleep';
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
  timeframe: string;
  category: string;
  icon: string;
}

export const PersonalizedRecommendations = () => {
  const { user } = useAuth();
  const { wellnessEntries, workoutSessions } = useWellnessData();
  const { currentJourney, currentStage } = useContentFilter();
  const { toast } = useToast();
  
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const generateRecommendations = async () => {
    if (!user) return;

    const isRefresh = recommendations.length > 0;
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const latestWellness = wellnessEntries[0];
      const recentWorkouts = workoutSessions.slice(0, 3);

      const profile = {
        journey: currentJourney || 'general',
        stage: currentStage || 'general',
        moodScore: latestWellness?.mood_score || 5,
        energyLevel: latestWellness?.energy_level || 5,
        stressLevel: latestWellness?.stress_level || 5,
        sleepHours: latestWellness?.sleep_hours || 8,
        hydrationGlasses: latestWellness?.hydration_glasses || 0,
        selfCareCompleted: latestWellness?.self_care_completed || false,
        recentActivities: recentWorkouts.map(w => w.workout_type),
        preferences: [] // Could be expanded later
      };

      const [newRecommendations, newInsights] = await Promise.all([
        wellnessAI.generatePersonalizedRecommendations(profile),
        wellnessAI.generateDynamicInsights(profile)
      ]);

      setRecommendations(newRecommendations);
      setInsights(newInsights);

      if (isRefresh) {
        toast({
          title: "Recommendations Updated",
          description: "Your personalized recommendations have been refreshed based on your latest data.",
        });
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to generate personalized recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    generateRecommendations();
  }, [user, wellnessEntries, currentJourney, currentStage]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      case 'low': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'nutrition': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'exercise': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'mindfulness': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'self-care': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      case 'sleep': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Generating Your Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">
              Analyzing your wellness data and journey...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dynamic Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Your Wellness Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.map((insight, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/50 border-l-4 border-primary">
                  <p className="text-sm font-medium">
                    {/* Make AI talk conversationally */}
                    {insight.includes('Hydration') && insight.includes('60%') 
                      ? 'Hydration at 60%-dance break, +5 points!' 
                      : insight.includes('mood') 
                      ? `Mood tracker noticed something - ${insight.toLowerCase()}, here's what might help!`
                      : insight.includes('energy')
                      ? `Energy levels looking ${insight.includes('high') ? 'amazing' : 'low'} - ${insight.toLowerCase()}, let's boost it!`
                      : insight.includes('stress')
                      ? `Stress hitting ${insight.includes('high') ? 'hard' : 'light'} today - ${insight.toLowerCase()}, quick fix coming up!`
                      : insight.includes('sleep')
                      ? `Sleep game ${insight.includes('good') ? 'strong' : 'needs work'} - ${insight.toLowerCase()}, let's optimize!`
                      : `${insight} - let's make it happen, +points incoming!`}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personalized Recommendations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Your Personalized Recommendations
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={generateRecommendations}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="p-4 rounded-lg border bg-card">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{rec.icon}</span>
                    <h3 className="font-semibold">{rec.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority}
                    </Badge>
                    <Badge variant="outline" className={getTypeColor(rec.type)}>
                      {rec.category}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-3">{rec.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Time:</span> {rec.timeframe} • 
                    <span className="font-medium ml-1">Why:</span> {rec.reasoning}
                  </div>
                  <Button size="sm" variant="outline">
                    {rec.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 rounded-lg bg-muted/30 border">
            <p className="text-sm text-muted-foreground text-center">
              💡 These recommendations are personalized based on your current wellness data, 
              journey stage ({currentJourney} - {currentStage}), and recent activities. 
              They update automatically as you log new data.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};