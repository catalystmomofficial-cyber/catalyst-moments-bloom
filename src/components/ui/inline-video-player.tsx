import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Minimize2, Maximize2, X } from 'lucide-react';

interface InlineVideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

const InlineVideoPlayer = ({ 
  isOpen, 
  onClose, 
  videoUrl, 
  title, 
  isMinimized = false,
  onToggleMinimize 
}: InlineVideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const isMp4 = /\.mp4($|[?])/i.test(videoUrl);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
    }
  }, [isOpen]);

  const togglePlay = () => {
    if (isMp4 && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!isOpen) return null;

  return (
    <Card 
      className={`fixed z-50 bg-background border transition-all duration-300 shadow-lg ${
        isMinimized 
          ? 'bottom-4 right-4 w-80 h-52' 
          : 'bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 h-64'
      }`}
    >
      <div className="flex items-center justify-between p-2 bg-muted/50">
        <span className="text-sm font-medium truncate">{title || 'Video'}</span>
        <div className="flex items-center gap-1">
          {onToggleMinimize && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleMinimize}
              className="h-6 w-6 p-0"
            >
              {isMinimized ? (
                <Maximize2 className="h-3 w-3" />
              ) : (
                <Minimize2 className="h-3 w-3" />
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <div className="relative flex-1 bg-black">
        {isMp4 ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover"
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        ) : (
          <iframe
            ref={iframeRef}
            src={`${videoUrl}?autoplay=0`}
            title={title || "Video"}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        )}
        
        {isMp4 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlay}
            className="absolute bottom-2 left-2 bg-black/50 text-white hover:bg-black/70"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default InlineVideoPlayer;