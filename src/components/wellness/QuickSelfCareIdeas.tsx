import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Timer, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWellnessData } from '@/hooks/useWellnessData';
import { useContentFilter } from '@/hooks/useContentFilter';
import { wellnessAI } from '@/services/wellnessAI';
import { useToast } from '@/hooks/use-toast';

interface SelfCareIdea {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: 'breathing' | 'movement' | 'mindfulness' | 'relaxation' | 'energy';
  instructions: string[];
  benefits: string;
  icon: string;
}

export const QuickSelfCareIdeas = () => {
  const { user } = useAuth();
  const { wellnessEntries } = useWellnessData();
  const { currentJourney, currentStage } = useContentFilter();
  const { toast } = useToast();
  
  const [selfCareIdeas, setSelfCareIdeas] = useState<SelfCareIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const generateSelfCareIdeas = async (isManualRefresh = false) => {
    if (!user) {
      setLoading(false);
      return;
    }

    const isRefresh = isManualRefresh && selfCareIdeas.length > 0;
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const latestWellness = wellnessEntries[0];
      
      const profile = {
        journey: currentJourney || 'general',
        stage: currentStage || 'general',
        moodScore: latestWellness?.mood_score || 5,
        energyLevel: latestWellness?.energy_level || 5,
        stressLevel: latestWellness?.stress_level || 5,
        sleepHours: latestWellness?.sleep_hours || 8,
        timeAvailable: '5-10 minutes',
        preferences: ['quick', 'effective', 'accessible']
      };

      const ideas = await wellnessAI.generateSelfCareIdeas(profile);
      setSelfCareIdeas(ideas);

      if (isRefresh) {
        toast({
          title: "Self-Care Ideas Updated",
          description: "Your personalized self-care suggestions have been refreshed.",
        });
      }
    } catch (error) {
      console.error('Error generating self-care ideas:', error);
      toast({
        title: "Error",
        description: "Failed to generate self-care ideas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const generationKey = [
    user?.id,
    currentJourney,
    currentStage,
    wellnessEntries[0]?.id,
    wellnessEntries[0]?.mood_score,
    wellnessEntries[0]?.energy_level,
    wellnessEntries[0]?.stress_level,
    wellnessEntries[0]?.sleep_hours,
  ].join('|');

  useEffect(() => {
    void generateSelfCareIdeas(false);
    // generationKey intentionally captures the profile fields used above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generationKey]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'breathing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'movement': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'mindfulness': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'relaxation': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      case 'energy': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'breathing': return '🫁';
      case 'movement': return '🤸‍♀️';
      case 'mindfulness': return '🧘‍♀️';
      case 'relaxation': return '😌';
      case 'energy': return '⚡';
      default: return '💚';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Generating Your Self-Care Ideas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground text-sm">
              Creating personalized ideas...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Quick Self-Care Ideas
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => void generateSelfCareIdeas(true)}
          disabled={refreshing}
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {selfCareIdeas.slice(0, 3).map((idea, index) => (
          <div key={idea.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
            <div className="rounded-full bg-primary/10 h-8 w-8 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">{getCategoryIcon(idea.category)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium truncate">{idea.title}</p>
                <Badge variant="outline" className={`text-xs ${getCategoryColor(idea.category)}`}>
                  {idea.duration}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{idea.description}</p>
              <p className="text-xs text-muted-foreground font-medium">💡 {idea.benefits}</p>
            </div>
          </div>
        ))}
        
        <div className="mt-4 p-3 rounded-lg bg-muted/20 border">
          <p className="text-xs text-muted-foreground text-center">
            🎯 These activities are personalized for your current wellness state and {currentJourney} journey.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
