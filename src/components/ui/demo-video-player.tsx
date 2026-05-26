import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface DemoVideoPlayerProps {
  title?: string;
  description?: string;
}

const DemoVideoPlayer = ({ 
  title = "Wellness Demo", 
  description = "See how our wellness platform transforms your health journey" 
}: DemoVideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden shadow-2xl">
      <CardContent className="p-0">
        <div 
          className="relative group cursor-pointer"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(isPlaying)}
        >
          {/* Video Element */}
          <video
            ref={videoRef}
            className="w-full h-auto"
            poster="/lovable-uploads/46dafd82-4029-4af8-b259-7df82cdfa99c.png"
            playsInline
            crossOrigin="anonymous"
            {...{ 'x-webkit-airplay': 'allow', 'webkit-playsinline': '', disableRemotePlayback: false }}
            onEnded={handleVideoEnd}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src="/catalyst-wellness-preview.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Play Overlay */}
          {!isPlaying && (
            <div 
              className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300"
              onClick={togglePlay}
            >
              <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors duration-200">
                <Play className="h-8 w-8 text-gray-800 ml-1" />
              </div>
            </div>
          )}

          {/* Video Controls */}
          {showControls && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="p-6 bg-gradient-to-br from-background to-muted">
          <h3 className="text-2xl font-bold mb-2 gradient-text">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoVideoPlayer;