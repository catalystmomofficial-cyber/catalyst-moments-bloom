
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import WellnessCoachButton from "@/components/wellness-coach/WellnessCoachButton";

interface HeroSectionProps {
  onWatchVideo: (url: string, title: string) => void;
}

const HeroSection = ({ onWatchVideo }: HeroSectionProps) => {
  return (
    <section className="hero-gradient pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <Badge variant="outline" className="mb-4 px-4 py-1.5 border-primary/30 text-primary">
              Made for Every Stage of Motherhood
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight">
              Your Wellness <span className="text-primary">Journey</span> Through Motherhood
            </h1>
            <p className="text-lg mb-8 text-muted-foreground max-w-lg leading-relaxed">
              Catalyst Mom empowers you with personalized fitness, nutrition, self-care, and community support — designed for every stage of motherhood.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
              <Button asChild size="lg" className="font-medium rounded-full px-8">
                <Link to="/dashboard">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link to="/about" className="flex items-center">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <WellnessCoachButton variant="secondary" size="lg" className="mt-2" />
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-64 h-64 bg-primary/10 rounded-full animate-pulse-soft"></div>
              <div className="absolute bottom-8 -right-8 w-40 h-40 bg-primary/10 rounded-full animate-float"></div>
              <div className="relative z-10 rounded-2xl shadow-soft overflow-hidden max-w-sm md:max-w-md mx-auto">
                <AspectRatio ratio={4/5} className="bg-muted">
                  <img 
                    src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                    alt="Mom with baby using laptop" 
                    className="object-cover h-full w-full"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </AspectRatio>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                  <Button 
                    size="icon" 
                    className="rounded-full bg-background/90 hover:bg-background text-primary"
                    onClick={() => onWatchVideo("https://www.youtube.com/embed/j7f75AzL9Hg", "Mom Fitness Journey")}
                  >
                    <Play className="h-5 w-5 ml-0.5" />
                  </Button>
                  <span className="text-white text-sm font-medium drop-shadow-md">Watch Story</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
