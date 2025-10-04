
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import HomeWellnessCoachButton from "@/components/wellness-coach/HomeWellnessCoachButton";
import AffiliateButton from "@/components/affiliate/AffiliateButton";

interface CTASectionProps {
  onWatchDemo: (url: string, title: string) => void;
}

const CTASection = ({ onWatchDemo }: CTASectionProps) => {
  return (
    <section className="py-20 bg-gradient-to-br from-catalyst-copper/10 to-white">
      <div className="container container-padding mx-auto text-center">
        <Badge variant="outline" className="mb-6 px-3 py-1 border-primary/30 text-primary">
          Join Us Today
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Wellness Journey?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of moms who are prioritizing their well-being and finding balance in motherhood.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <Button asChild size="lg" className="font-medium rounded-full px-8 bg-catalyst-copper hover:bg-catalyst-copper/90">
            <Link to="/dashboard">Get Started Now</Link>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="rounded-full border-catalyst-copper/20 text-catalyst-copper hover:bg-catalyst-copper/5"
            onClick={() => onWatchDemo("/catalyst-mom-demo.mp4", "Catalyst Mom - Your Complete Wellness Journey")}
          >
            <Play className="mr-2 h-4 w-4" />
            Watch Demo
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <HomeWellnessCoachButton variant="secondary" size="lg" />
          <AffiliateButton variant="outline" size="lg" className="border-catalyst-copper/20 text-catalyst-copper hover:bg-catalyst-copper/5" />
        </div>
      </div>
    </section>
  );
};

export default CTASection;
