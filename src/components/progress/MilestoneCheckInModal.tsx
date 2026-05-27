import { useEffect, useMemo, useState } from 'react';
import { InlineWidget } from 'react-calendly';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Heart, Flower2, Baby, Activity, Trophy, Flame, Calendar, ArrowRight } from 'lucide-react';
import { usePoints } from '@/hooks/usePoints';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type MilestoneStage = 'ttc' | 'pregnant' | 'postpartum' | 'general';

const CALENDLY_URL = 'https://calendly.com/catalystmomofficial/2-week-milestone-check-in-catalyst-mom';

interface MilestoneCheckInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stage: MilestoneStage;
  userName?: string;
  userEmail?: string;
  summary: {
    workouts: number;
    activeDays: number;
    points: number;
    weeks: number;
  };
  onBooked?: () => void;
}

const STAGE_CONTENT: Record<MilestoneStage, {
  icon: typeof Heart;
  accent: string;
  title: string;
  subtitle: string;
  body: string;
  focusLabel: string;
  focus: string[];
}> = {
  ttc: {
    icon: Flower2,
    accent: 'from-rose-400/20 via-pink-300/20 to-amber-300/20',
    title: 'Two weeks of conscious movement, mama.',
    subtitle: 'Hormone harmony in motion.',
    body: 'You showed up for your body — and your future baby — every single day. This check-in is where we measure the invisible wins: nervous system calm, cycle rhythm, and the energy you\'ve been quietly rebuilding.',
    focusLabel: 'Your check-in focus',
    focus: [
      'Stress levels & nervous system reset',
      'Cycle tracking patterns & symptoms',
      'Hormone harmony habits going forward',
    ],
  },
  pregnant: {
    icon: Baby,
    accent: 'from-amber-300/20 via-rose-300/20 to-emerald-300/20',
    title: 'Two weeks of consistency for you and baby.',
    subtitle: 'Strong body, calm mind, growing baby.',
    body: 'Every movement you completed built strength your body will pull from on birth day. Let\'s look at how your trimester is unfolding and adjust your plan so you stay mobile, supported, and ready.',
    focusLabel: 'Your check-in focus',
    focus: [
      'Structural mobility & posture',
      'Trimester comfort & symptom shifts',
      'Birth prep adjustments & breath work',
    ],
  },
  postpartum: {
    icon: Heart,
    accent: 'from-emerald-300/20 via-teal-300/20 to-sky-300/20',
    title: '14 days of foundational recovery.',
    subtitle: 'You\'re rebuilding from the inside out.',
    body: 'This isn\'t about bouncing back — it\'s about coming home to your body. We\'ll review your pelvic floor reconnection, core re-education, and make sure every signal your body is sending is being heard.',
    focusLabel: 'Your check-in focus',
    focus: [
      'Pelvic floor health & reconnection',
      'Core re-education progress',
      'Safe healing indicators & red flags',
    ],
  },
  general: {
    icon: Sparkles,
    accent: 'from-primary/20 via-secondary/20 to-accent/20',
    title: 'Two weeks of showing up for you.',
    subtitle: 'Let\'s celebrate the progress.',
    body: 'You\'ve put in the reps. Let\'s look at the data, name the wins, and design the next 14 days with intention.',
    focusLabel: 'Your check-in focus',
    focus: [
      'Movement consistency',
      'Energy & recovery',
      'Goals for the next two weeks',
    ],
  },
};

export const MilestoneCheckInModal = ({
  open, onOpenChange, stage, userName, userEmail, summary, onBooked,
}: MilestoneCheckInModalProps) => {
  const [view, setView] = useState<'celebrate' | 'book'>('celebrate');
  const [booked, setBooked] = useState(false);
  const { awardPoints } = usePoints();
  const content = STAGE_CONTENT[stage] ?? STAGE_CONTENT.general;
  const Icon = content.icon;

  useEffect(() => {
    if (open) {
      setView('celebrate');
      setBooked(false);
    }
  }, [open]);

  const calendlyPrefill = useMemo(() => ({
    name: userName,
    email: userEmail,
    customAnswers: {
      a1: stage === 'ttc' ? 'TTC' : stage === 'pregnant' ? 'Pregnancy' : stage === 'postpartum' ? 'Postpartum' : 'General',
    },
  }), [userName, userEmail, stage]);

  // Listen for Calendly event scheduled
  useEffect(() => {
    if (view !== 'book') return;
    const handler = (e: MessageEvent) => {
      if (typeof e.data !== 'object' || !e.data?.event) return;
      if (e.data.event === 'calendly.event_scheduled') {
        const payload = e.data?.payload ?? {};
        handleBookingSuccess({
          eventUri: payload?.event?.uri,
          inviteeUri: payload?.invitee?.uri,
        });
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [view]);

  const handleBookingSuccess = async (booking?: { eventUri?: string; inviteeUri?: string }) => {
    if (booked) return;
    setBooked(true);

    // Confetti
    const duration = 2500;
    const end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 70, origin: { x: 0 } });
      confetti({ particleCount: 4, angle: 120, spread: 70, origin: { x: 1 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });

    // Award points + reset cycle
    try {
      await awardPoints(150, 'milestone_checkin', '2-week milestone check-in booked');
    } catch (err) {
      console.error('Award points failed', err);
    }
    const bookedAt = new Date().toISOString();
    let startTime: string | null = null;
    let joinUrl: string | null = null;

    // Fetch the live Zoom join URL + start time from Calendly via our edge function
    if (booking?.eventUri) {
      try {
        const { data, error } = await supabase.functions.invoke('calendly-event-details', {
          body: { eventUri: booking.eventUri },
        });
        if (!error && data) {
          startTime = data.startTime ?? null;
          joinUrl = data.joinUrl ?? null;
        }
      } catch (err) {
        console.error('Calendly details fetch failed', err);
      }
    }

    try {
      localStorage.setItem('cm_last_milestone_at', bookedAt);
      const record = {
        bookedAt,
        stage,
        eventUri: booking?.eventUri ?? null,
        inviteeUri: booking?.inviteeUri ?? null,
        startTime,
        joinUrl,
      };
      localStorage.setItem('cm_milestone_booking', JSON.stringify(record));
      window.dispatchEvent(new CustomEvent('cm:milestone-booked', { detail: record }));
    } catch {}


    toast.success('🎉 Milestone booked! +150 points awarded', {
      description: 'Your next 2-week window has been reset. See you soon, mama!',
    });

    onBooked?.();
  };

  const stats = [
    { icon: Activity, label: 'Workouts', value: summary.workouts },
    { icon: Flame, label: 'Active Days', value: summary.activeDays },
    { icon: Trophy, label: 'Points', value: summary.points },
    { icon: Calendar, label: 'Weeks', value: summary.weeks },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {view === 'celebrate' ? (
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${content.accent} pointer-events-none rounded-lg`} />
            <div className="relative p-6 md:p-8 space-y-6">
              <DialogHeader>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="mx-auto mb-3 w-16 h-16 rounded-full bg-background/80 backdrop-blur flex items-center justify-center shadow-lg"
                >
                  <Icon className="w-8 h-8 text-primary" />
                </motion.div>
                <Badge variant="secondary" className="mx-auto w-fit">
                  <Sparkles className="w-3 h-3 mr-1" /> 2-Week Milestone
                </Badge>
                <DialogTitle className="text-2xl md:text-3xl text-center font-bold">
                  {content.title}
                </DialogTitle>
                <DialogDescription className="text-center text-base">
                  {content.subtitle}
                </DialogDescription>
              </DialogHeader>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-center text-muted-foreground leading-relaxed"
              >
                {content.body}
              </motion.p>

              {/* 14-day summary */}
              <div className="rounded-xl bg-background/70 backdrop-blur border p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3 text-center">
                  Your last 14 days
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {stats.map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      className="text-center"
                    >
                      <s.icon className="w-4 h-4 mx-auto mb-1 text-primary" />
                      <div className="text-xl font-bold">{s.value}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border bg-background/70 backdrop-blur p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">
                  {content.focusLabel}
                </p>
                <ul className="space-y-1.5">
                  {content.focus.map((f) => (
                    <li key={f} className="text-sm flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button size="lg" className="w-full gap-2" onClick={() => setView('book')}>
                Continue to booking <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <DialogHeader className="mb-3">
              <DialogTitle>Book your milestone check-in</DialogTitle>
              <DialogDescription>
                Your details are pre-filled. Pick the time that works for you.
              </DialogDescription>
            </DialogHeader>
            <div className="rounded-lg overflow-hidden border" style={{ height: 650 }}>
              <InlineWidget
                url={CALENDLY_URL}
                prefill={calendlyPrefill}
                styles={{ height: '100%', width: '100%' }}
                utm={{ utmSource: 'catalyst-mom-app', utmCampaign: '2-week-milestone', utmContent: stage }}
              />
            </div>
            {booked && (
              <p className="text-sm text-center text-primary mt-3 font-medium">
                ✓ Booking confirmed — you can close this window.
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
