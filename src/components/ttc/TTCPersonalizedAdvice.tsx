import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Calendar, Heart, Utensils, Dumbbell, Brain, Droplets, Thermometer } from 'lucide-react';

interface AdviceItem {
  id: string;
  title: string;
  description: string;
  type: 'nutrition' | 'exercise' | 'wellness' | 'timing' | 'lifestyle';
  priority: 'high' | 'medium' | 'low';
  icon: React.ReactNode;
  actionable: boolean;
}

interface TTCPersonalizedAdviceProps {
  cycleDay?: number;
  cyclePhase?: 'menstrual' | 'follicular' | 'fertile' | 'luteal';
  moodScore?: number;
  stressLevel?: number;
  energyLevel?: number;
}

export const TTCPersonalizedAdvice = ({ 
  cycleDay = 14, 
  cyclePhase = 'fertile',
  moodScore = 7,
  stressLevel = 4,
  energyLevel = 6
}: TTCPersonalizedAdviceProps) => {
  const [advice, setAdvice] = useState<AdviceItem[]>([]);

  useEffect(() => {
    generatePersonalizedAdvice();
  }, [cycleDay, cyclePhase, moodScore, stressLevel, energyLevel]);

  const generatePersonalizedAdvice = () => {
    let newAdvice: AdviceItem[] = [];

    // Cycle-based advice
    if (cyclePhase === 'fertile') {
      newAdvice.push({
        id: 'fertile-timing',
        title: 'Optimal Conception Window',
        description: 'You\'re in your fertile window! Consider intimate time every other day for the next 3-4 days.',
        type: 'timing',
        priority: 'high',
        icon: <Calendar className="h-4 w-4" />,
        actionable: true
      });

      newAdvice.push({
        id: 'fertile-nutrition',
        title: 'Fertility-Boosting Foods',
        description: 'Focus on foods rich in folate, iron, and antioxidants. Try spinach, berries, and lean proteins.',
        type: 'nutrition',
        priority: 'high',
        icon: <Utensils className="h-4 w-4" />,
        actionable: true
      });
    }

    if (cyclePhase === 'luteal') {
      newAdvice.push({
        id: 'luteal-rest',
        title: 'Gentle Movement',
        description: 'Focus on gentle activities like walking or yoga. Avoid intense workouts during the two-week wait.',
        type: 'exercise',
        priority: 'medium',
        icon: <Dumbbell className="h-4 w-4" />,
        actionable: true
      });
    }

    if (cyclePhase === 'menstrual') {
      newAdvice.push({
        id: 'menstrual-selfcare',
        title: 'Self-Care Focus',
        description: 'Listen to your body. Gentle stretching, warm baths, and iron-rich foods can help.',
        type: 'wellness',
        priority: 'medium',
        icon: <Heart className="h-4 w-4" />,
        actionable: true
      });
    }

    // Stress-based advice
    if (stressLevel >= 7) {
      newAdvice.push({
        id: 'high-stress',
        title: 'Stress Reduction Priority',
        description: 'High stress can impact fertility. Try 10 minutes of deep breathing or meditation today.',
        type: 'wellness',
        priority: 'high',
        icon: <Brain className="h-4 w-4" />,
        actionable: true
      });
    }

    // Energy-based advice
    if (energyLevel <= 4) {
      newAdvice.push({
        id: 'low-energy',
        title: 'Energy Boost Strategy',
        description: 'Low energy detected. Ensure 8+ hours sleep, stay hydrated, and consider B-complex vitamins.',
        type: 'lifestyle',
        priority: 'medium',
        icon: <Droplets className="h-4 w-4" />,
        actionable: true
      });
    }

    // Mood-based advice
    if (moodScore <= 5) {
      newAdvice.push({
        id: 'mood-support',
        title: 'Mood Enhancement',
        description: 'Consider gentle exercise, sunlight exposure, or connecting with your support network.',
        type: 'wellness',
        priority: 'medium',
        icon: <Heart className="h-4 w-4" />,
        actionable: true
      });
    }

    // General TTC advice
    newAdvice.push({
      id: 'hydration',
      title: 'Stay Hydrated',
      description: 'Aim for 8-10 glasses of water daily to support cervical mucus production and overall health.',
      type: 'lifestyle',
      priority: 'low',
      icon: <Droplets className="h-4 w-4" />,
      actionable: true
    });

    newAdvice.push({
      id: 'temperature-tracking',
      title: 'Temperature Tracking',
      description: 'Track your basal body temperature first thing in the morning for cycle insights.',
      type: 'timing',
      priority: 'medium',
      icon: <Thermometer className="h-4 w-4" />,
      actionable: true
    });

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    newAdvice.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    setAdvice(newAdvice.slice(0, 5)); // Limit to top 5 pieces of advice
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'nutrition': return 'bg-green-100 text-green-800';
      case 'exercise': return 'bg-purple-100 text-purple-800';
      case 'wellness': return 'bg-blue-100 text-blue-800';
      case 'timing': return 'bg-pink-100 text-pink-800';
      case 'lifestyle': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5" />
          Personalized TTC Advice
        </CardTitle>
        <CardDescription>
          Tailored guidance based on your cycle, mood, and wellness data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {advice.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            Complete your daily check-ins to receive personalized advice!
          </div>
        ) : (
          <div className="space-y-3">
            {advice.map((item) => (
              <Card key={item.id} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between space-x-4">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="p-2 bg-primary/10 rounded-full">
                        {item.icon}
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{item.title}</h4>
                          <Badge className={getPriorityColor(item.priority)} variant="secondary">
                            {item.priority}
                          </Badge>
                          <Badge className={getTypeColor(item.type)} variant="secondary">
                            {item.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    {item.actionable && (
                      <Button size="sm" variant="outline">
                        Learn More
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Advice updates based on your daily check-ins and cycle tracking.
            Always consult with your healthcare provider for medical guidance.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};