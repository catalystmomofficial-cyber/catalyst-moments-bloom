import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const InlineDemoVideo = () => {
  return (
    <section id="demo-video" className="py-12 md:py-16">
      <div className="container container-padding mx-auto">
        <div className="mx-auto" style={{ maxWidth: '900px' }}>
          <div className="rounded-lg overflow-hidden shadow-soft border bg-card">
            <AspectRatio ratio={16 / 9}>
              <iframe
                src="https://www.youtube.com/embed/MxFf4_degjk?rel=0&modestbranding=1&showinfo=0"
                title="Catalyst Mom Demo"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                className="w-full h-full"
              />
            </AspectRatio>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            See what your journey looks like with Catalyst Mom
          </p>
        </div>
      </div>
    </section>
  );
};

export default InlineDemoVideo;
