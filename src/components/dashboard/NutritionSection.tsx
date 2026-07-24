import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { recipes } from '@/data/recipeData';

const stageToParam = (stage?: string | null) => {
  switch ((stage || '').toLowerCase()) {
    case 'ttc': return 'ttc';
    case 'pregnant':
    case 'pregnancy': return 'pregnant';
    case 'postpartum': return 'postpartum';
    default: return '';
  }
};

// Real, authored postpartum recipes from the app's own data — not hardcoded
// placeholder "avocado toast". Every user used to see the identical three
// generic breakfasts; now the card shows the app's actual recovery-focused
// food (iron, lactation support, gut-healing), which is what makes it belong
// on a postpartum dashboard instead of any diet app.
const featuredRecipes = recipes
  .filter((r) => r.journey.includes('postpartum'))
  .slice(0, 3);

export const NutritionSection = () => {
  const { profile } = useAuth();
  const stageParam = stageToParam(profile?.motherhood_stage);
  const mealPlanHref = stageParam ? `/meal-plan?stage=${stageParam}` : '/meal-plan';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-primary" />
          Recovery Nutrition
        </CardTitle>
        <CardDescription>
          Real, nourishing recipes to support your recovery
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Rows are previews, not links: there is no per-recipe detail route,
            so a per-row button would be a broken affordance (it promised "open
            this recipe" but dumped every tap on the same index). One clear CTA
            at the bottom instead — the app's single primary action for the card. */}
        {featuredRecipes.map((recipe) => (
          <div key={recipe.id} className="flex gap-3 rounded-lg border p-3">
            <img
              src={recipe.image}
              alt=""
              loading="lazy"
              className="h-14 w-14 shrink-0 rounded-md object-cover bg-muted"
              onError={(e) => {
                // External recipe photos can die (Unsplash IDs get removed).
                // Hide the broken box instead of showing an empty gray square.
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-semibold leading-snug">{recipe.title}</h4>
                <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {recipe.prepTime}
                </span>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {recipe.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full" asChild>
          <Link to={mealPlanHref}>
            View recovery meal plans →
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
