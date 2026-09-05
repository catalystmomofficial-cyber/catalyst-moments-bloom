
import React, { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ShimmerButton } from "@/components/ui/shimmer-button";

const ASSESSMENT_URL = "https://assessment.catalystmomofficial.com?utm_source=app-site&utm_medium=hero&utm_campaign=assessment-invite";

interface HeroSectionProps {
  onWatchVideo: (url: string, title: string) => void;
}

// Brand images (Google Stitch) — slow auto-crossfade full-bleed background.
// Falls back to the previous stock photo if the files can't load.
const heroSlides = [
  { src: "/images/home/screen2.png", alt: "Mom checking her wellness score in the Catalyst Mom app" },
  { src: "/images/home/screen1.png", alt: "Pregnant mom taking a quiet moment in a sunlit nursery" },
  { src: "/images/home/screen3.png", alt: "Mom holding her newborn at home" },
  { src: "/images/home/screen4.png", alt: "Pregnant mom breathing calmly in the nursery" },
];
const FALLBACK_SRC = "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1600&q=80";

const HeroSection = ({ onWatchVideo: _onWatchVideo }: HeroSectionProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
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
    <header className="relative overflow-hidden pt-24 md:pt-32 pb-16 md:pb-24 min-h-[560px] md:min-h-[620px] flex items-center">
      {/* ── Full-bleed animated background ── */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {liveSlides.length === 0 ? (
          <img
            src={FALLBACK_SRC}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
            fetchPriority="high"
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
                alt=""
                className={`absolute inset-0 h-full w-full object-cover object-[70%_center] transition-opacity duration-[2000ms] ease-in-out motion-reduce:transition-none ${active ? "opacity-100" : "opacity-0"}`}
                fetchPriority={i === 0 ? "high" : undefined}
                loading={i === 0 ? undefined : "lazy"}
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
        {/* Legibility scrim: lightens the whole image, then emphasises the left where the copy sits */}
        <div className="absolute inset-0 bg-background/40 md:bg-background/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/50 to-background/30 md:bg-gradient-to-r md:from-background md:via-background/75 md:to-transparent" />
      </div>

      {/* ── Foreground content ── */}
      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-xl">
          <Badge variant="outline" className="mb-4 px-4 py-1.5 border-primary/30 text-primary dark:text-catalyst-peach dark:border-catalyst-peach/40 bg-background/60 backdrop-blur-sm">
            Made for Every Stage of Motherhood
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight">
            Prenatal & Postpartum <span className="text-catalyst-copper dark:text-catalyst-gold">Fitness</span> for Every Stage of Motherhood
          </h1>
          <p className="text-lg mb-8 text-foreground/80 max-w-lg leading-relaxed">
            Whether you are trying to conceive, growing a baby, or healing postpartum Catalyst Mom gives you personalised fitness, nutrition, and a community that actually gets it.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
            <ShimmerButton
              onClick={() => navigate("/dashboard")}
              background="linear-gradient(135deg, #A15C2F, #C27B48)"
              shimmerColor="#FBEAD3"
              className="px-8 py-3.5 text-base font-semibold !text-white shadow-lg"
            >
              Get Started
            </ShimmerButton>
            {isAuthenticated ? (
              <ShimmerButton
                onClick={() => navigate("/about")}
                background="rgba(255,255,255,0.6)"
                shimmerColor="#C27B48"
                className="px-8 py-3.5 text-base font-semibold !text-catalyst-copper border border-catalyst-copper/25 backdrop-blur-sm shadow-sm"
              >
                <span className="flex items-center">
                  About Our Mission <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </ShimmerButton>
            ) : (
              <ShimmerButton
                onClick={() => { window.location.href = ASSESSMENT_URL; }}
                background="rgba(255,255,255,0.6)"
                shimmerColor="#C27B48"
                className="px-8 py-3.5 text-base font-semibold !text-catalyst-copper border border-catalyst-copper/25 backdrop-blur-sm shadow-sm"
              >
                Free Assessment
              </ShimmerButton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
