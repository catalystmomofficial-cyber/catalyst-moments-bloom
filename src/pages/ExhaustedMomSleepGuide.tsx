import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import SEO from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/blog/Breadcrumb";

// SEO resource page: "Exhausted New Mom — Sleep Troubleshooting Guide." Targets
// the sleep-deprivation + decision-fatigue pain point across r/NewParents and
// r/beyondthebump, which forums usually answer with generic "sleep when the
// baby sleeps" tips instead of a structured triage. On-brand: this is about the
// MOTHER's rest (matching the existing "Sleep Reset for Moms" product), not
// infant sleep-training. Safe: no sleep-training prescriptions, defers infant
// safe-sleep to the pediatrician/AAP, points to 988/PSI for overwhelm. Funnels
// into the app and the existing Sleep Reset for Moms guide.

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why am I so exhausted even when I do get some sleep?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Because the bottleneck isn't always the baby. For some moms it's fragmented sleep with no consolidated stretch; for others it's a racing mind that won't let them fall back asleep, an unequal night-duty split, or run-down iron or thyroid levels. Fixing the wrong thing is why generic tips don't work — this guide helps you find your actual bottleneck first.",
      },
    },
    {
      "@type": "Question",
      name: "What actually helps a sleep-deprived new mom?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The single highest-leverage move is protecting one consolidated 3-4 hour block of sleep, usually by having a partner or support person cover one overnight feed or stretch. From there it depends on your bottleneck: a wind-down routine and a mental-offload list for a racing mind, sharing the invisible load, and asking your provider to check iron or thyroid if you're wrecked despite sleeping.",
      },
    },
    {
      "@type": "Question",
      name: "When is exhaustion something to talk to a doctor about?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If you're getting sleep and still feel completely depleted, ask your provider to check things like iron and thyroid. And if the exhaustion comes with low mood, anxiety you can't switch off, or a sense of hopelessness, that can be more than tiredness — reach out to your provider, Postpartum Support International (1-800-944-4773), or call/text 988.",
      },
    },
  ],
};

const structuredData = [
  faqSchema,
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Exhausted New Mom: A Sleep Troubleshooting Guide",
    description:
      "A structured triage for new-mom exhaustion — find your actual sleep bottleneck (fragmentation, a racing mind, an unequal load, or run-down levels) and the highest-leverage fix for each.",
    author: { "@type": "Organization", name: "Catalyst Mom" },
    publisher: {
      "@type": "Organization",
      name: "Catalyst Mom",
      url: "https://catalystmomofficial.com",
    },
    mainEntityOfPage:
      "https://catalystmomofficial.com/exhausted-mom-sleep-troubleshooting",
  },
];

const branches = [
  {
    tag: "The baby keeps waking me",
    when: "You'd sleep fine — the wakings just won't stop.",
    fix: "The highest-leverage move isn't more tips, it's one protected 3-4 hour block. Have your partner or a support person cover one overnight feed or stretch so you get one consolidated chunk. One unbroken block beats the same hours in fragments.",
    link: { label: "Scripts to split the night with your partner", href: "/stop-breastfeeding-without-guilt" },
  },
  {
    tag: "I can sleep but can't fall back asleep",
    when: "Your mind starts racing the second your head hits the pillow.",
    fix: "This is a wind-down and mental-load problem, not a willpower one. Keep a notepad by the bed and 'offload' every open loop before sleep so your brain stops rehearsing it. Dim screens an hour before. If anxiety is the thing keeping you awake most nights, that's worth naming to someone — it's common and treatable.",
    link: null,
  },
  {
    tag: "I get hours but still feel wrecked",
    when: "The math says you slept — your body says otherwise.",
    fix: "Look at quality and your levels. Cut caffeine after early afternoon, protect the consolidated block over scattered naps, hydrate. And if you're genuinely resting and still depleted, ask your provider to check iron and thyroid — postpartum dips in both are common and easily missed.",
    link: { label: "The postpartum changes to ask your provider about", href: "/postpartum-body-changes-what-nobody-tells-you" },
  },
  {
    tag: "There's no time to sleep — it's all on me",
    when: "The problem isn't the baby, it's that every task defaults to you.",
    fix: "You can't out-tip an unequal load. Write the invisible list down, hand off whole categories (not one-off favors), and name who owns nights. Rest isn't the reward for finishing the list — it's the thing that keeps you standing to do any of it.",
    link: null,
  },
];

const ExhaustedMomSleepGuide = () => {
  return (
    <PageLayout>
      <SEO
        title="Exhausted New Mom? Sleep Troubleshooting Guide"
        description="A structured triage for new-mom exhaustion — find your real sleep bottleneck (fragmentation, a racing mind, an unequal load, or run-down levels) and the fix for each."
        canonical="https://catalystmomofficial.com/exhausted-mom-sleep-troubleshooting"
        type="article"
        structuredData={structuredData}
      />

      <article className="container mx-auto max-w-4xl px-4 py-10 md:py-16">
        <Breadcrumb
          items={[
            { label: "Free Guides", href: "/guides" },
            {
              label: "Exhausted Mom Sleep Troubleshooting",
              href: "/exhausted-mom-sleep-troubleshooting",
            },
          ]}
        />

        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-catalyst-brown">
            Exhausted New Mom? Start Here.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            "Sleep when the baby sleeps" is useless advice when you don't know
            what's actually keeping you exhausted. This is the troubleshooting
            tree nobody hands you — find your bottleneck, then fix that.
          </p>
        </header>

        <section className="mb-10">
          <p className="mb-4 leading-relaxed">
            Every exhaustion thread fills up fast, and almost every reply offers
            the same generic tips. But four moms can be equally wrecked for four
            completely different reasons, and the fix for one does nothing for
            another. So don't start with tips. Start by finding which of these is
            most true for you.
          </p>
          <div className="rounded-lg border border-border bg-catalyst-copper/5 p-4 text-sm text-muted-foreground">
            This is about <em>your</em> rest, not infant sleep-training. For your
            baby's sleep and safe-sleep questions, follow your pediatrician's
            guidance. If exhaustion comes with low mood or anxiety you can't
            switch off, please reach out — PSI: 1-800-944-4773, or call/text 988.
          </div>
        </section>

        <section className="mb-12">
          <p className="mb-6 font-semibold text-catalyst-brown text-lg">
            Which one is most true for you right now?
          </p>
          <div className="space-y-5">
            {branches.map((b, i) => (
              <div key={b.tag} className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 rounded-full bg-catalyst-copper/15 text-catalyst-brown font-bold w-8 h-8 flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-catalyst-brown">"{b.tag}"</p>
                    <p className="text-sm text-muted-foreground italic mt-0.5">{b.when}</p>
                    <p className="mt-3 leading-relaxed">{b.fix}</p>
                    {b.link && (
                      <Link
                        to={b.link.href}
                        className="mt-3 inline-block text-catalyst-copper font-medium underline underline-offset-4"
                      >
                        {b.link.label} →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <div className="rounded-lg border border-catalyst-copper/30 bg-catalyst-copper/5 p-6">
            <h2 className="text-2xl font-semibold text-catalyst-brown mb-3">
              Want the full reset, not just the triage?
            </h2>
            <p className="mb-4 leading-relaxed">
              Once you know your bottleneck, the <strong>Sleep Reset for Moms</strong>{" "}
              guide inside Catalyst Mom walks you through reclaiming your rest
              step by step — built for a mom's broken nights, not a sleep coach's
              ideal ones. It's part of your membership alongside the recovery
              programs and the community.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-catalyst-copper hover:bg-catalyst-copper/90">
                <Link to="/register">Get the Sleep Reset & more</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/postpartum-body-changes-what-nobody-tells-you">
                  What nobody tells you about postpartum
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </article>
    </PageLayout>
  );
};

export default ExhaustedMomSleepGuide;
