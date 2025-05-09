import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Calendar } from "@/components/ui/calendar";
import { Activity, Baby, Calendar as CalendarIcon, CheckCircle, Heart, LineChart, Smile, Timer, User, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const Dashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return (
    <PageLayout>
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Welcome back, Ashley!</h1>
            <p className="text-muted-foreground">Here's your wellness overview for today</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Motherhood stage:</span>
            <Button variant="outline" size="sm" className="gap-2">
              <Baby className="h-4 w-4" /> Postpartum (8 weeks)
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Weekly Workouts"
            value="3/5"
            description="60% of your goal completed"
            icon={<Activity />}
            color="bg-primary/10"
          />
          <StatsCard
            title="Wellness Score"
            value="76"
            description="Improved 12% from last week"
            icon={<Heart />}
            color="bg-red-100"
          />
          <StatsCard
            title="Streak"
            value="6"
            description="Keep going! Your best is 12 days"
            icon={<CheckCircle />}
            color="bg-green-100"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="today" className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Your Plan</h2>
                <TabsList>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="week">This Week</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="today">
                <div className="space-y-4">
                  <PlanCard
                    title="10-Minute Core Workout"
                    category="Workout"
                    description="Gentle core strengthening for postpartum recovery"
                    completed={false}
                    icon={<Activity className="h-5 w-5" />}
                    time="10 mins"
                    link="/workouts/postpartum-core"
                    buttonText="Start Workout"
                    progress={0}
                    tags={["Postpartum", "Core", "Beginner"]}
                  />
                  <PlanCard
                    title="Mood Check-In"
                    category="Wellness"
                    description="Track your daily mood and emotional wellbeing"
                    completed={true}
                    icon={<Smile className="h-5 w-5" />}
                    time="2 mins"
                    link="/wellness/mood"
                    buttonText="Update"
                    progress={100}
                    tags={["Self-care", "Mental Health"]}
                  />
                  <PlanCard
                    title="Nourishing Breakfast Ideas"
                    category="Nutrition"
                    description="Quick, nutritious breakfast recipes for busy mornings"
                    completed={false}
                    icon={<Baby className="h-5 w-5" />}
                    time="5 mins"
                    link="/nutrition/recipes/breakfast"
                    buttonText="View Recipes"
                    progress={0}
                    tags={["Recipes", "Energy", "Quick"]}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="week">
                <div className="p-6 text-center border rounded-lg bg-muted/30">
                  <h3 className="font-medium mb-2">Weekly Plan Coming Soon</h3>
                  <p className="text-muted-foreground">
                    We're building your personalized weekly plan based on your goals and progress.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="mr-2 h-5 w-5" />
                  Your Progress
                </CardTitle>
                <CardDescription>
                  Track your wellness journey over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center border rounded-md bg-muted/30">
                  <p className="text-muted-foreground text-sm">
                    Progress charts will appear as you log more activities
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border pointer-events-auto"
                />
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View Schedule
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Community Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-primary/20 h-10 w-10 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm"><span className="font-medium">Jessica</span> completed the 30-day Challenge</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-primary/20 h-10 w-10 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm"><span className="font-medium">Maria</span> shared a new postpartum recipe</p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/community">View Community</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

const StatsCard = ({ title, value, description, icon, color }: StatsCardProps) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between mb-2">
        <div className={`${color} p-2 rounded-md`}>
          {icon}
        </div>
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

interface PlanCardProps {
  title: string;
  category: string;
  description: string;
  completed: boolean;
  icon: React.ReactNode;
  time: string;
  link: string;
  buttonText: string;
  progress: number;
  tags: string[];
}

const PlanCard = ({ 
  title, 
  category, 
  description, 
  completed, 
  icon, 
  time, 
  link, 
  buttonText, 
  progress,
  tags
}: PlanCardProps) => (
  <Card className={completed ? "bg-muted/30" : ""}>
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-md ${completed ? 'bg-green-100' : 'bg-primary/10'}`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{category}</p>
            <h3 className="font-semibold">{title}</h3>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Timer className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span 
            key={tag} 
            className="text-xs py-1 px-2 bg-muted rounded-full text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Progress</span>
          <span className="text-xs font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button variant={completed ? "outline" : "default"} size="sm" asChild>
          <Link to={link}>{buttonText}</Link>
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default Dashboard;
