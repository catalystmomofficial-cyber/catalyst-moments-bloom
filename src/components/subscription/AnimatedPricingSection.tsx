"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import NumberFlow from "@number-flow/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlanPopularity } from "@/hooks/usePlanPopularity";

interface AnimatedPricingSectionProps {
  onSelectPlan: (priceId: string) => void;
  isLoading?: boolean;
  yearlyPriceId?: string;
  monthlyPriceId?: string;
}

const MONTHLY_PRICE_ID_DEFAULT = "price_1S546jCNwyQa1NiQYpl3OjEe";

const features = [
  "Stage-specific protocols (TTC, pregnancy, postpartum)",
  "Fertility optimization programs",
  "Birth prep + pelvic floor healing",
  "Diastasis recti repair programs",
  "Daily workouts, meal plans & community",
  "24/7 wellness coach chat",
];

const PricingSwitch = ({
  isYearly,
  onChange,
  showYearly,
}: {
  isYearly: boolean;
  onChange: (yearly: boolean) => void;
  showYearly: boolean;
}) => {
  if (!showYearly) return null;
  return (
    <div className="relative inline-flex items-center rounded-full border border-primary/20 bg-background/60 backdrop-blur p-1 shadow-soft">
      {(["Monthly", "Yearly"] as const).map((label, i) => {
        const selected = (isYearly ? 1 : 0) === i;
        return (
          <button
            key={label}
            onClick={() => onChange(i === 1)}
            className={cn(
              "relative z-10 h-9 rounded-full px-5 text-sm font-medium transition-colors",
              selected ? "text-primary-foreground" : "text-foreground/70 hover:text-foreground"
            )}
          >
            {selected && (
              <motion.span
                layoutId="pricing-pill"
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-primary to-secondary shadow-glow"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            {label}
            {label === "Yearly" && (
              <span className="ml-2 rounded-full bg-catalyst-copper/20 px-2 py-0.5 text-[10px] font-semibold text-catalyst-copper">
                Save $99
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

const AnimatedPricingSection = ({
  onSelectPlan,
  isLoading,
  yearlyPriceId,
  monthlyPriceId = MONTHLY_PRICE_ID_DEFAULT,
}: AnimatedPricingSectionProps) => {
  const [isYearly, setIsYearly] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { trackSelection } = usePlanPopularity();
  const showYearly = !!yearlyPriceId;

  const plans = [
    {
      name: "Monthly",
      description: "Flexible month-to-month access to your full wellness toolkit.",
      monthly: 29,
      yearly: 29,
      priceId: monthlyPriceId,
      popular: !showYearly || !isYearly,
      planType: "monthly" as const,
    },
    ...(showYearly
      ? [
          {
            name: "Yearly",
            description: "Best value — save $99 and commit to a full year of growth.",
            monthly: 21,
            yearly: 249,
            priceId: yearlyPriceId!,
            popular: isYearly,
            planType: "yearly" as const,
          },
        ]
      : []),
  ];

  const handleSelect = (priceId: string, planType: "monthly" | "yearly") => {
    trackSelection(planType);
    onSelectPlan(priceId);
  };

  return (
    <div ref={ref} className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-background via-accent/30 to-background py-10 px-4 sm:px-6">
      {/* Animated gradient backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-secondary/30 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-3">
          <Sparkles className="h-3 w-3" /> Choose your plan
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text">
          Plans that grow with you
        </h2>
        <p className="mt-2 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
          Trusted by 1,000+ moms across every stage of motherhood. Cancel anytime.
        </p>
        <div className="mt-6 flex justify-center">
          <PricingSwitch isYearly={isYearly} onChange={setIsYearly} showYearly={showYearly} />
        </div>
      </motion.div>

      <div className={cn("grid gap-6 max-w-4xl mx-auto", showYearly ? "md:grid-cols-2" : "md:grid-cols-1 max-w-md")}>
        {plans.map((plan, i) => {
          const displayPrice = isYearly && plan.planType === "yearly"
            ? plan.yearly
            : plan.planType === "yearly"
            ? plan.monthly
            : plan.monthly;
          const suffix = plan.planType === "yearly" && isYearly ? "/year" : "/month";
          const isHighlighted = plan.popular;

          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
            >
              <Card
                className={cn(
                  "relative h-full transition-all duration-300 hover:-translate-y-1",
                  isHighlighted
                    ? "border-2 border-primary shadow-glow bg-card"
                    : "border bg-card/80 backdrop-blur"
                )}
              >
                {isHighlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-secondary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-glow">
                    <TrendingUp className="h-3 w-3" /> Most Popular
                  </div>
                )}
                <CardHeader className="pb-2 pt-7">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight">
                      $
                      <NumberFlow value={displayPrice} />
                    </span>
                    <span className="text-muted-foreground text-sm">{suffix}</span>
                  </div>
                  {plan.planType === "yearly" && isYearly && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Just <span className="font-semibold text-primary">$20.75/mo</span> billed annually
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-3">{plan.description}</p>
                </CardHeader>
                <CardContent className="pt-2">
                  <Button
                    className={cn(
                      "w-full mb-5",
                      isHighlighted &&
                        "bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    )}
                    variant={isHighlighted ? "default" : "outline"}
                    disabled={isLoading}
                    onClick={() => handleSelect(plan.priceId, plan.planType)}
                  >
                    Get started
                  </Button>
                  <p className="text-xs font-semibold text-foreground/80 mb-3">
                    Everything included:
                  </p>
                  <ul className="space-y-2.5">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AnimatedPricingSection;
