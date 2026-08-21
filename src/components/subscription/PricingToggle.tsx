import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Star, Users, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlowingShadow } from '@/components/ui/glowing-shadow';
import { usePlanPopularity } from '@/hooks/usePlanPopularity';

interface PricingToggleProps {
  onSelectPlan: (priceId: string) => void;
  isLoading?: boolean;
  yearlyPriceId?: string;
}

const BENEFITS = [
  { text: '2 private 1:1 Progression Syncs/month with your dedicated coach', bold: true },
  { text: 'Stage-specific protocols — TTC, pregnancy, postpartum', bold: false },
  { text: 'Fertility optimization programs', bold: false },
  { text: 'Birth prep + pelvic floor healing', bold: false },
  { text: 'Diastasis recti repair programs', bold: false },
  { text: 'Daily workouts, meal plans & community', bold: false },
  { text: '24/7 Catalyst AI Expert — instant answers to any wellness question', bold: false },
];

const PricingToggle = ({ onSelectPlan, isLoading, yearlyPriceId }: PricingToggleProps) => {
  const { trackSelection } = usePlanPopularity();
  const showYearly = !!yearlyPriceId;

  const handleSelect = (priceId: string, cadence: 'monthly' | 'yearly') => {
    trackSelection(cadence);
    onSelectPlan(priceId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">

      {/* Plan cards */}
      <div className={`grid ${showYearly ? 'md:grid-cols-2' : 'grid-cols-1'} gap-5`}>

        {/* Monthly */}
        <GlowingShadow radius="0.75rem">
          <Card className="relative border-2 border-primary shadow-lg h-full flex flex-col">
            <CardContent className="p-6 flex flex-col h-full">

              {/* Price */}
              <div className="text-center mb-5">
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                {/* "Locked when you join" — the only rate-justification copy needed */}
                <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  <Lock className="h-3 w-3" />
                  Your rate is locked when you join
                </div>
              </div>

              {/* Benefits */}
              <ul className="space-y-2.5 mb-6 flex-1">
                {BENEFITS.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className={`text-sm ${b.bold ? 'font-semibold' : ''}`}>{b.text}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                onClick={() => handleSelect('price_1S546jCNwyQa1NiQYpl3OjEe', 'monthly')}
                disabled={isLoading}
              >
                Get Started — $29/month
              </Button>
            </CardContent>
          </Card>
        </GlowingShadow>

        {/* Yearly — only if a live price ID is provided */}
        {showYearly && (
          <Card className="relative border-2 h-full flex flex-col">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold z-10 whitespace-nowrap">
              Save $99/year
            </div>
            <CardContent className="p-6 flex flex-col h-full">

              {/* Price */}
              <div className="text-center mb-5">
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-4xl font-bold text-primary">$249</span>
                  <span className="text-muted-foreground">/year</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">$20.75/month · billed annually</p>
                <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  <Lock className="h-3 w-3" />
                  Your rate is locked when you join
                </div>
              </div>

              {/* Same benefits */}
              <ul className="space-y-2.5 mb-6 flex-1">
                {BENEFITS.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className={`text-sm ${b.bold ? 'font-semibold' : ''}`}>{b.text}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant="outline"
                onClick={() => handleSelect(yearlyPriceId!, 'yearly')}
                disabled={isLoading}
              >
                Get Started — $249/year
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Social proof */}
      <div className="text-center space-y-5">
        <div className="flex items-center justify-center gap-8 flex-wrap">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold">2,000+ Mamas Supported</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-catalyst-copper fill-catalyst-copper" />
            <span className="text-sm font-semibold">4.9/5 Average Rating</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              quote: '"I was leaking every sneeze and my belly still looked 5 months pregnant. Three weeks in my core finally feels like mine again. I actually cried during my check-in."',
              tag: 'Postpartum',
            },
            {
              quote: '"My second VBAC was completely different. I pushed my baby out in 10 minutes. My first took over an hour of pushing. This program changed everything."',
              tag: 'VBAC Mama',
            },
            {
              quote: '"I had been trying for 8 months and felt completely lost. Two months into Catalyst Mom I finally felt like I had a real plan. Not just hope."',
              tag: 'TTC',
            },
          ].map((r, i) => (
            <Card key={i} className="border-0 shadow-soft bg-card/50">
              <CardContent className="p-4">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-catalyst-copper fill-catalyst-copper" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic">{r.quote}</p>
                <p className="text-sm font-semibold mt-2">Catalyst Mom Community · {r.tag}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
};

export default PricingToggle;
