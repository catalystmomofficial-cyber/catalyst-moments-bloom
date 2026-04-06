
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


const isStandaloneMode = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as any).standalone === true;

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [isWelcomeVideo, setIsWelcomeVideo] = useState(false);

  const isPWA = isStandaloneMode();

  useEffect(() => {
    if (!isPWA || isLoading) return;
    navigate(isAuthenticated ? '/dashboard' : '/login', { replace: true });
  }, [isAuthenticated, isLoading, navigate, isPWA]);

  if (isPWA && isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-primary/90 to-primary gap-6">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg overflow-hidden">
            <img src="https://moxxceccaftkeuaowctw.supabase.co/storage/v1/object/public/catalystcourses/Logo/LOGO%20(3)%20(1).png" alt="Catalyst Mom" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Catalyst Mom</h1>
        </div>
        <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        <p className="text-white/70 text-sm">Loading your wellness journey…</p>
      </div>
    );
  }

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
