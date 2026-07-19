import PageLayout from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, Dumbbell, Filter, Baby, Heart, Activity, Settings, Lock } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import WellnessCoachButton from '@/components/wellness-coach/WellnessCoachButton';
import GlowAndGoPrenatalCard from '@/components/workouts/GlowAndGoPrenatalCard';
import PostpartumGlowUpChallenge from '@/components/workouts/PostpartumGlowUpChallenge';
import FitFierceAdvancedCard from '@/components/workouts/FitFierceAdvancedCard';
import CoreRestoreCard from '@/components/workouts/CoreRestoreCard';
import CoreRestoreFoundationsCard from '@/components/workouts/CoreRestoreFoundationsCard';
import EnergyStrengthCard from '@/components/workouts/EnergyStrengthCard';
import BirthBallGuideCard from '@/components/workouts/BirthBallGuideCard';

import { useAuth } from '@/contexts/AuthContext';
import { useContentFilter, ContentItem } from '@/hooks/useContentFilter';
import { useScrollToHash } from '@/hooks/useScrollToHash';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import JourneySelector from '@/components/onboarding/JourneySelector';
import { useEffect, useMemo, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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
  const { filterContent, stageInfo, hasJourney, currentStage, currentJourney } = useContentFilter();
  const [isJourneySelectorOpen, setIsJourneySelectorOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  // Deep-link params from coach card: ?stage=pregnancy|postpartum|ttc&focus=quick
  const VALID_STAGES = new Set(['pregnancy', 'pregnant', 'postpartum', 'ttc']);
  const VALID_FOCUS = new Set(['quick']);

  const rawStage = (searchParams.get('stage') || '').toLowerCase().trim();
  const rawFocus = (searchParams.get('focus') || '').toLowerCase().trim();

  const stageValid = !rawStage || VALID_STAGES.has(rawStage);
  const focusValid = !rawFocus || VALID_FOCUS.has(rawFocus);

  const stageParam = stageValid ? rawStage : '';
  const focusParam = focusValid ? rawFocus : '';

  // Friendly fallback: notify and strip unknown params from URL
  useEffect(() => {
    if (stageValid && focusValid) return;
    const unknown = [!stageValid && `stage=${rawStage}`, !focusValid && `focus=${rawFocus}`]
      .filter(Boolean).join(', ');
    toast({
      title: 'Showing recommended workouts',
      description: `We didn't recognize ${unknown}. Browse all workouts below.`,
    });
    const next = new URLSearchParams(searchParams);
    if (!stageValid) next.delete('stage');
    if (!focusValid) next.delete('focus');
    setSearchParams(next, { replace: true });
  }, [stageValid, focusValid, rawStage, rawFocus]);

  // Map external stage param → internal tab
  const defaultTab = useMemo(() => {
    if (stageParam === 'pregnancy' || stageParam === 'pregnant') return 'specialized';
    if (stageParam === 'postpartum') return 'specialized';
    if (stageParam === 'ttc') return 'specialized';
    if (focusParam === 'quick') return 'quickWorkouts';
    return 'recommended';
  }, [stageParam, focusParam]);

  // Scroll to the recommended programs section when arriving via deep link
  useEffect(() => {
    if (!stageParam && !focusParam) return;
    const t = setTimeout(() => {
      document.getElementById('featured-programs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 250);
    return () => clearTimeout(t);
  }, [stageParam, focusParam]);

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

  const isTTC = stageInfo?.journey === 'ttc' || currentJourney === 'ttc';
  const isPregnant = stageInfo?.journey === 'pregnant' || currentJourney === 'pregnant' || !!(currentStage?.includes('pregnan') || currentStage?.includes('trimester'));
  const isPostpartum = stageInfo?.journey === 'postpartum' || currentJourney === 'postpartum';
  const isToddler = stageInfo?.journey === 'toddler' || currentJourney === 'toddler';

  // Phase 2 (Strength & Stamina) stays hidden as its own card until Phase 1
  // (Core Restore Foundations) is complete. Read the same localStorage key
  // Phase 1 writes to.
  const [isPhase1Complete, setIsPhase1Complete] = useState(false);
  // Smooth-scroll to the Phase 2 card when arriving from the Phase 1
  // completion handoff (/workouts#phase-2).
  useScrollToHash();
  useEffect(() => {
    const check = () => {
      try {
        const stored = localStorage.getItem('core-restore-foundations-progress');
        setIsPhase1Complete(stored ? !!JSON.parse(stored).completed_at : false);
      } catch {
        setIsPhase1Complete(false);
      }
    };
    check();
    window.addEventListener('focus', check);
    return () => window.removeEventListener('focus', check);
  }, []);
  
  
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
            <Button variant="outline" size="icon" aria-label="Filter" title="Filter coming soon" onClick={() => {}} disabled>
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
        ) : null}
        
        {hasJourney && (
          <div className="mb-8 scroll-mt-24" id="featured-programs">
            <h2 className="text-2xl font-bold mb-6">Featured Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isPregnant && <GlowAndGoPrenatalCard />}
              {isPregnant && <BirthBallGuideCard />}
              {isPostpartum && <CoreRestoreFoundationsCard />}
              {/* Phase 2 full card only appears once Phase 1 (Core Restore) is complete.
                  Until then a compact locked teaser sits inside the Phase 1 card. */}
              {isPostpartum && isPhase1Complete && (
                <div id="phase-2" className="scroll-mt-24 md:mt-10 lg:mt-16">
                  <PostpartumGlowUpChallenge />
                </div>
              )}

              {isToddler && <EnergyStrengthCard />}
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
