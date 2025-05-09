
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Calendar as CalendarIcon,
  Heart,
  MoonStar,
  SmilePlus,
  Timer,
  Utensils,
  PenLine,
} from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Wellness = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return (
    <PageLayout>
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Wellness</h1>
            <p className="text-muted-foreground">
              Track, monitor, and improve your overall wellbeing
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button>
              <PenLine className="mr-2 h-4 w-4" /> Log Today
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <WellnessQuickCard
            title="Mood"
            icon={<SmilePlus className="h-5 w-5 text-primary" />}
            value="Good"
            trend="Stable this week"
            color="bg-yellow-100"
          />
          <WellnessQuickCard
            title="Sleep"
            icon={<MoonStar className="h-5 w-5 text-primary" />}
            value="6.2h"
            trend="↑ 0.8h from last week"
            color="bg-blue-100"
          />
          <WellnessQuickCard
            title="Self-Care"
            icon={<Heart className="h-5 w-5 text-primary" />}
            value="2/3"
            trend="Daily goal progress"
            color="bg-red-100"
          />
          <WellnessQuickCard
            title="Hydration"
            icon={<Utensils className="h-5 w-5 text-primary" />}
            value="4/8"
            trend="Glasses of water"
            color="bg-blue-100"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="insights" className="mb-8">
              <TabsList>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="mood">Mood</TabsTrigger>
                <TabsTrigger value="sleep">Sleep</TabsTrigger>
                <TabsTrigger value="selfcare">Self-Care</TabsTrigger>
              </TabsList>
              
              <TabsContent value="insights" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart className="mr-2 h-5 w-5" />
                      Weekly Wellness Summary
                    </CardTitle>
                    <CardDescription>Your wellness trends over the past 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px] flex items-center justify-center border rounded-md bg-muted/30">
                      <p className="text-muted-foreground text-sm">
                        Your personalized wellness insights will appear here as you log more data
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Previous Week</Button>
                    <Button variant="outline">Next Week</Button>
                  </CardFooter>
                </Card>
                
                <div className="mt-6 space-y-6">
                  <h2 className="text-xl font-bold mb-4">Recommended for You</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <WellnessResourceCard
                      title="Sleep Strategies for New Moms"
                      description="Evidence-based tips to maximize sleep quality when dealing with nighttime feedings"
                      category="Sleep"
                      time="5 min read"
                      icon={<MoonStar className="h-5 w-5" />}
                      color="bg-blue-100"
                    />
                    <WellnessResourceCard
                      title="5-Minute Mindfulness Practices"
                      description="Quick mindfulness exercises you can do while holding your baby"
                      category="Mental Wellbeing"
                      time="Audio: 5 min"
                      icon={<Heart className="h-5 w-5" />}
                      color="bg-red-100"
                    />
                    <WellnessResourceCard
                      title="Postpartum Mood Tracker"
                      description="Learn to identify patterns in your emotional wellbeing during the postpartum period"
                      category="Mood"
                      time="Interactive Tool"
                      icon={<SmilePlus className="h-5 w-5" />}
                      color="bg-yellow-100"
                    />
                    <WellnessResourceCard
                      title="Hydration & Energy Guide"
                      description="How proper hydration affects your energy levels, milk production and recovery"
                      category="Nutrition"
                      time="8 min read"
                      icon={<Utensils className="h-5 w-5" />}
                      color="bg-green-100"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="mood">
                <div className="text-center py-8 border rounded-lg bg-muted/30">
                  <SmilePlus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <h3 className="font-medium mb-1">Mood Tracking</h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Track your daily mood to identify patterns and improve your emotional wellbeing.
                  </p>
                  <Button>Track Today's Mood</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="sleep">
                <div className="text-center py-8 border rounded-lg bg-muted/30">
                  <MoonStar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <h3 className="font-medium mb-1">Sleep Tracking</h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Monitor your sleep patterns to improve rest quality and energy levels.
                  </p>
                  <Button>Log Last Night's Sleep</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="selfcare">
                <div className="text-center py-8 border rounded-lg bg-muted/30">
                  <Heart className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <h3 className="font-medium mb-1">Self-Care Activities</h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Track and schedule regular self-care activities to maintain your wellbeing.
                  </p>
                  <Button>Add Self-Care Activity</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  Calendar
                </CardTitle>
                <CardDescription>Select a date to view or log wellness data</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border pointer-events-auto"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Timer className="mr-2 h-5 w-5" />
                  Quick Self-Care Ideas
                </CardTitle>
                <CardDescription>
                  5-minute activities to boost your wellbeing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-blue-100 h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Deep Breathing</p>
                    <p className="text-xs text-muted-foreground">5 deep breaths, focusing on exhaling longer than inhaling</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-green-100 h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Shoulder Release</p>
                    <p className="text-xs text-muted-foreground">Roll shoulders back 5 times, then forward 5 times</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-yellow-100 h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Gratitude Moment</p>
                    <p className="text-xs text-muted-foreground">Write down one thing you're grateful for today</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/wellness/self-care">View More Ideas</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

interface WellnessQuickCardProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  trend: string;
  color: string;
}

const WellnessQuickCard = ({ title, icon, value, trend, color }: WellnessQuickCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-2">
        <div className={`${color} p-2 rounded-md`}>
          {icon}
        </div>
        <span className="text-xl font-bold">{value}</span>
      </div>
      <h3 className="font-medium text-sm mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground">{trend}</p>
    </CardContent>
  </Card>
);

interface WellnessResourceCardProps {
  title: string;
  description: string;
  category: string;
  time: string;
  icon: React.ReactNode;
  color: string;
}

const WellnessResourceCard = ({ title, description, category, time, icon, color }: WellnessResourceCardProps) => (
  <Card className="card-hover">
    <CardContent className="p-6">
      <div className="flex items-start space-x-3 mb-3">
        <div className={`${color} p-2 rounded-md flex-shrink-0`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{category}</p>
          <h3 className="font-semibold mb-1">{title}</h3>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground flex items-center">
          <Timer className="h-3 w-3 mr-1" />
          {time}
        </span>
        <Button variant="link" size="sm" className="p-0">View Resource</Button>
      </div>
    </CardContent>
  </Card>
);

export default Wellness;
