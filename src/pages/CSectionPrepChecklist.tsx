import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import SEO from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/blog/Breadcrumb";

// SEO resource page: "C-Section & Plan B Prep Checklist." Targets the concrete,
// unaddressed pain point across r/BabyBumps and r/beyondthebump, moms who
// refused to prepare for a possible c-section, then had one with no supplies,
// no home setup and no support plan. Checklist-shaped, calm (preparing is
// insurance, not pessimism), safety-first (surgery guidance defers to the
// provider, never prescribes), and funnels into the prenatal program and, after
// clearance, C-section-safe Core Restore.

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does preparing for a c-section make it more likely to happen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. About 1 in 3 births in the US ends in a c-section, and many are unplanned. Preparing for the possibility doesn't 'jinx' your birth, it just means that if plan A changes, you're not scrambling for supplies, a home setup, or a support plan while recovering from major surgery. It's insurance, not pessimism.",
      },
    },
    {
      "@type": "Question",
      name: "What should I pack in my hospital bag for a possible c-section?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Beyond the standard bag: high-waisted underwear that sits well above the incision line, loose dark bottoms and dresses, a long phone-charging cable (you'll be in bed longer), lip balm, and slip-on shoes so you don't have to bend. Small comforts matter more when you can't move freely for a few days.",
      },
    },
    {
      "@type": "Question",
      name: "When can I start core exercises after a c-section?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Only after your provider clears you, typically around your postpartum check, and sometimes later for a c-section. Then the safest path is gentle, progressive deep-core and pelvic-floor rehab, not crunches. Catalyst Mom's Core Restore program has a C-section-aware track built for exactly this window.",
      },
    },
  ],
};

const structuredData = [
  faqSchema,
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "C-Section & Plan B Prep Checklist for an Unplanned Birth",
    description:
      "A calm, practical checklist to prepare for a possible c-section, hospital bag, home setup, recovery-safe first weeks, and a support plan, so a change of plan doesn't catch you off guard.",
    author: { "@type": "Organization", name: "Catalyst Mom" },
    publisher: {
      "@type": "Organization",
      name: "Catalyst Mom",
      url: "https://catalystmomofficial.com",
    },
    mainEntityOfPage:
      "https://catalystmomofficial.com/c-section-prep-checklist",
  },
];

const hospitalBag = [
  "High-waisted underwear that sits well above the incision line (grab a few sizes up)",
  "Loose, dark bottoms and dresses, nothing with a waistband that presses on the incision",
  "A long phone-charging cable, you'll be in bed and unable to reach far for a while",
  "Slip-on shoes so you never have to bend to your feet",
  "A nursing pillow to protect your belly when baby is on your lap",
  "Lip balm and hair ties, small comforts you can't reach for once you're lying flat",
];

const homeSetup = [
  "A recovery station within arm's reach of where you'll rest: water, snacks, meds, phone, remote, burp cloths",
  "Everyday things moved to counter height so you're not bending or reaching low for the first weeks",
  "A firm pillow to 'splint' (gently press to) your belly when you cough, laugh, or sneeze",
  "Easy one-handed meals stocked or batch-cooked, you'll have one arm holding a baby",
  "A clear path from bed to bathroom to baby with nothing to step over or twist toward",
  "Ask your provider ahead of time what they recommend for comfort and regularity, and have it on hand",
];

const firstWeeks = [
  "Log-roll out of bed, roll to your side, then push up with your arms instead of sitting straight up",
  "Take the stairs slowly and rarely at first; set up so you can stay on one level",
  "Lift nothing heavier than your baby until your provider says otherwise",
  "Watch the incision for redness, swelling, warmth, discharge, or a fever, and call your provider if you see them",
  "Rest is part of the healing, not a reward for finishing it, protect it like an appointment",
];

const supportPlan = [
  "Decide before the birth who covers night wakings, meals, other kids, and the door/visitors",
  "Name one person as the 'gatekeeper' for texts and visitors so you don't have to manage anyone",
  "Write the invisible list down (bottles, laundry, groceries, appointments) so it isn't all silently on you",
  "Line up who drives, you won't be cleared to drive for a couple of weeks",
];

const CSectionPrepChecklist = () => {
  return (
    <PageLayout>
      <SEO
        title="C-Section Prep Checklist: Ready for Plan B Birth"
        description="A calm, practical c-section prep checklist for a Plan B birth you didn't plan on, hospital bag, home setup, recovery-safe movement, and a support plan."
        canonical="https://catalystmomofficial.com/c-section-prep-checklist"
        type="article"
        structuredData={structuredData}
      />

      <article className="container mx-auto max-w-4xl px-4 py-10 md:py-16">
        <Breadcrumb
          items={[
            { label: "Free Guides", href: "/guides" },
            {
              label: "C-Section & Plan B Prep Checklist",
              href: "/c-section-prep-checklist",
            },
          ]}
        />

        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-catalyst-brown">
            The C-Section & "Plan B" Prep Checklist
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            For the birth you didn't plan on. Preparing for a possible c-section
            isn't pessimism, it's the difference between recovering in comfort
            and scrambling for underwear that doesn't hurt while healing from
            surgery.
          </p>
        </header>

        <section className="mb-12">
          <p className="mb-4 leading-relaxed">
            About <strong>1 in 3 births in the US</strong> ends in a c-section,
            and a lot of them weren't the plan. The regret we hear most comes
            from moms who refused to picture one, got one anyway, and came home
            with no supplies, no home setup, and no support plan, recovering from{" "}
            <em>major abdominal surgery</em> while learning to feed a newborn.
          </p>
          <p className="mb-4 leading-relaxed">
            You can hope hard for the birth you want <em>and</em> spend twenty
            minutes preparing for the version you didn't. Doing that doesn't make
            it more likely. It just means that if the plan changes, the hard part
            is only the recovery, not the recovery <em>plus</em> a house that
            isn't ready. Here's the whole checklist.
          </p>
          <div className="rounded-lg border border-border bg-catalyst-copper/5 p-4 text-sm text-muted-foreground">
            This is a practical prep guide, not medical advice. A c-section is
            surgery, your provider's instructions always come first, especially
            on movement, lifting, and anything to do with your incision.
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-catalyst-brown mb-4">
            1. The hospital bag (the c-section extras nobody lists)
          </h2>
          <ul className="space-y-3">
            {hospitalBag.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1 text-catalyst-copper">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-catalyst-brown mb-4">
            2. Set up your home before the birth
          </h2>
          <p className="mb-4 leading-relaxed">
            You won't be able to bend, twist, or lift much for a couple of weeks.
            The moms who recover most comfortably set the house up{" "}
            <em>before</em> they need it.
          </p>
          <ul className="space-y-3">
            {homeSetup.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1 text-catalyst-copper">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-catalyst-brown mb-4">
            3. Protect yourself in the first weeks
          </h2>
          <ul className="space-y-3">
            {firstWeeks.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1 text-catalyst-copper">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-lg border border-border bg-catalyst-copper/5 p-4 text-sm text-muted-foreground">
            Call your provider promptly for a fever, heavy bleeding, or an
            incision that's increasingly red, warm, swollen, or leaking, these
            can be signs of infection and are worth a same-day call.
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-catalyst-brown mb-4">
            4. Build the support plan (before you need it)
          </h2>
          <p className="mb-4 leading-relaxed">
            The load doesn't disappear because you had surgery, it just lands on
            someone. Decide who, on paper, while you still can.
          </p>
          <ul className="space-y-3">
            {supportPlan.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1 text-catalyst-copper">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-6">
          <div className="rounded-lg border border-catalyst-copper/30 bg-catalyst-copper/5 p-6">
            <h2 className="text-2xl font-semibold text-catalyst-brown mb-3">
              Then comes the rebuild, safely, when you're cleared
            </h2>
            <p className="mb-4 leading-relaxed">
              A c-section cuts through the abdominal wall, so the core comes back
              differently, and it does come back, in the right order. Not
              crunches. Not "wait and see." Once your provider clears you, gentle,
              progressive deep-core and pelvic-floor rehab is the safe path.
              Catalyst Mom's <strong>Core Restore</strong> program has a
              C-section-aware track built for exactly that window, and{" "}
              <strong>Glow &amp; Go</strong> keeps you moving safely through the
              pregnancy before it.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-catalyst-copper hover:bg-catalyst-copper/90">
                <Link to="/register">Start prepping with Catalyst Mom</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/postpartum-body-changes-what-nobody-tells-you">
                  What nobody tells you about postpartum recovery
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </article>
    </PageLayout>
  );
};

export default CSectionPrepChecklist;
