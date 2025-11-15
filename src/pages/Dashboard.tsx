import { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Calendar } from "@/components/ui/calendar";
import { Activity, Baby, Calendar as CalendarIcon, CheckCircle, Heart, LineChart, Smile, Timer, User, Users, TrendingUp, CreditCard, Crown, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWellnessData } from '@/hooks/useWellnessData';
import { MoodCheckIn } from '@/components/dashboard/MoodCheckIn';
import { NutritionSection } from '@/components/dashboard/NutritionSection';
import { WeeklyProgress } from '@/components/dashboard/WeeklyProgress';
import { WeeklyCheckIn } from '@/components/accountability/WeeklyCheckIn';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { TTCTracker } from '@/components/ttc/TTCTracker';
import { TTCNutritionSection } from '@/components/ttc/TTCNutritionSection';
import { TTCCommunitySection } from '@/components/ttc/TTCCommunitySection';
import { TTCEducationalResources } from '@/components/ttc/TTCEducationalResources';
import { PregnancyTracker } from '@/components/pregnancy/PregnancyTracker';
import { PregnancyJournal } from '@/components/pregnancy/PregnancyJournal';
import { PregnancyWellnessDigest } from '@/components/pregnancy/PregnancyWellnessDigest';
import { PostpartumPrepGuide } from '@/components/pregnancy/PostpartumPrepGuide';
import { PregnancyCommunity } from '@/components/pregnancy/PregnancyCommunity';
import { useAuth } from '@/contexts/AuthContext';
import { useContentFilter } from '@/hooks/useContentFilter';
import JourneySelector from '@/components/onboarding/JourneySelector';
import SubscriptionStatus from '@/components/subscription/SubscriptionStatus';
import SubscriptionButton from '@/components/subscription/SubscriptionButton';
import AffiliateButton from '@/components/affiliate/AffiliateButton';
import { ProfileCompletionWidget } from '@/components/profile/ProfileCompletionWidget';
import { AchievementBadges } from '@/components/profile/AchievementBadges';
import { MonthlyChallenge } from '@/components/challenges/MonthlyChallenge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const Dashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isJourneySelectorOpen, setIsJourneySelectorOpen] = useState(false);
  const [isManagingSubscription, setIsManagingSubscription] = useState(false);
  const { wellnessScore, weeklyWorkoutProgress, weeklyWorkoutGoal, workoutSessions, refreshData } = useWellnessData();
  const { user, profile, subscribed, subscriptionTier, subscriptionEnd } = useAuth();
  const { stageInfo, hasJourney } = useContentFilter();
  
  const isTTC = stageInfo?.journey === 'ttc';
  const isPregnant = stageInfo?.journey === 'pregnant';
  const isPostpartum = stageInfo?.journey === 'postpartum';
  const isToddler = stageInfo?.journey === 'toddler';
  
  // Auto-refresh data every 30 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const handleManageSubscription = async () => {
    try {
      setIsManagingSubscription(true);
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Failed to open subscription management portal');
    } finally {
      setIsManagingSubscription(false);
    }
  };
  
  return (
    <PageLayout>
      <div className="container px-4 mx-auto">
        {!hasJourney ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <JourneySelector 
              onComplete={() => setIsJourneySelectorOpen(false)}
              isOnboarding={true}
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-1">Welcome back, {profile?.display_name || user?.email?.split('@')[0] || 'Ashley'}!</h1>
                <p className="text-muted-foreground">
                  {isTTC ? 'Your TTC journey tracker and support center' : 
                   isPregnant ? 'Your pregnancy companion and wellness guide' :
                   isPostpartum ? 'Your postpartum recovery and wellness hub' :
                   isToddler ? 'Your busy mom wellness center' :
                   'Here\'s your wellness overview for today'}
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                {subscribed && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={handleManageSubscription}
                    disabled={isManagingSubscription}
                  >
                    <CreditCard className="h-4 w-4" />
                    {isManagingSubscription ? 'Loading...' : 'Manage Subscription'}
                  </Button>
                )}
                <AffiliateButton variant="outline" size="sm" />
                <span className="text-sm text-muted-foreground">Current stage:</span>
                <Dialog open={isJourneySelectorOpen} onOpenChange={setIsJourneySelectorOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Baby className="h-4 w-4" /> 
                      {stageInfo?.phase || 'Update Journey'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <JourneySelector 
                      onComplete={() => setIsJourneySelectorOpen(false)}
                      isOnboarding={false}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
        
        {subscribed && (
          <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Crown className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">Premium Membership</h3>
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                        <CheckCircle className="h-3 w-3" />
                        <span className="text-xs font-medium">Active</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Full access to all premium features
                    </p>
                    {subscriptionEnd && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Renews on {new Date(subscriptionEnd).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    )}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleManageSubscription}
                  disabled={isManagingSubscription}
                  className="gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!subscribed && (
          <Card className="mb-8 border-amber-200 dark:border-amber-900/30 bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-950/20">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-500" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">Free Plan</h3>
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-muted rounded-full">
                        <span className="text-xs font-medium text-muted-foreground">Limited Access</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Upgrade to unlock all premium features, workouts, and meal plans
                    </p>
                  </div>
                </div>
                <SubscriptionButton />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Monthly Challenge, Profile Completion and Achievement Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="space-y-6">
            <MonthlyChallenge />
            <ProfileCompletionWidget />
          </div>
          <AchievementBadges />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Weekly Workouts"
            value={`${workoutSessions.length}/${weeklyWorkoutGoal}`}
            description={`${weeklyWorkoutProgress.toFixed(0)}% of your goal completed`}
            icon={<Activity />}
            color="bg-primary/10"
          />
          <StatsCard
            title="Wellness Score"
            value={wellnessScore || "—"}
            description={wellnessScore ? "Based on recent check-ins" : "Complete a mood check-in"}
            icon={<Heart />}
            color="bg-red-100"
          />
          <StatsCard
            title="This Week"
            value={workoutSessions.reduce((sum, s) => sum + s.duration_minutes, 0)}
            description="Total workout minutes"
            icon={<TrendingUp />}
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  {isTTC ? <TTCTracker /> : 
                   isPregnant ? <PregnancyTracker /> : (
                    <Dialog open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
                      <DialogTrigger asChild>
                        <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow border-dashed border-2">
                          <div className="flex flex-col items-center justify-center space-y-4 h-full min-h-[120px]">
                            <CheckCircle className="h-8 w-8 text-primary" />
                            <div className="text-center">
                              <h3 className="font-semibold">Weekly Check-In</h3>
                              <p className="text-sm text-muted-foreground">Track your progress</p>
                            </div>
                          </div>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                        <WeeklyCheckIn />
                      </DialogContent>
                    </Dialog>
                  )}
                  {isPregnant ? <PregnancyWellnessDigest /> : <MoodCheckIn />}
                </div>
                <div className="space-y-4">
                  {isPregnant ? (
                    <div className="grid grid-cols-1 gap-4">
                      <PregnancyJournal />
                      <PostpartumPrepGuide />
                    </div>
                  ) : (
                    <PlanCard
                      title={isTTC ? "Fertility Flow Yoga" : "10-Minute Core Workout"}
                      category="Workout"
                      description={isTTC ? "Gentle yoga to support reproductive health and reduce stress" : "Gentle core strengthening for postpartum recovery"}
                      completed={false}
                      icon={<Activity className="h-5 w-5" />}
                      time={isTTC ? "20 mins" : "10 mins"}
                      link={isTTC ? "/workouts/fertility-flow-yoga" : "/workouts/postpartum-core"}
                      buttonText="Start Workout"
                      progress={0}
                      tags={isTTC ? ["TTC", "Fertility", "Gentle"] : ["Postpartum", "Core", "Beginner"]}
                    />
                  )}
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
            {isTTC ? <TTCNutritionSection /> : 
             isPregnant ? <PregnancyCommunity /> : 
             <NutritionSection />}
            
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
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/wellness">View Schedule</Link>
                </Button>
              </CardFooter>
            </Card>
            
            {isTTC ? (
              <TTCCommunitySection />
            ) : !isPregnant ? (
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
            ) : null}
          </div>
            </div>
          </>
        )}
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
