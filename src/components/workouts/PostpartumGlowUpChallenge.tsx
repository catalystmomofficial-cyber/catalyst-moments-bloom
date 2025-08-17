import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Star, Play, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import glowUpCover from "@/assets/30-days-glow-up-professional-cover.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import InlineVideoPlayer from '@/components/ui/inline-video-player';

// Real-looking diverse avatar URLs for postpartum moms
const AVATARS = [
  'https://randomuser.me/api/portraits/women/20.jpg',
  'https://randomuser.me/api/portraits/women/35.jpg',
  'https://randomuser.me/api/portraits/women/52.jpg',
  'https://randomuser.me/api/portraits/women/63.jpg',
  'https://randomuser.me/api/portraits/women/17.jpg',
];

interface AnimatedCounterProps {
  target: number;
  duration?: number;
}

const AnimatedCounter = ({ target, duration = 2000 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * target);
      
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [target, duration]);

  return <span>{count}</span>;
};

const UserAvatars = ({ enrolledCount }: { enrolledCount: number }) => {
  const displayedAvatars = AVATARS.slice(0, 4);
  const remainingCount = enrolledCount - displayedAvatars.length;

  return (
    <div className="flex items-center space-x-3">
      <div className="flex -space-x-2">
        {displayedAvatars.map((avatar, index) => (
          <div
            key={avatar}
            className="relative group"
            style={{ 
              animationDelay: `${index * 200}ms`,
              animation: 'fade-in 0.6s ease-out both'
            }}
          >
            <img
              src={avatar}
              alt={`Enrolled mom ${index + 1}`}
              className="w-8 h-8 rounded-full border-2 border-background object-cover 
                       transition-transform duration-300 hover:scale-110 hover:z-10
                       shadow-sm group-hover:shadow-md"
            />
            <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 
                          group-hover:opacity-100 transition-opacity duration-300 
                          animate-pulse" />
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background 
                        flex items-center justify-center text-xs font-medium text-primary
                        transition-all duration-300 hover:bg-primary/30 hover:scale-110">
            +{remainingCount > 999 ? '999+' : remainingCount}
          </div>
        )}
      </div>
    </div>
  );
};

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
  const [enrolledCount, setEnrolledCount] = useState(245);
  const [showInlinePlayer, setShowInlinePlayer] = useState(false);
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);
  const [hasStartedProgram, setHasStartedProgram] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProgress();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setEnrolledCount(prev => prev + Math.floor(Math.random() * 2) + 1);
      }
    }, 45000);

    return () => clearInterval(interval);
  }, []);

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

      setHasStartedProgram(true);
      setShowInlinePlayer(true);
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

  const handleStartProgram = () => {
    if (isEnrolled) {
      setShowInlinePlayer(true);
      setHasStartedProgram(true);
    } else {
      enrollInChallenge();
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
              A structured 4-week program to safely rebuild strength after birth. Gentle, effective exercises designed specifically for your recovery journey.
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
            <span>15-20 min/day</span>
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

        <div className="space-y-3 mb-6">
          {[
            'Safe core strengthening exercises',
            'Gentle pelvic floor restoration', 
            'Progressive weekly challenges'
          ].map((benefit, index) => (
            <div 
              key={benefit}
              className="flex items-center text-sm group"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'fade-in 0.8s ease-out both'
              }}
            >
              <div className="w-2 h-2 bg-primary rounded-full mr-3 
                            transition-all duration-300 group-hover:scale-125 group-hover:shadow-sm
                            group-hover:shadow-primary/50" />
              <span className="transition-colors duration-300 group-hover:text-foreground">
                {benefit}
              </span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <UserAvatars enrolledCount={enrolledCount} />
          <div className="text-right">
            <div className="text-lg font-semibold text-primary">
              <AnimatedCounter target={enrolledCount} />
            </div>
            <span className="text-xs text-muted-foreground">moms enrolled</span>
          </div>
        </div>

        <Button 
          onClick={handleStartProgram}
          className="w-full"
          size="lg"
        >
          {isCompleted ? (
            <>
              <Star className="h-4 w-4 mr-2" />
              Review Challenge
            </>
          ) : hasStartedProgram || isEnrolled ? (
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
      
      <InlineVideoPlayer
        isOpen={showInlinePlayer}
        onClose={() => setShowInlinePlayer(false)}
        videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="30 Days Glow Up Challenge - Day 1"
        isMinimized={isPlayerMinimized}
        onToggleMinimize={() => setIsPlayerMinimized(!isPlayerMinimized)}
      />
    </Card>
  );
}