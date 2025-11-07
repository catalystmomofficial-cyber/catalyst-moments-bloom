import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check, TrendingUp, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePlanPopularity } from '@/hooks/usePlanPopularity';

interface PricingToggleProps {
  onSelectPlan: (priceId: string) => void;
  isLoading?: boolean;
  yearlyPriceId?: string; // Optional yearly price ID
}

const PricingToggle = ({ onSelectPlan, isLoading, yearlyPriceId }: PricingToggleProps) => {
  const { mostPopular, trackSelection } = usePlanPopularity();
  
  // Only show yearly option if live price ID is provided
  const showYearly = !!yearlyPriceId;

  const handleSelectPlan = (priceId: string, planType: 'monthly' | 'yearly') => {
    trackSelection(planType);
    onSelectPlan(priceId);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className={`grid ${showYearly ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-6 mb-12`}>
        {/* Monthly Plan */}
        <Card className="relative border-2 border-primary shadow-lg">
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-primary/80 border-0 gap-1 z-10">
            <TrendingUp className="h-3 w-3" />
            Most Popular
          </Badge>
        <CardContent className="p-6 mt-2">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Monthly</h3>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold">$29</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </div>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">Stage-specific protocols (TTC, pregnancy, postpartum)</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">Fertility optimization programs</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">Birth prep + pelvic floor healing</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">Diastasis recti repair programs</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">Daily workouts, meal plans & community</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">24/7 wellness coach chat</span>
            </li>
          </ul>
          
          <Button 
            className="w-full" 
            onClick={() => handleSelectPlan('price_1S546jCNwyQa1NiQYpl3OjEe', 'monthly')}
            disabled={isLoading}
          >
            Select Monthly
          </Button>
        </CardContent>
      </Card>

      {/* Yearly Plan - Only show if price ID exists */}
      {showYearly && (
      <Card className="relative border-2">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold z-10">
          Save $99
        </div>
        <CardContent className="p-6 mt-2">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Yearly</h3>
            <div className="flex items-baseline justify-center gap-2 mb-1">
              <span className="text-2xl text-muted-foreground line-through">$348</span>
              <span className="text-4xl font-bold text-primary">$249</span>
            </div>
            <span className="text-sm text-muted-foreground">$20.75/month</span>
          </div>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">Stage-specific protocols (TTC, pregnancy, postpartum)</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">Fertility optimization programs</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">Birth prep + pelvic floor healing</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">Diastasis recti repair programs</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">Daily workouts, meal plans & community</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">24/7 wellness coach chat</span>
            </li>
          </ul>
          
          <Button 
            className="w-full" 
            onClick={() => handleSelectPlan(yearlyPriceId!, 'yearly')}
            disabled={isLoading}
          >
            Select Yearly
          </Button>
        </CardContent>
      </Card>
      )}
      </div>

      {/* Social Proof Section */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-8 flex-wrap">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">1,000+ Happy Members</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-catalyst-copper fill-catalyst-copper" />
            <span className="text-lg font-semibold">4.9/5 Average Rating</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Card className="border-0 shadow-soft bg-card/50">
            <CardContent className="p-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-catalyst-copper fill-catalyst-copper" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground italic">"I was trying for 9 months with no luck. After joining Catalyst Mom and following the fertility optimization protocols, I got pregnant in 6 weeks. The app gave me everything I needed in one place best $29 I've ever spent."</p>
              <p className="text-sm font-semibold mt-2">— Maren L., Now 18 weeks pregnant</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-soft bg-card/50">
            <CardContent className="p-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-catalyst-copper fill-catalyst-copper" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground italic">"The pelvic floor + birth prep protocols changed EVERYTHING. My second labor was 6 hours (first was 24 hours). I walked in confident instead of terrified. Worth way more than $29/month."</p>
              <p className="text-sm font-semibold mt-2">— Brianna R., Mom of 2</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-soft bg-card/50">
            <CardContent className="p-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-catalyst-copper fill-catalyst-copper" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground italic">"I was leaking every sneeze and my mom pooch made me avoid mirrors. The postpartum protocols closed my gap from 3 fingers to 0.5 in 12 weeks and stopped the leaking by week 3. Best $29/month I've spent."</p>
              <p className="text-sm font-semibold mt-2">— Jade M.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PricingToggle;
