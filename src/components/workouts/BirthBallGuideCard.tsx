import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Play, Star, Users } from 'lucide-react';
import VideoModal from '@/components/ui/video-modal';

const BIRTHBALL_GUIDE_URL = "https://moxxceccaftkeuaowctw.supabase.co/storage/v1/object/public/catalystcourses/Ultimate%20birth%20ball%20guide/The%20Ultimate%20Birth%20Ball%20Guide%20Safe%20&%20Effective%20Exercises%20for%20Every%20Trimester.pdf";

const AVATARS = [
  "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&h=150&fit=crop&crop=face"
];

interface AnimatedCounterProps {
  target: number;
  duration?: number;
}

const AnimatedCounter = ({ target, duration = 2000 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeOutCubic * target);
      
      setCount(currentCount);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [target, duration]);

  return <span>{count}</span>;
};

interface UserAvatarsProps {
  enrolledCount: number;
}

const UserAvatars = ({ enrolledCount }: UserAvatarsProps) => {
  const displayCount = Math.min(enrolledCount, 4);
  const remainingCount = Math.max(0, enrolledCount - 4);

  return (
    <div className="flex items-center -space-x-2">
      {AVATARS.slice(0, displayCount).map((avatar, index) => (
        <Avatar key={index} className="w-8 h-8 border-2 border-white">
          <AvatarImage src={avatar} alt={`User ${index + 1}`} />
          <AvatarFallback>U{index + 1}</AvatarFallback>
        </Avatar>
      ))}
      {remainingCount > 0 && (
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center border-2 border-white">
          +{remainingCount > 999 ? '999' : remainingCount}
        </div>
      )}
    </div>
  );
};

const BirthBallGuideCard = () => {
  const [enrolledCount, setEnrolledCount] = useState(1247);
  const [isHovered, setIsHovered] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnrolledCount(prev => prev + Math.floor(Math.random() * 3));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Card 
        className="relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-105"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-64 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-80"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=600&fit=crop')"
            }}
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant="secondary" className="bg-white/90 text-purple-700 hover:bg-white">
              Pregnancy
            </Badge>
            <Badge variant="outline" className="border-white/80 text-white bg-black/20">
              Pain Relief
            </Badge>
          </div>

          {/* Play Button */}
          <div 
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setShowVideoModal(true)}
          >
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors cursor-pointer">
              <Play className="w-6 h-6 text-purple-600 ml-1" fill="currentColor" />
            </div>
          </div>

          {/* Rating */}
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/40 rounded-full px-2 py-1">
            <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
            <span className="text-white text-sm font-medium">4.9</span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              Ultimate Birth Ball Guide
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              Pain Relief + Labor Prep
            </p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Physio-designed routine that relieves sciatica, pelvic pressure, and prepares your body for an easier birth.
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              Immediate pain relief
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              Better sleep positioning
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              Labor prep moves
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              Safe for all trimesters
            </div>
          </div>

          {/* Enrollment Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserAvatars enrolledCount={enrolledCount} />
              <div className="text-sm">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">
                    <AnimatedCounter target={enrolledCount} />
                  </span>
                  <span className="text-muted-foreground">enrolled</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Button className="w-full" size="lg" onClick={() => setShowVideoModal(true)}>
              Start Ball Workouts
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <a href={BIRTHBALL_GUIDE_URL} target="_blank" rel="noopener noreferrer">
                View Guide (PDF)
              </a>
            </Button>
          </div>
        </div>
      </Card>

      <VideoModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="Ultimate Birth Ball Guide Preview"
      />
    </>
  );
};

export default BirthBallGuideCard;