import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Apple, Droplets, Brain, Heart, CheckCircle, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DailyTip {
  id: string;
  category: 'workout' | 'nutrition' | 'hydration' | 'mindfulness' | 'sleep';
  title: string;
  description: string;
  completed: boolean;
  icon: React.ReactNode;
  action: string;
  benefit: string;
}

export const PregnancyWellnessDigest = () => {
  const { toast } = useToast();
  const [tips, setTips] = useState<DailyTip[]>([
    {
      id: '1',
      category: 'workout',
      title: 'Gentle Prenatal Yoga',
      description: 'Try cat-cow stretches to ease back tension (5 minutes)',
      completed: false,
      icon: <Activity className="h-4 w-4" />,
      action: 'Start 5-min session',
      benefit: 'Relieves back pain & improves flexibility'
    },
    {
      id: '2',
      category: 'nutrition',
      title: 'Iron-Rich Snack',
      description: 'Have spinach and hummus or a handful of almonds',
      completed: false,
      icon: <Apple className="h-4 w-4" />,
      action: 'Plan your snack',
      benefit: 'Prevents anemia & boosts energy'
    },
    {
      id: '3',
      category: 'hydration',
      title: 'Hydration Goal',
      description: 'Aim for 8-10 glasses of water today',
      completed: false,
      icon: <Droplets className="h-4 w-4" />,
      action: 'Track your intake',
      benefit: 'Supports blood volume & reduces swelling'
    },
    {
      id: '4',
      category: 'mindfulness',
      title: 'Baby Connection Time',
      description: 'Spend 5 minutes talking or singing to your baby',
      completed: true,
      icon: <Heart className="h-4 w-4" />,
      action: 'Talk to baby',
      benefit: 'Strengthens bond & reduces stress'
    },
    {
      id: '5',
      category: 'sleep',
      title: 'Sleep Prep',
      description: 'Set up your pregnancy pillow for tonight',
      completed: false,
      icon: <Brain className="h-4 w-4" />,
      action: 'Arrange pillows',
      benefit: 'Improves sleep quality & comfort'
    }
  ]);

  const completeTip = (tipId: string) => {
    setTips(prev => prev.map(tip => 
      tip.id === tipId ? { ...tip, completed: true } : tip
    ));
    
    const tip = tips.find(t => t.id === tipId);
    toast({
      title: "Great job!",
      description: `${tip?.title} completed. ${tip?.benefit}`,
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'workout': return 'bg-blue-100 text-blue-800';
      case 'nutrition': return 'bg-green-100 text-green-800';
      case 'hydration': return 'bg-cyan-100 text-cyan-800';
      case 'mindfulness': return 'bg-purple-100 text-purple-800';
      case 'sleep': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completedCount = tips.filter(tip => tip.completed).length;
  const progressPercentage = (completedCount / tips.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Today's Wellness Digest
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {completedCount}/{tips.length} Complete
          </Badge>
        </CardTitle>
        <CardDescription>
          Your personalized daily wellness plan for Week 21
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Summary */}
        <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-sm">Daily Progress</h4>
            <span className="text-sm font-medium">{progressPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-white rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            You're doing amazing! Each small step supports your pregnancy journey.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Tips</TabsTrigger>
            <TabsTrigger value="workout">Move</TabsTrigger>
            <TabsTrigger value="nutrition">Nourish</TabsTrigger>
            <TabsTrigger value="mindfulness">Mind</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {tips.map((tip) => (
              <div 
                key={tip.id} 
                className={`p-3 border rounded-lg transition-all ${
                  tip.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1 rounded ${getCategoryColor(tip.category)}`}>
                        {tip.icon}
                      </div>
                      <h4 className={`font-medium text-sm ${tip.completed ? 'line-through text-gray-500' : ''}`}>
                        {tip.title}
                      </h4>
                      {tip.completed && <CheckCircle className="h-4 w-4 text-green-600" />}
                    </div>
                    <p className={`text-xs mb-2 ${tip.completed ? 'text-gray-500' : 'text-gray-700'}`}>
                      {tip.description}
                    </p>
                    <p className="text-xs text-blue-600 font-medium">
                      💡 {tip.benefit}
                    </p>
                  </div>
                  
                  <div className="ml-3">
                    {!tip.completed ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => completeTip(tip.id)}
                        className="text-xs h-8"
                      >
                        {tip.action}
                      </Button>
                    ) : (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        Done!
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="workout" className="space-y-3">
            {tips.filter(tip => tip.category === 'workout').map((tip) => (
              <div key={tip.id} className="p-3 border rounded-lg bg-blue-50">
                <div className="flex items-center gap-2 mb-2">
                  {tip.icon}
                  <h4 className="font-medium text-sm">{tip.title}</h4>
                </div>
                <p className="text-xs text-gray-700 mb-2">{tip.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-blue-600 font-medium">💪 {tip.benefit}</p>
                  <Button size="sm" variant="outline" className="text-xs h-8">
                    {tip.action}
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-3">
            {tips.filter(tip => tip.category === 'nutrition').map((tip) => (
              <div key={tip.id} className="p-3 border rounded-lg bg-green-50">
                <div className="flex items-center gap-2 mb-2">
                  {tip.icon}
                  <h4 className="font-medium text-sm">{tip.title}</h4>
                </div>
                <p className="text-xs text-gray-700 mb-2">{tip.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-green-600 font-medium">🌱 {tip.benefit}</p>
                  <Button size="sm" variant="outline" className="text-xs h-8">
                    {tip.action}
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="mindfulness" className="space-y-3">
            {tips.filter(tip => tip.category === 'mindfulness' || tip.category === 'sleep').map((tip) => (
              <div key={tip.id} className="p-3 border rounded-lg bg-purple-50">
                <div className="flex items-center gap-2 mb-2">
                  {tip.icon}
                  <h4 className="font-medium text-sm">{tip.title}</h4>
                </div>
                <p className="text-xs text-gray-700 mb-2">{tip.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-purple-600 font-medium">🧘 {tip.benefit}</p>
                  <Button size="sm" variant="outline" className="text-xs h-8">
                    {tip.action}
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};