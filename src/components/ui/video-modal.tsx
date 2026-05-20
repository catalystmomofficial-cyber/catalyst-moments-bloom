
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { X } from "lucide-react";
import { Button } from "./button";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
  isWelcomeVideo?: boolean;
}

const VideoModal = ({ isOpen, onClose, videoUrl, title, isWelcomeVideo = false }: VideoModalProps) => {
  const isMp4 = /\.mp4($|[?])/i.test(videoUrl);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-black border-0">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-2 right-2 z-10 text-white bg-black/40 hover:bg-black/60 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
          {isWelcomeVideo ? (
            <AspectRatio ratio={16 / 9}>
              <iframe
                src="https://www.youtube.com/embed/MxFf4_degjk?rel=0&modestbranding=1&showinfo=0&autoplay=1"
                title="Catalyst Mom Welcome Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </AspectRatio>
          ) : (
            <AspectRatio ratio={16 / 9}>
              {isMp4 ? (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full"
                  title={title || "Video"}
                />
              ) : (
                <iframe
                  src={`${videoUrl}?autoplay=1`}
                  title={title || "Video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              )}
            </AspectRatio>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
