import PageLayout from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, Dumbbell, Filter, Baby, Heart, Activity, Settings, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import WellnessCoachButton from '@/components/wellness-coach/WellnessCoachButton';
import GlowAndGoPrenatalCard from '@/components/workouts/GlowAndGoPrenatalCard';
import PostpartumGlowUpChallenge from '@/components/workouts/PostpartumGlowUpChallenge';
import FitFierceAdvancedCard from '@/components/workouts/FitFierceAdvancedCard';
import CoreRestoreCard from '@/components/workouts/CoreRestoreCard';
import EnergyStrengthCard from '@/components/workouts/EnergyStrengthCard';
import BirthBallGuideCard from '@/components/workouts/BirthBallGuideCard';

import { useAuth } from '@/contexts/AuthContext';
import { useContentFilter, ContentItem } from '@/hooks/useContentFilter';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import JourneySelector from '@/components/onboarding/JourneySelector';
import { useEffect, useMemo, useState } from 'react';

interface WorkoutCardProps {
  title: string;
  description: string;
  duration: string;
  level: string;
  image: string;
  category: string;
  tags: string[];
  featured?: boolean;
  locked?: boolean;
  onComplete?: () => void;
}

// Stock workouts removed — only real, built-out programs are shown via the Featured Programs section.
const allWorkouts: (ContentItem & WorkoutCardProps)[] = [];

const Workouts = () => {
  const { user, profile } = useAuth();
  const { filterContent, stageInfo, hasJourney, currentStage } = useContentFilter();
  const [isJourneySelectorOpen, setIsJourneySelectorOpen] = useState(false);
  
  const filteredWorkouts = filterContent(allWorkouts);

  const levelOrder: Record<string, number> = { 'Beginner': 0, 'All Levels': 1, 'Intermediate': 2, 'Advanced': 3 };

  const sortedWorkouts = useMemo(() => {
    const cs = currentStage || '';
    return [...filteredWorkouts].sort((a, b) => {
      const aStageMatch = Array.isArray(a.stage) && (a.stage.includes(cs) || a.stage.some(s => cs.includes(s)));
      const bStageMatch = Array.isArray(b.stage) && (b.stage.includes(cs) || b.stage.some(s => cs.includes(s)));
      if (aStageMatch !== bStageMatch) return aStageMatch ? -1 : 1;
      const aLevel = levelOrder[a.level] ?? 99;
      const bLevel = levelOrder[b.level] ?? 99;
      return aLevel - bLevel;
    });
  }, [filteredWorkouts, currentStage]);

  const progressKey = `workoutProgress:${currentStage || 'default'}`;
  const [progressIndex, setProgressIndex] = useState<number>(0);
  useEffect(() => {
    const saved = localStorage.getItem(progressKey);
    setProgressIndex(saved ? parseInt(saved) || 0 : 0);
  }, [progressKey]);

  const handleComplete = (idx: number) => {
    setProgressIndex(prev => {
      const next = Math.max(prev, idx) + 1;
      localStorage.setItem(progressKey, String(next));
      return next;
    });
  };

  const isTTC = stageInfo?.journey === 'ttc';
  const isPregnant = stageInfo?.journey === 'pregnant';
  const isPostpartum = stageInfo?.journey === 'postpartum';
  const isToddler = stageInfo?.journey === 'toddler';
  
  return (
    <PageLayout>
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Workouts</h1>
            <p className="text-muted-foreground mb-4 md:mb-0">
              {hasJourney ? (
                <>Exercise designed for your current stage: <strong>{stageInfo?.phase}</strong></>
              ) : (
                'Personalized workouts for your motherhood journey'
              )}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Dialog open={isJourneySelectorOpen} onOpenChange={setIsJourneySelectorOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  {hasJourney ? 'Update Stage' : 'Set Journey'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <JourneySelector 
                  onComplete={() => setIsJourneySelectorOpen(false)}
                  isOnboarding={false}
                />
              </DialogContent>
            </Dialog>
            <WellnessCoachButton variant="secondary" size="sm" showLabel={false} className="mr-1" />
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search workouts..." 
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {!hasJourney ? (
          <Card className="mb-8">
            <CardContent className="pt-6 text-center">
              <Baby className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Personalize Your Experience</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Tell us about your current motherhood journey to see workouts tailored specifically for you.
              </p>
              <Button onClick={() => setIsJourneySelectorOpen(true)} className="gap-2">
                <Settings className="h-4 w-4" />
                Set Up Your Journey
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="recommended" className="mb-8">
            <TabsList>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="specialized">
                {isTTC ? "Fertility Focus" : isPregnant ? "Prenatal Safe" : isPostpartum ? "Recovery" : "Quick Workouts"}
              </TabsTrigger>
              <TabsTrigger value="quickWorkouts">Quick Workouts</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
          
            <TabsContent value="recommended" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {sortedWorkouts.slice(0, 5).map((workout, idx) => (
                  <WorkoutCard 
                    key={workout.id}
                    title={workout.title}
                    description={workout.description}
                    duration={workout.duration}
                    level={workout.level}
                    image={workout.image}
                    category={workout.category}
                    tags={workout.tags}
                    featured={workout.featured}
                    locked={idx > progressIndex}
                    onComplete={() => handleComplete(idx)}
                  />
                ))}
              </div>
            </TabsContent>
          
            <TabsContent value="specialized">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkouts.filter(w => 
                  (isTTC && w.category === 'TTC') ||
                  (isPregnant && w.category === 'Prenatal') ||
                  (isPostpartum && w.category === 'Postpartum') ||
                  (isToddler && (w.category === 'Quick' || w.category === 'Outdoor'))
                ).map((workout) => (
                  <WorkoutCard 
                    key={workout.id}
                    title={workout.title}
                    description={workout.description}
                    duration={workout.duration}
                    level={workout.level}
                    image={workout.image}
                    category={workout.category}
                    tags={workout.tags}
                    featured={workout.featured}
                  />
                ))}
              </div>
            </TabsContent>
          
            <TabsContent value="quickWorkouts">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkouts.filter(w => 
                  w.category === 'Quick' || parseInt(w.duration) <= 15
                ).map((workout) => (
                  <WorkoutCard 
                    key={workout.id}
                    title={workout.title}
                    description={workout.description}
                    duration={workout.duration}
                    level={workout.level}
                    image={workout.image}
                    category={workout.category}
                    tags={workout.tags}
                    featured={workout.featured}
                  />
                ))}
              </div>
            </TabsContent>
          
            <TabsContent value="favorites">
              <div className="text-center py-8 border rounded-lg bg-muted/30">
                <Heart className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <h3 className="font-medium mb-1">Your Favorites</h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  Save your favorite workouts for easy access. They'll appear here.
                </p>
                <Button asChild>
                  <Link to="/workouts">Browse Workouts</Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
        
        {hasJourney && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Featured Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isPregnant && <GlowAndGoPrenatalCard />}
              {isPregnant && <BirthBallGuideCard />}
              {isPostpartum && <PostpartumGlowUpChallenge />}
              {isPostpartum && <FitFierceAdvancedCard />}
              {isPostpartum && <CoreRestoreCard />}
              {(isPostpartum || isToddler) && <EnergyStrengthCard />}
              {!isPregnant && !isPostpartum && !isToddler && null}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

const WorkoutCard = ({ 
  title, 
  description, 
  duration, 
  level, 
  image,
  category,
  tags,
  featured = false,
  locked = false,
  onComplete,
}: WorkoutCardProps) => {
  return (
    <Card className={`overflow-hidden ${featured ? 'ring-2 ring-primary/50' : ''} relative`}>
      {locked && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <Lock className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <Badge variant="secondary">Locked</Badge>
            <p className="text-xs text-muted-foreground mt-1">Complete previous workout to unlock</p>
          </div>
        </div>
      )}
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-foreground">
            {category}
          </Badge>
        </div>
        {featured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-primary hover:bg-primary">Featured</Badge>
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex space-x-4 mb-3">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{duration}</span>
          </div>
          <div className="flex items-center">
            <Dumbbell className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{level}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span 
              key={tag}
              className="text-xs py-1 px-2 bg-muted rounded-full text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="space-x-2">
        {locked ? (
          <Button className="w-full" disabled>
            Locked
          </Button>
        ) : (
          <>
            <Button asChild className="w-full">
              <Link to={`/workouts/${title.toLowerCase().replace(/\s+/g, '-')}`}>
                Start Workout
              </Link>
            </Button>
            {onComplete && (
              <Button variant="outline" className="w-full" onClick={onComplete}>
                Mark as done
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default Workouts;
