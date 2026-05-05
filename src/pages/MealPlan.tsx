import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { MealPlanCard } from '@/components/recipes/JourneySpecificMealPlans';
import { mealPlans } from '@/data/recipeData';
import { Badge } from '@/components/ui/badge';

const STAGE_TO_JOURNEY: Record<string, string> = {
  pregnancy: 'pregnant',
  pregnant: 'pregnant',
  postpartum: 'postpartum',
  ttc: 'ttc',
};

const MealPlan = () => {
  const [searchParams] = useSearchParams();
  const stageParam = (searchParams.get('stage') || searchParams.get('focus') || '').toLowerCase();
  const journeyKey = STAGE_TO_JOURNEY[stageParam];

  const recommendedRef = useRef<HTMLElement>(null);

  const recommended = useMemo(() => {
    if (!journeyKey) return [];
    return mealPlans.filter((p: any) =>
      Array.isArray(p.journey) && p.journey.includes(journeyKey)
    );
  }, [journeyKey]);

  useEffect(() => {
    if (recommended.length === 0) return;
    const t = setTimeout(() => {
      recommendedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 250);
    return () => clearTimeout(t);
  }, [recommended]);

  return (
    <PageLayout>
      <div className="container px-4 mx-auto py-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-2">All Meal Plans</h1>
          <p className="text-muted-foreground">
            Browse every plan across journeys. Select one to get started.
          </p>
        </header>

        <main className="space-y-10">
          {recommended.length > 0 && (
            <section
              ref={recommendedRef}
              id="recommended-plans"
              aria-labelledby="recommended-plans-heading"
              className="scroll-mt-24"
            >
              <div className="flex items-center gap-2 mb-4">
                <h2 id="recommended-plans-heading" className="text-2xl font-bold">
                  Recommended for you
                </h2>
                <Badge variant="secondary" className="capitalize">{stageParam}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommended.map((plan: any) => (
                  <MealPlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            </section>
          )}

          <section aria-labelledby="all-plans">
            <h2 id="all-plans" className="text-2xl font-bold mb-4">All plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mealPlans.map((plan) => (
                <MealPlanCard key={plan.id} plan={plan as any} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </PageLayout>
  );
};

export default MealPlan;
