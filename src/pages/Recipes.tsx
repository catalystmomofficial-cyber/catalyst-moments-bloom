import PageLayout from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, ChefHat, Heart } from 'lucide-react';
import JourneySpecificRecipes from '@/components/recipes/JourneySpecificRecipes';
import JourneySpecificMealPlans from '@/components/recipes/JourneySpecificMealPlans';
import { recipes, mealPlans } from '@/data/recipeData';
import { useContentFilter } from '@/hooks/useContentFilter';

const Recipes = () => {
  const { stageInfo } = useContentFilter();

  return (
    <PageLayout>
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Nourishing Recipes</h1>
            <p className="text-muted-foreground mb-4 md:mb-0">
              {stageInfo ? `Recipes designed for your ${stageInfo.phase.toLowerCase()} journey` : 'Delicious and nutritious meals designed for your motherhood journey'}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search recipes..." 
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="plans" className="mb-8">
          <TabsList>
            <TabsTrigger value="plans">Meal Plans</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="mt-6">
            <JourneySpecificMealPlans mealPlans={mealPlans} />
          </TabsContent>

          <TabsContent value="favorites">
            <div className="text-center py-8 border rounded-lg bg-muted/30">
              <Heart className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h3 className="font-medium mb-1">Your Favorite Recipes</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Save your favorite recipes to see them here.
              </p>
              <Button asChild>
                <a href="/recipes">Browse Meal Plans</a>
              </Button>
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </PageLayout>
  );
};


export default Recipes;
