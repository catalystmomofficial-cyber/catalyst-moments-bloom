import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

// Homepage discovery band for the free SEO guide cluster. Reinforces the
// positioning wedge (we cover what the big maternal apps don't) and routes
// cold visitors into the /guides hub. Theme-aware, matches the home sections.

const featured = [
  {
    title: "What Nobody Tells You About Your Postpartum Body",
    blurb: "The changes no one warns you about — what's normal, what helps, and what you can rebuild.",
    href: "/postpartum-body-changes-what-nobody-tells-you",
  },
  {
    title: "C-Section & \"Plan B\" Prep Checklist",
    blurb: "For the birth you didn't plan on: bag, home setup, recovery, and a support plan.",
    href: "/c-section-prep-checklist",
  },
  {
    title: "Breastfeeding Without the Guilt",
    blurb: "Permission and word-for-word scripts for your partner, your family, and yourself.",
    href: "/stop-breastfeeding-without-guilt",
  },
];

const FreeGuidesSection = () => {
  return (
    <section aria-label="Free Guides" className="py-20 bg-background">
      <div className="container container-padding mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="outline" className="mb-4 px-3 py-1 border-primary/30 text-primary dark:text-catalyst-gold dark:border-catalyst-gold/40">
            Free · No email required
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            The stuff no one else talks about
          </h2>
          <p className="text-lg text-muted-foreground">
            Honest, judgment-free guides on the parts of motherhood the big apps
            skip — postpartum recovery, c-section prep, feeding, and exhaustion.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3 mb-10">
          {featured.map((g) => (
            <div key={g.href} className="relative h-full rounded-xl">
              <GlowingEffect
                disabled={false}
                proximity={80}
                spread={30}
                borderWidth={2}
                inactiveZone={0.4}
              />
              <Link
                to={g.href}
                className="group relative block h-full rounded-xl border border-border bg-card p-6 transition-colors hover:border-catalyst-copper/50"
              >
                <h3 className="text-lg font-semibold text-foreground group-hover:text-catalyst-copper transition-colors">
                  {g.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{g.blurb}</p>
                <span className="mt-3 inline-flex items-center text-sm font-medium text-catalyst-copper dark:text-catalyst-gold">
                  Read the guide <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="outline" className="rounded-full border-catalyst-copper/20 text-catalyst-copper hover:bg-catalyst-copper/5 dark:text-catalyst-gold dark:border-catalyst-gold/40 dark:hover:bg-catalyst-copper/10">
            <Link to="/guides">See all free guides</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FreeGuidesSection;
