import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import SEO from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/blog/Breadcrumb";

// SEO resource page: "Honest Pregnancy Advice the Apps Won't Give You."
// Targets the validated pain point on r/pregnant (699 upvotes) — pregnancy
// apps pushing shaming, contradictory, toxic-positivity notifications, with
// commenters begging for an honest alternative they'd pay for. Warm-honest
// tone that validates real feelings while never dismissing genuine warning
// signs (those still go to the provider). No fabricated data.

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why do pregnancy apps make me feel worse?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Because many are written in a sanitized, one-size-fits-all voice — warning you about 'saggy breasts,' telling you to walk an hour a day when you can barely move, or pushing 'focus on your miracle' when you feel awful. It's not you failing pregnancy; it's the tone missing the reality. Feeling exhausted, unglamorous, or ambivalent while pregnant is normal and human.",
      },
    },
    {
      "@type": "Question",
      name: "Is it normal to not feel that 'pregnancy glow'?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Completely. Plenty of people spend big stretches of pregnancy nauseated, exhausted, achy, and not remotely glowing — and love their baby all the same. You're allowed to be grateful and miserable in the same breath. One doesn't cancel the other.",
      },
    },
    {
      "@type": "Question",
      name: "When should I stop 'toughing it out' and call my provider?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Honesty about feelings never means ignoring your body. Call your provider for things like heavy bleeding, severe or sudden headache, vision changes, severe belly pain, a big drop in your baby's movements, or thoughts of harming yourself. Being real about how hard pregnancy is and taking warning signs seriously are not opposites — do both.",
      },
    },
  ],
};

const structuredData = [
  faqSchema,
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Honest Pregnancy Advice the Apps Won't Give You",
    description:
      "The validating, no-toxic-positivity version of pregnancy advice — countering the shaming, contradictory notifications, while still taking real warning signs seriously.",
    author: { "@type": "Organization", name: "Catalyst Mom" },
    publisher: {
      "@type": "Organization",
      name: "Catalyst Mom",
      url: "https://catalystmomofficial.com",
    },
    mainEntityOfPage: "https://catalystmomofficial.com/honest-pregnancy-truths",
  },
];

const truths = [
  {
    app: "\"Focus on your miracle!\"",
    honest:
      "You can be grateful for the baby and still hate being pregnant some days. Both are true at once, and neither makes you a bad mom.",
  },
  {
    app: "\"Aim for 60 minutes of walking a day.\"",
    honest:
      "Some days getting off the couch is the win. Movement helps when it's realistic for the body you have today — not a quota to feel guilty about missing.",
  },
  {
    app: "\"Watch out for sagging and stretch marks.\"",
    honest:
      "Your body is doing the single most impressive thing a body can do. It's allowed to change. You do not owe anyone the body you had before.",
  },
  {
    app: "\"You should be glowing!\"",
    honest:
      "Lots of people are nauseated and exhausted for months and never glow once. That's normal, not a personal failing.",
  },
  {
    app: "\"Cherish every moment.\"",
    honest:
      "You don't have to cherish heartburn at 3am. You can love your baby and still count down the days. Real beats grateful-on-command.",
  },
];

const HonestPregnancyTruths = () => {
  return (
    <PageLayout>
      <SEO
        title="Honest Pregnancy Advice the Apps Won't Give You"
        description="The validating, no-toxic-positivity version of pregnancy advice — countering the shaming, contradictory app notifications, while still taking real warning signs seriously."
        canonical="https://catalystmomofficial.com/honest-pregnancy-truths"
        type="article"
        structuredData={structuredData}
      />

      <article className="container mx-auto max-w-4xl px-4 py-10 md:py-16">
        <Breadcrumb
          items={[
            { label: "Free Guides", href: "/guides" },
            {
              label: "Honest Pregnancy Truths",
              href: "/honest-pregnancy-truths",
            },
          ]}
        />

        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-catalyst-brown">
            The Honest Pregnancy Advice the Apps Won't Give You
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            No toxic positivity, no body-shaming push notifications, no "cherish
            every moment" while you're throwing up. Just the real version — and
            we'll still tell you when something's worth a call to your provider.
          </p>
        </header>

        <section className="mb-12">
          <p className="mb-4 leading-relaxed">
            A post on r/pregnant listing the absurd things pregnancy apps
            actually send — warnings about "saggy breasts," an hour of daily
            walking while you can barely move, "focus on your miracle" when you
            feel like garbage — hit <strong>hundreds of upvotes</strong>, and the
            comments were full of people begging someone to make an honest
            version instead. So here it is.
          </p>
          <div className="rounded-lg border border-border bg-catalyst-copper/5 p-4 text-sm text-muted-foreground">
            Being honest about how hard pregnancy feels is not the same as
            ignoring your body. This validates your feelings — it does not
            replace your provider. Real warning signs still deserve a call
            (there's a list at the bottom).
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-catalyst-brown mb-4">
            What the app says vs. the honest truth
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm md:text-base">
              <thead className="bg-catalyst-copper/10">
                <tr>
                  <th className="p-4 font-semibold text-catalyst-brown w-1/2">
                    What the app pushes
                  </th>
                  <th className="p-4 font-semibold text-catalyst-brown w-1/2">
                    The honest version
                  </th>
                </tr>
              </thead>
              <tbody>
                {truths.map((row) => (
                  <tr key={row.app} className="border-t border-border align-top">
                    <td className="p-4 text-muted-foreground italic">{row.app}</td>
                    <td className="p-4">{row.honest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-catalyst-brown mb-3">
              Honesty cuts both ways — call your provider for these
            </h2>
            <p className="mb-3 leading-relaxed text-muted-foreground">
              Being real about the hard parts doesn't mean toughing out the
              serious ones. Reach out promptly for:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-3"><span className="mt-1 text-catalyst-copper">•</span> Heavy bleeding, or severe or sudden belly pain</li>
              <li className="flex gap-3"><span className="mt-1 text-catalyst-copper">•</span> A severe headache, vision changes, or sudden swelling</li>
              <li className="flex gap-3"><span className="mt-1 text-catalyst-copper">•</span> A noticeable drop in your baby's movements (later in pregnancy)</li>
              <li className="flex gap-3"><span className="mt-1 text-catalyst-copper">•</span> Any thoughts of harming yourself — you can call or text 988 any time</li>
            </ul>
          </div>
        </section>

        <section className="mb-6">
          <div className="rounded-lg border border-catalyst-copper/30 bg-catalyst-copper/5 p-6">
            <h2 className="text-2xl font-semibold text-catalyst-brown mb-3">
              Movement that meets you where you are
            </h2>
            <p className="mb-4 leading-relaxed">
              You don't need an hour of walking you can't do. Catalyst Mom's{" "}
              <strong>Glow &amp; Go</strong> prenatal program is built for the
              body you have today — short, safe, trimester-aware sessions with
              zero guilt attached. That's the whole difference: met where you
              are, not shamed for where you're not.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-catalyst-copper hover:bg-catalyst-copper/90">
                <Link to="/register">Try Glow &amp; Go — gentle prenatal movement</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/c-section-prep-checklist">
                  Prep calmly for any kind of birth
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </article>
    </PageLayout>
  );
};

export default HonestPregnancyTruths;
