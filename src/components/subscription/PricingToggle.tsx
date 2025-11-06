import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check, TrendingUp } from 'lucide-react';
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
    <div className={`grid ${showYearly ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-6 w-full max-w-4xl mx-auto`}>
      {/* Monthly Plan */}
      <Card className="relative border-2">
        {mostPopular === 'monthly' && (
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-primary/80 border-0 gap-1">
            <TrendingUp className="h-3 w-3" />
            Most Popular
          </Badge>
        )}
        <CardContent className="p-6">
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
              <span className="text-sm">Personalized wellness plans</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">AI wellness coach</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">Exclusive community access</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">Premium workout library</span>
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
      <Card className="relative border-2 border-primary shadow-lg">
        {mostPopular === 'yearly' && (
          <Badge className="absolute -top-3 left-4 bg-gradient-to-r from-primary to-primary/80 border-0 gap-1 z-10">
            <TrendingUp className="h-3 w-3" />
            Most Popular
          </Badge>
        )}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
          Save $99
        </div>
        <CardContent className="p-6">
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
              <span className="text-sm">Personalized wellness plans</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">AI wellness coach</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">Exclusive community access</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">Premium workout library</span>
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
  );
};

export default PricingToggle;
