import { useState, useEffect, useRef } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Loader2 } from 'lucide-react';

interface GeneratedScene {
  id: number;
  duration: number;
  imageUrl: string;
  audioBase64: string;
  narration: string;
}

interface VideoSlideshowProps {
  scenes: GeneratedScene[];
  onComplete?: () => void;
}

export default function VideoSlideshow({ scenes, onComplete }: VideoSlideshowProps) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!scenes || scenes.length === 0) return;

    const currentScene = scenes[currentSceneIndex];
    
    // Create and play audio
    const audio = new Audio(`data:audio/mp3;base64,${currentScene.audioBase64}`);
    audioRef.current = audio;
    
    setIsPlaying(true);
    audio.play().catch(err => console.error('Audio playback error:', err));

    // Move to next scene after duration
    const timer = setTimeout(() => {
      if (currentSceneIndex < scenes.length - 1) {
        setCurrentSceneIndex(prev => prev + 1);
      } else {
        setIsPlaying(false);
        onComplete?.();
      }
    }, currentScene.duration);

    return () => {
      clearTimeout(timer);
      audio.pause();
      audio.src = '';
    };
  }, [currentSceneIndex, scenes, onComplete]);

  if (!scenes || scenes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-muted">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const currentScene = scenes[currentSceneIndex];

  return (
    <div className="relative w-full h-full bg-black">
      <AspectRatio ratio={16 / 9}>
        <img
          src={currentScene.imageUrl}
          alt={`Scene ${currentScene.id}`}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        
        {/* Progress indicator */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
          <div className="flex gap-1 mb-2">
            {scenes.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded transition-colors ${
                  index <= currentSceneIndex ? 'bg-primary' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          <p className="text-white text-sm text-center">{currentScene.narration}</p>
        </div>
      </AspectRatio>
    </div>
  );
}
