import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWellnessData } from '@/hooks/useWellnessData';
import { useContentFilter } from '@/hooks/useContentFilter';
import { useAssessmentData } from '@/hooks/useAssessmentData';
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
  const { assessmentData, scoreNumber: assessmentScore } = useAssessmentData();
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
        journey: currentJourney || (assessmentData?.stage as string) || 'general',
        stage: currentStage || (assessmentData?.stage as string) || 'general',
        moodScore: latestWellness?.mood_score || 5,
        energyLevel: latestWellness?.energy_level || 5,
        stressLevel: latestWellness?.stress_level || 5,
        sleepHours: latestWellness?.sleep_hours || 8,
        hydrationGlasses: latestWellness?.hydration_glasses || 0,
        selfCareCompleted: latestWellness?.self_care_completed || false,
        recentActivities: recentWorkouts.map(w => w.workout_type),
        preferences: [
          assessmentData?.primary_goal && `goal:${assessmentData.primary_goal}`,
          assessmentData?.biggest_obstacle && `obstacle:${assessmentData.biggest_obstacle}`,
          assessmentData?.birth_experience && `birth:${assessmentData.birth_experience}`,
          assessmentData?.tier && `tier:${assessmentData.tier}`,
          assessmentScore !== null && `baseline_score:${assessmentScore}`,
        ].filter(Boolean) as string[],
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
  }, [user, wellnessEntries, currentJourney, currentStage, assessmentData]);

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
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Sparkles className="h-5 w-5 flex-shrink-0" />
              <span className="break-words">Your Wellness Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.map((insight, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/50 border-l-4 border-primary">
                  <p className="text-sm font-medium break-words">
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
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 space-y-0">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg min-w-0">
            <Sparkles className="h-5 w-5 flex-shrink-0" />
            <span className="break-words">Your Personalized Recommendations</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={generateRecommendations}
            disabled={refreshing}
            className="self-start sm:self-auto gap-2 flex-shrink-0"
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
          {assessmentData?.biggest_obstacle && (
            <div className="mb-4 p-4 rounded-lg border-l-4 border-primary bg-primary/5">
              <div className="flex items-start gap-2 mb-1">
                <Badge className="bg-destructive text-destructive-foreground">Priority Gap</Badge>
                {assessmentData?.tier && (
                  <Badge variant="outline" className="capitalize">{String(assessmentData.tier)} tier</Badge>
                )}
              </div>
              <h3 className="font-semibold mt-2 break-words">
                Focus area: {String(assessmentData.biggest_obstacle)}
              </h3>
              {assessmentData?.primary_goal && (
                <p className="text-sm text-muted-foreground mt-1 break-words">
                  Aligned with your goal: <span className="font-medium text-foreground">{String(assessmentData.primary_goal)}</span>
                </p>
              )}
            </div>
          )}
          <div className="space-y-4">
            {recommendations.map((rec) => {
              // Icon may come back as a name string (e.g. "water-outline") instead of an emoji.
              // Only render single-glyph emoji-like values; otherwise show a neutral dot.
              const isEmoji = typeof rec.icon === 'string' && rec.icon.length <= 4 && !/[a-zA-Z-]/.test(rec.icon);
              // Action labels are sometimes long sentences from the AI. Keep button readable.
              const actionLabel = (rec.action || 'Start').trim();
              const shortAction = actionLabel.length > 24 ? actionLabel.slice(0, 22).trimEnd() + '…' : actionLabel;

              return (
                <div key={rec.id} className="p-4 rounded-lg border bg-card overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      {isEmoji ? (
                        <span className="text-2xl flex-shrink-0 leading-none">{rec.icon}</span>
                      ) : (
                        <span className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" aria-hidden />
                      )}
                      <h3 className="font-semibold break-words min-w-0 text-base sm:text-lg leading-snug">
                        {rec.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:flex-shrink-0">
                      <Badge className={getPriorityColor(rec.priority)}>{rec.priority}</Badge>
                      <Badge variant="outline" className={getTypeColor(rec.type)}>{rec.category}</Badge>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-3 text-sm sm:text-base break-words">{rec.description}</p>

                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                    <div className="text-sm text-muted-foreground space-y-1 min-w-0 flex-1">
                      <div className="break-words">
                        <span className="font-medium text-foreground">Time:</span> {rec.timeframe}
                      </div>
                      <div className="break-words">
                        <span className="font-medium text-foreground">Why:</span> {rec.reasoning}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full sm:w-auto sm:flex-shrink-0 sm:max-w-[180px] truncate"
                      title={actionLabel}
                    >
                      {shortAction}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-muted/30 border">
            <p className="text-xs sm:text-sm text-muted-foreground text-center break-words">
              💡 Personalized for your {currentJourney || 'wellness'} journey
              {currentStage ? ` (${currentStage})` : ''}. Updates as you log new data.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};