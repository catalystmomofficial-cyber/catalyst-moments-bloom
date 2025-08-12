import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Baby, Clock, Play } from 'lucide-react';
import VideoModal from '@/components/ui/video-modal';

const GLOW_VIDEO_URL = "https://moxxceccaftkeuaowctw.supabase.co/storage/v1/object/public/catalystcourses/glow%20and%20go/Intro.mp4";

// Real-looking diverse avatar URLs from randomuser.me with seed for consistency
const AVATARS = [
  'https://randomuser.me/api/portraits/women/1.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/women/89.jpg',
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
      
      // Easing function for smooth animation
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

const GlowAndGoPrenatalCard = () => {
  // Simulate dynamic enrollment count (could be fetched from backend)
  const [enrolledCount, setEnrolledCount] = useState(247);
  const [isHovered, setIsHovered] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Simulate gradual enrollment increase
  useEffect(() => {
    const interval = setInterval(() => {
      // Small random increase every 30 seconds (for demo purposes)
      if (Math.random() > 0.7) {
        setEnrolledCount(prev => prev + Math.floor(Math.random() * 3) + 1);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card 
      className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10
                 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02]
                 hover:border-primary/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1584432743501-7d5c27a39189" 
          alt="Glow & Go Prenatal Program" 
          className={`w-full h-48 object-cover transition-transform duration-700 
                     ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        <div className="absolute top-2 left-2 z-20">
          <Badge className="bg-primary hover:bg-primary text-white animate-pulse">
            ✨ Featured
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4 z-20">
          <Badge className="bg-background/80 backdrop-blur-sm text-foreground
                           transition-all duration-300 hover:bg-background/90">
            All Trimesters
          </Badge>
        </div>
        {/* Play Button */}
        <Button 
          size="lg" 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 
                     bg-white/90 text-primary hover:bg-white rounded-full w-16 h-16 flex items-center justify-center
                     backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-lg"
          onClick={() => setVideoModalOpen(true)}
        >
          <Play className="h-8 w-8 ml-1" fill="currentColor" />
        </Button>
        
        {/* Subtle shimmer effect */}
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                        transition-transform duration-1000 ${isHovered ? 'translate-x-full' : '-translate-x-full'}`} />
      </div>
      
      <CardHeader>
        <CardTitle className="text-primary transition-colors duration-300 hover:text-primary/80">
          Glow & Go Prenatal Program
        </CardTitle>
        <CardDescription className="leading-relaxed">
          Train for birth. Strengthen safely. Protect your body. A physio-designed pregnancy fitness system built to support your body from bump to birth.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center group">
            <Baby className="h-4 w-4 mr-1 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-sm text-muted-foreground">All Levels</span>
          </div>
          <div className="flex items-center group">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-sm text-muted-foreground">20-30 min/day</span>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          {[
            'Prepare for labor & reduce tearing risk',
            'Strengthen pelvic floor safely', 
            'Trimester-specific guidance'
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
            <span className="text-xs text-muted-foreground">expecting moms enrolled</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full bg-primary hover:bg-primary/90 transition-all duration-300
                   hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02]
                   group relative overflow-hidden"
        >
          <span className="relative z-10">Start Prenatal Program</span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0
                        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </Button>
      </CardFooter>

      {/* Video Modal */}
      <VideoModal 
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoUrl={GLOW_VIDEO_URL}
        title="Glow & Go Prenatal Program"
      />
    </Card>
  );
};

export default GlowAndGoPrenatalCard;