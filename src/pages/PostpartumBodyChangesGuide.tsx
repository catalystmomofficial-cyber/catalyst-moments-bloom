import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import SEO from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/blog/Breadcrumb";

// SEO landing / resource page: "What Nobody Tells You About Your Postpartum
// Body." Targets the single largest pain point surfaced across r/BabyBumps,
// r/beyondthebump, r/NewParents and r/Mommit — "nobody warned me this was
// normal." Safety-first (names what's common, flags when to call a provider,
// includes crisis resources) and funnels the recoverable changes into Core
// Restore. Health guidance uses tendency language ("often/commonly") and never
// diagnoses the reader.

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why did nobody tell me about these postpartum body changes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most pregnancy and baby apps cover the pregnancy itself and the baby's milestones in depth, but treat the mother's long-term recovery as an afterthought. On forums like r/beyondthebump and r/NewParents, the most common thread is 'nobody prepared me for this.' Changes like pelvic floor weakness, a persistent lower-belly gap, hair shedding, foot-size changes, night sweats and brain fog are extremely common and usually normal — they simply aren't talked about openly.",
      },
    },
    {
      "@type": "Question",
      name: "Which postpartum body changes can actually be rebuilt?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The core-related changes are the most trainable: pelvic floor weakness and leaking, diastasis recti (the 'mom pooch'), and much of the back and hip pain that comes from a deconditioned core. With a safe, progressive rehab plan these commonly improve. Catalyst Mom's Core Restore program is a short, physio-informed daily protocol built specifically for this.",
      },
    },
    {
      "@type": "Question",
      name: "When should I call my doctor about a postpartum symptom?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Seek care promptly for heavy bleeding (soaking a pad an hour), a fever, severe headache, chest pain or trouble breathing, calf pain or swelling, or a c-section or tear incision that looks infected. For your mood, reach out right away if you feel hopeless, disconnected from your baby, or have frightening thoughts — in the US you can call or text 988 any time, or Postpartum Support International at 1-800-944-4773. This guide is educational and is not a substitute for your provider.",
      },
    },
  ],
};

const structuredData = [
  faqSchema,
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "What Nobody Tells You About Your Postpartum Body (And What Actually Helps)",
    description:
      "A judgment-free guide to the postpartum body changes moms say no one warned them about — what's normal, what helps, when to call your provider, and which changes you can rebuild.",
    author: { "@type": "Organization", name: "Catalyst Mom" },
    publisher: {
      "@type": "Organization",
      name: "Catalyst Mom",
      url: "https://catalystmomofficial.com",
    },
    mainEntityOfPage:
      "https://catalystmomofficial.com/postpartum-body-changes-what-nobody-tells-you",
  },
];

// The recoverable, core-related changes — these route into Core Restore.
const rebuildable = [
  {
    change: "Leaking when you sneeze, laugh, or jump",
    real: "A pelvic floor that's been stretched and is still switching back on. It's common — and it responds well to targeted, progressive retraining. It is not something you're stuck with.",
  },
  {
    change: "The lower belly that still looks pregnant (the \"mom pooch\")",
    real: "Often diastasis recti — a natural separation of the abdominal wall. Crunches and planks tend to make it worse; deep-core rehab in the right order helps knit it back.",
  },
  {
    change: "Low back, hip, and pelvic pain that wasn't there before",
    real: "A deep core that isn't yet reconnected leaves the back and hips to compensate. Rebuild the core in sequence and the compensation — and often the pain — tends to ease.",
  },
  {
    change: "Feeling weak, unstable, or \"disconnected\" from your middle",
    real: "The deep core muscles go quiet during pregnancy and need to be re-recruited deliberately. This is trainable at any stage postpartum, including years later.",
  },
];

// Common, usually-normal changes that mostly resolve or are managed at home.
const hormonalAndCommon = [
  {
    change: "Hair falling out in handfuls (around month 3–4)",
    real: "Telogen effluvium — the hair you kept during pregnancy shedding at once. It's normal and usually settles and regrows within 6–12 months. Gentle styling and good protein and iron intake support it. Mention it to your provider if it's severe or lasts beyond a year.",
  },
  {
    change: "Your feet got bigger — and stayed bigger",
    real: "Relaxin loosened the ligaments in your feet, and for some women the change is permanent. It's not in your head. A half-size up and supportive shoes help more than trying to squeeze back in.",
  },
  {
    change: "Drenching night sweats",
    real: "Your body offloading pregnancy fluid and hormones. Common in the early weeks and usually fades. Light layers and hydration help. Flag a fever or sweats with chills to your provider.",
  },
  {
    change: "Hemorrhoids and changed bathroom habits",
    real: "Very common after pregnancy and pushing. Fiber, fluids, not straining, and over-the-counter care usually resolve them. See your provider for heavy bleeding or pain that won't settle.",
  },
  {
    change: "Brain fog and \"where did that word go?\" moments",
    real: "\"Mom brain\" is real and tied heavily to sleep loss and the mental load — not a sign something's wrong with you. It commonly improves as sleep does. If it comes with heavy fatigue, mood changes, or weight changes, ask your provider to check your thyroid (see below).",
  },
  {
    change: "Painful sex once you're cleared",
    real: "Common — often from hormonal dryness (especially while breastfeeding) and pelvic floor tension. Lubricant, patience, and pelvic floor work help. Bring persistent pain to your provider or a pelvic floor PT.",
  },
];

// Things worth actively raising with a provider (never diagnosed here).
const askYourProvider = [
  {
    signal: "Postpartum thyroid changes",
    detail:
      "Postpartum thyroiditis is more common than most moms realize. Lingering exhaustion, mood swings, hair loss, or unexplained weight changes can overlap with it. It's a simple blood test — ask your provider to check rather than assuming it's 'just new-mom tiredness.'",
  },
  {
    signal: "New allergies or histamine sensitivity",
    detail:
      "Some women develop new allergic or histamine reactions after birth as hormones shift. If you're noticing new skin, sinus, or food reactions, an allergist or your provider can help you sort it out.",
  },
];

const PostpartumBodyChangesGuide = () => {
  return (
    <PageLayout>
      <SEO
        title="Postpartum Body Changes Nobody Warns You About"
        description="The postpartum changes no one warns you about — pelvic floor, the mom pooch, hair loss, brain fog, mood. What's normal, what helps, and what you can rebuild."
        canonical="https://catalystmomofficial.com/postpartum-body-changes-what-nobody-tells-you"
        type="article"
        structuredData={structuredData}
      />

      <article className="container mx-auto max-w-4xl px-4 py-10 md:py-16">
        <Breadcrumb
          items={[
            { label: "Blog", href: "/blog" },
            {
              label: "What Nobody Tells You About Your Postpartum Body",
              href: "/postpartum-body-changes-what-nobody-tells-you",
            },
          ]}
        />

        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-catalyst-brown">
            What Nobody Tells You About Your Postpartum Body
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            The changes moms say no one warned them about — what's actually
            normal, what helps, when to call your provider, and the parts you
            can rebuild. No sugar-coating, no shame.
          </p>
        </header>

        <section className="mb-12">
          <p className="mb-4 leading-relaxed">
            Scroll through r/beyondthebump, r/NewParents, or r/Mommit and you'll
            find the same sentence thousands of times over:{" "}
            <em>"Why did nobody tell me this would happen?"</em>
          </p>
          <p className="mb-4 leading-relaxed">
            We notice, because Catalyst Mom didn't start as an app — it started
            as a handful of digital guides, which meant we were in the messages
            with moms one at a time, for a long time. Across the 2,000+ moms
            we've supported since, the thing we hear most often isn't a question
            about the baby. It's a quieter version of the same worry:{" "}
            <em>
              "I don't recognize my own body — and I can't get anyone to tell me
              whether that's normal."
            </em>{" "}
            So here's the honest answer we wish someone had given us.
          </p>
          <p className="mb-4 leading-relaxed">
            The pregnancy apps track your bump. The baby apps track your baby.
            But the changes that happen to <strong>you</strong> — the leaking,
            the belly that still looks pregnant, the hair in the drain, the feet
            that don't fit your shoes, the fog — get treated like a secret you're
            supposed to figure out alone. You're not imagining them, and you're
            not the only one. Here's the honest version, and what you can
            actually do about each part.
          </p>
          <div className="rounded-lg border border-border bg-catalyst-copper/5 p-4 text-sm text-muted-foreground">
            This guide is educational and judgment-free — not medical advice or
            a diagnosis. Every body recovers differently. Anything that worries
            you is worth a call to your own provider.
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-catalyst-brown mb-4">
            The part you can rebuild (this is the good news)
          </h2>
          <p className="mb-6 leading-relaxed">
            Some changes feel the most permanent but are actually the most
            <strong> trainable</strong>. The core-related ones — leaking, the
            lower-belly gap, the back and hip pain — commonly improve with the
            right work done in the right order. Not crunches. Not "wait and see."
            A short, progressive rehab plan.
          </p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm md:text-base">
              <thead className="bg-catalyst-copper/10">
                <tr>
                  <th className="p-4 font-semibold text-catalyst-brown w-1/2">
                    What nobody warned you about
                  </th>
                  <th className="p-4 font-semibold text-catalyst-brown w-1/2">
                    What's really going on — and the way back
                  </th>
                </tr>
              </thead>
              <tbody>
                {rebuildable.map((row) => (
                  <tr key={row.change} className="border-t border-border align-top">
                    <td className="p-4 text-muted-foreground">{row.change}</td>
                    <td className="p-4">{row.real}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 rounded-lg border border-catalyst-copper/30 bg-catalyst-copper/5 p-5">
            <p className="font-semibold text-catalyst-brown mb-1">
              This is exactly what Core Restore is for.
            </p>
            <p className="text-muted-foreground">
              Our Core Restore program is a short daily protocol (12–15 minutes)
              that rebuilds your deep core and pelvic floor in the safe order —
              no crunches, no planks, no guessing. It's the difference between
              hoping these fade and actually training them back.
            </p>
            <blockquote className="mt-4 border-l-4 border-catalyst-copper/50 pl-4 italic text-muted-foreground">
              "I couldn't sneeze without leaking and my belly still looked five
              months pregnant. Three weeks into the program my core finally feels
              like mine again."
              <span className="mt-1 block not-italic text-sm font-medium text-catalyst-brown">
                — Postpartum mama, Catalyst Mom community
              </span>
            </blockquote>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-catalyst-copper hover:bg-catalyst-copper/90">
                <Link to="/register">Start rebuilding with Core Restore</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/diastasis-recti-recovery-program-reviews-reddit">
                  More on healing the "mom pooch"
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-catalyst-brown mb-4">
            The hormonal stuff that's normal (even when it's alarming)
          </h2>
          <p className="mb-6 leading-relaxed">
            Most of these surprise nobody who's lived through them — and almost
            nobody who hasn't. They're common, usually self-limiting, and rarely
            talked about out loud. Knowing they're normal takes half the fear
            out of them.
          </p>
          <div className="space-y-4">
            {hormonalAndCommon.map((row) => (
              <div key={row.change} className="rounded-lg border border-border bg-card p-4">
                <p className="font-semibold text-catalyst-brown">{row.change}</p>
                <p className="text-muted-foreground mt-1">{row.real}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-catalyst-brown mb-4">
            Worth asking your provider about — don't just tough these out
          </h2>
          <p className="mb-6 leading-relaxed">
            These get brushed off as "just new-mom tiredness" far too often. They
            usually have a simple test or a real answer. You're allowed to ask.
          </p>
          <div className="space-y-4">
            {askYourProvider.map((row) => (
              <div key={row.signal} className="rounded-lg border border-border bg-card p-4">
                <p className="font-semibold text-catalyst-brown">{row.signal}</p>
                <p className="text-muted-foreground mt-1">{row.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="rounded-lg border-2 border-catalyst-copper/40 bg-catalyst-copper/5 p-6">
            <h2 className="text-2xl font-semibold text-catalyst-brown mb-3">
              The one you must never tough out alone: your mind
            </h2>
            <p className="mb-3 leading-relaxed">
              A few weeks of "baby blues" — teary, overwhelmed, up and down — is
              common and usually lifts. But if heaviness, hopelessness, anxiety
              you can't switch off, feeling disconnected from your baby, or
              frightening or intrusive thoughts show up, that is{" "}
              <strong>not weakness and not your fault</strong> — it's postpartum
              depression or anxiety, it's common, and it's very treatable. The
              single bravest thing is to say it out loud to someone.
            </p>
            <p className="leading-relaxed">
              If you're struggling right now, you don't have to wait: in the US
              you can call or text <strong>988</strong> any time (free,
              confidential, 24/7), or reach Postpartum Support International at{" "}
              <strong>1-800-944-4773</strong>. If you or your baby are in
              immediate danger, call 911.
            </p>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-catalyst-brown mb-4">
            You don't have to figure your body out alone
          </h2>
          <p className="mb-6 leading-relaxed">
            You can't control the hair or the shoe size. But the parts that make
            you feel weak, leaky, and disconnected from your own middle? Those
            you can rebuild — with a plan made for a postpartum body, not a
            generic gym routine. Take the free 2-minute assessment and we'll show
            you exactly where you stand and the way back.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="bg-catalyst-copper hover:bg-catalyst-copper/90">
              <Link to="/register">Create your account & start Core Restore</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/about">Why Catalyst Mom is built differently</Link>
            </Button>
          </div>
        </section>
      </article>
    </PageLayout>
  );
};

export default PostpartumBodyChangesGuide;
