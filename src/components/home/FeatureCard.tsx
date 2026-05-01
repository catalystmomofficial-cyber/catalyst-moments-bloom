
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="border-0 shadow-soft rounded-2xl overflow-hidden card-hover dark:bg-[#2C2218] dark:border dark:border-[#B5651D]/20">
      <CardContent className="p-7 flex flex-col items-center text-center">
        <div className="rounded-full bg-catalyst-copper/10 p-3 mb-4">
          {icon}
        </div>
        <h3 className="font-bold text-lg mb-3 dark:text-[#FDF6EE]">{title}</h3>
        <p className="text-muted-foreground dark:text-[#F4C5A0]">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
