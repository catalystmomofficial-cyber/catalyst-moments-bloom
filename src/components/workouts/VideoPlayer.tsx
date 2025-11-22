import { useState, useRef } from 'react';
import { Play, Gauge } from 'lucide-react';
import { VideoPlayerProps } from './types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export default function VideoPlayer({ videoUrl, title, thumbnail }: VideoPlayerProps) {
  console.log('VideoPlayer - URL:', videoUrl, 'Title:', title, 'Thumbnail:', thumbnail);
  
  const [showIframe, setShowIframe] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMp4 = /\.mp4($|[?])/i.test(videoUrl || '');
  const isYouTube = videoUrl && (/youtube\.com|youtu\.be/i.test(videoUrl));
  
  // Format YouTube URL properly for embedding
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    // If already an embed URL, ensure it has proper parameters
    if (url.includes('/embed/')) {
      const baseUrl = url.split('?')[0];
      return `${baseUrl}?rel=0&modestbranding=1`;
    }
    return url;
  };

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  if (!videoUrl) {
    return (
      <div className="w-full mb-6">
        <h4 className="font-medium mb-2">Exercise Video:</h4>
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">No video available for this exercise</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium">Exercise Video:</h4>
        {isMp4 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Gauge className="h-4 w-4" />
                <span>{playbackSpeed}x</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-2">
              <div className="grid gap-1">
                <p className="text-sm font-medium mb-1">Playback Speed</p>
                {speedOptions.map((speed) => (
                  <Button
                    key={speed}
                    variant={playbackSpeed === speed ? "secondary" : "ghost"}
                    size="sm"
                    className="justify-start"
                    onClick={() => handleSpeedChange(speed)}
                  >
                    {speed}x
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
      <div className="relative w-full overflow-hidden rounded-lg bg-black" style={{ paddingBottom: '56.25%' }}>
        {isMp4 ? (
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            playsInline
            poster={thumbnail}
            className="absolute top-0 left-0 w-full h-full object-contain"
            title={title}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                videoRef.current.playbackRate = playbackSpeed;
              }
            }}
          />
        ) : isYouTube && !showIframe && thumbnail ? (
          // YouTube thumbnail with play overlay
          <div className="absolute top-0 left-0 w-full h-full cursor-pointer group" onClick={() => setShowIframe(true)}>
            <img 
              src={thumbnail} 
              alt={title}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/90 group-hover:bg-primary flex items-center justify-center transition-all scale-100 group-hover:scale-110">
                <Play className="h-10 w-10 text-primary-foreground ml-1" fill="currentColor" />
              </div>
            </div>
          </div>
        ) : isYouTube ? (
          <iframe
            src={showIframe ? `${getYouTubeEmbedUrl(videoUrl)}${getYouTubeEmbedUrl(videoUrl).includes('?') ? '&' : '?'}autoplay=1` : getYouTubeEmbedUrl(videoUrl)}
            title={title}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-muted">
            <p className="text-muted-foreground">Unsupported video format</p>
          </div>
        )}
      </div>
    </div>
  );
}
