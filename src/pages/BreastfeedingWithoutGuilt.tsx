import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import SEO from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/blog/Breadcrumb";

// SEO resource page: "Stop Breastfeeding Without Guilt — Decision & Scripts."
// Targets a charged, unaddressed pain point across r/beyondthebump and
// r/NewParents: moms who need permission to stop or combo-feed, and word-for-
// word scripts to explain to a partner that low supply isn't a willpower issue.
// The big three maternal apps offer trackers and feeds, not judgment-free
// emotional + communication toolkits. Strictly non-judgmental, no medical
// claims about supply; points to IBCLCs, the pediatrician, and mental-health
// resources.

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is it okay to stop breastfeeding?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. A fed baby and a well mother are the goal, and there is no version of feeding your baby that makes you a failure — breast, combo, or formula. Whether you stop at three days or three months, because of pain, supply, work, mental health, or simply because you want to, that is a valid, loving decision. Guilt is not evidence you did something wrong.",
      },
    },
    {
      "@type": "Question",
      name: "How do I explain to my partner that low milk supply isn't my fault?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Try: 'Milk supply is physiological, not a matter of trying harder. Some bodies make less no matter what, and pushing through pain or exhaustion doesn't change that — it just costs me. What I need from you isn't more pressure, it's support with the decision I'm making for our baby and for me.' Low supply has many causes and is not a willpower issue.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I get real help with feeding?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A lactation consultant (IBCLC) can help with latch, pain, and supply questions. Your baby's pediatrician is the right person for any concern about your baby's weight or feeding. And if guilt or anxiety about feeding feels overwhelming, that matters too — in the US you can reach Postpartum Support International at 1-800-944-4773, or call or text 988 any time.",
      },
    },
  ],
};

const structuredData = [
  faqSchema,
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Stop Breastfeeding Without Guilt: The Decision & The Scripts",
    description:
      "Permission and word-for-word scripts for the breastfeeding decision — telling a partner low supply isn't willpower, setting boundaries with family, and quieting your own guilt.",
    author: { "@type": "Organization", name: "Catalyst Mom" },
    publisher: {
      "@type": "Organization",
      name: "Catalyst Mom",
      url: "https://catalystmomofficial.com",
    },
    mainEntityOfPage:
      "https://catalystmomofficial.com/stop-breastfeeding-without-guilt",
  },
];

const permissionTruths = [
  "A fed baby and a well mother is the whole goal. Breast, combo, or formula — all of it is feeding your baby.",
  "Low supply is physiological. It has many causes and is not a sign you didn't try hard enough.",
  "You are allowed to stop because of pain, supply, work, sleep, mental health — or simply because you want to.",
  "Guilt is a feeling, not a verdict. You can feel it and still be making the right call.",
  "You don't owe anyone an explanation. The scripts below are for when you choose to give one.",
];

const partnerScripts = [
  {
    situation: "Telling your partner low supply isn't willpower",
    script:
      "\"Supply is physiological, not a matter of trying harder. Pushing through pain and exhaustion doesn't make more milk — it just costs me. I need support with this decision, not pressure to keep going.\"",
  },
  {
    situation: "Asking for the night feed so you can sleep",
    script:
      "\"If you take one bottle feed overnight, I get one solid stretch of sleep — and that keeps me okay for all of us. This isn't me opting out. It's us splitting it.\"",
  },
  {
    situation: "When your partner says 'just try a little longer'",
    script:
      "\"I hear that you want the best for the baby — so do I. The best thing for our baby is a mom who isn't running on empty. I've made this decision with care, and I need you on my side of it.\"",
  },
];

const boundaryScripts = [
  {
    situation: "Family pushing you to keep breastfeeding",
    script:
      "\"I know you mean well. This is a decision I've made with my baby's doctor and myself, and it's final. What would really help is your support, not your opinion on it.\"",
  },
  {
    situation: "The unsolicited 'have you tried…'",
    script:
      "\"I've looked into the options with the people who know my situation. I'm good on advice — thank you.\"",
  },
];

const selfTalk = [
  {
    guilt: "\"A good mom would have pushed through.\"",
    reframe:
      "A good mom keeps herself well enough to show up. You didn't quit on your baby — you chose a way to feed them that you can sustain.",
  },
  {
    guilt: "\"Everyone else seems to manage it.\"",
    reframe:
      "You're comparing your insides to everyone else's outsides. Plenty of them are struggling quietly too — and their bodies aren't yours.",
  },
  {
    guilt: "\"I'll regret stopping.\"",
    reframe:
      "In a year, your baby will be thriving and no one will ask how they were fed. What they'll feel is a mother who was present — which is easier when you're not depleted.",
  },
];

const BreastfeedingWithoutGuilt = () => {
  return (
    <PageLayout>
      <SEO
        title="Stop Breastfeeding Without Guilt: Scripts & Support"
        description="Permission and word-for-word scripts for the breastfeeding decision — telling a partner low supply isn't willpower, boundaries with family, and quieting your own guilt."
        canonical="https://catalystmomofficial.com/stop-breastfeeding-without-guilt"
        type="article"
        structuredData={structuredData}
      />

      <article className="container mx-auto max-w-4xl px-4 py-10 md:py-16">
        <Breadcrumb
          items={[
            { label: "Blog", href: "/blog" },
            {
              label: "Breastfeeding Without the Guilt",
              href: "/stop-breastfeeding-without-guilt",
            },
          ]}
        />

        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-catalyst-brown">
            Breastfeeding Without the Guilt — The Decision & The Scripts
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            Permission you shouldn't need but deserve anyway — plus the
            word-for-word scripts for telling your partner, your family, and
            yourself that this is okay.
          </p>
        </header>

        <section className="mb-12">
          <p className="mb-4 leading-relaxed">
            On r/beyondthebump and r/NewParents, one of the most-answered cries
            for help isn't about latch or pumping schedules. It's some version
            of: <em>"I need someone to tell me it's okay to stop"</em> — or{" "}
            <em>"how do I make my partner understand low supply isn't me not
            trying?"</em>
          </p>
          <p className="mb-4 leading-relaxed">
            The trackers and feeds can count ounces. They can't hand you the
            words. So here they are — the permission first, then the scripts.
          </p>
          <div className="rounded-lg border border-border bg-catalyst-copper/5 p-4 text-sm text-muted-foreground">
            This is emotional and communication support, not medical or feeding
            advice. For latch, pain, or supply, a lactation consultant (IBCLC)
            can help; for anything about your baby's weight or feeding, your
            pediatrician is the right call.
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-catalyst-brown mb-4">
            First, the permission
          </h2>
          <ul className="space-y-3">
            {permissionTruths.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1 text-catalyst-copper">♥</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-catalyst-brown mb-4">
            Scripts for your partner
          </h2>
          <div className="space-y-4">
            {partnerScripts.map((row) => (
              <div key={row.situation} className="rounded-lg border border-border bg-card p-4">
                <p className="font-semibold text-catalyst-brown mb-1">{row.situation}</p>
                <p className="text-muted-foreground">{row.script}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-catalyst-brown mb-4">
            Scripts for family &amp; the unsolicited advice
          </h2>
          <div className="space-y-4">
            {boundaryScripts.map((row) => (
              <div key={row.situation} className="rounded-lg border border-border bg-card p-4">
                <p className="font-semibold text-catalyst-brown mb-1">{row.situation}</p>
                <p className="text-muted-foreground">{row.script}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-catalyst-brown mb-4">
            Scripts for the hardest voice — your own
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm md:text-base">
              <thead className="bg-catalyst-copper/10">
                <tr>
                  <th className="p-4 font-semibold text-catalyst-brown w-1/2">
                    The guilt says…
                  </th>
                  <th className="p-4 font-semibold text-catalyst-brown w-1/2">
                    The truth is…
                  </th>
                </tr>
              </thead>
              <tbody>
                {selfTalk.map((row) => (
                  <tr key={row.guilt} className="border-t border-border align-top">
                    <td className="p-4 text-muted-foreground italic">{row.guilt}</td>
                    <td className="p-4">{row.reframe}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-6">
          <div className="rounded-lg border border-catalyst-copper/30 bg-catalyst-copper/5 p-6">
            <h2 className="text-2xl font-semibold text-catalyst-brown mb-3">
              You were never meant to carry this by yourself
            </h2>
            <p className="mb-4 leading-relaxed">
              The feeding decision is rarely the only thing on your plate — it's
              usually tangled up with the invisible load, the sleep, the sense
              that it's all on you. Catalyst Mom is built for the whole of that,
              not just the baby: a community of moms who get it, and tools for
              the mental load nobody else hands you.
            </p>
            <p className="mb-4 leading-relaxed text-sm text-muted-foreground">
              And if the guilt or anxiety feels heavier than you can hold, please
              reach out — Postpartum Support International: 1-800-944-4773, or
              call/text 988 any time.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-catalyst-copper hover:bg-catalyst-copper/90">
                <Link to="/register">Find your people at Catalyst Mom</Link>
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

export default BreastfeedingWithoutGuilt;
