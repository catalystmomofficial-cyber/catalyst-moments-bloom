import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BookOpen, Video, Clock, Heart, Brain, Utensils, Dumbbell } from 'lucide-react';

interface EducationalResource {
  id: string;
  title: string;
  description: string;
  category: 'fertility' | 'nutrition' | 'stress' | 'exercise';
  type: 'article' | 'video';
  duration: string;
  tags: string[];
  content?: string;
}

export const TTCEducationalResources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const resources: EducationalResource[] = [
    {
      id: '1',
      title: 'Understanding Your Fertile Window',
      description: 'Learn how to identify your most fertile days and optimize conception timing.',
      category: 'fertility',
      type: 'article',
      duration: '5 min read',
      tags: ['ovulation', 'timing', 'cycle tracking'],
      content: 'Your fertile window is typically 6 days long...'
    },
    {
      id: '2',
      title: 'Fertility-Boosting Foods to Include in Your Diet',
      description: 'Discover the best foods to enhance fertility and support reproductive health.',
      category: 'nutrition',
      type: 'article',
      duration: '7 min read',
      tags: ['diet', 'supplements', 'folic acid'],
      content: 'Nutrition plays a crucial role in fertility...'
    },
    {
      id: '3',
      title: 'Gentle Yoga for Fertility',
      description: 'A 15-minute yoga sequence designed to reduce stress and support fertility.',
      category: 'exercise',
      type: 'video',
      duration: '15 min',
      tags: ['yoga', 'relaxation', 'flexibility'],
      content: 'This gentle yoga practice focuses on...'
    },
    {
      id: '4',
      title: 'Managing TTC Stress and Anxiety',
      description: 'Practical techniques for coping with the emotional challenges of trying to conceive.',
      category: 'stress',
      type: 'article',
      duration: '6 min read',
      tags: ['mental health', 'coping', 'mindfulness'],
      content: 'The journey to conception can be emotionally challenging...'
    },
    {
      id: '5',
      title: 'Meditation for Fertility',
      description: 'Guided meditation practice to reduce stress and promote relaxation during TTC.',
      category: 'stress',
      type: 'video',
      duration: '10 min',
      tags: ['meditation', 'mindfulness', 'relaxation'],
      content: 'This guided meditation helps calm your mind...'
    },
    {
      id: '6',
      title: 'Exercise Guidelines for TTC',
      description: 'Safe and effective workout routines to support your fertility journey.',
      category: 'exercise',
      type: 'article',
      duration: '4 min read',
      tags: ['fitness', 'safety', 'guidelines'],
      content: 'Regular exercise can positively impact fertility...'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fertility': return <Heart className="h-4 w-4" />;
      case 'nutrition': return <Utensils className="h-4 w-4" />;
      case 'stress': return <Brain className="h-4 w-4" />;
      case 'exercise': return <Dumbbell className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fertility': return 'bg-red-100 text-red-800';
      case 'nutrition': return 'bg-green-100 text-green-800';
      case 'stress': return 'bg-blue-100 text-blue-800';
      case 'exercise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="mr-2 h-5 w-5" />
          TTC Educational Resources
        </CardTitle>
        <CardDescription>
          Evidence-based articles and videos to support your fertility journey
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="fertility">Fertility</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="stress">Stress</TabsTrigger>
            <TabsTrigger value="exercise">Exercise</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-4 mt-4">
            {filteredResources.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No resources found matching your criteria.
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredResources.map((resource) => (
                  <Card key={resource.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between space-x-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge className={getCategoryColor(resource.category)}>
                              <span className="flex items-center space-x-1">
                                {getCategoryIcon(resource.category)}
                                <span>{resource.category}</span>
                              </span>
                            </Badge>
                            <Badge variant="outline" className="flex items-center space-x-1">
                              {resource.type === 'video' ? <Video className="h-3 w-3" /> : <BookOpen className="h-3 w-3" />}
                              <span>{resource.type}</span>
                            </Badge>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{resource.duration}</span>
                            </div>
                          </div>
                          
                          <h3 className="font-medium">{resource.title}</h3>
                          <p className="text-sm text-muted-foreground">{resource.description}</p>
                          
                          <div className="flex flex-wrap gap-1">
                            {resource.tags.map((tag) => (
                              <span key={tag} className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <Button size="sm" variant="outline">
                          {resource.type === 'video' ? 'Watch' : 'Read'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Categories */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t">
          <Button variant="outline" size="sm" className="justify-start">
            <Heart className="mr-2 h-4 w-4" />
            Fertility Basics
          </Button>
          <Button variant="outline" size="sm" className="justify-start">
            <Utensils className="mr-2 h-4 w-4" />
            Nutrition Plans
          </Button>
          <Button variant="outline" size="sm" className="justify-start">
            <Brain className="mr-2 h-4 w-4" />
            Stress Relief
          </Button>
          <Button variant="outline" size="sm" className="justify-start">
            <Dumbbell className="mr-2 h-4 w-4" />
            Exercise Guide
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};