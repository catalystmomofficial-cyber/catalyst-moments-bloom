import { Badge } from "@/components/ui/badge";
import { Dumbbell, LayoutGrid, HeartHandshake } from "lucide-react";

// Additive homepage band (placed below the working hero/features/about copy)
// that states the positioning wedge without naming or bashing competitors:
// deep where it counts (real recovery) + all-in-one (stop juggling apps) +
// a connected coach/AI/community in your corner. Theme-aware; matches the
// other home sections.

const pillars = [
  {
    icon: LayoutGrid,
    title: "Everything in one app",
    body: "Cycle tracking for TTC, pregnancy and postpartum, personalized workouts, meal plans, and progress — all in one place. Stop juggling five apps and five subscriptions for one motherhood.",
  },
  {
    icon: Dumbbell,
    title: "Deep where it counts",
    body: "All-in-one doesn't mean shallow. We go expert-level on the thing most apps skip entirely — guided core and pelvic floor recovery. Leaking, the mom pooch, and back pain are trainable, not something to just log and live with.",
  },
  {
    icon: HeartHandshake,
    title: "A coach in your corner",
    body: "A wellness coach and a 24/7 AI that actually know your assessment — so the guidance connects instead of starting from scratch — plus a community of moms in your exact stage. Support that answers back.",
  },
];

const WhyDifferentSection = () => {
  return (
    <section aria-label="Why Catalyst Mom is different" className="py-20 bg-background">
      <div className="container container-padding mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="outline" className="mb-4 px-3 py-1 border-primary/30 text-primary dark:text-catalyst-gold dark:border-catalyst-gold/40">
            Why Catalyst Mom
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            One app that does it all — and is actually good at each part
          </h2>
          <p className="text-lg text-muted-foreground">
            Most moms end up with a phone full of single-purpose apps: one for
            cycles, one for sleep, one for workouts, none of them talking to each
            other. Catalyst Mom brings it together — and goes deep where it
            matters most.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="rounded-xl border border-border bg-card p-6">
                <div className="w-11 h-11 rounded-lg bg-catalyst-copper/10 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-catalyst-copper dark:text-catalyst-gold" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{p.title}</h3>
                <p className="text-muted-foreground">{p.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyDifferentSection;
