import PageLayout from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, Dumbbell, Filter, Baby, Heart, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import WellnessCoachButton from '@/components/wellness-coach/WellnessCoachButton';

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

const Workouts = () => {
  return (
    <PageLayout>
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Workouts</h1>
            <p className="text-muted-foreground mb-4 md:mb-0">
              Exercise designed for your current motherhood stage: Postpartum (8 weeks)
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
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
        
        <Tabs defaultValue="recommended" className="mb-8">
          <TabsList>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="postpartum">Postpartum</TabsTrigger>
            <TabsTrigger value="quickWorkouts">Quick Workouts</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommended" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <WorkoutCard 
                title="Gentle Postpartum Core Recovery"
                description="Safe, effective exercises to rebuild core strength after childbirth"
                duration="15 min"
                level="Beginner"
                image="https://images.unsplash.com/photo-1518495973542-4542c06a5843"
                category="Postpartum"
                tags={["Core", "Recovery"]}
                featured={true}
              />
              <WorkoutCard 
                title="Energy Boost: Quick Standing Workout"
                description="No equipment needed - perfect for when baby is napping"
                duration="10 min"
                level="Beginner"
                image="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
                category="Quick"
                tags={["Energy", "No Equipment"]}
              />
              <WorkoutCard 
                title="Diastasis Recti Healing Sequence"
                description="Targeted moves to help heal abdominal separation"
                duration="20 min"
                level="Beginner"
                image="https://images.unsplash.com/photo-1521322800607-8c38375eef04"
                category="Postpartum"
                tags={["Recovery", "Core"]}
              />
              <WorkoutCard 
                title="Pelvic Floor Restoration"
                description="Strengthen your pelvic floor with these gentle exercises"
                duration="15 min"
                level="Beginner"
                image="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07"
                category="Postpartum"
                tags={["Recovery", "Strength"]}
              />
              <WorkoutCard 
                title="Baby & Me: Bonding Workout"
                description="Include your baby in this gentle workout routine"
                duration="20 min"
                level="Beginner"
                image="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                category="Baby & Me"
                tags={["Bonding", "Gentle"]}
              />
              <Card className="border border-dashed flex flex-col items-center justify-center p-6 h-full">
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full p-3 mx-auto mb-4 w-fit">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Discover More Workouts</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We have 50+ workouts designed for every stage of motherhood
                  </p>
                  <Button variant="outline">View Library</Button>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="postpartum">
            <div className="text-center py-8 border rounded-lg bg-muted/30">
              <Baby className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h3 className="font-medium mb-1">Postpartum Collection</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Specialized workouts for your postpartum recovery will appear here as you continue your journey.
              </p>
              <Button>Explore Postpartum Workouts</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="quickWorkouts">
            <div className="text-center py-8 border rounded-lg bg-muted/30">
              <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h3 className="font-medium mb-1">Quick Workouts</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Short, effective workouts designed for busy moms will appear here.
              </p>
              <Button>Explore Quick Workouts</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="favorites">
            <div className="text-center py-8 border rounded-lg bg-muted/30">
              <Heart className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h3 className="font-medium mb-1">Your Favorites</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Save your favorite workouts for easy access. They'll appear here.
              </p>
              <Button>Browse Workouts</Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Workout Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Featured Glow & Go Prenatal Program */}
            <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1584432743501-7d5c27a39189" 
                  alt="Glow & Go Prenatal Program" 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 z-20">
                  <Badge className="bg-primary hover:bg-primary text-white">✨ Featured</Badge>
                </div>
                <div className="absolute bottom-4 left-4 z-20">
                  <Badge className="bg-background/80 backdrop-blur-sm text-foreground">All Trimesters</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-primary">Glow & Go Prenatal Program</CardTitle>
                <CardDescription>
                  Train for birth. Strengthen safely. Protect your body. A physio-designed pregnancy fitness system built to support your body from bump to birth.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <Baby className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">All Levels</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">20-30 min/day</span>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    <span>Prepare for labor & reduce tearing risk</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    <span>Strengthen pelvic floor safely</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    <span>Trimester-specific guidance</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">+</div>
                    <div className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center text-xs">+</div>
                    <div className="w-6 h-6 rounded-full bg-primary/40 flex items-center justify-center text-xs">+</div>
                  </div>
                  <span className="text-xs text-muted-foreground">182 expecting moms enrolled</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-primary hover:bg-primary/90">Start Prenatal Program</Button>
              </CardFooter>
            </Card>
            <Card className="overflow-hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1518495973542-4542c06a5843" 
                  alt="Postpartum Recovery Program" 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <Badge className="bg-primary hover:bg-primary">4 Weeks</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle>Postpartum Recovery Program</CardTitle>
                <CardDescription>
                  A structured 4-week program to safely rebuild strength after birth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <Dumbbell className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Beginner</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">15-20 min/day</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">+</div>
                    <div className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center text-xs">+</div>
                    <div className="w-6 h-6 rounded-full bg-primary/40 flex items-center justify-center text-xs">+</div>
                  </div>
                  <span className="text-xs text-muted-foreground">245 moms enrolled</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Start Program</Button>
              </CardFooter>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
                  alt="Energy & Strength" 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <Badge className="bg-primary hover:bg-primary">6 Weeks</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle>Energy & Strength for Moms</CardTitle>
                <CardDescription>
                  Build sustainable energy and functional strength for mom life
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <Dumbbell className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Intermediate</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">20-30 min/day</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">+</div>
                    <div className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center text-xs">+</div>
                    <div className="w-6 h-6 rounded-full bg-primary/40 flex items-center justify-center text-xs">+</div>
                  </div>
                  <span className="text-xs text-muted-foreground">189 moms enrolled</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Start Program</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
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
