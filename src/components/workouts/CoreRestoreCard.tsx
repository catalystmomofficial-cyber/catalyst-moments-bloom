import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Clock, ChevronRight } from 'lucide-react';
import InlineVideoPlayer from '@/components/ui/inline-video-player';

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

const CoreRestoreCard = () => {
  const [enrolledCount, setEnrolledCount] = useState(183);
  const [isHovered, setIsHovered] = useState(false);
  const [showInlinePlayer, setShowInlinePlayer] = useState(false);
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);
  const [hasStartedProgram, setHasStartedProgram] = useState(false);

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
      {/* Hero Image with Play Button */}
      <div className="relative h-48 bg-gradient-to-br from-primary to-secondary overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop" 
          alt="Core restoration exercises"
          className="w-full h-full object-cover opacity-80"
        />
        
        {/* Play Button */}
        {hasStartedProgram && (
          <button 
            onClick={() => setShowInlinePlayer(true)}
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
          Core Restore: 21-Day Ab Rehab for Moms
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          🧘‍♀️ Reconnect to core, posture, pelvic floor at any stage
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
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => {
            setHasStartedProgram(true);
            setShowInlinePlayer(true);
          }}
        >
          {hasStartedProgram ? 'Continue Program' : 'Start Program'}
          <ChevronRight className={`ml-2 h-4 w-4 transition-transform duration-200 ${
            isHovered ? 'translate-x-1' : ''
          }`} />
        </Button>
      </div>

      <InlineVideoPlayer
        isOpen={showInlinePlayer}
        onClose={() => setShowInlinePlayer(false)}
        videoUrl="https://www.youtube.com/embed/ScNNfyq3d_w"
        title="Core Restore: 21-Day Ab Rehab for Moms"
        isMinimized={isPlayerMinimized}
        onToggleMinimize={() => setIsPlayerMinimized(!isPlayerMinimized)}
      />
    </Card>
  );
};

export default CoreRestoreCard;