import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Star, Play, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import glowUpCover from "@/assets/30-days-glow-up-cover.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface UserProgress {
  current_week: number;
  current_day: number;
  started_at: string;
  completed_at?: string;
}

export default function PostpartumGlowUpChallenge() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProgress();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserProgress = async () => {
    if (!user) return;

    try {
      // First get the course ID
      const { data: courses, error: courseError } = await supabase
        .from('courses')
        .select('id')
        .eq('title', '30 Days Glow Up Challenge')
        .single();

      if (courseError) throw courseError;

      // Then get user progress
      const { data, error } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courses.id)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setUserProgress(data);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const enrollInChallenge = async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to join the challenge",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get course ID
      const { data: courses, error: courseError } = await supabase
        .from('courses')
        .select('id')
        .eq('title', '30 Days Glow Up Challenge')
        .single();

      if (courseError) throw courseError;

      const { error } = await supabase
        .from('user_course_progress')
        .insert({
          user_id: user.id,
          course_id: courses.id,
          current_week: 1,
          current_day: 1,
        });

      if (error) throw error;

      toast({
        title: "Welcome to the Challenge!",
        description: "You've successfully joined the 30 Days Glow Up Challenge",
      });

      fetchUserProgress();
    } catch (error) {
      console.error('Error enrolling in challenge:', error);
      toast({
        title: "Enrollment Failed",
        description: "Failed to join the challenge. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isEnrolled = !!userProgress;
  const isCompleted = userProgress?.completed_at;
  const totalDays = 28; // 4 weeks * 7 days
  const currentDay = userProgress ? (userProgress.current_week - 1) * 7 + userProgress.current_day : 0;
  const progressPercentage = isCompleted ? 100 : (currentDay / totalDays) * 100;

  const weekTitles = [
    "Foundation Week",
    "Strength Week", 
    "Energy Week",
    "Glow Week"
  ];

  const currentWeekTitle = userProgress ? weekTitles[userProgress.current_week - 1] : weekTitles[0];

  if (loading) {
    return (
      <Card className="overflow-hidden animate-pulse">
        <div className="h-48 bg-muted"></div>
        <CardHeader>
          <div className="h-6 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-primary/20 shadow-lg">
      <div className="relative h-48 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
        <img 
          src={glowUpCover}
          alt="30 Days Glow Up Challenge - Empowering postpartum fitness journey"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/20 text-white border-white/30">
            Featured Challenge
          </Badge>
        </div>
        {isCompleted && (
          <div className="absolute top-4 right-4">
            <Star className="h-6 w-6 text-yellow-300 fill-current" />
          </div>
        )}
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-2xl font-bold">30 Days Glow Up</h3>
          <p className="text-white/90">Transform your postpartum journey</p>
        </div>
      </div>

      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl mb-2">
              30 Days Glow Up Challenge
            </CardTitle>
            <CardDescription>
              A comprehensive 4-week program designed specifically for postpartum recovery and confidence building
            </CardDescription>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Postpartum
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Beginner
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            4 Weeks
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>4 weeks program</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>15-30 min daily</span>
          </div>
        </div>

        {isEnrolled && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Your Progress</span>
              <span className="text-muted-foreground">
                {isCompleted ? 'Challenge Completed! 🎉' : `${currentWeekTitle} - Day ${userProgress?.current_day}`}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="text-xs text-muted-foreground">
              {isCompleted ? 'Congratulations on completing the challenge!' : `${currentDay} of ${totalDays} days completed`}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-medium text-sm">What's Included:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Week 1: Foundation & gentle movement</li>
            <li>• Week 2: Strength training & core recovery</li>
            <li>• Week 3: Energy boosting & metabolism</li>
            <li>• Week 4: Full body glow up transformation</li>
          </ul>
        </div>

        <Button 
          onClick={isEnrolled ? () => window.location.href = '/courses' : enrollInChallenge}
          className="w-full"
          size="lg"
        >
          {isCompleted ? (
            <>
              <Star className="h-4 w-4 mr-2" />
              Review Challenge
            </>
          ) : isEnrolled ? (
            <>
              <Play className="h-4 w-4 mr-2" />
              Continue Challenge
            </>
          ) : (
            <>
              <ArrowRight className="h-4 w-4 mr-2" />
              Start Your Glow Up
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}