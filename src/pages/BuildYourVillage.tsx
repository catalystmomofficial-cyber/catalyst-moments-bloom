import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import SEO from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/blog/Breadcrumb";

// SEO resource page: "How to Build Your Village as a New Mom." Targets the
// loneliness / failed-friend-making theme across the Peanut-app threads and the
// 160-comment r/SAHP thread on lost community support. The insight from the
// research: matching gets you to a first chat but rarely to a real friendship —
// the moms who succeed force fast, low-stakes meetups. So this is a structured
// "first three meetups" + reciprocal-support playbook, not another matcher.

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why is it so hard to make mom friends?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Because matching and chatting is the easy part — the conversations fizzle before they ever become a real friendship. The moms who succeed don't wait for chemistry over text; they move a match to a low-stakes, in-person meetup fast (a coffee, a splash pad, a stroller walk), where friendship actually forms. The bottleneck isn't finding people, it's the first three meetups.",
      },
    },
    {
      "@type": "Question",
      name: "How do I build a support village without family nearby?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Build it reciprocally and specifically. Trade concrete help with other parents and neighbors — a two-hour swap so each of you gets a break, a shared school pickup, a meal exchange. Reciprocity makes people comfortable both giving and asking, which is what turns acquaintances into a real support network.",
      },
    },
  ],
};

const structuredData = [
  faqSchema,
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Build Your Village as a New Mom",
    description:
      "A structured playbook for turning matches and acquaintances into a real support village — the first-three-meetups method plus reciprocal-help swaps.",
    author: { "@type": "Organization", name: "Catalyst Mom" },
    publisher: {
      "@type": "Organization",
      name: "Catalyst Mom",
      url: "https://catalystmomofficial.com",
    },
    mainEntityOfPage: "https://catalystmomofficial.com/build-your-village",
  },
];

const meetups = [
  {
    title: "Meetup 1 — Low stakes, short, in person",
    detail:
      "Skip the long text back-and-forth. Within a few messages: \"Want to grab a coffee or do a stroller walk this week? No pressure, happy to keep it short.\" A 30-minute in-person is worth ten days of texting.",
  },
  {
    title: "Meetup 2 — Make it a standing thing",
    detail:
      "At the end of the first, plant the next: \"This was lovely — same time next week?\" A repeating, low-effort slot (splash pad Tuesdays) beats trying to schedule fresh each time.",
  },
  {
    title: "Meetup 3 — Trade a small favor",
    detail:
      "Introduce reciprocity: watch each other's babies for 20 minutes so one of you runs in a shop, or swap a spare meal. The first exchange is what shifts 'acquaintance' to 'village.'",
  },
];

const openers = [
  "\"I'm trying to get out more with the baby — want to be my low-pressure coffee this week?\"",
  "\"No agenda, just adult conversation and caffeine. You in?\"",
  "\"Splash pad Thursday? Kids do their thing, we get to actually talk.\"",
  "\"Want to trade a couple hours sometime? You get a break, then I do — no money, just swap.\"",
];

const BuildYourVillage = () => {
  return (
    <PageLayout>
      <SEO
        title="How to Build Your Village as a New Mom"
        description="A structured playbook for turning matches and acquaintances into a real support village — the first-three-meetups method plus reciprocal-help swaps."
        canonical="https://catalystmomofficial.com/build-your-village"
        type="article"
        structuredData={structuredData}
      />

      <article className="container mx-auto max-w-4xl px-4 py-10 md:py-16">
        <Breadcrumb
          items={[
            { label: "Free Guides", href: "/guides" },
            { label: "Build Your Village", href: "/build-your-village" },
          ]}
        />

        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-catalyst-brown">
            How to Actually Build Your Village
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            Matching apps get you to a first chat. They almost never get you to a
            friend. Here's the part nobody spells out — how to close the gap
            between "we matched" and "she's my person."
          </p>
        </header>

        <section className="mb-12">
          <p className="mb-4 leading-relaxed">
            On the friend-finding threads, the complaint is rarely "I can't find
            anyone." It's that the conversations <em>fizzle</em> — polite texts
            that never become a coffee, let alone a village. And in a
            160-comment r/SAHP thread, moms named the deeper problem: the free,
            reliable community support past generations had is genuinely harder
            to come by now.
          </p>
          <p className="mb-4 leading-relaxed">
            The moms who crack it all do the same thing — they move fast to a
            small, in-person, low-stakes meetup, and they build reciprocity. Here
            is that method as a plan.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-catalyst-brown mb-4">
            The first three meetups
          </h2>
          <ol className="space-y-4">
            {meetups.map((m, i) => (
              <li key={m.title} className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 rounded-full bg-catalyst-copper/15 text-catalyst-brown font-bold w-8 h-8 flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-catalyst-brown">{m.title}</p>
                    <p className="text-muted-foreground mt-1">{m.detail}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-catalyst-brown mb-4">
            Copy-paste openers (the hardest part is the first line)
          </h2>
          <div className="space-y-3">
            {openers.map((o) => (
              <div key={o} className="rounded-lg border border-border bg-card p-4 text-muted-foreground italic">
                {o}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <div className="rounded-lg border border-catalyst-copper/30 bg-catalyst-copper/5 p-6">
            <h2 className="text-2xl font-semibold text-catalyst-brown mb-3">
              Start with a room full of moms who get it
            </h2>
            <p className="mb-4 leading-relaxed">
              The first meetup is easier when you're not starting from strangers.
              The Catalyst Mom <strong>community</strong> is moms in the same
              stages as you — a warmer place to find the person you'll eventually
              text "splash pad Thursday?" It's built into your membership,
              alongside the programs and the guides.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-catalyst-copper hover:bg-catalyst-copper/90">
                <Link to="/register">Join the Catalyst Mom community</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/stop-breastfeeding-without-guilt">
                  Scripts for the other hard conversations
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </article>
    </PageLayout>
  );
};

export default BuildYourVillage;
