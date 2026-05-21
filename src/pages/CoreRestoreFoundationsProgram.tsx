import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Check, Tv } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/layout/PageLayout";

const STORAGE_KEY = "core-restore-foundations-progress";
const TOTAL_DAYS = 28;

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

const weekTitles = [
  "Foundation Week",
  "Activation Week",
  "Connection Week",
  "Restoration Week",
];

interface LocalProgress {
  current_week: number;
  current_day: number;
  unlocked_day: number;
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

export default function CoreRestoreFoundationsProgram() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [progress, setProgress] = useState<LocalProgress>(() => loadProgress());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const markDayComplete = () => {
    if (progress.completed_at) return;
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
    toast({
      title: `Day ${progress.unlocked_day} complete 💛`,
      description: updated.completed_at
        ? "Program complete — beautiful work, mama."
        : `Day ${next} is now unlocked.`,
    });
  };

  const pct = Math.min(100, ((progress.unlocked_day - 1) / TOTAL_DAYS) * 100);
  const currentDay = progress.unlocked_day;
  const currentWeek = Math.ceil(currentDay / 7);
  const currentDayInWeek = ((currentDay - 1) % 7) + 1;
  const isAllComplete = !!progress.completed_at;

  const videoSrc =
    currentWeek === 1 ? WEEK_1_VIDEOS[currentDayInWeek - 1] : DAY_PLACEHOLDER;

  return (
    <PageLayout>
      <div className="container max-w-lg mx-auto py-6 px-4 space-y-6">
        <Button variant="ghost" onClick={() => navigate("/workouts")} className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Workouts
        </Button>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Core Restore Foundations</h1>
          <p className="text-muted-foreground text-sm">
            {weekTitles[currentWeek - 1] ?? weekTitles[3]} • Day {currentDay} of {TOTAL_DAYS}
          </p>
          <Progress value={pct} className="h-2" />
        </div>

        {/* Active day hero card */}
        <Card className="border-primary/20 shadow-md">
          <CardContent className="p-5 space-y-4">
            <div>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Week {currentWeek} • Day {currentDayInWeek}
              </Badge>
              <h3 className="mt-2 text-xl font-semibold">
                {isAllComplete ? "Program Complete 💛" : `Day ${currentDay} — Today`}
              </h3>
              {currentWeek === 1 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Week 1 — Diastasis Recti Workout
                </p>
              )}
            </div>

            {/* Video player */}
            <div className="rounded-2xl overflow-hidden border bg-black shadow-md">
              <video
                key={currentDay}
                controls
                playsInline
                controlsList="nodownload"
                {...{ "x-webkit-airplay": "allow", "webkit-playsinline": "" }}
                width="100%"
                style={{ borderRadius: "12px", backgroundColor: "#000" }}
                preload="metadata"
              >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Casting hint */}
            <p className="flex items-start gap-2 text-xs text-muted-foreground">
              <Tv className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              Want a bigger screen? Use your device's native options to cast this routine to your Apple TV, Smart TV, or Laptop.
            </p>

            {/* Mark complete */}
            {isAllComplete ? (
              <p className="text-center text-sm text-muted-foreground py-2">
                Your core is restored — beautiful work, mama.
              </p>
            ) : (
              <Button size="lg" className="w-full" onClick={markDayComplete}>
                <Check className="h-4 w-4 mr-2" />
                Mark Day {currentDay} Complete
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
