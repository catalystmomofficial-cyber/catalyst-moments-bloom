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
import { PushNotificationPrompt } from '@/components/notifications/PushNotificationPrompt';

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
      <div className="container px-3 sm:px-4 mx-auto max-w-full overflow-x-hidden">
        {!hasJourney ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <JourneySelector 
              onComplete={() => setIsJourneySelectorOpen(false)}
              isOnboarding={true}
            />
          </div>
        ) : (
          <>
            {/* Push Notification Prompt */}
            <div className="mb-4">
              <PushNotificationPrompt />
            </div>

            {/* Header Section - More Compact */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1 break-words">Welcome back, <span className="break-all">{profile?.display_name || user?.email?.split('@')[0] || 'Ashley'}</span>!</h1>
                <p className="text-muted-foreground text-sm">
                  {isTTC ? 'Your TTC journey tracker' : 
                   isPregnant ? 'Your pregnancy companion' :
                   isPostpartum ? 'Your postpartum wellness hub' :
                   isToddler ? 'Your busy mom wellness center' :
                   'Your wellness overview'}
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-2">
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
        
            {/* Subscription Status - Simplified & Compact */}
            <div className="mb-8">
              {subscribed ? (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                      <Crown className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">Premium</h3>
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                          <CheckCircle className="h-3 w-3" />
                          <span className="text-xs font-medium">Active</span>
                        </div>
                      </div>
                      {subscriptionEnd && (
                        <p className="text-xs text-muted-foreground">
                          Renews {new Date(subscriptionEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto [&>*]:flex-1 sm:[&>*]:flex-none">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleManageSubscription}
                      disabled={isManagingSubscription}
                      className="gap-1"
                    >
                      <CreditCard className="h-4 w-4" />
                      Manage
                    </Button>
                    <AffiliateButton variant="ghost" size="sm" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-lg border border-amber-200 dark:border-amber-900/30 bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-950/20">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg shrink-0">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold">Free Plan</h3>
                      <p className="text-xs text-muted-foreground">Limited access to features</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto [&>*]:flex-1 sm:[&>*]:flex-none">
                    <SubscriptionButton />
                    <AffiliateButton variant="ghost" size="sm" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats - More Compact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatsCard
                title="Weekly Workouts"
                value={`${workoutSessions.length}/${weeklyWorkoutGoal}`}
                description={`${weeklyWorkoutProgress.toFixed(0)}% complete`}
                icon={<Activity className="h-5 w-5" />}
                color="bg-primary/10"
              />
              <StatsCard
                title="Wellness Score"
                value={wellnessScore || "—"}
                description={wellnessScore ? "Recent check-ins" : "Check-in to track"}
                icon={<Heart className="h-5 w-5" />}
                color="bg-primary/10"
              />
              <StatsCard
                title="This Week"
                value={workoutSessions.reduce((sum, s) => sum + s.duration_minutes, 0)}
                description="Workout minutes"
                icon={<TrendingUp className="h-5 w-5" />}
                color="bg-primary/10"
              />
            </div>
            
            {/* Main Content Grid - Reorganized */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Primary Actions */}
              <div className="lg:col-span-2 space-y-6">
                {/* Today's Focus */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Today's Focus</span>
                      <Timer className="h-5 w-5 text-muted-foreground" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {isTTC ? <TTCTracker /> : 
                       isPregnant ? <PregnancyTracker /> : (
                        <Dialog open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
                          <DialogTrigger asChild>
                            <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow border-dashed border-2">
                              <div className="flex flex-col items-center justify-center space-y-3 h-full min-h-[100px]">
                                <CheckCircle className="h-7 w-7 text-primary" />
                                <div className="text-center">
                                  <h3 className="font-semibold text-sm">Weekly Check-In</h3>
                                  <p className="text-xs text-muted-foreground">Track progress</p>
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
                  </CardContent>
                </Card>

                {/* Recommended Activity */}
                {isPregnant ? (
                  <div className="grid grid-cols-1 gap-4">
                    <PregnancyJournal />
                    <PostpartumPrepGuide />
                  </div>
                ) : (
                  <PlanCard
                    title={isTTC ? "Fertility Flow Yoga" : "10-Minute Core Workout"}
                    category="Workout"
                    description={isTTC ? "Gentle yoga to support reproductive health" : "Gentle core strengthening"}
                    completed={false}
                    icon={<Activity className="h-5 w-5" />}
                    time={isTTC ? "20 mins" : "10 mins"}
                    link={isTTC ? "/workouts/fertility-flow-yoga" : "/workouts/postpartum-core"}
                    buttonText="Start Workout"
                    progress={0}
                    tags={isTTC ? ["TTC", "Fertility"] : ["Postpartum", "Core"]}
                  />
                )}

                {/* Challenge & Achievements - Collapsible */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MonthlyChallenge />
                  <ProfileCompletionWidget />
                </div>
              </div>
              
              {/* Right Column - Quick Access */}
              <div className="space-y-6">
                {/* Calendar */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-base">
                      <CalendarIcon className="mr-2 h-4 w-4" />
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
                </Card>

                {/* Quick Links */}
                {isTTC ? <TTCNutritionSection /> : 
                 isPregnant ? <PregnancyCommunity /> : 
                 <NutritionSection />}
                
                {/* Community Preview */}
                {isTTC ? (
                  <TTCCommunitySection />
                ) : !isPregnant ? (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-base">
                        <Users className="mr-2 h-4 w-4" />
                        Community
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="rounded-full bg-primary/20 h-8 w-8 flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate"><span className="font-medium">Jessica</span> completed the 30-day Challenge</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-3">
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link to="/community">Join Community</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ) : null}

                {/* Badges - Compact */}
                <AchievementBadges />
              </div>
            </div>

            {isTTC && (
              <div className="mt-6">
                <TTCEducationalResources />
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
};

const StatsCard = ({ title, value, description, icon, color }: StatsCardProps) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className={`${color} rounded-full p-3`}>
          {icon}
        </div>
      </div>
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