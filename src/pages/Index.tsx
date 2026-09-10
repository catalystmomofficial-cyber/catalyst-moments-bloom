
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from "@/components/layout/PageLayout";
import VideoModal from "@/components/ui/video-modal";
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import AboutSection from '@/components/home/AboutSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import HomeFAQSection, { homeFaqSchema } from '@/components/home/HomeFAQSection';
import CTASection from '@/components/home/CTASection';
import FreeGuidesSection from '@/components/home/FreeGuidesSection';
import FoodCalorieCheckerCard from '@/components/home/FoodCalorieCheckerCard';
import SEO from '@/components/seo/SEO';
import { useAuth } from '@/contexts/AuthContext';
import { Capacitor } from '@capacitor/core';
import BreathingLoader from '@/components/ui/breathing-loader';



const isAppMode = () =>
  Capacitor.isNativePlatform() ||
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as any).standalone === true;

const homeStructuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Catalyst Mom",
    "url": "https://catalystmomofficial.com",
    "dateModified": "2026-07-12",
  },
  homeFaqSchema,
];

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [isWelcomeVideo, setIsWelcomeVideo] = useState(false);

  const isPWA = isAppMode();

  useEffect(() => {
    if (!isPWA || isLoading) return;
    navigate(isAuthenticated ? '/dashboard' : '/login', { replace: true });
  }, [isAuthenticated, isLoading, navigate, isPWA]);

  if (isPWA && isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-white via-catalyst-cream to-catalyst-peach/40">
        <BreathingLoader />
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
        title="TTC, Pregnancy & Postpartum Wellness | Catalyst Mom"
        description="Core & pelvic floor recovery, workouts, meal plans & cycle tracking for TTC, pregnancy & postpartum — all in one app. Rebuild your body, don't just track it."
        structuredData={homeStructuredData}
      />
      {/* Hero Section */}
      <HeroSection onWatchVideo={openWelcomeVideo} />

      {/* Features Section */}
      <FeaturesSection />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* About Section */}
      <AboutSection />

      {/* Testimonial Section */}
      <TestimonialsSection />

      {/* Free Guides discovery band */}
      <FreeGuidesSection />

      {/* FAQ Section */}
      <HomeFAQSection />

      {/* CTA Section */}
      <CTASection onWatchDemo={(url, title) => openVideoModal(url, title)} />

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
