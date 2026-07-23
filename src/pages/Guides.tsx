import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import SEO from "@/components/seo/SEO";
import { Breadcrumb } from "@/components/blog/Breadcrumb";
import { GlowingEffect } from "@/components/ui/glowing-effect";

// Public hub for the free SEO resource cluster. Gives the standalone guide
// pages a discoverable home + internal links (so they aren't orphaned) and a
// place to rank for "free postpartum / pregnancy guides." Linked from the
// footer Resources column.

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Free Guides for Moms, Catalyst Mom",
  description:
    "Free, judgment-free guides on the things no one warns moms about: postpartum recovery, c-section prep, the breastfeeding decision, and new-mom exhaustion.",
  url: "https://catalystmomofficial.com/guides",
};

const guides = [
  {
    stage: "Postpartum",
    title: "What Nobody Tells You About Your Postpartum Body",
    blurb:
      "The changes moms say no one warned them about, what's normal, what helps, when to call your provider, and what you can rebuild.",
    href: "/postpartum-body-changes-what-nobody-tells-you",
  },
  {
    stage: "Pregnancy",
    title: "C-Section & \"Plan B\" Prep Checklist",
    blurb:
      "For the birth you didn't plan on: hospital-bag extras, home setup, recovery-safe first weeks, and a support plan, so a change of plan doesn't catch you off guard.",
    href: "/c-section-prep-checklist",
  },
  {
    stage: "Postpartum",
    title: "Breastfeeding Without the Guilt: Scripts & Permission",
    blurb:
      "Word-for-word scripts for telling your partner low supply isn't willpower, setting boundaries with family, and quieting your own guilt.",
    href: "/stop-breastfeeding-without-guilt",
  },
  {
    stage: "Postpartum",
    title: "Exhausted New Mom? Sleep Troubleshooting",
    blurb:
      "A structured triage to find your real sleep bottleneck, fragmentation, a racing mind, an unequal load, or run-down levels, and the fix for each.",
    href: "/exhausted-mom-sleep-troubleshooting",
  },
  {
    stage: "Postpartum",
    title: "You're Allowed to Stop Logging Everything",
    blurb:
      "When feed and wake-window tracking turns into anxiety: when it's worth keeping, when it's not, and a gentle step-down plan to trust yourself again.",
    href: "/baby-tracking-anxiety",
  },
  {
    stage: "Pregnancy",
    title: "Honest Pregnancy Advice the Apps Won't Give You",
    blurb:
      "The no-toxic-positivity version, countering the shaming, contradictory app notifications, while still taking real warning signs seriously.",
    href: "/honest-pregnancy-truths",
  },
  {
    stage: "Mental load",
    title: "Postpartum Freezer Meal Prep + Grocery List",
    blurb:
      "One afternoon of batch cooking = weeks of dinners already decided. Six freeze-and-reheat meals with a one-trip grocery list.",
    href: "/postpartum-freezer-meal-prep",
  },
  {
    stage: "Community",
    title: "How to Actually Build Your Village",
    blurb:
      "Matching apps get you to a first chat but rarely a friend. The first-three-meetups method + reciprocal-help swaps, with copy-paste openers.",
    href: "/build-your-village",
  },
  {
    stage: "Baby",
    title: "Baby Allergen & First Foods Tracker (Printable)",
    blurb:
      "The simple checklist parents keep wishing existed, track what your baby has tried and how they responded, to bring to your pediatrician.",
    href: "/baby-allergen-tracker",
  },
  {
    stage: "Postpartum",
    title: "Healing Diastasis Recti & the \"Mom Pooch\" (the Reddit consensus)",
    blurb:
      "Why crunches and planks make the gap worse, what the forums actually agree on, and the safe way to close it.",
    href: "/diastasis-recti-recovery-program-reviews-reddit",
  },
];

const Guides = () => {
  return (
    <PageLayout>
      <SEO
        title="Free Guides for Moms, Pregnancy & Postpartum"
        description="Free, judgment-free guides on what no one warns moms about, postpartum body changes, c-section prep, the breastfeeding decision, and new-mom exhaustion."
        canonical="https://catalystmomofficial.com/guides"
        structuredData={structuredData}
      />

      <div className="container mx-auto max-w-5xl px-4 py-10 md:py-16">
        <Breadcrumb items={[{ label: "Free Guides", href: "/guides" }]} />

        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-catalyst-brown">
            Free Guides for the Things No One Warns You About
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            Honest, judgment-free, and safety-first, the guides we wish someone
            had handed us. No email wall, no fluff.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2">
          {guides.map((g) => (
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
                <span className="text-xs font-semibold uppercase tracking-wide text-catalyst-copper">
                  {g.stage}
                </span>
                <h2 className="mt-2 text-xl font-semibold text-catalyst-brown group-hover:underline underline-offset-4">
                  {g.title}
                </h2>
                <p className="mt-2 text-muted-foreground">{g.blurb}</p>
                <span className="mt-3 inline-block text-sm font-medium text-catalyst-copper">
                  Read the guide →
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Guides;
