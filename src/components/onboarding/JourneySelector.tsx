import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Baby, Heart, Sparkles, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import posthog from '@/lib/posthog';

interface JourneyOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  stages?: { value: string; label: string; description?: string }[];
}

const journeyOptions: JourneyOption[] = [
  {
    id: 'ttc',
    title: 'Trying to Conceive',
    description: 'Supporting your fertility journey with personalized nutrition, workouts, and tracking tools',
    icon: <Heart className="h-6 w-6" />,
    color: 'bg-catalyst-peach/70 text-catalyst-brown dark:bg-catalyst-copper/15 dark:text-catalyst-gold',
    stages: [
      { value: 'ttc_1-3', label: '1-3 months trying', description: 'Just started your TTC journey' },
      { value: 'ttc_4-6', label: '4-6 months trying', description: 'Building healthy habits' },
      { value: 'ttc_6-12', label: '6-12 months trying', description: 'Focused support and guidance' },
      { value: 'ttc_12+', label: '12+ months trying', description: 'Advanced support and resources' }
    ]
  },
  {
    id: 'pregnant',
    title: 'Pregnant',
    description: 'Your personalized pregnancy companion with safe workouts, nutrition, and weekly insights',
    icon: <Baby className="h-6 w-6" />,
    color: 'bg-[hsl(var(--gestation-soft))] text-[hsl(var(--gestation))]',
    stages: [
      { value: 'trimester_1', label: 'First Trimester (1-12 weeks)', description: 'Early pregnancy support' },
      { value: 'trimester_2', label: 'Second Trimester (13-26 weeks)', description: 'Growth and energy phase' },
      { value: 'trimester_3', label: 'Third Trimester (27-40 weeks)', description: 'Preparing for birth' }
    ]
  },
  {
    id: 'postpartum',
    title: 'Postpartum',
    description: 'Recovery-focused workouts, healing nutrition, and mental wellness support for new moms',
    icon: <Sparkles className="h-6 w-6" />,
    color: 'bg-recovery-soft text-recovery',
    stages: [
      { value: 'postpartum_0-6', label: '0-6 weeks postpartum', description: 'Initial recovery phase' },
      { value: 'postpartum_6-12', label: '6-12 weeks postpartum', description: 'Gentle movement return' },
      { value: 'postpartum_3-6m', label: '3-6 months postpartum', description: 'Building strength back' },
      { value: 'postpartum_6-12m', label: '6-12 months postpartum', description: 'Established routine' },
      { value: 'postpartum_12m+', label: '12+ months postpartum', description: 'Long-term wellness' }
    ]
  },
  {
    id: 'toddler',
    title: 'Toddler Mom',
    description: 'Staying healthy while chasing little ones - quick workouts and practical wellness tips',
    icon: <Users className="h-6 w-6" />,
    color: 'bg-catalyst-beige text-catalyst-brown dark:bg-catalyst-gold/10 dark:text-catalyst-gold',
    stages: [
      { value: 'toddler_1-2', label: '1-2 year old', description: 'High energy phase' },
      { value: 'toddler_2-3', label: '2-3 years old', description: 'Growing independence' },
      { value: 'toddler_3+', label: '3+ years old', description: 'Preschool age support' }
    ]
  }
];

interface JourneySelectorProps {
  onComplete: () => void;
  isOnboarding?: boolean;
}

export const JourneySelector = ({ onComplete, isOnboarding = false }: JourneySelectorProps) => {
  const [selectedJourney, setSelectedJourney] = useState<string>('');
  const [selectedStage, setSelectedStage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { updateProfile } = useAuth();

  const selectedJourneyData = journeyOptions.find(j => j.id === selectedJourney);

  const handleSaveJourney = async () => {
    if (!selectedJourney) {
      toast.error('Please select your current journey');
      return;
    }

    setIsLoading(true);
    try {
      const stageValue = selectedStage || selectedJourney;
      await updateProfile({ 
        motherhood_stage: stageValue
      });
      
      posthog.capture('journey_updated', {
        journey: selectedJourney,
        stage: stageValue,
        source: isOnboarding ? 'onboarding' : 'profile',
      });
      toast.success('Your journey has been updated!');
      onComplete();
    } catch (error) {
      console.error('Error updating journey:', error);
      toast.error('Failed to update your journey. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {isOnboarding ? 'Welcome to Catalyst Mom!' : 'Update Your Journey'}
        </h1>
        <p className="text-muted-foreground">
          {isOnboarding 
            ? 'Tell us where you are in your motherhood journey so we can personalize your experience'
            : 'Update your current stage to get the most relevant content and recommendations'
          }
        </p>
      </div>

      {!selectedJourney ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {journeyOptions.map((journey) => (
            <button
              key={journey.id}
              type="button"
              className="relative h-full rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={() => setSelectedJourney(journey.id)}
              aria-label={`Choose ${journey.title}`}
            >
              <GlowingEffect
                disabled={false}
                proximity={80}
                spread={30}
                borderWidth={2}
                inactiveZone={0.4}
              />
              <Card
                className="pointer-events-none relative h-full border-2 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${journey.color}`}>
                        {journey.icon}
                      </div>
                      {journey.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {journey.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${selectedJourneyData?.color}`}>
                    {selectedJourneyData?.icon}
                  </div>
                  {selectedJourneyData?.title}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSelectedJourney('');
                    setSelectedStage('');
                  }}
                >
                  Change Journey
                </Button>
              </div>
              <CardDescription>
                {selectedJourneyData?.description}
              </CardDescription>
            </CardHeader>
          </Card>

          {selectedJourneyData?.stages && (
            <div>
              <h3 id="journey-stage-heading" className="text-lg font-semibold mb-4">Select your current stage:</h3>
              <div className="grid grid-cols-1 gap-3" role="radiogroup" aria-labelledby="journey-stage-heading">
                {selectedJourneyData.stages.map((stage) => (
                  <button
                    key={stage.value}
                    type="button"
                    role="radio"
                    aria-checked={selectedStage === stage.value}
                    className="rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    onClick={() => setSelectedStage(stage.value)}
                  >
                    <Card
                      className={`pointer-events-none min-h-11 transition-all border-2 ${
                        selectedStage === stage.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{stage.label}</h4>
                            {stage.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {stage.description}
                              </p>
                            )}
                          </div>
                          {selectedStage === stage.value && (
                            <Badge variant="default">Selected</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedJourney('');
                setSelectedStage('');
              }}
            >
              Back
            </Button>
            <Button
              onClick={handleSaveJourney}
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? 'Saving...' : 'Continue'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JourneySelector;
