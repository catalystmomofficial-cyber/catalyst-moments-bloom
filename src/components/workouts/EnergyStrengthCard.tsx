import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dumbbell, Clock, Play } from 'lucide-react';
import InlineVideoPlayer from '@/components/ui/inline-video-player';

// Real-looking diverse avatar URLs for active moms
const AVATARS = [
  'https://randomuser.me/api/portraits/women/25.jpg',
  'https://randomuser.me/api/portraits/women/41.jpg',
  'https://randomuser.me/api/portraits/women/58.jpg',
  'https://randomuser.me/api/portraits/women/14.jpg',
  'https://randomuser.me/api/portraits/women/33.jpg',
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
            <div className="absolute inset-0 rounded-full bg-accent/10 opacity-0 
                          group-hover:opacity-100 transition-opacity duration-300 
                          animate-pulse" />
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="w-8 h-8 rounded-full bg-accent/20 border-2 border-background 
                        flex items-center justify-center text-xs font-medium text-accent-foreground
                        transition-all duration-300 hover:bg-accent/30 hover:scale-110">
            +{remainingCount > 999 ? '999+' : remainingCount}
          </div>
        )}
      </div>
    </div>
  );
};

const EnergyStrengthCard = () => {
  const [enrolledCount, setEnrolledCount] = useState(189);
  const [isHovered, setIsHovered] = useState(false);
  const [showInlinePlayer, setShowInlinePlayer] = useState(false);
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);
  const [hasStartedProgram, setHasStartedProgram] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.75) {
        setEnrolledCount(prev => prev + Math.floor(Math.random() * 3) + 1);
      }
    }, 35000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card 
      className="overflow-hidden border border-border/50 bg-gradient-to-br from-accent/20 to-accent/5
                 transition-all duration-500 hover:shadow-lg hover:shadow-accent/10 hover:scale-[1.02]
                 hover:border-accent/40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b" 
          alt="Energy & Strength for Moms" 
          className={`w-full h-48 object-cover transition-transform duration-700 
                     ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        <div className="absolute bottom-4 left-4 z-20">
          <Badge className="bg-background/80 backdrop-blur-sm text-foreground
                           transition-all duration-300 hover:bg-background/90">
            6 Weeks
          </Badge>
        </div>
        {/* Play Button */}
        {hasStartedProgram && (
          <Button 
            size="lg" 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 
                       bg-white/90 text-accent-foreground hover:bg-white rounded-full w-16 h-16 flex items-center justify-center
                       backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-lg"
            onClick={() => setShowInlinePlayer(true)}
          >
            <Play className="h-8 w-8 ml-1" fill="currentColor" />
          </Button>
        )}
        
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                        transition-transform duration-1000 ${isHovered ? 'translate-x-full' : '-translate-x-full'}`} />
      </div>
      
      <CardHeader>
        <CardTitle className="text-accent-foreground transition-colors duration-300 hover:text-accent-foreground/80">
          Energy & Strength for Moms
        </CardTitle>
        <CardDescription className="leading-relaxed">
          Build sustainable energy and functional strength for mom life. Perfect for busy moms who want to feel strong and energized.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center group">
            <Dumbbell className="h-4 w-4 mr-1 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
            <span className="text-sm text-muted-foreground">Intermediate</span>
          </div>
          <div className="flex items-center group">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
            <span className="text-sm text-muted-foreground">20-30 min/day</span>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          {[
            'Build functional strength for daily tasks',
            'Boost energy levels naturally', 
            'Progressive strength challenges'
          ].map((benefit, index) => (
            <div 
              key={benefit}
              className="flex items-center text-sm group"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'fade-in 0.8s ease-out both'
              }}
            >
              <div className="w-2 h-2 bg-accent rounded-full mr-3 
                            transition-all duration-300 group-hover:scale-125 group-hover:shadow-sm
                            group-hover:shadow-accent/50" />
              <span className="transition-colors duration-300 group-hover:text-foreground">
                {benefit}
              </span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <UserAvatars enrolledCount={enrolledCount} />
          <div className="text-right">
            <div className="text-lg font-semibold text-accent-foreground">
              <AnimatedCounter target={enrolledCount} />
            </div>
            <span className="text-xs text-muted-foreground">moms enrolled</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300
                   hover:shadow-lg hover:shadow-accent/20 hover:scale-[1.02]
                   group relative overflow-hidden"
          onClick={() => {
            setHasStartedProgram(true);
            setShowInlinePlayer(true);
          }}
        >
          <span className="relative z-10">{hasStartedProgram ? 'Continue Program' : 'Start Program'}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-white/20 to-accent/0
                        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </Button>
      </CardFooter>

      {/* Inline Video Player */}
      <InlineVideoPlayer
        isOpen={showInlinePlayer}
        onClose={() => setShowInlinePlayer(false)}
        videoUrl="https://www.youtube.com/embed/UItWltVZZmE"
        title="Energy & Strength for Moms"
        isMinimized={isPlayerMinimized}
        onToggleMinimize={() => setIsPlayerMinimized(!isPlayerMinimized)}
      />
    </Card>
  );
};

export default EnergyStrengthCard;