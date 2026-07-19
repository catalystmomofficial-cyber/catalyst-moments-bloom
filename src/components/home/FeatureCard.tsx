
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { GlowingEffect } from "@/components/ui/glowing-effect";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="relative h-full rounded-2xl">
      <GlowingEffect
        disabled={false}
        proximity={80}
        spread={30}
        borderWidth={2}
        inactiveZone={0.4}
      />
      <Card className="relative border-0 shadow-soft rounded-2xl overflow-hidden card-hover h-full dark:bg-card dark:border dark:border-catalyst-copper/20">
        <CardContent className="p-7 flex flex-col items-center text-center">
          <div className="rounded-full bg-catalyst-copper/10 dark:bg-catalyst-copper/20 p-3 mb-4">
            {icon}
          </div>
          <h3 className="font-bold text-lg mb-3 text-foreground">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureCard;
