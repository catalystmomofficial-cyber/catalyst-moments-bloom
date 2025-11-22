import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const HeroVideoSection = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <Card className="mb-8 overflow-hidden relative group cursor-pointer" onClick={() => setIsVideoOpen(true)}>
        <div className="relative aspect-video bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
          {/* Thumbnail Image */}
          <img 
            src="/birth-ball-images/trimester-2-cover.png" 
            alt="Birth ball exercises preview"
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-2xl">
              <Play className="h-12 w-12 text-primary fill-primary" />
            </div>
          </div>
          
          {/* Text Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
            <h3 className="text-white text-2xl font-bold mb-2">Watch: Birth Ball Exercises Overview</h3>
            <p className="text-white/90 text-sm">Quick preview of safe and effective birth ball movements • 2 min</p>
          </div>
        </div>
      </Card>

      {/* Video Dialog */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl p-0">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-50 rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={() => setIsVideoOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="aspect-video bg-black">
            <video 
              controls 
              autoPlay
              className="w-full h-full"
              src="/wellness-demo-video.mp4"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HeroVideoSection;
