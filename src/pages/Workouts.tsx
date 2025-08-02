import PageLayout from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, Dumbbell, Filter, Baby, Heart, Activity, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import WellnessCoachButton from '@/components/wellness-coach/WellnessCoachButton';
import GlowAndGoPrenatalCard from '@/components/workouts/GlowAndGoPrenatalCard';
import PostpartumRecoveryCard from '@/components/workouts/PostpartumRecoveryCard';
import PostpartumGlowUpChallenge from '@/components/workouts/PostpartumGlowUpChallenge';
import EnergyStrengthCard from '@/components/workouts/EnergyStrengthCard';
import BirthBallGuideCard from '@/components/workouts/BirthBallGuideCard';
import { TTCWorkoutCard } from '@/components/ttc/TTCWorkoutCard';
import { useAuth } from '@/contexts/AuthContext';
import { useContentFilter, ContentItem } from '@/hooks/useContentFilter';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import JourneySelector from '@/components/onboarding/JourneySelector';
import { useState } from 'react';

interface WorkoutCardProps {
  title: string;
  description: string;
  duration: string;
  level: string;
  image: string;
  category: string;
  tags: string[];
  featured?: boolean;
}

// Sample workout content with journey tagging
const allWorkouts: (ContentItem & WorkoutCardProps)[] = [
  // TTC Workouts
  {
    id: 'fertility-strength',
    title: "Fertility-Boosting Strength Training",
    description: "Gentle strength exercises to support reproductive health",
    duration: "25 min",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    category: "TTC",
    tags: ["Strength", "Fertility"],
    journey: ['ttc'],
    featured: true
  },
  {
    id: 'stress-relief-walk',
    title: "Stress-Relief Walking Meditation",
    description: "Mindful movement to reduce stress and promote conception",
    duration: "15 min",
    level: "All Levels",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    category: "TTC",
    tags: ["Mindfulness", "Stress Relief"],
    journey: ['ttc']
  },
  {
    id: 'hip-opening-flow',
    title: "Hip-Opening Flow",
    description: "Gentle yoga to improve circulation and flexibility",
    duration: "20 min",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1540206395-68808572332f",
    category: "TTC",
    tags: ["Yoga", "Flexibility"],
    journey: ['ttc']
  },
  // Pregnancy Workouts
  {
    id: 'prenatal-gentle',
    title: "Gentle Prenatal Yoga",
    description: "Safe, flowing movements for expecting mothers",
    duration: "30 min",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    category: "Prenatal",
    tags: ["Yoga", "Gentle", "Pregnancy"],
    journey: ['pregnant'],
    stage: ['trimester_1', 'trimester_2', 'trimester_3']
  },
  {
    id: 'prenatal-strength',
    title: "Pregnancy Strength Training",
    description: "Build strength safely during pregnancy",
    duration: "25 min",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    category: "Prenatal",
    tags: ["Strength", "Pregnancy"],
    journey: ['pregnant'],
    stage: ['trimester_2', 'trimester_3']
  },
  // Postpartum Workouts
  {
    id: 'core-recovery',
    title: "Gentle Postpartum Core Recovery",
    description: "Safe, effective exercises to rebuild core strength after childbirth",
    duration: "15 min",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843",
    category: "Postpartum",
    tags: ["Core", "Recovery"],
    journey: ['postpartum'],
    stage: ['postpartum_6-12', 'postpartum_3-6m'],
    featured: true
  },
  {
    id: 'energy-boost',
    title: "Energy Boost: Quick Standing Workout",
    description: "No equipment needed - perfect for when baby is napping",
    duration: "10 min",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    category: "Quick",
    tags: ["Energy", "No Equipment"],
    journey: ['postpartum', 'toddler']
  },
  {
    id: 'diastasis-recti',
    title: "Diastasis Recti Healing Sequence",
    description: "Targeted moves to help heal abdominal separation",
    duration: "20 min",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1521322800607-8c38375eef04",
    category: "Postpartum",
    tags: ["Recovery", "Core"],
    journey: ['postpartum'],
    stage: ['postpartum_6-12', 'postpartum_3-6m', 'postpartum_6-12m']
  },
  {
    id: 'pelvic-floor',
    title: "Pelvic Floor Restoration",
    description: "Strengthen your pelvic floor with these gentle exercises",
    duration: "15 min",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
    category: "Postpartum",
    tags: ["Recovery", "Strength"],
    journey: ['postpartum'],
    stage: ['postpartum_6-12', 'postpartum_3-6m', 'postpartum_6-12m', 'postpartum_12m+']
  },
  {
    id: 'baby-and-me',
    title: "Baby & Me: Bonding Workout",
    description: "Include your baby in this gentle workout routine",
    duration: "20 min",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    category: "Baby & Me",
    tags: ["Bonding", "Gentle"],
    journey: ['postpartum'],
    stage: ['postpartum_3-6m', 'postpartum_6-12m', 'postpartum_12m+']
  },
  // Toddler Mom Workouts
  {
    id: 'quick-hiit',
    title: "5-Minute HIIT for Busy Moms",
    description: "High-intensity workout that fits into your busy schedule",
    duration: "5 min",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    category: "Quick",
    tags: ["HIIT", "Quick", "High Energy"],
    journey: ['toddler', 'postpartum'],
    stage: ['toddler_1-2', 'toddler_2-3', 'toddler_3+', 'postpartum_12m+']
  },
  {
    id: 'playground-workout',
    title: "Playground Workout",
    description: "Exercise while your toddler plays - make the most of park time",
    duration: "20 min",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    category: "Outdoor",
    tags: ["Outdoor", "Functional", "Family"],
    journey: ['toddler'],
    stage: ['toddler_1-2', 'toddler_2-3', 'toddler_3+']
  }
];

const Workouts = () => {
  const { user, profile } = useAuth();
  const { filterContent, stageInfo, hasJourney } = useContentFilter();
  const [isJourneySelectorOpen, setIsJourneySelectorOpen] = useState(false);
  
  const filteredWorkouts = filterContent(allWorkouts);
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
                {isTTC && <TTCWorkoutCard />}
                {filteredWorkouts.slice(0, 5).map((workout) => (
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
                <Card className="border border-dashed flex flex-col items-center justify-center p-6 h-full">
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full p-3 mx-auto mb-4 w-fit">
                      <Activity className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-2">Discover More Workouts</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {filteredWorkouts.length > 5 
                        ? `${filteredWorkouts.length - 5} more workouts available for your ${stageInfo?.phase?.toLowerCase()} stage`
                        : `Specialized workouts designed for your ${stageInfo?.phase?.toLowerCase()} journey`
                      }
                    </p>
                    <Button variant="outline" asChild>
                      <Link to="/workout-plan">Create Custom Plan</Link>
                    </Button>
                  </div>
                </Card>
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
                {filteredWorkouts.filter(w => 
                  (isTTC && w.category === 'TTC') ||
                  (isPregnant && w.category === 'Prenatal') ||
                  (isPostpartum && w.category === 'Postpartum') ||
                  (isToddler && (w.category === 'Quick' || w.category === 'Outdoor'))
                ).length === 0 && (
                  <div className="col-span-full text-center py-8 border rounded-lg bg-muted/30">
                    <Baby className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <h3 className="font-medium mb-1">
                      {isTTC ? 'Fertility Collection' : 
                       isPregnant ? 'Prenatal Collection' :
                       isPostpartum ? 'Recovery Collection' : 'Quick Workout Collection'}
                    </h3>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                      Specialized workouts for your {stageInfo?.phase?.toLowerCase()} stage will appear here.
                    </p>
                    <Button asChild>
                      <Link to="/workout-plan">Create Custom Plan</Link>
                    </Button>
                  </div>
                )}
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
                {filteredWorkouts.filter(w => 
                  w.category === 'Quick' || parseInt(w.duration) <= 15
                ).length === 0 && (
                  <div className="col-span-full text-center py-8 border rounded-lg bg-muted/30">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <h3 className="font-medium mb-1">Quick Workouts</h3>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                      Short, effective workouts for your busy schedule will appear here.
                    </p>
                    <Button asChild>
                      <Link to="/workout-plan">Create Quick Plan</Link>
                    </Button>
                  </div>
                )}
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
              {isPostpartum && <PostpartumRecoveryCard />}
              {(isPostpartum || isToddler) && <EnergyStrengthCard />}
              {!isPregnant && !isPostpartum && !isToddler && (
                <Card className="border border-dashed flex flex-col items-center justify-center p-6">
                  <div className="text-center">
                    <Activity className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium mb-2">Programs for {stageInfo?.phase}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Specialized workout programs for your journey are coming soon.
                    </p>
                    <Button variant="outline" asChild>
                      <Link to="/workout-plan">Create Custom Plan</Link>
                    </Button>
                  </div>
                </Card>
              )}
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
  featured = false
}: WorkoutCardProps) => {
  return (
    <Card className={`overflow-hidden ${featured ? 'ring-2 ring-primary/50' : ''}`}>
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
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/workouts/${title.toLowerCase().replace(/\s+/g, '-')}`}>
            Start Workout
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Workouts;
