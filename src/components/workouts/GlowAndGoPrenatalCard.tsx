import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Baby, Clock, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GLOW_AND_GO_VIDEOS } from '@/data/glowAndGoVideos';
import professionalCover from '@/assets/glow-and-go-professional-cover.jpg';
import { useVideoPlayer } from '@/contexts/VideoPlayerContext';

const GLOW_VIDEO_URL = "course://glow and go/Intro.mp4";

const GlowAndGoPrenatalCard = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [watched, setWatched] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const { openVideo } = useVideoPlayer();

  // Calculate progress
  const totalVideos = GLOW_AND_GO_VIDEOS.length;
  const watchedCount = GLOW_AND_GO_VIDEOS.filter(v => watched[v.id]).length;
  const progressPercent = totalVideos ? Math.round((watchedCount / totalVideos) * 100) : 0;

  // Load watched progress
  useEffect(() => {
    try {
      const saved = localStorage.getItem("glowAndGoWatched");
      if (saved) setWatched(JSON.parse(saved));
    } catch {}
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
          src={professionalCover} 
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
          onClick={() => openVideo(GLOW_VIDEO_URL, "Glow & Go Prenatal Program")}
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
            <span className="text-sm text-muted-foreground">10-20 min/day</span>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          {[
            'Prep your body for birth with safe, mobile movement',
            'Pelvic-floor–friendly strengthening',
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
        
        {/* Progress Bar Section */}
        <div className="mb-6 p-3 bg-primary/5 rounded-lg border border-primary/10">
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium text-primary">Your Progress</span>
            <span className="text-muted-foreground">{watchedCount}/{totalVideos} videos • {progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Baby className="h-4 w-4 text-primary shrink-0" />
          <span>Trimester-safe sessions · included with your membership</span>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full bg-primary hover:bg-primary/90 transition-all duration-300
                   hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02]
                   group relative overflow-hidden"
          onClick={() => navigate('/programs/glow-and-go')}
        >
          <span className="relative z-10">Start Prenatal Program</span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0
                        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GlowAndGoPrenatalCard;