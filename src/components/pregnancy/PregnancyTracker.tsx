import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePregnancyProgress } from '@/hooks/usePregnancyProgress';
import { weekNote } from '@/lib/pregnancy';
import { GrowthRing } from './GrowthRing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Baby, Calendar, Heart, Scale, Zap, Moon, BookOpen, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useContentFilter } from '@/hooks/useContentFilter';
import { BabyKickCounter } from './BabyKickCounter';
import { ContractionTracker } from './ContractionTracker';
import { PremiumToolGuard } from '@/components/subscription/PremiumToolGuard';

interface PregnancyData {
  week: number;
  trimester: number;
  dueDate: string;
  symptoms: string[];
  mood: number;
  energy: number;
  sleep: number;
  weight: number;
}

export const PregnancyTracker = () => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const { stageInfo } = useContentFilter();
  const [searchParams] = useSearchParams();
  const tool = (searchParams.get('tool') || '').toLowerCase();
  const initialTab =
    tool === 'kick-counter' ? 'kicks' :
    tool === 'contractions' ? 'contractions' :
    tool === 'symptoms' ? 'symptoms' :
    tool === 'insights' ? 'insights' : 'today';
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  useEffect(() => {
    if (tool === 'kick-counter') setActiveTab('kicks');
    else if (tool === 'contractions') setActiveTab('contractions');
  }, [tool]);
  
  // Her real gestational age, from her real due date. This used to be
  // Math.random() inside a trimester band, with a hardcoded 2024 due date —
  // so the week number changed on every render and the guidance below it was
  // written for whichever number came up.
  const { progress, dueDate, loading: dueDateLoading, saveDueDate, needsDate } =
    usePregnancyProgress();

  const [draftDueDate, setDraftDueDate] = useState('');

  // Trimester now comes from the week, not from a profile string that could
  // disagree with it. A woman marked "trimester_2" at 28 weeks was being shown
  // second-trimester content.
  const trimester = progress?.trimester ?? 2;
  const week = progress?.week ?? 0;
  const note = progress ? weekNote(progress.week) : null;

  const [pregnancyData, setPregnancyData] = useState<Omit<PregnancyData, 'week' | 'trimester' | 'dueDate'>>({
    symptoms: [],
    mood: 7,
    energy: 6,
    sleep: 6,
    weight: 0,
  });

  const getWeeklyMessage = () => {
    if (!progress) return 'Add your due date to see where you are this week.';
    if (progress.isOverdue) {
      return `${progress.label}. Only about 4% of babies arrive on their due date — you are not late.`;
    }
    if (!note) return progress.label;
    return `${progress.label} · ${note.baby}`;
  };

  const getPersonalizedTip = () => {
    const { symptoms, mood, energy, sleep } = pregnancyData;
    
    // First trimester specific tips
    if (trimester === 1) {
      if (symptoms.includes('Morning sickness')) {
        return "Morning sickness is tough! Try eating small, frequent meals and keep crackers by your bed. Ginger tea can help too.";
      }
      if (symptoms.includes('Fatigue')) {
        return "First trimester fatigue is your body working overtime! Listen to it and rest as much as you can.";
      }
      if (symptoms.includes('Food aversions')) {
        return "Food aversions are so common right now. Focus on what you can keep down and don't stress about perfect nutrition yet.";
      }
      return "First trimester is all about survival mode. Be gentle with yourself - growing a baby is hard work!";
    }
    
    // Second trimester specific tips
    if (trimester === 2) {
      if (symptoms.includes('Sciatica')) {
        return "Sciatica pain is common as baby grows. Try gentle stretches, warm compresses, and consider prenatal massage. Rest when you can!";
      }
      if (symptoms.includes('Lower back pain') || symptoms.includes('Round ligament pain')) {
        return "Back pain is so common right now. Try prenatal yoga, a warm bath, or ask your partner for a gentle massage.";
      }
      if (symptoms.includes('Heartburn')) {
        return "Heartburn bothering you? Try eating smaller meals, avoid spicy foods, and sleep with your head elevated.";
      }
      return "Second trimester energy boost! This is a great time to prepare the nursery and enjoy feeling good.";
    }
    
    // Third trimester specific tips
    if (trimester === 3) {
      if (symptoms.includes('Shortness of breath')) {
        return "Shortness of breath is normal as baby takes up more space. Sit up straight and take breaks when climbing stairs.";
      }
      if (symptoms.includes('Swelling')) {
        return "Swelling in feet and hands is common. Elevate your feet, drink plenty of water, and call your doctor if it's sudden.";
      }
      if (symptoms.includes('Braxton Hicks')) {
        return "Braxton Hicks contractions are practice runs! Stay hydrated and change positions. Time them if they get regular.";
      }
      if (sleep < 5) {
        return "Third trimester sleep is challenging! Try a pregnancy pillow, frequent position changes, and rest during the day.";
      }
      return "You're in the home stretch! Start preparing your hospital bag and practicing breathing techniques.";
    }
    
    // General tips based on mood/energy
    if (energy < 5) {
      return "Low energy is totally normal. Try protein-rich snacks, short walks, and don't hesitate to rest when needed.";
    }
    if (mood < 6) {
      return "It's totally okay to have tough days. Consider journaling, calling a friend, or doing something small that brings you joy.";
    }
    
    return "You're doing such an amazing job! Your body is working hard to grow your little one. Keep being gentle with yourself.";
  };

  const handleLogSymptom = (symptom: string) => {
    setPregnancyData(prev => ({
      ...prev,
      symptoms: [...prev.symptoms, symptom]
    }));
    
    toast({
      title: "Symptom logged",
      description: `${symptom} has been added to your pregnancy tracker`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Baby className="mr-2 h-5 w-5" />
            Pregnancy Journey
          </div>
          {progress && (
            <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/25">
              Week {progress.week}
              <span className="opacity-70">+{progress.dayOfWeek}</span>
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {getWeeklyMessage()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Without a due date there is no honest week number to show, so ask
            for one instead of inventing it — which is what this component
            used to do. */}
        {!dueDateLoading && needsDate && (
          <div className="rounded-lg border border-dashed p-4 space-y-3">
            <div>
              <Label htmlFor="pregnancy-due-date" className="text-sm font-semibold">
                When is your baby due?
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Everything else here — your week, your kick counts, your movement
                plan — is worked out from this one date.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Input
                id="pregnancy-due-date"
                type="date"
                value={draftDueDate}
                onChange={(e) => setDraftDueDate(e.target.value)}
                className="max-w-[200px]"
              />
              <Button
                size="sm"
                disabled={!draftDueDate}
                onClick={async () => {
                  const { error } = await saveDueDate(draftDueDate);
                  toast(error
                    ? { title: "Couldn't save your due date", description: 'Please try again.' }
                    : { title: 'Due date saved', description: 'Your week updates from here on.' });
                }}
              >
                Save
              </Button>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
            {trimester >= 2 && <TabsTrigger value="kicks">Kicks</TabsTrigger>}
            {trimester === 3 && <TabsTrigger value="contractions">Contractions</TabsTrigger>}
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            {/* The weekly moment. Ovia, Flo and The Bump all anchor pregnancy
                on one image that changes each week; this is ours, drawn as
                growth rather than as the baby. */}
            <div className="flex flex-col items-center py-2">
              <GrowthRing progress={progress} />
              {progress && dueDate && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Due {new Date(dueDate).toLocaleDateString(undefined, {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              )}
            </div>

            {/* This week — the baby, and her. Every competitor writes the first
                half; the second half is the framing the rest of the product
                already takes. */}
            {note && progress && (
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    This week
                  </span>
                  <span className="text-xs text-muted-foreground">
                    about {note.size} · roughly {note.compare}
                  </span>
                </div>
                <p className="text-sm">
                  <span className="font-semibold">Baby: </span>{note.baby}
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-primary">You: </span>{note.mother}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Sizes are averages and vary widely. Your provider's scan is the
                  measurement that matters.
                </p>
              </div>
            )}

            {/* Quick Tracking */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg">
                <div className="flex items-center justify-between">
                  <Heart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium">{pregnancyData.mood}/10</span>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Mood Today</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950/40 rounded-lg">
                <div className="flex items-center justify-between">
                  <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium">{pregnancyData.energy}/10</span>
                </div>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">Energy Level</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-lg">
                <div className="flex items-center justify-between">
                  <Moon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium">{pregnancyData.sleep}/10</span>
                </div>
                <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">Sleep Quality</p>
              </div>
              <div className="p-3 bg-pink-50 dark:bg-pink-950/40 rounded-lg">
                <div className="flex items-center justify-between">
                  <Scale className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                  <span className="text-sm font-medium">{pregnancyData.weight}lbs</span>
                </div>
                <p className="text-xs text-pink-700 dark:text-pink-300 mt-1">Current Weight</p>
              </div>
            </div>

            {/* Personalized Tip */}
            <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200 dark:border-pink-800">
              <h4 className="font-medium text-sm mb-2 flex items-center">
                <MessageCircle className="h-4 w-4 mr-2 text-pink-600 dark:text-pink-400" />
                Your Daily Tip
              </h4>
              <p className="text-sm text-gray-700">{getPersonalizedTip()}</p>
            </div>
          </TabsContent>

          <TabsContent value="symptoms" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Current Symptoms</h4>
              <div className="flex flex-wrap gap-2">
                {pregnancyData.symptoms.map((symptom, index) => (
                  <Badge key={index} variant="outline" className="bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-800">
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Quick Log</h4>
              <div className="grid grid-cols-2 gap-2">
                {(trimester === 1 
                  ? ['Morning sickness', 'Fatigue', 'Breast tenderness', 'Food aversions', 'Headaches', 'Dizziness', 'Mood swings', 'Constipation']
                  : trimester === 2 
                    ? ['Sciatica', 'Hip pain', 'Heartburn', 'Baby kicks', 'Round ligament pain', 'Increased appetite', 'Skin changes', 'Leg cramps']
                    : ['Shortness of breath', 'Swelling', 'Braxton Hicks', 'Restless legs', 'Pelvic pressure', 'Frequent urination', 'Insomnia', 'Nesting urge']
                ).map((symptom) => (
                  <Button
                    key={symptom}
                    variant="outline"
                    size="sm"
                    onClick={() => handleLogSymptom(symptom)}
                    className="text-xs"
                  >
                    {symptom}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Baby Kick Counter - 2nd & 3rd Trimester (Premium) */}
          {trimester >= 2 && (
            <TabsContent value="kicks" className="space-y-4">
              <PremiumToolGuard
                toolName="Baby Kick Counter"
                description="Track your baby's movements with real-time pattern detection. Renew your subscription to continue using this tool."
              >
                <BabyKickCounter />
              </PremiumToolGuard>
            </TabsContent>
          )}

          {/* Contraction Tracker - 3rd Trimester Only (Premium) */}
          {trimester === 3 && (
            <TabsContent value="contractions" className="space-y-4">
              <PremiumToolGuard
                toolName="Contraction Tracker"
                description="Get live labor analysis and smart push alerts. Renew your subscription to continue using this tool."
              >
                <ContractionTracker />
              </PremiumToolGuard>
            </TabsContent>
          )}

          <TabsContent value="insights" className="space-y-4">
            <PremiumToolGuard
              toolName="AI Pregnancy Insights"
              description="Personalized weekly insights powered by AI. Renew your subscription to unlock again."
              preview
            >
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Week {week} Development</h4>
                <p className="text-sm text-gray-700">
                  {trimester === 1 
                    ? "Your baby's major organs are forming! Neural tube development is crucial right now."
                    : trimester === 2 
                      ? "Your baby is about the size of a carrot! They're developing their senses and you might feel more movement."
                      : "Your baby is gaining weight and their lungs are maturing. They're getting ready to meet you!"
                  }
                </p>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-950/40 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Your Body This Week</h4>
                <p className="text-sm text-gray-700">
                  {trimester === 1 
                    ? "Your body is adjusting to pregnancy hormones. Fatigue and nausea are common as your body works hard."
                    : trimester === 2 
                      ? "Your belly is really showing now! Back pain is common as your center of gravity shifts. Stay active but listen to your body."
                      : "Your body is preparing for birth. Your ribcage may expand and you might feel more pressure as baby drops lower."
                  }
                </p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Wellness Focus</h4>
                <p className="text-sm text-gray-700">
                  {trimester === 1 
                    ? "Focus on folic acid, staying hydrated, and gentle movement. Listen to your body and rest when needed."
                    : trimester === 2 
                      ? "Focus on calcium-rich foods, gentle exercise, and enjoying this energy boost. Great time for prenatal classes!"
                      : "Focus on preparing for birth, practicing breathing techniques, and getting plenty of rest. Pack your hospital bag!"
                  }
                </p>
              </div>
            </div>
            </PremiumToolGuard>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};