import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  ArrowLeft,
  Check,
  Tv,
  Lock,
  Sparkles,
  Trophy,
  Flame,
  Star,
  Cast,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePoints } from "@/hooks/usePoints";
import PageLayout from "@/components/layout/PageLayout";

const STORAGE_KEY = "core-restore-foundations-progress";
const TOTAL_DAYS = 28;
const POINTS_PER_DAY = 15;
const POINTS_PER_WEEK_BONUS = 30;
const POINTS_PROGRAM_COMPLETE = 100;

const WEEK_1_VIDEOS = [
  "https://media.catalystmomofficial.com/DR%20COURSE/DR%20WEEK%201/Day%201.mp4",
  "https://media.catalystmomofficial.com/DR%20COURSE/DR%20WEEK%201/Day%202.mp4",
  "https://media.catalystmomofficial.com/DR%20COURSE/DR%20WEEK%201/Day%203.mp4",
  "https://media.catalystmomofficial.com/DR%20COURSE/DR%20WEEK%201/Day%204.mp4",
  "https://media.catalystmomofficial.com/DR%20COURSE/DR%20WEEK%201/Day%205.mp4",
  "https://media.catalystmomofficial.com/DR%20COURSE/DR%20WEEK%201/Day%206.mp4",
  "https://media.catalystmomofficial.com/DR%20COURSE/DR%20WEEK%201/Day%207.mp4",
];
const DAY_PLACEHOLDER = "https://pub-e55a11498b7e47449512d71ec24e8493.r2.dev";

const WEEKS = [
  {
    number: 1,
    code: "RECONNECT",
    title: "Reconnect",
    description:
      "Rebuild the breath–core connection. Gentle diastasis recti work to wake up the deep system.",
    color: "from-rose-500/20 to-pink-500/10",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    number: 2,
    code: "SECURE",
    title: "Secure",
    description:
      "Lock in your foundation. Stabilize the pelvic floor and transverse abdominis under light load.",
    color: "from-amber-500/20 to-orange-500/10",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    number: 3,
    code: "STABILIZE",
    title: "Stabilize",
    description:
      "Add control and endurance. Functional movement patterns that protect your core every day.",
    color: "from-emerald-500/20 to-teal-500/10",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    number: 4,
    code: "INTEGRATE",
    title: "Integrate",
    description:
      "Bring it all together. Full-body integration so your restored core powers real life.",
    color: "from-violet-500/20 to-purple-500/10",
    badgeClass: "bg-violet-50 text-violet-700 border-violet-200",
  },
] as const;

interface LocalProgress {
  current_week: number;
  current_day: number;
  unlocked_day: number;
  streak: number;
  last_completed_date?: string;
  started_at: string;
  completed_at?: string;
}

const todayKey = () => new Date().toISOString().slice(0, 10);

const loadProgress = (): LocalProgress => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (typeof p.unlocked_day !== "number") p.unlocked_day = 1;
      if (typeof p.streak !== "number") p.streak = 0;
      return p;
    }
  } catch {}
  const fresh: LocalProgress = {
    current_week: 1,
    current_day: 1,
    unlocked_day: 1,
    streak: 0,
    started_at: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  return fresh;
};

export default function CoreRestoreFoundationsProgram() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { awardPoints } = usePoints();
  const [progress, setProgress] = useState<LocalProgress>(() => loadProgress());
  const [selectedDay, setSelectedDay] = useState<number>(() => loadProgress().unlocked_day);
  const [celebration, setCelebration] = useState<null | {
    day: number;
    week: number;
    isWeekEnd: boolean;
    isProgramComplete: boolean;
    pointsEarned: number;
    streak: number;
  }>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const unlockedDay = progress.unlocked_day;
  const isProgramComplete = !!progress.completed_at;
  const overallPct = Math.min(100, ((unlockedDay - 1) / TOTAL_DAYS) * 100);

  const selWeek = Math.ceil(selectedDay / 7);
  const selDayInWeek = ((selectedDay - 1) % 7) + 1;
  const isViewingUnlocked = selectedDay <= unlockedDay && !isProgramComplete;
  const isViewingActiveDay = selectedDay === unlockedDay && !isProgramComplete;
  const isLocked = selectedDay > unlockedDay;
  const videoSrc = selWeek === 1 ? WEEK_1_VIDEOS[selDayInWeek - 1] : DAY_PLACEHOLDER;

  const markDayComplete = async () => {
    if (!isViewingActiveDay) return;
    const completedDay = unlockedDay;
    const next = Math.min(completedDay + 1, TOTAL_DAYS);
    const isWeekEnd = completedDay % 7 === 0;
    const isFinal = completedDay === TOTAL_DAYS;
    const week = Math.ceil(next / 7);
    const day = ((next - 1) % 7) + 1;

    // streak update
    const today = todayKey();
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    let streak = progress.streak;
    if (progress.last_completed_date === today) {
      // already counted today
    } else if (progress.last_completed_date === yesterday) {
      streak += 1;
    } else {
      streak = 1;
    }

    const updated: LocalProgress = {
      ...progress,
      unlocked_day: next,
      current_week: isFinal ? Math.ceil(completedDay / 7) : week,
      current_day: isFinal ? ((completedDay - 1) % 7) + 1 : day,
      streak,
      last_completed_date: today,
      completed_at: isFinal ? new Date().toISOString() : progress.completed_at,
    };
    setProgress(updated);
    setSelectedDay(isFinal ? completedDay : next);

    // points
    let pointsEarned = POINTS_PER_DAY;
    await awardPoints(
      POINTS_PER_DAY,
      "core_restore_day",
      `Core Restore — Week ${Math.ceil(completedDay / 7)}, Day ${
        ((completedDay - 1) % 7) + 1
      }`
    );
    if (isWeekEnd && !isFinal) {
      pointsEarned += POINTS_PER_WEEK_BONUS;
      await awardPoints(
        POINTS_PER_WEEK_BONUS,
        "core_restore_week",
        `Completed Week ${Math.ceil(completedDay / 7)} of Core Restore`
      );
    }
    if (isFinal) {
      pointsEarned += POINTS_PROGRAM_COMPLETE;
      await awardPoints(
        POINTS_PROGRAM_COMPLETE,
        "core_restore_complete",
        "Completed Core Restore Foundations"
      );
    }

    setCelebration({
      day: completedDay,
      week: Math.ceil(completedDay / 7),
      isWeekEnd,
      isProgramComplete: isFinal,
      pointsEarned,
      streak,
    });
  };

  // Auto-celebrate when video ends
  const handleVideoEnded = () => {
    if (isViewingActiveDay) markDayComplete();
  };

  const tryCast = async () => {
    const v = videoRef.current as any;
    if (v && typeof v.webkitShowPlaybackTargetPicker === "function") {
      try {
        v.webkitShowPlaybackTargetPicker();
        return;
      } catch {}
    }
    if ((window as any).RemotePlayback || (v && v.remote)) {
      try {
        await v.remote?.prompt();
        return;
      } catch {}
    }
    toast({
      title: "Casting not available here",
      description:
        "Open this page in Safari for AirPlay, or Chrome's three-dot menu → Cast for Chromecast.",
    });
  };

  const weeks = useMemo(() => WEEKS, []);
  const selWeekMeta = WEEKS[selWeek - 1];

  return (
    <PageLayout>
      <div className="container max-w-3xl mx-auto py-6 px-4 space-y-6">
        <Button variant="ghost" onClick={() => navigate("/workouts")} className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Workouts
        </Button>

        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold tracking-tight">Core Restore Foundations</h1>
          <p className="text-muted-foreground text-sm">
            A 4-week journey to rebuild your core after birth.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Badge className="gap-1 bg-primary/10 text-primary border-primary/30">
              <Flame className="h-3.5 w-3.5" /> {progress.streak}-day streak
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Trophy className="h-3.5 w-3.5" /> Day {Math.min(unlockedDay, TOTAL_DAYS)} of {TOTAL_DAYS}
            </Badge>
            {isProgramComplete && (
              <Badge className="gap-1 bg-amber-100 text-amber-800 border-amber-300">
                <Star className="h-3.5 w-3.5 fill-current" /> Program Complete
              </Badge>
            )}
          </div>

          <Progress value={overallPct} className="h-2" />
        </div>

        {/* Week journey */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {weeks.map((w) => {
            const weekStartDay = (w.number - 1) * 7 + 1;
            const weekEndDay = w.number * 7;
            const weekUnlocked = unlockedDay >= weekStartDay;
            const weekDone = unlockedDay > weekEndDay || isProgramComplete;
            return (
              <div
                key={w.number}
                className={`relative rounded-2xl border p-4 bg-gradient-to-br ${w.color} ${
                  !weekUnlocked ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className={w.badgeClass}>
                    Week {w.number} — {w.code}
                  </Badge>
                  {weekDone ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : !weekUnlocked ? (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-primary" />
                  )}
                </div>
                <h3 className="font-semibold">{w.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 mb-3">{w.description}</p>

                <div className="grid grid-cols-7 gap-1.5">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const dayNum = weekStartDay + i;
                    const dayUnlocked = dayNum <= unlockedDay;
                    const dayDone = dayNum < unlockedDay || (isProgramComplete && dayNum <= TOTAL_DAYS);
                    const isToday = dayNum === unlockedDay && !isProgramComplete;
                    const isSelected = dayNum === selectedDay;
                    return (
                      <button
                        key={dayNum}
                        onClick={() => dayUnlocked && setSelectedDay(dayNum)}
                        disabled={!dayUnlocked}
                        aria-label={`Day ${dayNum}`}
                        className={`h-9 rounded-md text-xs font-medium border transition ${
                          isSelected
                            ? "ring-2 ring-primary ring-offset-1"
                            : ""
                        } ${
                          dayDone
                            ? "bg-primary/15 border-primary/30 text-primary"
                            : isToday
                            ? "bg-primary text-primary-foreground border-primary"
                            : dayUnlocked
                            ? "bg-background border-border hover:bg-muted"
                            : "bg-muted/40 border-transparent text-muted-foreground cursor-not-allowed"
                        }`}
                      >
                        {dayDone ? <Check className="h-3.5 w-3.5 mx-auto" /> : i + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Active day card */}
        <Card className="border-primary/20 shadow-md">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge variant="outline" className={selWeekMeta.badgeClass}>
                  Week {selWeek} — {selWeekMeta.code} • Day {selDayInWeek}
                </Badge>
                <h3 className="mt-2 text-xl font-semibold">
                  {isLocked
                    ? `Day ${selectedDay} — Locked`
                    : isViewingActiveDay
                    ? `Day ${selectedDay} — Today`
                    : `Day ${selectedDay} — Completed`}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {selWeekMeta.title}: {selWeekMeta.description}
                </p>
              </div>
              {isViewingUnlocked && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={tryCast}
                  className="shrink-0"
                  aria-label="Cast or AirPlay"
                >
                  <Cast className="h-4 w-4 mr-1.5" />
                  Cast
                </Button>
              )}
            </div>

            {isLocked ? (
              <div className="rounded-2xl border bg-muted/30 p-6 text-center">
                <Lock className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Locked until previous day is complete.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden border bg-black shadow-md">
                <video
                  ref={videoRef}
                  key={selectedDay}
                  controls
                  playsInline
                  controlsList="nodownload"
                  crossOrigin="anonymous"
                  {...{
                    "x-webkit-airplay": "allow",
                    "webkit-playsinline": "",
                    disableRemotePlayback: false,
                  }}
                  onEnded={handleVideoEnded}
                  width="100%"
                  style={{ borderRadius: "12px", backgroundColor: "#000" }}
                  preload="metadata"
                >
                  <source src={videoSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {!isLocked && (
              <p className="flex items-start gap-2 text-xs text-muted-foreground">
                <Tv className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                Bigger screen? Tap the AirPlay icon in the player (Safari/iOS) or use Chrome's
                three-dot menu → Cast to send to Apple TV, Smart TV, or Chromecast.
              </p>
            )}

            {isProgramComplete ? (
              <p className="text-center text-sm text-muted-foreground py-2">
                Your core is restored — beautiful work, mama. 💛
              </p>
            ) : isViewingActiveDay ? (
              <Button size="lg" className="w-full" onClick={markDayComplete}>
                <Check className="h-4 w-4 mr-2" />
                Mark Day {selectedDay} Complete (+{POINTS_PER_DAY} pts)
              </Button>
            ) : isLocked ? (
              <Button size="lg" className="w-full" disabled>
                <Lock className="h-4 w-4 mr-2" />
                Complete Day {unlockedDay} to unlock
              </Button>
            ) : (
              <div className="flex items-center justify-center text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md py-2">
                <Check className="h-4 w-4 mr-2" /> Already completed
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Celebration modal — same vibe as 30-day glow up achievements */}
      <Dialog
        open={!!celebration}
        onOpenChange={(open) => !open && setCelebration(null)}
      >
        <DialogContent className="max-w-sm text-center p-0 overflow-hidden border-none">
          <AnimatePresence>
            {celebration && (
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: "spring", damping: 15, stiffness: 300 }}
                className="p-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: "spring", damping: 12 }}
                  className="mx-auto mb-6 w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center relative"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
                  />
                  <div className="p-4 rounded-full bg-primary/10">
                    {celebration.isProgramComplete ? (
                      <Trophy className="w-10 h-10 text-primary" />
                    ) : celebration.isWeekEnd ? (
                      <Star className="w-10 h-10 text-primary" />
                    ) : (
                      <Sparkles className="w-10 h-10 text-primary" />
                    )}
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="text-xl font-bold mb-1"
                >
                  {celebration.isProgramComplete
                    ? "Program Complete!"
                    : celebration.isWeekEnd
                    ? `Week ${celebration.week} Complete!`
                    : `Day ${celebration.day} Done`}
                </motion.h2>

                <Badge variant="secondary" className="mb-3">
                  +{celebration.pointsEarned} points
                </Badge>

                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="text-sm text-muted-foreground mb-4"
                >
                  {celebration.isProgramComplete
                    ? "You restored your core. This is the work, mama. 💛"
                    : celebration.isWeekEnd
                    ? `${WEEKS[celebration.week - 1].title} week locked in. The next phase is unlocked.`
                    : "One more day stronger. Tomorrow's session is unlocked."}
                </motion.p>

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-4"
                >
                  <Flame className="h-3.5 w-3.5 text-primary" />
                  {celebration.streak}-day streak
                </motion.div>

                <Button onClick={() => setCelebration(null)} className="w-full">
                  Keep going
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
