import PageLayout from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Clock, ChefHat, Heart, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecipeCardProps {
  title: string;
  description: string;
  prepTime: string;
  image: string;
  category: string;
  tags: string[];
  featured?: boolean;
}

const Recipes = () => {
  return (
    <PageLayout>
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Nourishing Recipes</h1>
            <p className="text-muted-foreground mb-4 md:mb-0">
              Delicious and nutritious meals designed for your motherhood journey
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
        
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Recipes</TabsTrigger>
            <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
            <TabsTrigger value="lunch">Lunch</TabsTrigger>
            <TabsTrigger value="dinner">Dinner</TabsTrigger>
            <TabsTrigger value="snacks">Snacks</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <RecipeCard 
                title="Energy-Boosting Overnight Oats"
                description="Protein-rich breakfast perfect for busy mornings"
                prepTime="5 min + overnight"
                image="https://images.unsplash.com/photo-1626078430052-97b74392654f"
                category="Breakfast"
                tags={["High Protein", "Lactation Support"]}
                featured={true}
              />
              <RecipeCard 
                title="One-Hand Veggie Wraps"
                description="Easy to eat while holding baby, packed with nutrients"
                prepTime="10 min"
                image="https://images.unsplash.com/photo-1600850056064-a8b380df8395"
                category="Lunch"
                tags={["Quick", "Vegetarian"]}
              />
              <RecipeCard 
                title="Iron-Rich Beef & Spinach Stew"
                description="Slow cooker meal to replenish postpartum iron stores"
                prepTime="15 min prep + 4h cook"
                image="https://images.unsplash.com/photo-1608500218890-c4f9019eef7f"
                category="Dinner"
                tags={["Iron Rich", "Slow Cooker"]}
              />
              <RecipeCard 
                title="Lactation-Supporting Banana Muffins"
                description="Delicious snacks that support milk production"
                prepTime="25 min"
                image="https://images.unsplash.com/photo-1606913947356-89296d414c0b"
                category="Snacks"
                tags={["Lactation", "Batch Cook"]}
              />
              <RecipeCard 
                title="Anti-Inflammatory Smoothie Bowl"
                description="Cooling and nutritious breakfast for postpartum recovery"
                prepTime="8 min"
                image="https://images.unsplash.com/photo-1638436684761-367dbfead4f3"
                category="Breakfast"
                tags={["Anti-Inflammatory", "Antioxidant"]}
              />
              <RecipeCard 
                title="Gut-Healing Bone Broth"
                description="Nutrient-dense broth to support gut health and recovery"
                prepTime="20 min + 8h simmer"
                image="https://images.unsplash.com/photo-1547592180-85f173990554"
                category="Basics"
                tags={["Gut Health", "Freezer Friendly"]}
              />
            </div>
          </TabsContent>
          
          {/* Other tab content sections would follow the same pattern - simplified for brevity */}
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
          <h2 className="text-2xl font-bold mb-6">Meal Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <AspectRatio ratio={16/9}>
                  <img 
                    src="https://images.unsplash.com/photo-1576402187878-974f70c890a5" 
                    alt="Postpartum Meal Plan" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </AspectRatio>
                <div className="absolute bottom-4 left-4 z-20">
                  <Badge className="bg-primary hover:bg-primary">2 Week Plan</Badge>
                </div>
              </div>
              <CardContent className="pt-4">
                <h3 className="text-xl font-bold mb-2">Postpartum Recovery Meal Plan</h3>
                <p className="text-muted-foreground mb-4">
                  Nutrient-dense meals designed to support healing and milk production in the fourth trimester
                </p>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">14 recipes</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">20-30 min/meal</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View Plan</Button>
              </CardFooter>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <AspectRatio ratio={16/9}>
                  <img 
                    src="https://images.unsplash.com/photo-1543339318-b43dc53e19b3" 
                    alt="Energy & Balance Meal Plan" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </AspectRatio>
                <div className="absolute bottom-4 left-4 z-20">
                  <Badge className="bg-primary hover:bg-primary">4 Week Plan</Badge>
                </div>
              </div>
              <CardContent className="pt-4">
                <h3 className="text-xl font-bold mb-2">Energy & Balance Meal Plan</h3>
                <p className="text-muted-foreground mb-4">
                  Optimize your energy levels and hormonal balance with this nutrient-balanced meal plan
                </p>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">24 recipes</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">15-40 min/meal</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View Plan</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

const RecipeCard = ({ 
  title, 
  description, 
  prepTime, 
  image,
  category,
  tags,
  featured = false
}: RecipeCardProps) => {
  return (
    <Card className={`overflow-hidden ${featured ? 'ring-2 ring-primary/50' : ''}`}>
      <div className="relative">
        <AspectRatio ratio={16/9}>
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </AspectRatio>
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-foreground">
            {category}
          </Badge>
        </div>
        {featured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-primary hover:bg-primary">Featured</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-muted-foreground text-sm mb-3">{description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{prepTime}</span>
          </div>
          <div className="flex space-x-1">
            {tags.slice(0, 2).map(tag => (
              <span 
                key={tag}
                className="text-xs py-1 px-2 bg-muted rounded-full text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild variant="ghost" className="w-full hover:bg-catalyst-copper/5 text-catalyst-copper">
          <Link to={`/recipes/${title.toLowerCase().replace(/\s+/g, '-')}`}>
            View Recipe
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Recipes;
