import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users, ChefHat, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  image?: string;
}

const breakfastRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Overnight Oats with Berries',
    description: 'Nutritious make-ahead breakfast packed with fiber and antioxidants',
    prepTime: 5,
    servings: 1,
    difficulty: 'Easy',
    tags: ['Make-ahead', 'High-fiber', 'Antioxidants'],
  },
  {
    id: '2',
    title: 'Protein Smoothie Bowl',
    description: 'Energizing smoothie bowl with protein powder and fresh fruits',
    prepTime: 8,
    servings: 1,
    difficulty: 'Easy',
    tags: ['High-protein', 'Quick', 'Energizing'],
  },
  {
    id: '3',
    title: 'Avocado Toast Plus',
    description: 'Elevated avocado toast with egg and microgreens for sustained energy',
    prepTime: 10,
    servings: 1,
    difficulty: 'Easy',
    tags: ['Healthy fats', 'Protein', 'Quick'],
  },
];

export const NutritionSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-green-500" />
          Quick Breakfast Ideas
        </CardTitle>
        <CardDescription>
          Nutritious recipes for busy mornings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {breakfastRecipes.map((recipe) => (
          <div key={recipe.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-sm">{recipe.title}</h4>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {recipe.prepTime}m
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mb-3">{recipe.description}</p>
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {recipe.servings} serving
                </span>
                <span className="flex items-center gap-1">
                  <Leaf className="h-3 w-3" />
                  {recipe.difficulty}
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {recipe.tags.map((tag) => (
                <span 
                  key={tag}
                  className="text-xs py-1 px-2 bg-green-100 text-green-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to={`/recipes/${recipe.id}`}>
                View Recipe
              </Link>
            </Button>
          </div>
        ))}
        
        <Button variant="ghost" className="w-full mt-4" asChild>
          <Link to="/recipes?category=breakfast">
            View All Breakfast Recipes →
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};