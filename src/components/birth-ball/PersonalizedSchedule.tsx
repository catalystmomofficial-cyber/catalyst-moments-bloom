import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, RefreshCw, Target, Sparkles, ChevronRight } from 'lucide-react';
import { birthBallExercises } from '@/data/birthBallGuideData';
import { generatePersonalizedSchedule, getMotivationalMessage, ScheduleRecommendation } from '@/utils/birthBallRecommendations';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const PersonalizedSchedule = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<ScheduleRecommendation[]>([]);
  const [motivationalMessage, setMotivationalMessage] = useState('');

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, [user, profile]);

  const loadRecommendations = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data: logs } = await supabase
        .from('birth_ball_exercise_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      // Determine user's trimester from profile or default to 2
      const userTrimester = profile?.motherhood_stage?.includes('pregnancy')
        ? 2 // Default to trimester 2 if pregnant
        : null;

      const schedule = generatePersonalizedSchedule(
        birthBallExercises,
        userTrimester,
        logs || []
      );
      
      setRecommendations(schedule);
      setMotivationalMessage(getMotivationalMessage(logs || []));
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseClick = (exerciseId: string) => {
    const exercise = birthBallExercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      navigate(`/birth-ball/exercise/${exercise.trimester}/${exerciseId}`);
    }
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-primary text-primary-foreground';
      case 'medium': return 'bg-secondary text-secondary-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityLabel = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'Recommended';
      case 'medium': return 'Suggested';
      case 'low': return 'Optional';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Loading your personalized schedule...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle>Your Personalized Practice Schedule</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={loadRecommendations}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Motivational Message */}
        <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
          <Target className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium text-foreground">{motivationalMessage}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Today's schedule is designed based on your trimester and practice history.
            </p>
          </div>
        </div>

        {/* Today's Schedule */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-semibold text-foreground">Today's Recommendations</h3>
            <Badge variant="secondary" className="ml-auto">
              {recommendations.length} exercises
            </Badge>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="cursor-pointer hover:border-primary/50 transition-all"
                  onClick={() => handleExerciseClick(rec.exercise.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">
                            {rec.exercise.name}
                          </h4>
                          <Badge className={getPriorityColor(rec.priority)}>
                            {getPriorityLabel(rec.priority)}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {rec.reason}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{rec.exercise.duration} min</span>
                          <span>•</span>
                          <span className="capitalize">{rec.exercise.category}</span>
                          {rec.exercise.trimester && (
                            <>
                              <span>•</span>
                              <span>Trimester {rec.exercise.trimester}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Helpful Tip */}
        <div className="p-4 bg-muted/50 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Tip:</strong> Try to complete at least the high-priority exercises. 
            The schedule adapts based on what you practice, so it gets smarter over time!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
