import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Video, Headphones, Download, Star, Clock, Users } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/contexts/AuthContext';

const WellnessResources = () => {
  const { profile } = useAuth();
  const stage = profile?.motherhood_stage || 'general';

  const getStageSpecificResources = () => {
    const baseResources = [
      {
        id: '1',
        title: 'Mindful Motherhood Meditation',
        description: 'Guided meditations designed specifically for mothers at every stage',
        type: 'audio',
        duration: '10-20 min',
        rating: 4.8,
        users: 1240,
        icon: <Headphones className="w-5 h-5" />,
        badge: 'Popular'
      },
      {
        id: '2',
        title: 'Self-Care Essentials Guide',
        description: 'Comprehensive guide to building sustainable self-care habits',
        type: 'ebook',
        duration: '45 min read',
        rating: 4.9,
        users: 890,
        icon: <BookOpen className="w-5 h-5" />,
        badge: 'Featured'
      },
      {
        id: '3',
        title: 'Quick Stress Relief Techniques',
        description: 'Short videos for managing stress in busy moments',
        type: 'video',
        duration: '5-15 min',
        rating: 4.7,
        users: 2100,
        icon: <Video className="w-5 h-5" />,
        badge: 'Quick Win'
      }
    ];

    const stageSpecificResources = {
      pregnant: [
        {
          id: '4',
          title: 'Pregnancy Wellness Toolkit',
          description: 'Essential wellness practices for a healthy pregnancy',
          type: 'ebook',
          duration: '60 min read',
          rating: 4.9,
          users: 756,
          icon: <BookOpen className="w-5 h-5" />,
          badge: 'Pregnancy'
        },
        {
          id: '5',
          title: 'Prenatal Breathing Exercises',
          description: 'Calming breathing techniques for pregnancy',
          type: 'audio',
          duration: '15 min',
          rating: 4.8,
          users: 623,
          icon: <Headphones className="w-5 h-5" />,
          badge: 'Pregnancy'
        }
      ],
      postpartum: [
        {
          id: '4',
          title: 'Postpartum Recovery Guide',
          description: 'Supporting your physical and emotional recovery',
          type: 'ebook',
          duration: '50 min read',
          rating: 4.9,
          users: 834,
          icon: <BookOpen className="w-5 h-5" />,
          badge: 'Postpartum'
        },
        {
          id: '5',
          title: 'New Mom Sleep Strategies',
          description: 'Maximizing rest with a newborn',
          type: 'video',
          duration: '25 min',
          rating: 4.7,
          users: 1120,
          icon: <Video className="w-5 h-5" />,
          badge: 'Postpartum'
        }
      ],
      ttc: [
        {
          id: '4',
          title: 'TTC Wellness Guide',
          description: 'Optimizing your health for conception',
          type: 'ebook',
          duration: '40 min read',
          rating: 4.8,
          users: 567,
          icon: <BookOpen className="w-5 h-5" />,
          badge: 'TTC'
        },
        {
          id: '5',
          title: 'Fertility-Focused Meditation',
          description: 'Guided practices to support your TTC journey',
          type: 'audio',
          duration: '20 min',
          rating: 4.9,
          users: 445,
          icon: <Headphones className="w-5 h-5" />,
          badge: 'TTC'
        }
      ]
    };

    return [...baseResources, ...(stageSpecificResources[stage as keyof typeof stageSpecificResources] || [])];
  };

  const resources = getStageSpecificResources();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-blue-100 text-blue-800';
      case 'audio': return 'bg-purple-100 text-purple-800';
      case 'ebook': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case 'Featured': return 'default';
      case 'Popular': return 'secondary';
      case 'Quick Win': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Wellness Resources
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Curated wellness content tailored to your motherhood journey
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <Card key={resource.id} className="h-full flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {resource.icon}
                      <Badge className={getTypeColor(resource.type)}>
                        {resource.type}
                      </Badge>
                    </div>
                    <Badge variant={getBadgeVariant(resource.badge)}>
                      {resource.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="flex-grow flex flex-col">
                  <p className="text-muted-foreground mb-4 flex-grow">
                    {resource.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {resource.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {resource.users.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{resource.rating}</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="gap-2"
                        onClick={() => {
                          // Open full article instead of just showing button
                          window.open(`/wellness/article/${resource.id}`, '_blank');
                        }}
                      >
                        <Download className="w-4 h-4" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="py-8">
                <h3 className="text-xl font-semibold mb-2">Need More Resources?</h3>
                <p className="text-muted-foreground mb-4">
                  Can't find what you're looking for? Our wellness coach can recommend personalized resources.
                </p>
                <Button asChild>
                  <a href="/wellness">Talk to Wellness Coach</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default WellnessResources;