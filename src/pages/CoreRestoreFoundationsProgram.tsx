import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Check, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/layout/PageLayout";

const STORAGE_KEY = "core-restore-foundations-progress";
const TOTAL_DAYS = 28;

const DAY_1_VIDEO = "https://pub-e55a11498b7e47449512d71ec24e8493.r2.dev";
// Placeholder audio (60s guided intro). Replace with real asset when ready.
const DAY_1_AUDIO = "/catalyst-mom-demo.mp4";

interface LocalProgress {
  current_week: number;
  current_day: number;
  unlocked_day: number; // 1..28
  started_at: string;
  completed_at?: string;
}

const loadProgress = (): LocalProgress => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (typeof p.unlocked_day !== "number") p.unlocked_day = 1;
      return p;
    }
  } catch {}
  const fresh: LocalProgress = {
    current_week: 1,
    current_day: 1,
    unlocked_day: 1,
    started_at: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  return fresh;
};

const weekTitles = [
  "Foundation Week",
  "Activation Week",
  "Connection Week",
  "Restoration Week",
];

export default function CoreRestoreFoundationsProgram() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [progress, setProgress] = useState<LocalProgress>(() => loadProgress());
  const [selectedDay, setSelectedDay] = useState<number>(() => loadProgress().unlocked_day);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const isUnlocked = (day: number) => day <= progress.unlocked_day;
  const isCompleted = (day: number) => day < progress.unlocked_day;

  const markDayComplete = () => {
    if (selectedDay !== progress.unlocked_day) return;
    const next = Math.min(progress.unlocked_day + 1, TOTAL_DAYS);
    const week = Math.ceil(next / 7);
    const day = ((next - 1) % 7) + 1;
    const updated: LocalProgress = {
      ...progress,
      unlocked_day: next,
      current_week: week,
      current_day: day,
      completed_at: next === TOTAL_DAYS ? new Date().toISOString() : progress.completed_at,
    };
    setProgress(updated);
    setSelectedDay(next > TOTAL_DAYS ? TOTAL_DAYS : next);
    toast({
      title: next > progress.unlocked_day ? `Day ${selectedDay} complete 💛` : "Saved",
      description:
        next >= TOTAL_DAYS && updated.completed_at
          ? "Program complete — beautiful work, mama."
          : `Day ${next} is now unlocked.`,
    });
  };

  const pct = Math.min(100, ((progress.unlocked_day - 1) / TOTAL_DAYS) * 100);

  const weeks = useMemo(
    () =>
      Array.from({ length: 4 }, (_, w) => ({
        week: w + 1,
        title: weekTitles[w],
        days: Array.from({ length: 7 }, (_, d) => w * 7 + d + 1),
      })),
    []
  );

  const selectedUnlocked = isUnlocked(selectedDay);
  const selectedIsCurrent = selectedDay === progress.unlocked_day;
  const selectedWeek = Math.ceil(selectedDay / 7);
  const selectedDayInWeek = ((selectedDay - 1) % 7) + 1;

  return (
    <PageLayout>
      <div className="container max-w-4xl mx-auto py-6 px-4 space-y-6">
        <Button variant="ghost" onClick={() => navigate("/workouts")} className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Workouts
        </Button>

        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Core Restore Foundations</h1>
          <p className="text-muted-foreground text-sm">
            {weekTitles[Math.ceil(progress.unlocked_day / 7) - 1] || weekTitles[3]} •
            {" "}Day {progress.unlocked_day} of {TOTAL_DAYS}
          </p>
          <Progress value={pct} className="h-2" />
        </div>

        {/* Day grid */}
        <div className="space-y-5">
          {weeks.map(({ week, title, days }) => (
            <div key={week} className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                  Week {week} — {title}
                </h2>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {days.map((day) => {
                  const unlocked = isUnlocked(day);
                  const done = isCompleted(day);
                  const active = day === selectedDay;
                  return (
                    <button
                      key={day}
                      onClick={() => unlocked && setSelectedDay(day)}
                      disabled={!unlocked}
                      className={[
                        "aspect-square rounded-xl border text-sm font-medium transition",
                        "flex flex-col items-center justify-center",
                        unlocked
                          ? "bg-card hover:border-primary cursor-pointer"
                          : "bg-muted/40 opacity-40 cursor-not-allowed",
                        active ? "border-primary ring-2 ring-primary/30" : "border-border",
                        done ? "bg-primary/10 border-primary/40" : "",
                      ].join(" ")}
                      aria-label={`Day ${day}${unlocked ? "" : " (locked)"}`}
                    >
                      <span className="text-xs text-muted-foreground">Day</span>
                      <span className="text-base leading-none">{day}</span>
                      {done && <Check className="h-3 w-3 text-primary mt-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Active day view */}
        <Card className="border-primary/20 shadow-sm">
          <CardContent className="p-5 md:p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  Week {selectedWeek} • Day {selectedDayInWeek}
                </Badge>
                <h3 className="mt-2 text-xl font-semibold">
                  Day {selectedDay} {isCompleted(selectedDay) ? "— Complete" : selectedIsCurrent ? "— Today" : ""}
                </h3>
              </div>
            </div>

            {!selectedUnlocked ? (
              <div className="rounded-xl border bg-muted/30 p-8 text-center space-y-2">
                <Lock className="h-5 w-5 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Locked until previous day is complete
                </p>
              </div>
            ) : (
              <>
                {/* 60s Guided Audio Intro */}
                <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    60-Second Guided Intro
                  </div>
                  <audio controls preload="metadata" className="w-full">
                    <source src={DAY_1_AUDIO} />
                    Your browser does not support audio.
                  </audio>
                </div>

                {/* Video player */}
                <div className="rounded-2xl overflow-hidden border bg-black shadow-md">
                  <video
                    key={selectedDay}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full aspect-video bg-black"
                    src={selectedDay === 1 ? DAY_1_VIDEO : DAY_1_VIDEO}
                  />
                </div>

                {/* Mark complete */}
                <Button
                  size="lg"
                  className="w-full"
                  onClick={markDayComplete}
                  disabled={!selectedIsCurrent}
                >
                  <Check className="h-4 w-4 mr-2" />
                  {selectedIsCurrent
                    ? `Mark Day ${selectedDay} Complete`
                    : isCompleted(selectedDay)
                    ? "Already Completed"
                    : "Locked"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
