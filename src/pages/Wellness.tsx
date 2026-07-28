import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  Utensils,
  PenLine,
  Sparkles,
} from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Link } from 'react-router-dom';
import WellnessCoachButton from '@/components/wellness-coach/WellnessCoachButton';
import { PersonalizedCoachCard } from '@/components/wellness-coach/PersonalizedCoachCard';
import { MoodCheckIn } from '@/components/dashboard/MoodCheckIn';
import { SleepTracker } from '@/components/wellness/SleepTracker';
import { SelfCareTracker } from '@/components/wellness/SelfCareTracker';
import { PersonalizedRecommendations } from '@/components/wellness/PersonalizedRecommendations';
import { QuickSelfCareIdeas } from '@/components/wellness/QuickSelfCareIdeas';
import { useWellnessData } from '@/hooks/useWellnessData';
import { useContentFilter } from '@/hooks/useContentFilter';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { useAssessmentData } from '@/hooks/useAssessmentData';
import { usePoints } from '@/hooks/usePoints';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import {
  Timer,
  HeartHandshake,
  Feather,
  Snowflake,
  NotebookPen,
  type LucideIcon,
} from 'lucide-react';
import {
  productsForJourney,
  isAvailable,
  type DigitalProduct,
} from '@/data/digitalProducts';

// The journey-specific section is a funnel INTO the premium digital guides
// (the paid products on /wellness/resources), not a scatter of free links.
// productsForJourney() picks the guides that fit her stage — available ones
// first — and every card deep-links to that guide on the store page.

const STAGE_LABEL: Record<string, string> = {
  ttc: 'Trying to Conceive',
  pregnant: 'Pregnancy',
  postpartum: 'Postpartum',
};

// One rich symbol per guide — the card's representing mark, rendered in a solid
// copper tile rather than a faint tinted icon.
const RESOURCE_ICON: Record<string, LucideIcon> = {
  'momodoro-planner': Timer,
  'busy-mom-self-care': HeartHandshake,
  'sleep-reset-guide': MoonStar,
  'emotional-load-workbook': Feather,
  'freezer-stash-guide': Snowflake,
  'keepsake-journal': NotebookPen,
};

const Wellness = () => {
  const [searchParams] = useSearchParams();
  const validTabs = ['insights', 'mood', 'sleep', 'selfcare'] as const;
  const initialTab = (() => {
    const t = (searchParams.get('tab') || '').toLowerCase();
    return (validTabs as readonly string[]).includes(t) ? t : 'insights';
  })();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  useEffect(() => {
    const t = (searchParams.get('tab') || '').toLowerCase();
    if ((validTabs as readonly string[]).includes(t)) setActiveTab(t);
  }, [searchParams]);
  const {
    wellnessEntries,
    wellnessScore,
    wellnessTrend,
    loading,
    addHydrationGlass,
    hydrationGoal,
  } = useWellnessData();
  const { currentJourney, currentStage } = useContentFilter();
  const { assessmentData, scoreNumber: assessmentScore, loading: assessmentLoading } = useAssessmentData();
  const { awardPoints } = usePoints();
  const { toast } = useToast();

  // Today's entry drives the daily summary cards; the latest entry (any day)
  // is only used to decide whether the user has ever logged anything.
  const isToday = (iso: string) => new Date(iso).toDateString() === new Date().toDateString();
  const todayEntry = wellnessEntries.find((e) => isToday(e.created_at));
  const latestEntry = wellnessEntries[0];

  // Use assessment score as a baseline only until the user logs a real mood today.
  const baselineFromAssessment = assessmentScore !== null && todayEntry?.mood_score == null;
  const moodDisplay = todayEntry?.mood_score != null
    ? `${todayEntry.mood_score}/10`
    : baselineFromAssessment
      ? `${Math.round(assessmentScore!)}/100`
      : "Not tracked";
  const sleepDisplay = todayEntry?.sleep_hours != null ? `${todayEntry.sleep_hours}h` : "Not tracked";
  const selfCareDisplay = todayEntry?.self_care_completed ? "✓ Done" : (todayEntry ? "Pending" : "Not tracked");
  const hydrationGlasses = todayEntry?.hydration_glasses ?? 0;
  const hydrationDisplay = `${hydrationGlasses}/${hydrationGoal}`;

  const handleAddGlass = async () => {
    const wasUnderGoal = hydrationGlasses < hydrationGoal;
    const justHitGoal = hydrationGlasses + 1 === hydrationGoal;
    await addHydrationGlass();
    if (wasUnderGoal) await awardPoints(2, 'hydration', 'Logged a glass of water');
    toast({
      title: justHitGoal ? "Hydration goal reached! 💧" : "Glass logged 💧",
      description: justHitGoal
        ? `Nice work — ${hydrationGoal}/${hydrationGoal} glasses today.`
        : `${hydrationGlasses + 1}/${hydrationGoal} glasses today.`,
    });
  };
  
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
            <Button asChild>
              <Link to="/wellness?tab=mood">
                <PenLine className="mr-2 h-4 w-4" /> Log Today
              </Link>
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
            color="bg-yellow-100 dark:bg-yellow-950/40"
          />
          <WellnessQuickCard
            title="Sleep"
            icon={<MoonStar className="h-5 w-5 text-primary" />}
            value={sleepDisplay}
            trend={todayEntry?.sleep_hours != null ? "Last night's sleep" : "Log your sleep"}
            color="bg-blue-100 dark:bg-blue-950/40"
          />
          <WellnessQuickCard
            title="Self-Care"
            icon={<Heart className="h-5 w-5 text-primary" />}
            value={selfCareDisplay}
            trend="Daily self-care goal"
            color="bg-red-100 dark:bg-red-950/40"
          />
          <WellnessQuickCard
            title="Hydration"
            icon={<Utensils className="h-5 w-5 text-primary" />}
            value={hydrationDisplay}
            trend="Glasses of water today"
            color="bg-blue-100 dark:bg-blue-950/40"
            action={
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-3"
                onClick={handleAddGlass}
                disabled={hydrationGlasses >= 20}
              >
                <Plus className="mr-1 h-4 w-4" /> Add a glass
              </Button>
            }
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
                            <div className="text-2xl font-bold text-primary">{wellnessScore != null ? `${wellnessScore}%` : '—'}</div>
                            <div className="text-sm text-muted-foreground">Wellness Score</div>
                          </div>
                        </div>
                        <div className="text-center text-sm text-muted-foreground">
                          {wellnessTrend === 'up'
                            ? '📈 Your wellness score is trending up — keep it going!'
                            : wellnessTrend === 'down'
                              ? '📉 A dip from last time — be gentle with yourself today.'
                              : wellnessTrend === 'flat'
                                ? '➡️ Holding steady — consistency is its own win.'
                                : '✨ Keep logging daily to see your wellness trend.'}
                        </div>
                      </div>
                    ) : assessmentLoading ? (
                      <div className="h-full flex flex-col justify-center space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center space-y-2">
                            <Skeleton className="h-8 w-24 mx-auto" />
                            <Skeleton className="h-4 w-32 mx-auto" />
                          </div>
                          <div className="text-center space-y-2">
                            <Skeleton className="h-8 w-24 mx-auto" />
                            <Skeleton className="h-4 w-32 mx-auto" />
                          </div>
                        </div>
                        <Skeleton className="h-4 w-2/3 mx-auto" />
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
                    <Button variant="outline" asChild>
                      <Link to="/progress">View Progress</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/wellness/resources">More Resources</Link>
                    </Button>
                  </CardFooter>
                </Card>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">Guides for Your Journey</h2>
                      <p className="text-sm text-muted-foreground">
                        Premium guides chosen for where you are right now.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="flex items-center gap-1 border-primary/30 text-primary">
                        <Sparkles className="h-3 w-3" />
                        {STAGE_LABEL[currentJourney ?? ''] || 'For You'}
                      </Badge>
                      <Link to="/wellness/resources">
                        <Button variant="outline" size="sm">
                          Browse All Guides
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {productsForJourney(currentJourney as Parameters<typeof productsForJourney>[0]).map((product) => (
                      <WellnessResourceCard key={product.slug} product={product} />
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="mood">
                <div className="space-y-6">
                  <div className="text-center py-8 border rounded-lg bg-muted/30">
                    <SmilePlus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <h2 className="font-medium mb-1">Mood Tracking</h2>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                      Track your daily mood to identify patterns and improve your emotional wellbeing.
                    </p>
                    <MoodCheckIn />
                  </div>
                  
                  {wellnessEntries.some((e) => e.mood_score != null) && (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Recent Mood Entries</h3>
                      {wellnessEntries
                        .filter((e) => e.mood_score != null)
                        .slice(0, 3)
                        .map((entry) => (
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
                  <h2 className="font-medium mb-1">Sleep Tracking</h2>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Monitor your sleep patterns to improve rest quality and energy levels.
                  </p>
                  <SleepTracker />
                </div>
              </TabsContent>
              
              <TabsContent value="selfcare">
                <div className="text-center py-8 border rounded-lg bg-muted/30">
                  <Heart className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <h2 className="font-medium mb-1">Self-Care Activities</h2>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Track and schedule regular self-care activities to maintain your wellbeing.
                  </p>
                  <SelfCareTracker />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <PersonalizedCoachCard />

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
                  className="rounded-2xl border border-border/60 shadow-sm pointer-events-auto"
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
  action?: React.ReactNode;
}

const WellnessQuickCard = ({ title, icon, value, trend, color, action }: WellnessQuickCardProps) => (
  <div className="relative h-full rounded-lg">
    <GlowingEffect disabled={false} proximity={80} spread={30} borderWidth={2} inactiveZone={0.4} />
    <Card className="relative h-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className={`${color} p-2 rounded-md`}>
            {icon}
          </div>
          <span className="text-xl font-bold">{value}</span>
        </div>
        <h3 className="font-medium text-sm mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground">{trend}</p>
        {action}
      </CardContent>
    </Card>
  </div>
);

/**
 * A funnel card into one premium digital guide — the clean icon + text layout,
 * with a richer copper symbol. No product imagery here; the whole card
 * deep-links to that guide on the store page (/wellness/resources?product=slug).
 */
const WellnessResourceCard = ({ product }: { product: DigitalProduct }) => {
  const available = isAvailable(product);
  const Icon = RESOURCE_ICON[product.slug] ?? Sparkles;
  return (
    <Card className="card-hover">
      <Link to={`/wellness/resources?product=${product.slug}`} className="block">
        <CardContent className="p-6">
          <div className="mb-3 flex items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-catalyst-copper/15 to-catalyst-copper/5 text-catalyst-copper">
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {product.category}
                </p>
                {!available && (
                  <Badge
                    variant="outline"
                    className="border-primary/30 px-1.5 py-0 text-[9px] uppercase tracking-wide text-primary"
                  >
                    Coming soon
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold leading-snug">{product.title}</h3>
            </div>
          </div>

          <p className="mb-4 text-sm text-muted-foreground">{product.hook}</p>

          <div className="flex items-center justify-end">
            <span className="text-sm font-medium text-primary">View guide →</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default Wellness;
