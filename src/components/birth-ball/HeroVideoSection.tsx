import CheckpointVideoPlayer from '@/components/video/CheckpointVideoPlayer';
import { Card } from '@/components/ui/card';

const HeroVideoSection = () => {
  return (
    <Card className="mb-8 overflow-hidden">
      <CheckpointVideoPlayer
        src="/wellness-demo-video.mp4"
        poster="/birth-ball-images/trimester-2-cover.png"
        title="Birth Ball Exercises Overview"
        streakKey="birth-ball-hero"
        autoChapterSeconds={180}
      />
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-1">Watch: Birth Ball Exercises Overview</h3>
        <p className="text-sm text-muted-foreground">
          Safe and effective birth ball movements with check-ins every 3 minutes.
        </p>
      </div>
    </Card>
  );
};

export default HeroVideoSection;
