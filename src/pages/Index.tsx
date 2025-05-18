
import React, { useState } from 'react';
import PageLayout from "@/components/layout/PageLayout";
import VideoModal from "@/components/ui/video-modal";
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';

const Index = () => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");

  const openVideoModal = (url: string, title: string) => {
    setVideoUrl(url);
    setVideoTitle(title);
    setVideoModalOpen(true);
  };

  return (
    <PageLayout withPadding={false}>
      {/* Hero Section */}
      <HeroSection onWatchVideo={openVideoModal} />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Benefits Section */}
      <BenefitsSection />
      
      {/* Testimonial Section */}
      <TestimonialsSection />
      
      {/* CTA Section */}
      <CTASection onWatchDemo={openVideoModal} />

      {/* Video Modal */}
      <VideoModal 
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoUrl={videoUrl}
        title={videoTitle}
      />
    </PageLayout>
  );
};

export default Index;
