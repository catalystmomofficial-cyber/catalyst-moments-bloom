
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from "@/components/layout/PageLayout";
import VideoModal from "@/components/ui/video-modal";
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';
import FoodCalorieCheckerCard from '@/components/home/FoodCalorieCheckerCard';
import SEO from '@/components/seo/SEO';
import { useAuth } from '@/contexts/AuthContext';


const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true;

    if (isStandalone && !isLoading) {
      navigate(isAuthenticated ? '/dashboard' : '/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [isWelcomeVideo, setIsWelcomeVideo] = useState(false);

  const openVideoModal = (url: string, title: string) => {
    setVideoUrl(url);
    setVideoTitle(title);
    setIsWelcomeVideo(false);
    setVideoModalOpen(true);
  };

  const openWelcomeVideo = () => {
    setIsWelcomeVideo(true);
    setVideoModalOpen(true);
  };

  return (
    <PageLayout withPadding={false}>
      <SEO 
        title="Catalyst Mom – Wellness, Fitness & Nutrition for Moms"
        description="Personalized workouts, meal plans, and community support for every stage of motherhood."
      />
      {/* Hero Section */}
      <HeroSection onWatchVideo={openWelcomeVideo} />
      

      {/* Food Calorie Checker Feature */}
      <div className="container mx-auto py-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          Try Our Latest Feature
        </h2>
        <div className="max-w-lg mx-auto">
          <FoodCalorieCheckerCard />
        </div>
      </div>
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Benefits Section */}
      <BenefitsSection />
      
      {/* Testimonial Section */}
      <TestimonialsSection />
      
      {/* CTA Section */}
      <CTASection onWatchDemo={openWelcomeVideo} />

      {/* Video Modal */}
      <VideoModal 
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoUrl={videoUrl}
        title={videoTitle}
        isWelcomeVideo={isWelcomeVideo}
      />
    </PageLayout>
  );
};

export default Index;
