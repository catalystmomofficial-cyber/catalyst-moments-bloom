
import { useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, ChefHat, Heart, BookOpen, Bookmark, Printer, Share2, CheckCircle, Utensils } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const RecipeDetail = () => {
  const { slug } = useParams();
  
  // In a real app, you would fetch recipe data based on the slug
  // For now we'll use mock data
  const recipe = {
    id: "1",
    title: "Energy-Boosting Overnight Oats",
    description: "This easy make-ahead breakfast is packed with protein, complex carbs, and healthy fats to give you sustained energy for the morning rush. Perfect for busy moms who need nourishment but have limited time.",
    prepTime: "5 min",
    totalTime: "8 hours (includes soaking overnight)",
    servings: 1,
    image: "https://images.unsplash.com/photo-1626078430052-97b74392654f",
    category: "Breakfast",
    tags: ["High Protein", "Lactation Support", "Make Ahead", "No Cook"],
    benefits: [
      "Rich in galactagogues that may support milk production",
      "Provides sustained energy release throughout the morning",
      "High in fiber to support postpartum digestive health",
      "Contains omega-3s for maternal and infant brain health"
    ],
    ingredients: [
      "½ cup rolled oats",
      "1 tablespoon chia seeds",
      "1 tablespoon ground flaxseed",
      "2 tablespoons chopped nuts (walnuts or almonds)",
      "½ cup milk of choice (dairy or plant-based)",
      "¼ cup Greek yogurt",
      "1 tablespoon maple syrup or honey",
      "½ teaspoon cinnamon",
      "¼ teaspoon vanilla extract",
      "½ cup berries (for topping)"
    ],
    instructions: [
      "In a mason jar or container with lid, combine oats, chia seeds, ground flaxseed, and chopped nuts.",
      "Add milk, yogurt, maple syrup, cinnamon, and vanilla. Stir well to combine.",
      "Seal container and refrigerate overnight or for at least 6 hours.",
      "In the morning, stir the mixture and add a splash more milk if it's too thick.",
      "Top with fresh berries and additional nuts if desired.",
      "Enjoy cold or warm in the microwave for 1 minute."
    ],
    nutrition: {
      calories: "390",
      protein: "15g",
      carbs: "48g",
      fat: "16g",
      fiber: "9g"
    },
    notes: "To make this recipe dairy-free, use plant-based milk and yogurt. For extra lactation support, add 1 tablespoon of brewer's yeast (though this will change the flavor profile). The basic recipe can be customized with different fruits, spices, or nut butters to prevent breakfast fatigue."
  };

  return (
    <PageLayout>
      <div className="container px-4 mx-auto">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="order-2 lg:order-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className="bg-catalyst-copper hover:bg-catalyst-copper">{recipe.category}</Badge>
                <Badge variant="outline" className="border-catalyst-copper/20 text-catalyst-copper">
                  <Clock className="mr-1 h-3 w-3" /> {recipe.prepTime} prep
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{recipe.title}</h1>
              <p className="text-muted-foreground mb-6">{recipe.description}</p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-catalyst-copper/10 flex items-center justify-center mr-3">
                    <Clock className="h-5 w-5 text-catalyst-copper" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Time</p>
                    <p className="font-medium">{recipe.totalTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-catalyst-copper/10 flex items-center justify-center mr-3">
                    <Utensils className="h-5 w-5 text-catalyst-copper" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Servings</p>
                    <p className="font-medium">{recipe.servings}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-catalyst-copper/10 flex items-center justify-center mr-3">
                    <ChefHat className="h-5 w-5 text-catalyst-copper" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Difficulty</p>
                    <p className="font-medium">Easy</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {recipe.tags.map(tag => (
                  <span 
                    key={tag}
                    className="text-xs py-1 px-3 bg-muted rounded-full text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex space-x-3">
                <Button className="bg-catalyst-copper hover:bg-catalyst-copper/90">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save Recipe
                </Button>
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="rounded-2xl overflow-hidden shadow-md">
                <AspectRatio ratio={4/3}>
                  <img 
                    src={recipe.image} 
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </AspectRatio>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="recipe" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="recipe">Recipe</TabsTrigger>
                <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recipe">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                          <BookOpen className="mr-2 h-5 w-5 text-catalyst-copper" />
                          Ingredients
                        </h2>
                        <ul className="space-y-2">
                          {recipe.ingredients.map((ingredient, index) => (
                            <li key={index} className="flex items-start pb-2 border-b border-muted">
                              <div className="w-5 h-5 rounded border border-muted flex-shrink-0 mt-0.5 mr-3"></div>
                              <span>{ingredient}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                          <ChefHat className="mr-2 h-5 w-5 text-catalyst-copper" />
                          Instructions
                        </h2>
                        <ol className="space-y-4">
                          {recipe.instructions.map((step, index) => (
                            <li key={index} className="flex">
                              <div className="w-6 h-6 rounded-full bg-catalyst-copper/10 text-catalyst-copper flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                                {index + 1}
                              </div>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="nutrition">
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-bold mb-4">Nutrition Information</h2>
                    <p className="text-sm text-muted-foreground mb-4">Per serving</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      <div className="bg-muted/30 p-4 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Calories</p>
                        <p className="font-bold text-xl">{recipe.nutrition.calories}</p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Protein</p>
                        <p className="font-bold text-xl">{recipe.nutrition.protein}</p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Carbs</p>
                        <p className="font-bold text-xl">{recipe.nutrition.carbs}</p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Fat</p>
                        <p className="font-bold text-xl">{recipe.nutrition.fat}</p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Fiber</p>
                        <p className="font-bold text-xl">{recipe.nutrition.fiber}</p>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <h3 className="font-bold mb-3">Motherhood Benefits</h3>
                    <ul className="space-y-2">
                      {recipe.benefits.map((benefit, index) => (
                        <li key={index} className="flex">
                          <CheckCircle className="h-5 w-5 text-catalyst-copper mr-2 flex-shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notes">
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-bold mb-4">Recipe Notes</h2>
                    <p className="mb-4">{recipe.notes}</p>
                    
                    <Separator className="my-6" />
                    
                    <h3 className="font-bold mb-3">Storage Instructions</h3>
                    <p>Store prepared overnight oats in an airtight container in the refrigerator for up to 4 days. The texture may thicken over time, so you may want to add a splash of milk before eating leftover portions.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card className="sticky top-20">
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-4">You Might Also Like</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1638436684761-367dbfead4f3" 
                        alt="Anti-Inflammatory Smoothie Bowl"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Anti-Inflammatory Smoothie Bowl</h4>
                      <p className="text-muted-foreground text-xs mb-1">Breakfast</p>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">8 min</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1606913947356-89296d414c0b" 
                        alt="Lactation-Supporting Banana Muffins"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Lactation-Supporting Banana Muffins</h4>
                      <p className="text-muted-foreground text-xs mb-1">Snacks</p>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">25 min</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1620741454326-75de3f80050a" 
                        alt="Protein-Packed Greek Yogurt Parfait"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Protein-Packed Greek Yogurt Parfait</h4>
                      <p className="text-muted-foreground text-xs mb-1">Breakfast</p>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">5 min</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="text-center">
                  <Button className="w-full bg-catalyst-copper hover:bg-catalyst-copper/90">
                    <Heart className="mr-2 h-4 w-4" />
                    Save to Favorites
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default RecipeDetail;
