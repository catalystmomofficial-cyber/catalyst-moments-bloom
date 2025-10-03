
import React, { useState } from 'react';
import PageLayout from "@/components/layout/PageLayout";
import VideoModal from "@/components/ui/video-modal";
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';
import FoodCalorieCheckerCard from '@/components/home/FoodCalorieCheckerCard';
import SEO from '@/components/seo/SEO';


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
      <SEO 
        title="Catalyst Mom – Wellness, Fitness & Nutrition for Moms"
        description="Personalized workouts, meal plans, and community support for every stage of motherhood."
      />
      {/* Hero Section */}
      <HeroSection onWatchVideo={openVideoModal} />
      

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
