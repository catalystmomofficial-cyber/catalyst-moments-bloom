import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Baby, Calendar, Heart, Scale, Zap, Moon, BookOpen, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface PregnancyData {
  week: number;
  trimester: number;
  dueDate: string;
  symptoms: string[];
  mood: number;
  energy: number;
  sleep: number;
  weight: number;
}

export const PregnancyTracker = () => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [pregnancyData, setPregnancyData] = useState<PregnancyData>({
    week: 21,
    trimester: 2,
    dueDate: '2024-08-15',
    symptoms: ['Back pain', 'Cravings'],
    mood: 8,
    energy: 6,
    sleep: 7,
    weight: 145
  });

  const getWeeklyMessage = () => {
    const week = pregnancyData.week;
    const trimester = pregnancyData.trimester;
    
    if (trimester === 1) {
      return `Week ${week}: Your baby is developing rapidly! Focus on gentle movement and proper nutrition.`;
    } else if (trimester === 2) {
      return `Week ${week}: Welcome to the sweet spot! This is often when energy returns and you feel amazing.`;
    } else {
      return `Week ${week}: You're in the home stretch! Prepare for baby's arrival while taking care of yourself.`;
    }
  };

  const getPersonalizedTip = () => {
    const { symptoms, mood, energy, sleep } = pregnancyData;
    
    if (symptoms.includes('Back pain')) {
      return "Try gentle prenatal yoga or swimming to ease back discomfort. A warm bath might also help!";
    }
    if (energy < 5) {
      return "Feeling tired is so normal! Try short walks, protein snacks, and don't hesitate to rest when needed.";
    }
    if (sleep < 6) {
      return "Sleep troubles? Try a pregnancy pillow, limit caffeine after 2pm, and create a calming bedtime routine.";
    }
    if (mood < 6) {
      return "It's okay to have tough days. Consider journaling, calling a friend, or doing something small that brings you joy.";
    }
    
    return "You're doing amazing! Keep up the great work with your self-care routine.";
  };

  const handleLogSymptom = (symptom: string) => {
    setPregnancyData(prev => ({
      ...prev,
      symptoms: [...prev.symptoms, symptom]
    }));
    
    toast({
      title: "Symptom logged",
      description: `${symptom} has been added to your pregnancy tracker`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Baby className="mr-2 h-5 w-5" />
            Pregnancy Journey
          </div>
          <Badge variant="secondary" className="bg-pink-100 text-pink-800">
            Week {pregnancyData.week}
          </Badge>
        </CardTitle>
        <CardDescription>
          {getWeeklyMessage()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            {/* Current Status */}
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold mb-1">
                {pregnancyData.trimester === 1 ? '1st' : pregnancyData.trimester === 2 ? '2nd' : '3rd'} Trimester
              </div>
              <p className="text-sm text-muted-foreground">
                Week {pregnancyData.week} • Due {new Date(pregnancyData.dueDate).toLocaleDateString()}
              </p>
            </div>

            {/* Quick Tracking */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Heart className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">{pregnancyData.mood}/10</span>
                </div>
                <p className="text-xs text-blue-700 mt-1">Mood Today</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">{pregnancyData.energy}/10</span>
                </div>
                <p className="text-xs text-green-700 mt-1">Energy Level</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Moon className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">{pregnancyData.sleep}/10</span>
                </div>
                <p className="text-xs text-purple-700 mt-1">Sleep Quality</p>
              </div>
              <div className="p-3 bg-pink-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Scale className="h-4 w-4 text-pink-600" />
                  <span className="text-sm font-medium">{pregnancyData.weight}lbs</span>
                </div>
                <p className="text-xs text-pink-700 mt-1">Current Weight</p>
              </div>
            </div>

            {/* Personalized Tip */}
            <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
              <h4 className="font-medium text-sm mb-2 flex items-center">
                <MessageCircle className="h-4 w-4 mr-2 text-pink-600" />
                Your Daily Tip
              </h4>
              <p className="text-sm text-gray-700">{getPersonalizedTip()}</p>
            </div>
          </TabsContent>

          <TabsContent value="symptoms" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Current Symptoms</h4>
              <div className="flex flex-wrap gap-2">
                {pregnancyData.symptoms.map((symptom, index) => (
                  <Badge key={index} variant="outline" className="bg-pink-50 border-pink-200">
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Quick Log</h4>
              <div className="grid grid-cols-2 gap-2">
                {['Nausea', 'Heartburn', 'Fatigue', 'Swelling', 'Kicks felt', 'Braxton Hicks'].map((symptom) => (
                  <Button
                    key={symptom}
                    variant="outline"
                    size="sm"
                    onClick={() => handleLogSymptom(symptom)}
                    className="text-xs"
                  >
                    {symptom}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Week {pregnancyData.week} Development</h4>
                <p className="text-sm text-gray-700">
                  Your baby is about the size of a carrot! They're developing their senses and you might feel more movement.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Your Body This Week</h4>
                <p className="text-sm text-gray-700">
                  Your belly is really showing now! Back pain is common as your center of gravity shifts. Stay active but listen to your body.
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Wellness Focus</h4>
                <p className="text-sm text-gray-700">
                  Focus on calcium-rich foods, gentle exercise, and preparing your birth plan. You're doing great!
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};