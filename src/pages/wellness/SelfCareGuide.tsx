import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import SEO from '@/components/seo/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, Timer, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { QuickSelfCareIdeas } from '@/components/wellness/QuickSelfCareIdeas';

const SelfCareGuide = () => {
  const selfCareCategories = [
    {
      title: "5-Minute Energy Boosters",
      description: "Quick activities to revitalize your energy",
      icon: "⚡",
      color: "bg-orange-100 text-orange-800",
      activities: [
        "Power stretching sequence",
        "Cold water face splash",
        "High-energy playlist dance",
        "Window breathing exercise"
      ]
    },
    {
      title: "Stress Relief Techniques",
      description: "Immediate stress-busting practices",
      icon: "🧘‍♀️",
      color: "bg-purple-100 text-purple-800",
      activities: [
        "4-7-8 breathing technique",
        "Progressive muscle relaxation",
        "Mindful observation exercise",
        "Stress-release journaling"
      ]
    },
    {
      title: "Mood Lifters",
      description: "Activities to brighten your day",
      icon: "🌟",
      color: "bg-yellow-100 text-yellow-800",
      activities: [
        "Gratitude list creation",
        "Positive affirmations",
        "Funny video watching",
        "Accomplishment celebration"
      ]
    },
    {
      title: "Physical Comfort",
      description: "Body care and comfort practices",
      icon: "💆‍♀️",
      color: "bg-pink-100 text-pink-800",
      activities: [
        "Self-massage techniques",
        "Warm compress therapy",
        "Gentle stretching",
        "Posture reset routine"
      ]
    }
  ];

  return (
    <PageLayout>
      <SEO
        title="Self-Care Guide for Moms | Catalyst Mom"
        description="Practical self-care routines for busy moms — 5-minute energy boosters, stress relief techniques, and restorative practices for pregnancy and postpartum."
      />
      <div className="container px-4 mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/wellness">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Wellness
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-2">Self-Care Guide</h1>
            <p className="text-muted-foreground">
              Practical self-care activities tailored to your needs
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {selfCareCategories.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    {category.title}
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {category.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{activity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Self-Care Tips for Success
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">1</Badge>
                    <div>
                      <p className="font-medium text-sm">Start Small</p>
                      <p className="text-xs text-muted-foreground">Begin with just 2-3 minutes and build gradually</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">2</Badge>
                    <div>
                      <p className="font-medium text-sm">Be Consistent</p>
                      <p className="text-xs text-muted-foreground">Daily small actions are better than occasional big ones</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">3</Badge>
                    <div>
                      <p className="font-medium text-sm">Listen to Your Body</p>
                      <p className="text-xs text-muted-foreground">Choose activities that feel good for you in the moment</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">4</Badge>
                    <div>
                      <p className="font-medium text-sm">No Guilt Zone</p>
                      <p className="text-xs text-muted-foreground">Self-care is essential, not selfish</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <QuickSelfCareIdeas />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  Quick Reference
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="font-medium text-sm mb-1">🌅 Morning (2-5 min)</p>
                  <p className="text-xs text-muted-foreground">Gratitude, stretching, intention setting</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="font-medium text-sm mb-1">🌞 Midday (3-7 min)</p>
                  <p className="text-xs text-muted-foreground">Breathing, movement, stress relief</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="font-medium text-sm mb-1">🌙 Evening (5-10 min)</p>
                  <p className="text-xs text-muted-foreground">Relaxation, reflection, preparation</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SelfCareGuide;