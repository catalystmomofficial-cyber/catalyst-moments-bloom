import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Minimize2, Maximize2, X, Move } from 'lucide-react';
import { useRemoteSync } from '@/hooks/useRemoteSync';

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
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const isMp4 = /\.mp4($|[?])/i.test(videoUrl);

  useRemoteSync({ videoRef, meta: { title: title ?? 'Video' }, enabled: isOpen && isMp4 });


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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMinimized && !isFullscreen) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && isMinimized && !isFullscreen) {
      const newX = Math.max(0, Math.min(window.innerWidth - 320, e.clientX - dragStart.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragStart.y));
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      try {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
          // Enable orientation lock for mobile
          if (screen.orientation && (screen.orientation as any).lock) {
            try {
              await (screen.orientation as any).lock('landscape');
            } catch (err) {
              console.log('Orientation lock not supported');
            }
          }
        }
      } catch (err) {
        console.log('Fullscreen not supported');
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        // Unlock orientation when exiting fullscreen
        if (screen.orientation && (screen.orientation as any).unlock) {
          (screen.orientation as any).unlock();
        }
      }
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (!isOpen) return null;

  const playerStyle = isMinimized && !isFullscreen ? {
    left: `${position.x}px`,
    top: `${position.y}px`,
    right: 'auto',
    bottom: 'auto',
  } : {};

  return (
    <div 
      ref={containerRef}
      style={playerStyle}
      className={`fixed z-50 bg-black rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${
        isFullscreen 
          ? 'inset-0 w-screen h-screen rounded-none'
          : isMinimized 
            ? 'w-80 h-48 cursor-move' 
            : 'bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 h-64'
      }`}
      onMouseDown={handleMouseDown}
    >
      <div className={`flex items-center justify-between p-2 bg-black/70 ${
        isFullscreen ? 'bg-black/90' : 'bg-muted/50'
      }`}>
        <div className="flex items-center gap-2">
          {isMinimized && !isFullscreen && (
            <Move className="h-4 w-4 text-white/60" />
          )}
          <span className={`text-sm font-medium truncate ${
            isFullscreen ? 'text-white' : 'text-foreground'
          }`}>
            {title || 'Video'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {isMp4 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              className={`h-6 w-6 p-0 ${
                isFullscreen 
                  ? 'text-white hover:bg-white/20' 
                  : 'hover:bg-muted'
              }`}
            >
              {isPlaying ? (
                <Pause className="h-3 w-3" />
              ) : (
                <Play className="h-3 w-3" />
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className={`h-6 w-6 p-0 ${
              isFullscreen 
                ? 'text-white hover:bg-white/20' 
                : 'hover:bg-muted'
            }`}
            title="Toggle Fullscreen"
          >
            <Maximize2 className="h-3 w-3" />
          </Button>
          {onToggleMinimize && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleMinimize}
              className={`h-6 w-6 p-0 ${
                isFullscreen 
                  ? 'text-white hover:bg-white/20' 
                  : 'hover:bg-muted'
              }`}
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
            className={`h-6 w-6 p-0 ${
              isFullscreen 
                ? 'text-white hover:bg-white/20' 
                : 'hover:bg-muted'
            }`}
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
            controls={isFullscreen}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        ) : (
          <iframe
            ref={iframeRef}
            src={`${videoUrl}?autoplay=0`}
            title={title || "Video"}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            className="w-full h-full"
          />
        )}
      </div>
    </div>
  );
};

export default InlineVideoPlayer;