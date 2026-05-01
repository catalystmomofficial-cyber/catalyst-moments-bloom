import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PremiumGuard from '@/components/subscription/PremiumGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Calendar as CalendarIcon,
  Heart,
  MoonStar,
  SmilePlus,
  Timer,
  Utensils,
  PenLine,
  Sparkles,
} from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Link } from 'react-router-dom';
import WellnessCoachButton from '@/components/wellness-coach/WellnessCoachButton';
import { MoodCheckIn } from '@/components/dashboard/MoodCheckIn';
import { SleepTracker } from '@/components/wellness/SleepTracker';
import { SelfCareTracker } from '@/components/wellness/SelfCareTracker';
import { PersonalizedRecommendations } from '@/components/wellness/PersonalizedRecommendations';
import { QuickSelfCareIdeas } from '@/components/wellness/QuickSelfCareIdeas';
import { useWellnessData } from '@/hooks/useWellnessData';
import { useContentFilter } from '@/hooks/useContentFilter';
import { useAssessmentData } from '@/hooks/useAssessmentData';
import { Skeleton } from '@/components/ui/skeleton';

const Wellness = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("insights");
  const { wellnessEntries, wellnessScore, loading } = useWellnessData();
  const { currentJourney, currentStage } = useContentFilter();
  const { assessmentData, scoreNumber: assessmentScore, loading: assessmentLoading } = useAssessmentData();
  
  // Get latest wellness data for display
  const latestEntry = wellnessEntries[0];
  // Use assessment score as baseline if user has no logged wellness data yet
  const baselineFromAssessment = assessmentScore !== null && !latestEntry;
  const moodDisplay = latestEntry
    ? `${latestEntry.mood_score}/10`
    : baselineFromAssessment
      ? `${Math.round(assessmentScore!)}/100`
      : "Not tracked";
  const sleepDisplay = latestEntry ? `${latestEntry.sleep_hours}h` : "Not tracked";
  const selfCareDisplay = latestEntry ? (latestEntry.self_care_completed ? "✓ Done" : "Pending") : "Not tracked";
  const hydrationDisplay = latestEntry ? `${latestEntry.hydration_glasses}/8` : "0/8";
  
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
          
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <WellnessCoachButton />
            <Button>
              <PenLine className="mr-2 h-4 w-4" /> Log Today
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <WellnessQuickCard
            title="Mood"
            icon={<SmilePlus className="h-5 w-5 text-primary" />}
            value={assessmentLoading && !latestEntry ? <Skeleton className="h-7 w-20" /> : moodDisplay}
            trend={
              assessmentLoading && !latestEntry ? (
                <Skeleton className="h-4 w-32" />
              ) : wellnessScore
                ? `Wellness Score: ${wellnessScore}%`
                : baselineFromAssessment
                  ? `Assessment baseline${assessmentData?.tier ? ` · ${assessmentData.tier}` : ''}`
                  : "Complete mood check-in"
            }
            color="bg-yellow-100"
          />
          <WellnessQuickCard
            title="Sleep"
            icon={<MoonStar className="h-5 w-5 text-primary" />}
            value={sleepDisplay}
            trend={latestEntry ? "Last night's sleep" : "Log your sleep"}
            color="bg-blue-100"
          />
          <WellnessQuickCard
            title="Self-Care"
            icon={<Heart className="h-5 w-5 text-primary" />}
            value={selfCareDisplay}
            trend="Daily self-care goal"
            color="bg-red-100"
          />
          <WellnessQuickCard
            title="Hydration"
            icon={<Utensils className="h-5 w-5 text-primary" />}
            value={hydrationDisplay}
            trend="Glasses of water today"
            color="bg-blue-100"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList>
                <TabsTrigger value="insights" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI Insights
                </TabsTrigger>
                <TabsTrigger value="mood">Mood</TabsTrigger>
                <TabsTrigger value="sleep">Sleep</TabsTrigger>
                <TabsTrigger value="selfcare">Self-Care</TabsTrigger>
              </TabsList>
              
              <TabsContent value="insights" className="mt-6 space-y-6">
                {/* AI-Powered Personalized Recommendations */}
                <PersonalizedRecommendations />
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart className="mr-2 h-5 w-5" />
                      Weekly Wellness Summary
                    </CardTitle>
                    <CardDescription>Your wellness trends over the past 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                  <div className="h-[250px] border rounded-md bg-gradient-to-br from-primary/10 to-primary/5 p-6">
                    {wellnessEntries.length > 0 ? (
                      <div className="h-full flex flex-col justify-center">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{moodDisplay}</div>
                            <div className="text-sm text-muted-foreground">Avg Mood</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{sleepDisplay}</div>
                            <div className="text-sm text-muted-foreground">Sleep</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{wellnessScore}%</div>
                            <div className="text-sm text-muted-foreground">Wellness Score</div>
                          </div>
                        </div>
                        <div className="text-center text-sm text-muted-foreground">
                          📈 Your wellness has improved 15% this week
                        </div>
                      </div>
                    ) : assessmentData ? (
                      <div className="h-full flex flex-col justify-center space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {assessmentScore !== null && (
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">{Math.round(assessmentScore)}/100</div>
                              <div className="text-sm text-muted-foreground">Assessment Baseline</div>
                            </div>
                          )}
                          {assessmentData.tier && (
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary capitalize">{String(assessmentData.tier)}</div>
                              <div className="text-sm text-muted-foreground">Your Tier</div>
                            </div>
                          )}
                        </div>
                        {assessmentData.biggest_obstacle && (
                          <div className="text-center text-sm text-muted-foreground">
                            🎯 Priority gap: <span className="font-medium text-foreground">{String(assessmentData.biggest_obstacle)}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-muted-foreground text-sm">
                          Your personalized wellness insights will appear here as you log more data
                        </p>
                      </div>
                    )}
                  </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Previous Week</Button>
                    <Button variant="outline">Next Week</Button>
                  </CardFooter>
                </Card>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Journey-Specific Resources</h2>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        {currentJourney || 'General'} - {currentStage || 'All Stages'}
                      </Badge>
                      <Link to="/wellness/resources">
                        <Button variant="outline" size="sm">
                          View All Resources
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {currentJourney === 'pregnant' && (
                      <>
                        <WellnessResourceCard
                          title="Prenatal Wellness Essentials"
                          description="Comprehensive guide for maintaining health during pregnancy"
                          category="Pregnancy"
                          time="8 min read"
                          icon={<Heart className="h-5 w-5" />}
                          color="bg-pink-100"
                          onClick={() => window.open('/wellness/prenatal-essentials', '_blank')}
                        />
                        <WellnessResourceCard
                          title="Managing Pregnancy Stress"
                          description="Techniques for emotional wellbeing during pregnancy"
                          category="Mental Health"
                          time="6 min read"
                          icon={<SmilePlus className="h-5 w-5" />}
                          color="bg-purple-100"
                          onClick={() => window.open('/wellness/pregnancy-stress', '_blank')}
                        />
                      </>
                    )}
                    
                    {currentJourney === 'postpartum' && (
                      <>
                        <WellnessResourceCard
                          title="Sleep Strategies for New Moms"
                          description="Evidence-based tips to maximize sleep quality when dealing with nighttime feedings"
                          category="Sleep"
                          time="5 min read"
                          icon={<MoonStar className="h-5 w-5" />}
                          color="bg-blue-100"
                          onClick={() => window.open('/wellness/sleep-strategies', '_blank')}
                        />
                        <WellnessResourceCard
                          title="Postpartum Recovery Guide"
                          description="Supporting your body and mind in the fourth trimester"
                          category="Recovery"
                          time="10 min read"
                          icon={<Heart className="h-5 w-5" />}
                          color="bg-green-100"
                          onClick={() => window.open('/wellness/postpartum-recovery', '_blank')}
                        />
                      </>
                    )}
                    
                    {currentJourney === 'ttc' && (
                      <>
                        <WellnessResourceCard
                          title="Fertility and Wellness"
                          description="How lifestyle choices impact conception and reproductive health"
                          category="Fertility"
                          time="7 min read"
                          icon={<Heart className="h-5 w-5" />}
                          color="bg-rose-100"
                          onClick={() => window.open('/wellness/fertility-wellness', '_blank')}
                        />
                        <WellnessResourceCard
                          title="Stress Management for TTC"
                          description="Managing the emotional journey of trying to conceive"
                          category="Mental Health"
                          time="5 min read"
                          icon={<SmilePlus className="h-5 w-5" />}
                          color="bg-purple-100"
                          onClick={() => window.open('/wellness/ttc-stress', '_blank')}
                        />
                      </>
                    )}
                    
                    <WellnessResourceCard
                      title="5-Minute Mindfulness Practices"
                      description="Quick mindfulness exercises you can do anywhere, anytime"
                      category="Mental Wellbeing"
                      time="Audio: 5 min"
                      icon={<Heart className="h-5 w-5" />}
                      color="bg-red-100"
                      onClick={() => window.open('/wellness/mindfulness', '_blank')}
                    />
                    <WellnessResourceCard
                      title="Hydration & Energy Guide"
                      description="How proper hydration affects your energy levels and overall health"
                      category="Nutrition"
                      time="8 min read"
                      icon={<Utensils className="h-5 w-5" />}
                      color="bg-green-100"
                      onClick={() => window.open('/wellness/hydration-guide', '_blank')}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="mood">
                <div className="space-y-6">
                  <div className="text-center py-8 border rounded-lg bg-muted/30">
                    <SmilePlus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <h3 className="font-medium mb-1">Mood Tracking</h3>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                      Track your daily mood to identify patterns and improve your emotional wellbeing.
                    </p>
                    <MoodCheckIn />
                  </div>
                  
                  {wellnessEntries.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Recent Mood Entries</h3>
                      {wellnessEntries.slice(0, 3).map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">
                              Mood: {entry.mood_score}/10 | Energy: {entry.energy_level}/10 | Stress: {entry.stress_level}/10
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(entry.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="sleep">
                <div className="text-center py-8 border rounded-lg bg-muted/30">
                  <MoonStar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <h3 className="font-medium mb-1">Sleep Tracking</h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Monitor your sleep patterns to improve rest quality and energy levels.
                  </p>
                  <SleepTracker />
                </div>
              </TabsContent>
              
              <TabsContent value="selfcare">
                <div className="text-center py-8 border rounded-lg bg-muted/30">
                  <Heart className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <h3 className="font-medium mb-1">Self-Care Activities</h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Track and schedule regular self-care activities to maintain your wellbeing.
                  </p>
                  <SelfCareTracker />
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
            
            <QuickSelfCareIdeas />
          </div>
        </div>
        </div>
    </PageLayout>
  );
};

interface WellnessQuickCardProps {
  title: string;
  icon: React.ReactNode;
  value: React.ReactNode;
  trend: React.ReactNode;
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
  onClick?: () => void;
}

const WellnessResourceCard = ({ title, description, category, time, icon, color, onClick }: WellnessResourceCardProps) => (
  <Card className="card-hover cursor-pointer" onClick={onClick}>
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
        <Button variant="link" size="sm" className="p-0" asChild>
          <Link to="/wellness/resources">View Resource</Link>
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default Wellness;
