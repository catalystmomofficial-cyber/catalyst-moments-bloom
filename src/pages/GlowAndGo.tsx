import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import VideoModal from "@/components/ui/video-modal";
import { Play, Clock, ShieldCheck, Heart, Dumbbell, Sparkles, Leaf } from "lucide-react";
import { GLOW_AND_GO_VIDEOS } from "@/data/glowAndGoVideos";
import FeatureCard from "@/components/home/FeatureCard";
import { Progress } from "@/components/ui/progress";

const GlowAndGo = () => {
  const [open, setOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>(GLOW_AND_GO_VIDEOS[0]?.url || "");
  const [currentTitle, setCurrentTitle] = useState<string>(GLOW_AND_GO_VIDEOS[0]?.title || "");
  const [watched, setWatched] = useState<Record<string, boolean>>({});
  const totalVideos = GLOW_AND_GO_VIDEOS.length;
  const watchedCount = GLOW_AND_GO_VIDEOS.filter(v => watched[v.id]).length;
  const progressPercent = totalVideos ? Math.round((watchedCount / totalVideos) * 100) : 0;

  useEffect(() => {
    document.title = "Glow & Go Prenatal Program";

    // Canonical tag
    const link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    link.setAttribute("href", window.location.href);
    document.head.appendChild(link);

    // Meta description for SEO
    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content = "Glow & Go prenatal fitness program: trimester-safe workouts, core & pelvic floor friendly, short on-demand videos.";
    document.head.appendChild(meta);

    // Structured data (JSON-LD)
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Course",
      name: "Glow & Go Prenatal Program",
      description: "A physio-designed pregnancy fitness system with trimester-safe workouts.",
      provider: { "@type": "Organization", name: "Catalyst", url: window.location.origin },
      hasCourseInstance: {
        "@type": "CourseInstance",
        name: "Glow & Go Prenatal Program",
        courseMode: "online",
        url: window.location.href
      },
      hasPart: GLOW_AND_GO_VIDEOS.map(v => ({
        "@type": "CreativeWork",
        name: v.title,
        url: v.url
      }))
    });
    document.head.appendChild(script);

    // Load watched progress
    try {
      const saved = localStorage.getItem("glowAndGoWatched");
      if (saved) setWatched(JSON.parse(saved));
    } catch {}

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(meta);
      document.head.removeChild(script);
    };
  }, []);

  const handlePlay = (id: string, url: string, title: string) => {
    setWatched((prev) => {
      const next = { ...prev, [id]: true };
      try {
        localStorage.setItem("glowAndGoWatched", JSON.stringify(next));
      } catch {}
      return next;
    });
    setCurrentUrl(url);
    setCurrentTitle(title);
    setOpen(true);
  };

  return (
    <PageLayout>
      <main className="container px-4 mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Glow & Go Prenatal Program</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Train for birth. Strengthen safely. A physio-designed pregnancy fitness system for all trimesters.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge>All Trimesters</Badge>
            <Badge variant="secondary">Physio-Designed</Badge>
            <Badge variant="outline">Pelvic Floor Safe</Badge>
          </div>
        </header>

        {/* Progress Bar Section */}
        <section className="mb-8 max-w-4xl">
          <div className="bg-card rounded-lg p-6 border">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Your Progress</h2>
              <p className="text-sm text-muted-foreground">Track your journey through the Glow & Go program</p>
            </div>
            <div className="mb-3 flex justify-between text-sm text-muted-foreground">
              <span>Program progress</span>
              <span>{watchedCount}/{totalVideos} videos • {progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-3" />
          </div>
        </section>

        <section aria-labelledby="features-heading" className="mb-10">
          <h2 id="features-heading" className="sr-only">Program Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              icon={<ShieldCheck className="h-5 w-5 text-primary" />}
              title="Physio-designed & trimester-safe"
              description="Every workout is safe across all trimesters and guided by physiotherapy principles."
            />
            <FeatureCard
              icon={<Heart className="h-5 w-5 text-primary" />}
              title="Core & pelvic floor friendly"
              description="Protect and strengthen your core while supporting your pelvic floor."
            />
            <FeatureCard
              icon={<Clock className="h-5 w-5 text-primary" />}
              title="Short, effective sessions"
              description="10–20 minute videos designed to fit your day and keep you consistent."
            />
            <FeatureCard
              icon={<Dumbbell className="h-5 w-5 text-primary" />}
              title="Minimal equipment"
              description="Move confidently with bodyweight and light dumbbells."
            />
            <FeatureCard
              icon={<Leaf className="h-5 w-5 text-primary" />}
              title="Bonus daily mobility"
              description="Gentle yoga-inspired flows to ease aches and boost energy."
            />
            <FeatureCard
              icon={<Sparkles className="h-5 w-5 text-primary" />}
              title="On-demand access"
              description="Watch anywhere, anytime—pause and resume as needed."
            />
          </div>
        </section>

        <section aria-labelledby="videos-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="videos-heading" className="text-xl font-semibold">Program Videos</h2>
            <Badge>All Trimesters</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GLOW_AND_GO_VIDEOS.map((v) => (
              <Card key={v.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-base">{v.title}</CardTitle>
                  {v.description && (
                    <CardDescription>{v.description}</CardDescription>
                  )}
                  {v.duration && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{v.duration}</span>
                    </div>
                  )}
                  {watched[v.id] && (
                    <div className="mt-2">
                      <Badge variant="secondary">Watched</Badge>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="aspect-video bg-black/80 rounded-lg mb-3 flex items-center justify-center">
                    <Button
                      size="icon"
                      className="rounded-full"
                      onClick={() => handlePlay(v.id, v.url, v.title)}
                      aria-label={`Play ${v.title}`}
                    >
                      <Play className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="mb-3">
                    <Progress value={watched[v.id] ? 100 : 0} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Button className="w-full" onClick={() => handlePlay(v.id, v.url, v.title)}>
                      Play
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <VideoModal
          isOpen={open}
          onClose={() => setOpen(false)}
          videoUrl={currentUrl}
          title={currentTitle}
        />
      </main>
    </PageLayout>
  );
};

export default GlowAndGo;
