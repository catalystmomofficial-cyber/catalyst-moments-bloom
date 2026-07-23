import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import SEO from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/blog/Breadcrumb";
import { GlowingEffect } from "@/components/ui/glowing-effect";

// SEO resource page: "Baby Tracking Anxiety, How to Log Less, Gently."
// Targets the tracking-app-anxiety pain point validated across r/NewParents,
// r/beyondthebump, r/Mommit, r/pregnant and r/BabyBumps (rigid wake-window /
// feed logging spiraling into anxiety; pediatricians telling parents to stop).
// Nobody offers a gentle "wean off tracking" companion. Safety-first: names
// when tracking IS medically worth keeping, and points to 988/PSI for anxiety.

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is it okay to stop tracking my baby's feeds and sleep?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For most healthy, thriving babies past the newborn weeks, yes, and many pediatricians actively encourage it, because habit-driven logging can fuel anxiety without adding safety. Keep tracking if your provider asked you to for a specific reason (weight gain, jaundice, medication, reflux) or in the early newborn days when output matters. Otherwise, tracking is a tool, not a requirement.",
      },
    },
    {
      "@type": "Question",
      name: "How do I wean off obsessive baby tracking?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gradually, one category at a time, the same advice parents keep landing on themselves. Drop the lowest-stakes log first (like diapers for a thriving baby), sit with the discomfort for a few days, then drop the next. You're not going cold turkey; you're handing trust back to yourself one step at a time.",
      },
    },
    {
      "@type": "Question",
      name: "Why does wake-window tracking make me anxious?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Because it turns a living baby into a number that's supposed to match an average, and real babies don't. When yours doesn't fit the app's window, it can feel like failure, even though the 'window' is just a population average, not a rule your baby agreed to. If tracking is making you dread the clock, that's a sign to loosen it, not to try harder.",
      },
    },
  ],
};

const structuredData = [
  faqSchema,
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Baby Tracking Anxiety: How to Log Less, Gently",
    description:
      "A gentle, non-judgmental way to wean off obsessive baby tracking, when logging is worth keeping, when it's just anxiety, and a step-down plan to trust yourself again.",
    author: { "@type": "Organization", name: "Catalyst Mom" },
    publisher: {
      "@type": "Organization",
      name: "Catalyst Mom",
      url: "https://catalystmomofficial.com",
    },
    mainEntityOfPage: "https://catalystmomofficial.com/baby-tracking-anxiety",
  },
];

const keepTracking = [
  "You're in the early newborn weeks and your provider is watching weight or output",
  "Your pediatrician asked you to track something specific (jaundice, weight gain, a medication, reflux)",
  "A short, time-limited log genuinely reassures you, and you can stop when it's resolved",
];

const canLetGo = [
  "Your baby is thriving and your provider isn't asking you to track",
  "You're logging out of habit or fear, not because anyone's using the data",
  "You feel like a failure when the numbers don't match the app's 'average'",
  "You check the app before you check your own baby",
];

const weanLadder = [
  {
    step: "Start with the lowest-stakes log",
    detail:
      "For a thriving baby, that's usually diapers. Stop logging it. Notice that nothing bad happens. Sit with the itch to log for a few days.",
  },
  {
    step: "Drop exact feed times, keep a loose sense",
    detail:
      "Move from 'fed 14 min at 2:47' to simply noticing 'we're feeding roughly every few hours.' You still know your baby is fed, you've just dropped the stopwatch.",
  },
  {
    step: "Loosen sleep from windows to cues",
    detail:
      "Instead of watching a wake-window timer, watch your baby: rubbing eyes, going quiet, looking away. Their cues are more accurate than any average.",
  },
  {
    step: "Keep only what genuinely serves you",
    detail:
      "Maybe that's nothing. Maybe it's one line in a journal at night. The goal isn't zero, it's that you're the one in charge, not the app.",
  },
];

const BabyTrackingAnxiety = () => {
  return (
    <PageLayout>
      <SEO
        title="Baby Tracking Anxiety: How to Log Less, Gently"
        description="A gentle way to wean off obsessive baby tracking, when logging is worth keeping, when it's just anxiety, and a step-down plan to trust your own instincts again."
        canonical="https://catalystmomofficial.com/baby-tracking-anxiety"
        type="article"
        structuredData={structuredData}
      />

      <article className="container mx-auto max-w-4xl px-4 py-10 md:py-16">
        <Breadcrumb
          items={[
            { label: "Free Guides", href: "/guides" },
            {
              label: "Baby Tracking Anxiety",
              href: "/baby-tracking-anxiety",
            },
          ]}
        />

        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-catalyst-brown">
            You're Allowed to Stop Logging Everything
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            When the feeding app, the sleep app, and the wake-window timer start
            running your day, and your mood, here's how to gently hand the
            trust back to yourself.
          </p>
        </header>

        <section className="mb-12">
          <p className="mb-4 leading-relaxed">
            There's a moment a lot of moms hit around nine months in. You're
            still logging every feed and every diaper, and you can't quite say
            why anymore. The data isn't for the pediatrician. It's become a
            compulsion. Plenty of pediatricians name it out loud and tell parents
            to stop, because the tracking has stopped being about the baby and
            started being about the anxiety.
          </p>
          <p className="mb-4 leading-relaxed">
            Rigid wake-window and feed tracking can quietly turn a living,
            unpredictable baby into a number that's supposed to match an average.
            When yours doesn't, it can feel like <em>you</em> failed, when
            really, the "window" was just a population average your baby never
            agreed to. So here's permission, and a plan.
          </p>
          <div className="rounded-lg border border-border bg-catalyst-copper/5 p-4 text-sm text-muted-foreground">
            This is about anxiety-driven habit tracking, not medical tracking.
            Keep logging anything your provider asked you to, the rest of this
            is for the tracking you're doing out of fear, not need.
          </div>
        </section>

        <section className="mb-12">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="relative h-full rounded-lg">
              <GlowingEffect disabled={false} proximity={80} spread={30} borderWidth={2} inactiveZone={0.4} />
              <div className="relative rounded-lg border border-border bg-card p-5 h-full">
                <h2 className="text-xl font-semibold text-catalyst-brown mb-3">
                  Worth keeping (for now)
                </h2>
                <ul className="space-y-3">
                  {keepTracking.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1 text-catalyst-copper">✓</span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="relative h-full rounded-lg">
              <GlowingEffect disabled={false} proximity={80} spread={30} borderWidth={2} inactiveZone={0.4} />
              <div className="relative rounded-lg border border-border bg-card p-5 h-full">
                <h2 className="text-xl font-semibold text-catalyst-brown mb-3">
                  Safe to let go of
                </h2>
                <ul className="space-y-3">
                  {canLetGo.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1 text-catalyst-copper">○</span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-catalyst-brown mb-4">
            The gentle wean-off ladder
          </h2>
          <p className="mb-6 leading-relaxed">
            You don't have to quit cold turkey. Drop one rung at a time, and let
            each one settle before the next.
          </p>
          <ol className="space-y-4">
            {weanLadder.map((rung, i) => (
              <li key={rung.step} className="relative rounded-lg">
                <GlowingEffect disabled={false} proximity={70} spread={25} borderWidth={2} inactiveZone={0.4} />
                <div className="relative rounded-lg border border-border bg-card p-5">
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 rounded-full bg-catalyst-copper/15 text-catalyst-brown font-bold w-8 h-8 flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-catalyst-brown">{rung.step}</p>
                      <p className="text-muted-foreground mt-1">{rung.detail}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-6">
          <div className="rounded-lg border border-catalyst-copper/30 bg-catalyst-copper/5 p-6">
            <h2 className="text-2xl font-semibold text-catalyst-brown mb-3">
              The goal was never a perfect log, it was a well mom
            </h2>
            <p className="mb-4 leading-relaxed">
              Your baby didn't read the algorithm, and a spreadsheet of feeds
              won't tell you what your own eyes already can. Catalyst Mom is built
              around <em>you</em> being okay, a community that gets it and tools
              for the mental load, not one more thing to measure yourself against.
            </p>
            <p className="mb-4 leading-relaxed text-sm text-muted-foreground">
              And if the anxiety is running the show, racing thoughts, dread,
              can't-put-it-down checking, that's worth support, not willpower.
              PSI: 1-800-944-4773, or call/text 988 any time.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-catalyst-copper hover:bg-catalyst-copper/90">
                <Link to="/register">Find calmer support at Catalyst Mom</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/exhausted-mom-sleep-troubleshooting">
                  Still exhausted? Troubleshoot your sleep
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </article>
    </PageLayout>
  );
};

export default BabyTrackingAnxiety;
