import { useState, useEffect, useRef } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import scene1 from '@/assets/welcome-video/scene-1-welcome.jpg';
import scene2 from '@/assets/welcome-video/scene-2-fitness.jpg';
import scene3 from '@/assets/welcome-video/scene-3-nutrition.jpg';
import scene4 from '@/assets/welcome-video/scene-4-community.jpg';
import scene5 from '@/assets/welcome-video/scene-5-ai-coach.jpg';
import scene6 from '@/assets/welcome-video/scene-6-cta.jpg';

interface Scene {
  id: number;
  image: string;
  narration: string;
  duration: number;
}

const videoScenes: Scene[] = [
  {
    id: 1,
    image: scene1,
    narration: "Welcome to Catalyst Mom - your complete wellness companion for every stage of motherhood.",
    duration: 5000
  },
  {
    id: 2,
    image: scene2,
    narration: "Get personalized workout plans tailored to your journey - from trying to conceive, through pregnancy, to postpartum recovery.",
    duration: 5000
  },
  {
    id: 3,
    image: scene3,
    narration: "Access nutritious meal plans and recipes designed specifically for moms.",
    duration: 5000
  },
  {
    id: 4,
    image: scene4,
    narration: "Connect with a supportive community of moms who understand your journey.",
    duration: 5000
  },
  {
    id: 5,
    image: scene5,
    narration: "Chat with our AI wellness coach available 24/7 for personalized guidance and support.",
    duration: 5000
  },
  {
    id: 6,
    image: scene6,
    narration: "Start your wellness journey today with Catalyst Mom. Sign up now!",
    duration: 5000
  }
];

interface StaticWelcomeVideoProps {
  onComplete?: () => void;
  autoPlay?: boolean;
}

export default function StaticWelcomeVideo({ onComplete, autoPlay = true }: StaticWelcomeVideoProps) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!isPlaying) return;

    const currentScene = videoScenes[currentSceneIndex];
    
    // Use Web Speech API for narration
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentScene.narration);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      speechRef.current = utterance;
      
      window.speechSynthesis.speak(utterance);
    }

    // Move to next scene after duration
    const timer = setTimeout(() => {
      if (currentSceneIndex < videoScenes.length - 1) {
        setCurrentSceneIndex(prev => prev + 1);
      } else {
        setIsPlaying(false);
        onComplete?.();
      }
    }, currentScene.duration);

    return () => {
      clearTimeout(timer);
      if (speechRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentSceneIndex, isPlaying, onComplete]);

  const currentScene = videoScenes[currentSceneIndex];

  return (
    <div className="relative w-full h-full bg-black">
      <AspectRatio ratio={16 / 9}>
        <img
          src={currentScene.image}
          alt={`Scene ${currentScene.id}`}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        
        {/* Progress indicator */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex gap-1 mb-2">
            {videoScenes.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded transition-colors ${
                  index <= currentSceneIndex ? 'bg-primary' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          <p className="text-white text-sm text-center font-medium">{currentScene.narration}</p>
        </div>
      </AspectRatio>
    </div>
  );
}
