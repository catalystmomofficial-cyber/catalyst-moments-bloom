import { useEffect, useMemo, useState } from 'react';
import { InlineWidget } from 'react-calendly';
import confetti from 'canvas-confetti';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { usePoints } from '@/hooks/usePoints';
import { useAssessmentData } from '@/hooks/useAssessmentData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type MilestoneStage = 'ttc' | 'pregnant' | 'postpartum' | 'general';

const CALENDLY_URL = 'https://calendly.com/catalystmomofficial/2-week-milestone-check-in-catalyst-mom';

interface FocusItem {
  title: string;
  description: string;
}

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
  /** YYYY-MM-DD strings for days the user was active in the last 14 days */
  activeDates?: string[];
  onBooked?: () => void;
}

// Stage-specific framing for the header + the default check-in focus list.
const STAGE_META: Record<MilestoneStage, { label: string; headline: string; subtitle: string }> = {
  ttc: {
    label: 'TTC',
    headline: 'Your fertility momentum is real',
    subtitle: 'Two weeks of consistent care. Time to sync with your expert and shape what comes next.',
  },
  pregnant: {
    label: 'Pregnancy',
    headline: 'Your pregnancy momentum is real',
    subtitle: 'Two weeks of consistent care. Time to sync with your expert and shape what comes next.',
  },
  postpartum: {
    label: 'Postpartum',
    headline: 'Your recovery momentum is real',
    subtitle: 'Two weeks of consistent care. Time to sync with your expert and shape what comes next.',
  },
  general: {
    label: 'Wellness',
    headline: 'Your momentum is real',
    subtitle: 'Two weeks of consistent care. Time to sync with your expert and shape what comes next.',
  },
};

const STAGE_FOCUS: Record<MilestoneStage, FocusItem[]> = {
  ttc: [
    { title: 'Cycle and hormone check', description: 'Reviewing your patterns and symptoms' },
    { title: 'Stress and nervous system', description: 'How the last two weeks really felt' },
    { title: 'Fertility-friendly habits', description: 'Progress against your baseline' },
  ],
  pregnant: [
    { title: 'Trimester symptom check', description: 'Reviewing how you and baby are doing' },
    { title: 'Pelvic floor and core readiness', description: 'Progress against your baseline' },
    { title: 'Birth preparation progress', description: 'How the last two weeks really felt' },
  ],
  postpartum: [
    { title: 'Core reconnection check', description: 'Reviewing healing signs and progress' },
    { title: 'Pelvic floor recovery', description: 'Progress against your baseline' },
    { title: 'Energy and emotional wellbeing', description: 'How the last two weeks really felt' },
  ],
  general: [
    { title: 'Movement consistency', description: 'Reviewing your wins and patterns' },
    { title: 'Energy and recovery', description: 'How the last two weeks really felt' },
    { title: 'Goals for the next two weeks', description: 'Shaping what comes next' },
  ],
};

// Turn a raw assessment value (slug or free text) into a clean readable phrase.
const humanize = (raw: string) =>
  raw.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim().replace(/^./, (c) => c.toUpperCase());

// Map the user's biggest obstacle → a specific check-in focus.
const mapObstacle = (raw?: string): FocusItem | null => {
  if (!raw) return null;
  const t = String(raw).toLowerCase();
  if (/no.?time|busy|schedule|time/.test(t))
    return { title: 'Building a routine that fits your real schedule', description: 'A plan that works around your actual days' };
  if (/no.?energy|energy|tired|fatigue|exhaust|sleep/.test(t))
    return { title: 'Working with your real energy levels', description: 'Matching intensity to how you actually feel' };
  if (/motivat|consisten|accountab|discipline|stick/.test(t))
    return { title: 'Staying consistent when motivation dips', description: 'Accountability that holds up week to week' };
  if (/pain|injur|discomfort|ache/.test(t))
    return { title: 'Movement that respects your pain and limits', description: 'Safe modifications for how your body feels' };
  if (/stress|anxi|overwhelm|mental|mood|burnout/.test(t))
    return { title: 'Managing stress and mental load', description: 'Nervous-system support for the next two weeks' };
  if (/where.?to.?start|confus|unsure|knowledge|know.?how|lost/.test(t))
    return { title: 'A clear starting point and next steps', description: 'Cutting through the overwhelm' };
  if (/confidence|body.?image|self.?conscious/.test(t))
    return { title: 'Rebuilding confidence in your body', description: 'Progress you can actually feel' };
  return { title: 'Clearing your biggest obstacle', description: humanize(String(raw)) };
};

// Map the user's primary goal → a specific check-in focus.
const mapGoal = (raw?: string): FocusItem | null => {
  if (!raw) return null;
  const t = String(raw).toLowerCase();
  if (/heal.?dr|diastasis|ab.?separation|\bdr\b|tummy.?gap/.test(t))
    return { title: 'Diastasis recti healing progress check', description: 'Tracking your core gap and tension' };
  if (/pelvic|leak|incontinen|prolapse/.test(t))
    return { title: 'Pelvic floor strength and control', description: 'Progress against your baseline' };
  if (/weight|fat.?loss|slim|lose|tone/.test(t))
    return { title: 'Sustainable weight and body composition', description: 'Progress against your baseline' };
  if (/strength|strong|muscle|build/.test(t))
    return { title: 'Building strength safely', description: 'Leveling up your training' };
  if (/fertil|conceive|ttc|hormone|ovulat/.test(t))
    return { title: 'Fertility and hormone optimization', description: 'Habits that move the needle' };
  if (/birth|labor|labour|delivery|prep/.test(t))
    return { title: 'Birth preparation progress', description: 'Getting your body ready' };
  if (/energy|fatigue|tired/.test(t))
    return { title: 'Getting your energy back', description: 'How the last two weeks really felt' };
  if (/mental|stress|mood|mindset|anxi/.test(t))
    return { title: 'Mental wellbeing and mindset', description: 'Support for the next two weeks' };
  if (/pain|back|sciatic/.test(t))
    return { title: 'Reducing pain and discomfort', description: 'Targeted relief strategies' };
  return { title: 'Progress toward your primary goal', description: humanize(String(raw)) };
};

export const MilestoneCheckInModal = ({
  open, onOpenChange, stage, userName, userEmail, summary, activeDates = [], onBooked,
}: MilestoneCheckInModalProps) => {
  const [view, setView] = useState<'celebrate' | 'book'>('celebrate');
  const [booked, setBooked] = useState(false);
  const { awardPoints } = usePoints();
  const { assessmentData } = useAssessmentData();
  const meta = STAGE_META[stage] ?? STAGE_META.general;

  useEffect(() => {
    if (open) {
      setView('celebrate');
      setBooked(false);
    }
  }, [open]);

  // Consistency + 14-segment streak data
  const consistency = Math.round((Math.min(summary.activeDays, 14) / 14) * 100);
  const segments = useMemo(() => {
    const set = new Set(activeDates);
    const today = new Date();
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (13 - i));
      return set.has(d.toISOString().slice(0, 10));
    });
  }, [activeDates]);

  // Personalised "what your expert will cover":
  // 1) biggest_obstacle  2) primary_goal  3) stage default — filling gaps with stage defaults.
  const focusItems = useMemo<FocusItem[]>(() => {
    const defaults = STAGE_FOCUS[stage] ?? STAGE_FOCUS.general;
    const hasAssessment = !!assessmentData && (!!assessmentData.biggest_obstacle || !!assessmentData.primary_goal);
    if (!hasAssessment) return defaults.slice(0, 3);

    const used = new Set<string>();
    const out: FocusItem[] = [];
    const nextDefault = () => defaults.find((d) => !used.has(d.title)) ?? null;
    const push = (it: FocusItem | null) => {
      const chosen = it && !used.has(it.title) ? it : nextDefault();
      if (chosen) {
        out.push(chosen);
        used.add(chosen.title);
      }
    };
    push(mapObstacle(assessmentData?.biggest_obstacle)); // 1st
    push(mapGoal(assessmentData?.primary_goal));         // 2nd
    push(null);                                          // 3rd → stage default
    while (out.length < 3) {
      const d = nextDefault();
      if (!d) break;
      out.push(d);
      used.add(d.title);
    }
    return out.slice(0, 3);
  }, [assessmentData, stage]);

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
    { label: 'Workouts', value: summary.workouts },
    { label: 'Active days', value: summary.activeDays },
    { label: 'Points', value: summary.points },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[92vh] overflow-y-auto p-0 overflow-hidden">
        {view === 'celebrate' ? (
          <div>
            {/* Dark header */}
            <div className="bg-gradient-to-b from-[#2b2019] to-[#20170f] px-7 pt-8 pb-7 text-center">
              <DialogHeader>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#d08b4f] mb-3">
                  Day 14 · {meta.label} Journey
                </p>
                <DialogTitle className="text-3xl font-bold text-white leading-tight">
                  {meta.headline}
                </DialogTitle>
                <DialogDescription className="text-white/60 mt-3 text-base leading-relaxed">
                  {meta.subtitle}
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Cream body */}
            <div className="bg-[#fbf2e9] px-6 py-7 space-y-6">
              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-3">
                {stats.map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl py-5 text-center shadow-sm">
                    <div className="text-3xl font-bold text-[#b5651d]">{s.value}</div>
                    <div className="text-xs text-[#8a7a6d] mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Consistency */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium text-[#2b2019]">Consistency this cycle</span>
                  <span className="text-2xl font-bold text-[#b5651d]">{consistency}%</span>
                </div>
                <div className="flex gap-1" aria-hidden>
                  {segments.map((active, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-2 rounded-full ${active ? 'bg-[#b5651d]' : 'bg-[#ead3b8]'}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-[#8a7a6d] mt-4">{summary.activeDays} of 14 days logged</p>
              </div>

              {/* What your expert will cover */}
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[#b5651d] mb-4">
                  What your expert will cover
                </p>
                <ol className="space-y-5">
                  {focusItems.map((item, i) => (
                    <li key={`${item.title}-${i}`} className="relative pl-6">
                      {i < focusItems.length - 1 && (
                        <span className="absolute left-[5px] top-3 -bottom-5 w-px bg-[#e0c9ae]" />
                      )}
                      <span className="absolute left-0 top-1 h-2.5 w-2.5 rounded-full bg-[#b5651d]" />
                      <p className="font-semibold text-[#2b2019] leading-snug">{item.title}</p>
                      <p className="text-sm text-[#8a7a6d]">{item.description}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <Button
                size="lg"
                className="w-full gap-2 rounded-full h-12 bg-[#2b2019] hover:bg-[#3a2c20] text-white"
                onClick={() => setView('book')}
              >
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
