import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Baby, Heart, Brain, Utensils, Home, CheckCircle, BookOpen, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PrepItem {
  id: string;
  category: 'recovery' | 'mental' | 'baby' | 'nutrition' | 'home';
  title: string;
  description: string;
  completed: boolean;
  importance: 'high' | 'medium' | 'low';
  week: number;
}

export const PostpartumPrepGuide = () => {
  const { toast } = useToast();
  const [prepItems, setPrepItems] = useState<PrepItem[]>([
    // Week 28-32 items
    {
      id: '1',
      category: 'recovery',
      title: 'Research Postpartum Recovery',
      description: 'Learn about physical healing, bleeding, and body changes',
      completed: false,
      importance: 'high',
      week: 30
    },
    {
      id: '2',
      category: 'mental',
      title: 'Understand Baby Blues vs PPD',
      description: 'Know the signs and when to seek help',
      completed: false,
      importance: 'high',
      week: 30
    },
    {
      id: '3',
      category: 'nutrition',
      title: 'Plan Postpartum Meals',
      description: 'Prep freezer meals or arrange meal train',
      completed: false,
      importance: 'medium',
      week: 32
    },
    // Week 33-36 items
    {
      id: '4',
      category: 'baby',
      title: 'Newborn Care Basics',
      description: 'Diaper changing, swaddling, feeding cues',
      completed: false,
      importance: 'high',
      week: 34
    },
    {
      id: '5',
      category: 'home',
      title: 'Set Up Recovery Station',
      description: 'Comfortable chair, supplies, water bottle',
      completed: false,
      importance: 'medium',
      week: 35
    },
    {
      id: '6',
      category: 'recovery',
      title: 'Gentle Movement Plan',
      description: 'Learn about safe postpartum exercises',
      completed: false,
      importance: 'medium',
      week: 35
    },
    // Week 37-40 items
    {
      id: '7',
      category: 'mental',
      title: 'Build Support Network',
      description: 'Identify people to call for help',
      completed: false,
      importance: 'high',
      week: 37
    },
    {
      id: '8',
      category: 'baby',
      title: 'Breastfeeding Resources',
      description: 'Find lactation consultant and support groups',
      completed: false,
      importance: 'high',
      week: 38
    }
  ]);

  const currentWeek = 34; // Example current week
  const availableItems = prepItems.filter(item => item.week <= currentWeek + 2);
  const completedCount = availableItems.filter(item => item.completed).length;
  const progressPercentage = availableItems.length > 0 ? (completedCount / availableItems.length) * 100 : 0;

  const toggleItem = (itemId: string) => {
    setPrepItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
    
    const item = prepItems.find(i => i.id === itemId);
    if (item && !item.completed) {
      toast({
        title: "Great progress!",
        description: `${item.title} marked as complete`,
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'recovery': return <Heart className="h-4 w-4" />;
      case 'mental': return <Brain className="h-4 w-4" />;
      case 'baby': return <Baby className="h-4 w-4" />;
      case 'nutrition': return <Utensils className="h-4 w-4" />;
      case 'home': return <Home className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'recovery': return 'bg-pink-100 text-pink-800';
      case 'mental': return 'bg-purple-100 text-purple-800';
      case 'baby': return 'bg-blue-100 text-blue-800';
      case 'nutrition': return 'bg-green-100 text-green-800';
      case 'home': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingItems = prepItems.filter(item => item.week > currentWeek + 2).slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Baby className="mr-2 h-5 w-5" />
            Postpartum Prep Guide
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Week {currentWeek}
          </Badge>
        </CardTitle>
        <CardDescription>
          Gentle preparation for your postpartum journey - no overwhelm, just loving guidance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Overview */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-sm">Your Prep Progress</h4>
            <span className="text-sm font-medium">{progressPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2 mb-2" />
          <p className="text-xs text-gray-600">
            {completedCount} of {availableItems.length} items ready. You're preparing beautifully! 💜
          </p>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">Current Focus</TabsTrigger>
            <TabsTrigger value="categories">By Topic</TabsTrigger>
            <TabsTrigger value="upcoming">Coming Up</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-3">
            <h4 className="font-medium text-sm mb-3">Ready to explore (Week {currentWeek})</h4>
            {availableItems.map((item) => (
              <div 
                key={item.id}
                className={`p-3 border rounded-lg transition-all cursor-pointer ${
                  item.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => toggleItem(item.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1 rounded ${getCategoryColor(item.category)}`}>
                        {getCategoryIcon(item.category)}
                      </div>
                      <h4 className={`font-medium text-sm ${item.completed ? 'line-through text-gray-500' : ''}`}>
                        {item.title}
                      </h4>
                      {item.completed && <CheckCircle className="h-4 w-4 text-green-600" />}
                    </div>
                    
                    <p className={`text-xs mb-2 ${item.completed ? 'text-gray-500' : 'text-gray-700'}`}>
                      {item.description}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getImportanceColor(item.importance)}>
                        {item.importance} priority
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        Week {item.week}
                      </Badge>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant={item.completed ? "secondary" : "outline"}
                    className="ml-3 text-xs h-8"
                  >
                    {item.completed ? "Done!" : "Mark Complete"}
                  </Button>
                </div>
              </div>
            ))}

            {availableItems.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">No prep items for this week yet.</p>
                <p className="text-xs mt-1">Check back as you progress! 💕</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            {['recovery', 'mental', 'baby', 'nutrition', 'home'].map((category) => {
              const categoryItems = availableItems.filter(item => item.category === category);
              if (categoryItems.length === 0) return null;
              
              return (
                <div key={category} className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    {getCategoryIcon(category)}
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h4>
                  <div className="space-y-2 ml-6">
                    {categoryItems.map((item) => (
                      <div 
                        key={item.id}
                        className={`p-2 border rounded text-sm cursor-pointer ${
                          item.completed ? 'bg-green-50 text-gray-500' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => toggleItem(item.id)}
                      >
                        <div className="flex items-center justify-between">
                          <span className={item.completed ? 'line-through' : ''}>{item.title}</span>
                          {item.completed && <CheckCircle className="h-3 w-3 text-green-600" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-3">
            <h4 className="font-medium text-sm mb-3">Coming soon (future weeks)</h4>
            {upcomingItems.map((item) => (
              <div key={item.id} className="p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 rounded bg-gray-200">
                    {getCategoryIcon(item.category)}
                  </div>
                  <h4 className="font-medium text-sm text-gray-600">{item.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    Week {item.week}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">{item.description}</p>
              </div>
            ))}
            
            {upcomingItems.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">You're all caught up!</p>
                <p className="text-xs mt-1">More prep items will unlock as you progress 🌟</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700 leading-relaxed">
            💝 <strong>Remember:</strong> This is gentle preparation, not a checklist to stress over. 
            Do what feels right for you and your family. You've got this, mama!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};