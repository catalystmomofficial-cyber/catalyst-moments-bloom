import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Star, Play, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useVideoPlayer } from '@/contexts/VideoPlayerContext';

const AVATARS = [
  'https://randomuser.me/api/portraits/women/22.jpg',
  'https://randomuser.me/api/portraits/women/41.jpg',
  'https://randomuser.me/api/portraits/women/55.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/women/12.jpg',
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
      setCount(Math.floor(easeOutQuart * target));
      if (progress < 1) requestAnimationFrame(animate);
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
              alt={`Healing mama ${index + 1}`}
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

interface LocalProgress {
  current_week: number;
  current_day: number;
  started_at: string;
  completed_at?: string;
}

const STORAGE_KEY = 'core-restore-foundations-progress';

export default function CoreRestoreFoundationsCard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { openVideo } = useVideoPlayer();
  const [userProgress, setUserProgress] = useState<LocalProgress | null>(null);
  const [enrolledCount, setEnrolledCount] = useState(189);
  const [hasStartedProgram, setHasStartedProgram] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUserProgress(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setEnrolledCount(prev => prev + Math.floor(Math.random() * 2) + 1);
      }
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const enrollInProgram = () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to begin your foundation",
        variant: "destructive",
      });
      return;
    }

    const fresh: LocalProgress = {
      current_week: 1,
      current_day: 1,
      started_at: new Date().toISOString(),
    };
    setUserProgress(fresh);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));

    toast({
      title: "Welcome, Mama 💛",
      description: "You've started Core Restore Foundations — Week 1, Day 1",
    });

    setHasStartedProgram(true);
    openVideo("https://www.youtube.com/embed/ScNNfyq3d_w", "Core Restore Foundations — Week 1");
  };

  const handleStartProgram = () => {
    if (isEnrolled) {
      setHasStartedProgram(true);
      openVideo("https://www.youtube.com/embed/ScNNfyq3d_w", "Core Restore Foundations");
    } else {
      enrollInProgram();
    }
  };

  const isEnrolled = !!userProgress;
  const isCompleted = !!userProgress?.completed_at;
  const totalDays = 28; // 4 weeks * 7 days
  const currentDay = userProgress ? (userProgress.current_week - 1) * 7 + userProgress.current_day : 0;
  const progressPercentage = isCompleted ? 100 : (currentDay / totalDays) * 100;

  const weekTitles = [
    "Foundation Week",
    "Activation Week",
    "Connection Week",
    "Restoration Week",
  ];

  const currentWeekTitle = userProgress ? weekTitles[userProgress.current_week - 1] : weekTitles[0];

  return (
    <Card className="overflow-hidden border-primary/20 shadow-lg relative">
      <div className="relative h-48 bg-gradient-to-br from-amber-700 via-orange-600 to-rose-500">
        <img
          src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=400&fit=crop"
          alt="Core Restore Foundations - Safe postpartum healing"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/20 text-white border-white/30">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Featured Program
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge className="bg-background/90 text-foreground border border-primary/30 shadow-sm backdrop-blur-sm">
            <Lock className="h-3 w-3 mr-1 text-primary" />
            Coming Soon
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-2xl font-bold">Core Restore Foundations</h3>
          <p className="text-white/90">Safely close abdominal separation &amp; heal your floor</p>
        </div>
      </div>

      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl mb-2">
              Core Restore Foundations
            </CardTitle>
            <CardDescription>
              A structured 4-week clinical-grade program to safely close Diastasis Recti and restore deep core stability. Zero traditional crunches or planks—just targeted activation movements designed to rebuild your internal corset from the inside out.
            </CardDescription>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            DR Repair &amp; Postpartum
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Rehab
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
            <span>10–15 min/day</span>
          </div>
        </div>

        {isEnrolled && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Your Progress</span>
              <span className="text-muted-foreground">
                {isCompleted ? 'Foundation Complete! 💛' : `${currentWeekTitle} – Day ${userProgress?.current_day}`}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="text-xs text-muted-foreground">
              {isCompleted ? 'Your core is restored — beautiful work, mama.' : `${currentDay} of ${totalDays} days completed`}
            </div>
          </div>
        )}

        <div className="space-y-3 mb-6">
          {[
            'Safe DR closure & deep core activation',
            'Pelvic-floor restoration techniques',
            'Zero crunches or planks — rehab progression',
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
            <span className="text-xs text-muted-foreground">mamas healing</span>
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
              Review Foundation
            </>
          ) : hasStartedProgram || isEnrolled ? (
            <>
              <Play className="h-4 w-4 mr-2" />
              Continue Foundation
            </>
          ) : (
            <>
              <ArrowRight className="h-4 w-4 mr-2" />
              Begin Your Foundation
            </>
          )}
        </Button>
      </CardContent>
    </Card>
    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-black/40 z-10">
      <div className="bg-white/95 rounded-2xl px-8 py-6 flex flex-col items-center shadow-xl">
        <Lock className="h-10 w-10 text-primary mb-3" />
        <span className="text-lg font-bold text-foreground">Program Locked</span>
        <span className="text-sm text-muted-foreground mt-1 text-center">Coming soon</span>
      </div>
    </div>
    </div>
  );
}
