import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import SEO from "@/components/seo/SEO";
import { Breadcrumb } from "@/components/blog/Breadcrumb";

// Public hub for the free SEO resource cluster. Gives the standalone guide
// pages a discoverable home + internal links (so they aren't orphaned) and a
// place to rank for "free postpartum / pregnancy guides." Linked from the
// footer Resources column.

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Free Guides for Moms — Catalyst Mom",
  description:
    "Free, judgment-free guides on the things no one warns moms about: postpartum recovery, c-section prep, the breastfeeding decision, and new-mom exhaustion.",
  url: "https://catalystmomofficial.com/guides",
};

const guides = [
  {
    stage: "Postpartum",
    title: "What Nobody Tells You About Your Postpartum Body",
    blurb:
      "The changes moms say no one warned them about — what's normal, what helps, when to call your provider, and what you can rebuild.",
    href: "/postpartum-body-changes-what-nobody-tells-you",
  },
  {
    stage: "Pregnancy",
    title: "C-Section & \"Plan B\" Prep Checklist",
    blurb:
      "For the birth you didn't plan on: hospital-bag extras, home setup, recovery-safe first weeks, and a support plan — so a change of plan doesn't catch you off guard.",
    href: "/c-section-prep-checklist",
  },
  {
    stage: "Postpartum",
    title: "Breastfeeding Without the Guilt — Scripts & Permission",
    blurb:
      "Word-for-word scripts for telling your partner low supply isn't willpower, setting boundaries with family, and quieting your own guilt.",
    href: "/stop-breastfeeding-without-guilt",
  },
  {
    stage: "Postpartum",
    title: "Exhausted New Mom? Sleep Troubleshooting",
    blurb:
      "A structured triage to find your real sleep bottleneck — fragmentation, a racing mind, an unequal load, or run-down levels — and the fix for each.",
    href: "/exhausted-mom-sleep-troubleshooting",
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
        title="Free Guides for Moms — Pregnancy & Postpartum"
        description="Free, judgment-free guides on what no one warns moms about — postpartum body changes, c-section prep, the breastfeeding decision, and new-mom exhaustion."
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
            Honest, judgment-free, and safety-first — the guides we wish someone
            had handed us. No email wall, no fluff.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2">
          {guides.map((g) => (
            <Link
              key={g.href}
              to={g.href}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-catalyst-copper/50"
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
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Guides;
