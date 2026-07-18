
import React, { useEffect, useState } from 'react';
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

// Brand images (Google Stitch) — slow auto-crossfade, no controls.
// Falls back to the previous stock photo until files are uploaded to public/images/home/.
const heroSlides = [
  { src: "/images/home/screen2.png", alt: "Mom checking her wellness score in the Catalyst Mom app" },
  { src: "/images/home/screen1.png", alt: "Pregnant mom taking a quiet moment in a sunlit nursery" },
  { src: "/images/home/screen3.png", alt: "Mom holding her newborn at home" },
  { src: "/images/home/screen4.png", alt: "Pregnant mom breathing calmly in the nursery" },
];
const FALLBACK_SRC = "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80";

const HeroSection = ({ onWatchVideo }: HeroSectionProps) => {
  const { isAuthenticated } = useAuth();
  const [slide, setSlide] = useState(0);
  const [failed, setFailed] = useState<Set<number>>(new Set());

  const liveSlides = heroSlides.filter((_, i) => !failed.has(i));

  useEffect(() => {
    if (liveSlides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setSlide((s) => s + 1), 7000);
    return () => window.clearInterval(id);
  }, [liveSlides.length]);

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
              <Button asChild size="lg" className="font-medium rounded-full px-8 bg-catalyst-copper hover:bg-catalyst-copper/90 animate-breathe-glow motion-reduce:animate-none">
                <Link to="/dashboard">Get Started</Link>
              </Button>
              {isAuthenticated ? (
                <Button asChild variant="outline" size="lg" className="rounded-full border-catalyst-copper/20 text-catalyst-copper hover:bg-catalyst-copper/5 dark:text-catalyst-gold dark:border-catalyst-gold/40 dark:hover:bg-catalyst-copper/10">
                  <Link to="/about" className="flex items-center">
                    About Our Mission <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="outline" size="lg" className="rounded-full border-catalyst-copper/20 text-catalyst-copper hover:bg-catalyst-copper/5 dark:text-catalyst-gold dark:border-catalyst-gold/40 dark:hover:bg-catalyst-copper/10">
                  <a href="https://catalystmom.online?utm_source=app-site&utm_medium=hero&utm_campaign=assessment-invite" target="_blank" rel="noopener noreferrer">
                    Free Assessment
                  </a>
                </Button>
              )}
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-sm md:max-w-md">
              <div className="absolute -top-4 -left-4 w-64 h-64 bg-catalyst-copper/10 rounded-full animate-breathe motion-reduce:animate-none"></div>
              <div className="absolute bottom-8 -right-8 w-40 h-40 bg-catalyst-copper/10 rounded-full animate-float"></div>
              <div className="relative z-10 rounded-2xl shadow-soft overflow-hidden w-full mx-auto">
                <div className="relative w-full bg-muted" style={{ aspectRatio: "3 / 2" }}>
                  {liveSlides.length === 0 ? (
                    <img
                      src={FALLBACK_SRC}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      alt="Mom with baby using laptop"
                      className="absolute inset-0 object-cover h-full w-full"
                      fetchPriority="high"
                      width={800}
                      height={1000}
                    />
                  ) : (
                    heroSlides.map((s, i) => {
                      if (failed.has(i)) return null;
                      const liveIndex = liveSlides.findIndex((ls) => ls.src === s.src);
                      const active = liveIndex === slide % liveSlides.length;
                      return (
                        <img
                          key={s.src}
                          src={s.src}
                          alt={active ? s.alt : ""}
                          aria-hidden={!active}
                          className={`absolute inset-0 object-cover h-full w-full transition-opacity duration-[1500ms] ease-in-out motion-reduce:transition-none ${active ? "opacity-100" : "opacity-0"}`}
                          fetchPriority={i === 0 ? "high" : undefined}
                          loading={i === 0 ? undefined : "lazy"}
                          width={800}
                          height={1000}
                          onError={() =>
                            setFailed((prev) => {
                              const next = new Set(prev);
                              next.add(i);
                              return next;
                            })
                          }
                        />
                      );
                    })
                  )}
                </div>


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
