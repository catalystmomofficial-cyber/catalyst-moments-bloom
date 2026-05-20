import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Clock, ChevronRight, Lock } from 'lucide-react';
import { useVideoPlayer } from '@/contexts/VideoPlayerContext';

const AVATARS = [
  "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=40&h=40&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face",
];

interface AnimatedCounterProps {
  target: number;
  duration?: number;
}

const AnimatedCounter = ({ target, duration = 2000 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count}</span>;
};

const UserAvatars = ({ enrolledCount }: { enrolledCount: number }) => {
  const displayAvatars = AVATARS.slice(0, 4);
  const remainingCount = enrolledCount - displayAvatars.length;
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {displayAvatars.map((avatar, index) => (
          <img
            key={index}
            src={avatar}
            alt={`Mom ${index + 1}`}
            className="w-8 h-8 rounded-full border-2 border-background object-cover"
          />
        ))}
        {remainingCount > 0 && (
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-semibold 
                         flex items-center justify-center border-2 border-background
                         transition-all duration-300 hover:bg-primary/30 hover:scale-110">
            +{remainingCount > 999 ? '999+' : remainingCount}
          </div>
        )}
      </div>
    </div>
  );
};

const CoreRestoreCard = ({ locked = false }: { locked?: boolean }) => {
  const [enrolledCount, setEnrolledCount] = useState(189);
  const [isHovered, setIsHovered] = useState(false);
  const [hasStartedProgram, setHasStartedProgram] = useState(false);
  const { openVideo } = useVideoPlayer();

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setEnrolledCount(prev => prev + Math.floor(Math.random() * 2) + 1);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20
                     hover:shadow-lg transition-all duration-300 relative group">
      {/* Lock overlay */}
      {locked && (
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Lock className="h-7 w-7 text-primary" />
            </div>
            <Badge variant="secondary" className="text-sm font-semibold">Premium Program</Badge>
            <p className="text-xs text-muted-foreground mt-2 max-w-[160px]">Upgrade to unlock this program</p>
          </div>
        </div>
      )}

      {/* Hero Image with Play Button */}
      <div className="relative h-48 bg-gradient-to-br from-primary to-secondary overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop"
          alt="Core restoration exercises"
          className="w-full h-full object-cover opacity-80"
        />

        {/* Play Button */}
        {hasStartedProgram && !locked && (
          <button
            onClick={() => openVideo("https://www.youtube.com/embed/ScNNfyq3d_w", "Core Restore Foundations")}
            className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0
                       group-hover:opacity-100 transition-all duration-300"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 hover:bg-white transition-colors">
              <Play className="h-6 w-6 text-primary ml-1" fill="currentColor" />
            </div>
          </button>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className="bg-white/90 text-primary font-semibold">
            🧘‍♀️ Specialty
          </Badge>
          <Badge variant="secondary" className="bg-white/90 text-gray-700">
            3 Weeks
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Core Restore Foundations
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Safely close abdominal separation &amp; heal your floor
        </p>

        {/* Duration */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Clock className="h-4 w-4" />
          <span>15-20 min/day</span>
        </div>

        {/* Benefits */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Deep core rehabilitation</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Posture correction techniques</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Pelvic floor strengthening</span>
          </div>
        </div>

        {/* User Avatars and Count */}
        <div className="flex items-center justify-between mb-6">
          <UserAvatars enrolledCount={enrolledCount} />
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              <AnimatedCounter target={enrolledCount} />
            </div>
            <div className="text-xs text-gray-500">moms enrolled</div>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold
                     transform transition-all duration-200 hover:scale-105"
          disabled={locked}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => {
            if (locked) return;
            setHasStartedProgram(true);
            openVideo("https://www.youtube.com/embed/ScNNfyq3d_w", "Core Restore Foundations");
          }}
        >
          {locked ? (
            <><Lock className="mr-2 h-4 w-4" /> Locked</>
          ) : hasStartedProgram ? 'Continue Program' : 'Start Program'}
          {!locked && (
            <ChevronRight className={`ml-2 h-4 w-4 transition-transform duration-200 ${
              isHovered ? 'translate-x-1' : ''
            }`} />
          )}
        </Button>
      </div>
    </Card>
  );
};

export default CoreRestoreCard;