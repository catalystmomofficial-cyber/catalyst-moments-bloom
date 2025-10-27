import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { welcomeVideoScenes } from '@/data/welcomeVideoScript';
import VideoSlideshow from './VideoSlideshow';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface GeneratedScene {
  id: number;
  duration: number;
  imageUrl: string;
  audioBase64: string;
  narration: string;
}

interface WelcomeVideoGeneratorProps {
  onComplete?: () => void;
}

const CACHE_KEY = 'catalyst_welcome_video_scenes';
const CACHE_EXPIRY_KEY = 'catalyst_welcome_video_expiry';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export default function WelcomeVideoGenerator({ onComplete }: WelcomeVideoGeneratorProps) {
  const [scenes, setScenes] = useState<GeneratedScene[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrGenerateVideo();
  }, []);

  const loadOrGenerateVideo = async () => {
    // Check cache first
    const cachedScenes = localStorage.getItem(CACHE_KEY);
    const cacheExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);

    if (cachedScenes && cacheExpiry) {
      const expiryTime = parseInt(cacheExpiry, 10);
      if (Date.now() < expiryTime) {
        console.log('Loading video from cache');
        setScenes(JSON.parse(cachedScenes));
        return;
      }
    }

    // Generate new video
    await generateVideo();
  };

  const generateVideo = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      console.log('Generating welcome video...');
      
      const { data, error: functionError } = await supabase.functions.invoke('generate-welcome-video', {
        body: { scenes: welcomeVideoScenes }
      });

      if (functionError) throw functionError;

      if (!data?.scenes) {
        throw new Error('No scenes returned from generation');
      }

      console.log('Video generated successfully');
      
      // Cache the generated scenes
      localStorage.setItem(CACHE_KEY, JSON.stringify(data.scenes));
      localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());

      setScenes(data.scenes);
      toast.success('Welcome video ready!');
    } catch (err: any) {
      console.error('Video generation error:', err);
      setError(err.message || 'Failed to generate video');
      toast.error('Failed to generate video. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-muted p-8 text-center">
        <p className="text-destructive mb-4">Error: {error}</p>
        <button
          onClick={generateVideo}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-muted p-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium mb-2">Creating your personalized welcome video...</p>
        <p className="text-sm text-muted-foreground">This may take 20-30 seconds</p>
      </div>
    );
  }

  if (!scenes) {
    return (
      <div className="flex items-center justify-center h-full bg-muted">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <VideoSlideshow scenes={scenes} onComplete={onComplete} />;
}
