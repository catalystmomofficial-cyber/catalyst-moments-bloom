import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import FeatureCard from "@/components/home/FeatureCard";
import { CheckCircle2, Clock, ShieldCheck, Heart, Activity, Sparkles, BookOpen, FileText, Video } from "lucide-react";
import { birthBallExercises } from "@/data/birthBallGuideData";
import { setLastActiveProgram } from "@/lib/lastActiveProgram";
import programCover from "@/assets/ultimate-birth-ball-guide-cover.jpg";

const BIRTHBALL_PDF_URL =
  "https://moxxceccaftkeuaowctw.supabase.co/storage/v1/object/public/catalystcourses/Ultimate%20birth%20ball%20guide/The%20Ultimate%20Birth%20Ball%20Guide%20Safe%20&%20Effective%20Exercises%20for%20Every%20Trimester.pdf";

const STORAGE_KEY = "birthBallProgramDone";

const BirthBallProgram = () => {
  const [done, setDone] = useState<Record<string, boolean>>({});

  const trimesters = useMemo(() => {
    const groups: Record<number, typeof birthBallExercises> = { 1: [], 2: [], 3: [] };
    birthBallExercises.forEach((ex) => {
      if (groups[ex.trimester]) groups[ex.trimester].push(ex);
    });
    return groups;
  }, []);

  const totalExercises = birthBallExercises.length;
  const completedCount = birthBallExercises.filter((ex) => done[ex.id]).length;
  const progressPercent = totalExercises ? Math.round((completedCount / totalExercises) * 100) : 0;

  useEffect(() => {
    document.title = "Birth Ball Program | Catalyst Mom";
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setDone(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    setLastActiveProgram({
      id: "birth-ball",
      name: "Birth Ball Program",
      href: "/programs/birth-ball",
      stage: "pregnancy",
      unit: "exercises",
      completed: completedCount,
      total: totalExercises,
      ctaLabel: "Continue Program",
    });
  }, [completedCount, totalExercises]);

  const toggleDone = (id: string) => {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  return (
    <PageLayout>
      <main className="container px-4 mx-auto">
        {/* Hero */}
        <section className="mb-12">
          <div className="relative aspect-[16/9] lg:aspect-[21/9] rounded-2xl overflow-hidden mb-6">
            <img
              src={programCover}
              alt="Birth Ball Program — physio-designed birth ball routines for every trimester"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white max-w-2xl">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">Birth Ball Program</h1>
              <p className="text-lg lg:text-xl mb-6 opacity-90">
                Relieve pelvic pressure, ease back pain, and prepare your body for birth with a
                physio-designed birth ball routine for every trimester.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">All Trimesters</Badge>
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">Physio-Designed</Badge>
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">Labor Prep</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Progress */}
        <section className="mb-8 max-w-4xl">
          <div className="bg-card rounded-lg p-6 border">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Your Progress</h2>
              <p className="text-sm text-muted-foreground">Track your way through the birth ball routines</p>
            </div>
            <div className="mb-3 flex justify-between text-sm text-muted-foreground">
              <span>Program progress</span>
              <span>{completedCount}/{totalExercises} exercises • {progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-3" />
          </div>
        </section>

        {/* Video coming soon + resources */}
        <section className="mb-10 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 border-dashed">
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6">
              <div className="rounded-full bg-primary/10 p-3">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Guided video sessions — coming soon</h3>
                <p className="text-sm text-muted-foreground">
                  Full follow-along video walkthroughs are in production. In the meantime, work through the
                  illustrated routines below and the complete PDF guide.
                </p>
              </div>
              <Badge variant="secondary">In production</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button className="w-full" asChild>
                <a href={BIRTHBALL_PDF_URL} target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-2 h-4 w-4" />
                  Download the PDF Guide
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/birth-ball-guide">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Open Interactive Guide
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Features */}
        <section aria-labelledby="features-heading" className="mb-10">
          <h2 id="features-heading" className="sr-only">Program Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              icon={<ShieldCheck className="h-5 w-5 text-primary" />}
              title="Physio-designed & trimester-safe"
              description="Every routine is built around safe, supported movement for each stage of pregnancy."
            />
            <FeatureCard
              icon={<Heart className="h-5 w-5 text-primary" />}
              title="Pain & pressure relief"
              description="Eases sciatica, pelvic pressure, and lower back tension."
            />
            <FeatureCard
              icon={<Activity className="h-5 w-5 text-primary" />}
              title="Labor preparation"
              description="Encourages optimal baby positioning and pelvic opening for birth."
            />
            <FeatureCard
              icon={<Clock className="h-5 w-5 text-primary" />}
              title="Short daily routines"
              description="Gentle sessions that fit into your day and keep you consistent."
            />
            <FeatureCard
              icon={<Sparkles className="h-5 w-5 text-primary" />}
              title="Illustrated step-by-step"
              description="Clear instructions and visuals for every exercise."
            />
            <FeatureCard
              icon={<BookOpen className="h-5 w-5 text-primary" />}
              title="Complete PDF companion"
              description="Take the full guide with you, on or offline."
            />
          </div>
        </section>

        {/* Exercises by trimester */}
        {[1, 2, 3].map((t) => {
          const exercises = trimesters[t];
          if (!exercises || exercises.length === 0) return null;
          return (
            <section key={t} className="mb-10 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Trimester {t}</h2>
                <Badge variant="secondary">{exercises.length} exercises</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exercises.map((ex) => (
                  <Card key={ex.id} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-base flex items-start justify-between gap-2">
                        <span>{ex.name}</span>
                        {done[ex.id] && <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {ex.duration} • {ex.category}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-4">
                      {ex.benefits?.length > 0 && (
                        <ul className="space-y-1.5">
                          {ex.benefits.slice(0, 3).map((b, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <Button
                        variant={done[ex.id] ? "outline" : "default"}
                        className="w-full"
                        onClick={() => toggleDone(ex.id)}
                      >
                        {done[ex.id] ? "Mark as not done" : "Mark as done"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </PageLayout>
  );
};

export default BirthBallProgram;
