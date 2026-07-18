
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import HomeWellnessCoachButton from "@/components/wellness-coach/HomeWellnessCoachButton";
import { useAuth } from "@/contexts/AuthContext";

interface HeroSectionProps {
  onWatchVideo: (url: string, title: string) => void;
}

const HeroSection = ({ onWatchVideo }: HeroSectionProps) => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="hero-gradient pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <Badge variant="outline" className="mb-4 px-4 py-1.5 border-primary/30 text-primary dark:text-catalyst-peach dark:border-catalyst-peach/40">
              Made for Every Stage of Motherhood
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight">
              Prenatal & Postpartum <span className="text-catalyst-copper dark:text-catalyst-gold">Fitness</span> for Every Stage of Motherhood
            </h1>
            <p className="text-lg mb-8 text-muted-foreground max-w-lg leading-relaxed">
              Whether you are trying to conceive, growing a baby, or healing postpartum Catalyst Mom gives you personalised fitness, nutrition, and a community that actually gets it.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
              {isAuthenticated ? (
                <>
                  <Button asChild size="lg" className="font-medium rounded-full px-8 bg-catalyst-copper hover:bg-catalyst-copper/90 animate-breathe-glow motion-reduce:animate-none">
                    <Link to="/dashboard">Get Started</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-full border-catalyst-copper/20 text-catalyst-copper hover:bg-catalyst-copper/5 dark:text-catalyst-gold dark:border-catalyst-gold/40 dark:hover:bg-catalyst-copper/10">
                    <Link to="/about" className="flex items-center">
                      About Our Mission <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg" className="font-medium rounded-full px-8 bg-catalyst-copper hover:bg-catalyst-copper/90 animate-breathe-glow motion-reduce:animate-none">
                    <a href="https://catalystmom.online?utm_source=app-site&utm_medium=hero&utm_campaign=assessment-invite">
                      Take the Free 2-Minute Assessment
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-full border-catalyst-copper/20 text-catalyst-copper hover:bg-catalyst-copper/5 dark:text-catalyst-gold dark:border-catalyst-gold/40 dark:hover:bg-catalyst-copper/10">
                    <Link to="/login">Log In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-64 h-64 bg-catalyst-copper/10 rounded-full animate-breathe motion-reduce:animate-none"></div>
              <div className="absolute bottom-8 -right-8 w-40 h-40 bg-catalyst-copper/10 rounded-full animate-float"></div>
              <div className="relative z-10 rounded-2xl shadow-soft overflow-hidden max-w-sm md:max-w-md mx-auto">
                <AspectRatio ratio={4/5} className="bg-muted">
                  <img
                    src="/images/home/hero-app.jpg"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    alt="Mom checking her wellness progress in the Catalyst Mom app"
                    className="object-cover h-full w-full animate-[breathe_12s_ease-in-out_infinite] motion-reduce:animate-none"
                    fetchPriority="high"
                    width={800}
                    height={1000}
                    onError={(e) => {
                      // Fallback until brand images are uploaded to public/images/home/
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80";
                      e.currentTarget.onerror = null;
                    }}
                  />
                </AspectRatio>

                <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                  <Button
                    size="icon"
                    className="rounded-full bg-white/90 hover:bg-white text-catalyst-copper"
                    aria-label="Watch video story"
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
    </header>
  );
};

export default HeroSection;
