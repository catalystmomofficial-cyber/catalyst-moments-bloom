import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import VideoModal from "@/components/ui/video-modal";
import { Play, Clock } from "lucide-react";
import { GLOW_AND_GO_VIDEOS } from "@/data/glowAndGoVideos";

const GlowAndGo = () => {
  const [open, setOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>(GLOW_AND_GO_VIDEOS[0]?.url || "");
  const [currentTitle, setCurrentTitle] = useState<string>(GLOW_AND_GO_VIDEOS[0]?.title || "");

  useEffect(() => {
    document.title = "Glow & Go Prenatal Program";

    // Basic canonical tag for SEO
    const link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    link.setAttribute("href", window.location.href);
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handlePlay = (url: string, title: string) => {
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
        </header>

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
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="aspect-video bg-black/80 rounded-lg mb-3 flex items-center justify-center">
                    <Button
                      size="icon"
                      className="rounded-full"
                      onClick={() => handlePlay(v.url, v.title)}
                      aria-label={`Play ${v.title}`}
                    >
                      <Play className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button className="w-full" onClick={() => handlePlay(v.url, v.title)}>
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
