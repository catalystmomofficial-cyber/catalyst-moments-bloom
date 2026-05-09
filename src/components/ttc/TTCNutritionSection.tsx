import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Leaf, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TTCNutritionSection = () => {
  const fertilityFoods = [
    {
      name: "Folate-Rich Green Smoothie",
      description: "Spinach, avocado, and berry blend with prenatal nutrients",
      prep: "5 min",
      nutrients: ["Folate", "Iron", "Antioxidants"],
      icon: <Leaf className="h-4 w-4" />
    },
    {
      name: "Omega-3 Salmon Bowl",
      description: "Wild salmon with quinoa and fertility-boosting vegetables",
      prep: "15 min",
      nutrients: ["Omega-3", "Protein", "B vitamins"],
      icon: <Heart className="h-4 w-4" />
    },
    {
      name: "Fertility Power Breakfast",
      description: "Greek yogurt with walnuts, berries, and chia seeds",
      prep: "3 min",
      nutrients: ["Protein", "Healthy fats", "Antioxidants"],
      icon: <Zap className="h-4 w-4" />
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fertility-Friendly Nutrition</CardTitle>
        <CardDescription>
          Nourish your body for optimal conception
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {fertilityFoods.map((food, index) => (
          <div key={index} className="p-3 border rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-primary/10 rounded">
                  {food.icon}
                </div>
                <h4 className="font-medium text-sm">{food.name}</h4>
              </div>
              <Badge variant="secondary" className="text-xs">
                {food.prep}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{food.description}</p>
            <div className="flex flex-wrap gap-1">
              {food.nutrients.map((nutrient) => (
                <span 
                  key={nutrient}
                  className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground"
                >
                  {nutrient}
                </span>
              ))}
            </div>
          </div>
        ))}
        
        <Button className="w-full" variant="outline" asChild>
          <Link to="/meal-plan?stage=ttc">View TTC Meal Plans</Link>
        </Button>
      </CardContent>
    </Card>
  );
};