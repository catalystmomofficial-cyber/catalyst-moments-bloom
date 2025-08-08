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
        
        <Tabs defaultValue="journey" className="mb-8">
          <TabsList>
            <TabsTrigger value="journey">Your Journey</TabsTrigger>
            <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
            <TabsTrigger value="lunch">Lunch</TabsTrigger>
            <TabsTrigger value="dinner">Dinner</TabsTrigger>
            <TabsTrigger value="snacks">Snacks</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
          
          <TabsContent value="journey" className="mt-6">
            <JourneySpecificRecipes recipes={recipes} />
          </TabsContent>
          
          <TabsContent value="breakfast">
            <div className="text-center py-8 border rounded-lg bg-muted/30">
              <ChefHat className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h3 className="font-medium mb-1">Breakfast Recipes</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Start your day with nourishing, energy-boosting breakfast options.
              </p>
              <Button>Browse Breakfast Recipes</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="lunch">
            <div className="text-center py-8 border rounded-lg bg-muted/30">
              <ChefHat className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h3 className="font-medium mb-1">Lunch Recipes</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Quick, nutritious midday meals for busy moms.
              </p>
              <Button>Browse Lunch Recipes</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="dinner">
            <div className="text-center py-8 border rounded-lg bg-muted/30">
              <ChefHat className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h3 className="font-medium mb-1">Dinner Recipes</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Family-friendly evening meals packed with nutrition.
              </p>
              <Button>Browse Dinner Recipes</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="snacks">
            <div className="text-center py-8 border rounded-lg bg-muted/30">
              <ChefHat className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h3 className="font-medium mb-1">Snack Recipes</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Healthy, easy snacks for sustained energy throughout the day.
              </p>
              <Button>Browse Snack Recipes</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="favorites">
            <div className="text-center py-8 border rounded-lg bg-muted/30">
              <Heart className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h3 className="font-medium mb-1">Your Favorite Recipes</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Save your favorite recipes for easy access. They'll appear here.
              </p>
              <Button>Browse All Recipes</Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mb-8">
          <JourneySpecificMealPlans mealPlans={mealPlans} />
        </div>

        {stageInfo?.journey !== 'pregnant' && (
          <div className="space-y-6">
            <div className="mt-2">
              <h2 className="text-2xl font-bold mb-2">Pregnancy Spotlight</h2>
              <p className="text-muted-foreground">Explore pregnancy-safe recipes and nutrition plans.</p>
            </div>
            <JourneySpecificRecipes recipes={recipes} overrideJourney="pregnant" />
            <JourneySpecificMealPlans mealPlans={mealPlans} overrideJourney="pregnant" />
          </div>
        )}
      </div>
    </PageLayout>
  );
};


export default Recipes;
