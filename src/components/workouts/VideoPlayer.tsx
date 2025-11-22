import { VideoPlayerProps } from './types';

export default function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  console.log('VideoPlayer - URL:', videoUrl, 'Title:', title);
  
  const isMp4 = /\.mp4($|[?])/i.test(videoUrl || '');

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
            className="absolute top-0 left-0 w-full h-full object-contain"
            title={title}
          />
        ) : (
          <iframe
            src={videoUrl}
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
