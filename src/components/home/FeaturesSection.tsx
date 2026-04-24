
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Activity, Baby, Calendar, Heart, Users } from "lucide-react";
import FeatureCard from './FeatureCard';
import WellnessCoachButton from "@/components/wellness-coach/WellnessCoachButton";

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
            We've combined the essential wellness tools to support your motherhood journey, all personalized to your unique needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Activity className="h-8 w-8 text-catalyst-copper" />}
            title="Adaptive Workouts"
            description="Workouts designed for TTC, pregnancy, postpartum, and busy mom life. All adjustable to your energy level and available time."
          />
          <FeatureCard
            icon={<Heart className="h-8 w-8 text-catalyst-copper" />}
            title="Wellness Tracking"
            description="Track your mood, sleep, and self-care practices with insights tailored to your motherhood stage."
          />
          <FeatureCard
            icon={<Baby className="h-8 w-8 text-catalyst-copper" />}
            title="Stage-Based Support"
            description="Get resources specific to your journey, whether you're TTC, pregnant, postpartum, or years into motherhood."
          />
          <FeatureCard
            icon={<Calendar className="h-8 w-8 text-catalyst-copper" />}
            title="Daily Guidance"
            description="Simple, achievable daily plans that flex with your unpredictable mom schedule."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-catalyst-copper" />}
            title="Supportive Community"
            description="Connect with mothers in similar life stages who understand exactly what you're going through."
          />
          <div className="bg-gradient-to-br from-catalyst-copper/5 to-catalyst-peach/20 rounded-2xl p-7 flex flex-col items-center text-center shadow-soft">
            <div className="rounded-full bg-catalyst-copper/10 p-3 mb-4">
              <div className="bg-catalyst-copper rounded-full h-8 w-8 flex items-center justify-center text-white font-bold">+</div>
            </div>
            <h3 className="font-bold text-lg mb-2">And Much More</h3>
            <p className="text-muted-foreground mb-6">
              Nutrition guidance, expert advice, personalized plans, and tools that grow with you.
            </p>
            <WellnessCoachButton variant="ghost" className="mt-auto text-catalyst-copper hover:text-catalyst-copper/90 hover:bg-catalyst-copper/5" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
