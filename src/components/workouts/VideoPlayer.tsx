import { useState } from 'react';
import { Play } from 'lucide-react';
import { VideoPlayerProps } from './types';

export default function VideoPlayer({ videoUrl, title, thumbnail }: VideoPlayerProps) {
  console.log('VideoPlayer - URL:', videoUrl, 'Title:', title, 'Thumbnail:', thumbnail);
  
  const [showIframe, setShowIframe] = useState(false);
  const isMp4 = /\.mp4($|[?])/i.test(videoUrl || '');
  const isYouTube = videoUrl && /youtube|youtu\.be/i.test(videoUrl);

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
      <h4 className="font-medium mb-2">Exercise Video:</h4>
      <div className="relative w-full overflow-hidden rounded-lg bg-black" style={{ paddingBottom: '56.25%' }}>
        {isMp4 ? (
          <video
            src={videoUrl}
            controls
            playsInline
            poster={thumbnail}
            className="absolute top-0 left-0 w-full h-full object-contain"
            title={title}
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
        ) : (
          <iframe
            src={showIframe ? `${videoUrl}?autoplay=1` : videoUrl}
            title={title}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}
