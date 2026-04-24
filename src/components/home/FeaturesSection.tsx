
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Activity, Baby, Calendar, Heart, Users, CheckCircle2 } from "lucide-react";
import FeatureCard from './FeatureCard';


const FeaturesSection = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container container-padding mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-3 py-1 border-primary/30 text-primary">
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need in One Place</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything built specifically for TTC, Pregnancy, and Postpartum — personalised to where you actually are right now.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Activity className="h-8 w-8 text-catalyst-copper" />}
            title="Adaptive Workouts"
            description="Workouts designed for TTC, pregnancy, and postpartum. All adjustable to your energy level and available time."
          />
          <FeatureCard
            icon={<Heart className="h-8 w-8 text-catalyst-copper" />}
            title="Wellness Tracking"
            description="Track your mood, sleep, and self-care practices with insights tailored to your motherhood stage."
          />
          <FeatureCard
            icon={<Baby className="h-8 w-8 text-catalyst-copper" />}
            title="Stage-Based Support"
            description="Get resources specific to your journey cycle tracking for TTC, kick counter and contraction tracker for pregnancy, and core recovery protocols for postpartum. The right tools for exactly where you are."
          />
          <FeatureCard
            icon={<Calendar className="h-8 w-8 text-catalyst-copper" />}
            title="Daily Guidance"
            description="Simple, achievable daily plans that flex with your schedule. Complete workouts, log your wellness, and earn points as you build your streak — because progress should feel rewarding, not just exhausting."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-catalyst-copper" />}
            title="Supportive Community"
            description="Connect with mothers in similar life stages who understand exactly what you're going through."
          />
          <FeatureCard
            icon={<CheckCircle2 className="h-8 w-8 text-catalyst-copper" />}
            title="Real Accountability"
            description="Bi-weekly check-ins with a real coach keep you on track without the pressure. Your progress is tracked, your wins are celebrated, and when life gets in the way — we hold your place."
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
