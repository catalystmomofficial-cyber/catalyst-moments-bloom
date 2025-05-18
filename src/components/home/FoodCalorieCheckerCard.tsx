
import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FoodCalorieCheckerCard = () => {
  return (
    <Card className="border shadow-soft rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-catalyst-copper/10 p-4 mb-4">
            <Utensils className="h-6 w-6 text-catalyst-copper" />
          </div>
          <h3 className="font-bold text-xl mb-2">Food Calorie Checker</h3>
          <p className="text-muted-foreground mb-4">
            Take a photo of your food and instantly get nutritional information with our AI-powered calorie checker.
          </p>
          <Button asChild className="mt-2">
            <Link to="/food-calories">Try It Now</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodCalorieCheckerCard;
