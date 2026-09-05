import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import { useTheme } from '@/components/theme-provider';

const INTRO_STYLE_ID = 'faq-intro-animations';

const faqs = [
  {
    q: "Can you heal diastasis recti with 20-minute home workouts?",
    a: "Yes. Healing diastasis recti doesn’t require hours in the gym; it requires intentional, deep-core activation. Short, targeted 20-minute routines focusing on proper breathing and transverse abdominis engagement can safely close the gap and rebuild stability without equipment.",
    meta: "Recovery",
  },
  {
    q: "How can I prepare my body for a natural birth and prevent tearing?",
    a: "Preparing for a natural, tear-free birth involves functional pelvic floor training, mobility work, and learning to breathe with contractions. Moving purposefully during pregnancy releases hip and pelvic tension, allowing your body to relax naturally during delivery.",
    meta: "Birth Prep",
  },
  {
    q: "How do I heal diastasis recti safely after a C-section?",
    a: "Healing diastasis recti after a C-section requires a progressive approach that focuses on deep core engagement rather than traditional sit-ups or crunches. Our Core Restore protocols are designed to protect your incision while progressively rebuilding your midsection strength — safely and at your own pace.",
    meta: "Recovery",
  },
  {
    q: "Is it normal to leak when sneezing postpartum?",
    a: "While leaking (urinary incontinence) is common, it is not something you just have to live with. It is a sign of pelvic floor dysfunction or coordination issues. Our targeted core and pelvic floor rehabilitation exercises help rebuild automatic reflex control so you can sneeze, jump, and run completely leak-free.",
    meta: "Recovery",
  },
  {
    q: "What are the best exercises to prepare for a VBAC?",
    a: "Preparing for a Vaginal Birth After Cesarean (VBAC) focuses heavily on pelvic mobility, deep core breathing, and optimal fetal positioning. Exercises like deep squats, pelvic tilts, asymmetric lunges, and learning to release the pelvic floor during contractions help open the birth canal and build the stamina needed for a successful labor.",
    meta: "Birth Prep",
  },
  {
    q: "Can I exercise while trying to conceive?",
    a: "Absolutely. Exercise is highly beneficial when trying to conceive (TTC) because it manages stress, improves insulin sensitivity, and optimizes blood flow to the reproductive organs. The key is balance—focusing on moderate strength training, mobility work, and steady cardio rather than extreme, exhaustive workouts.",
    meta: "TTC",
  },
  {
    q: "When should I start tracking my cycle for TTC?",
    a: "You should start tracking your cycle immediately if you are trying to conceive. Tracking your basal body temperature (BBT), cervical mucus changes, and utilizing ovulation predictor kits (OPKs) helps you accurately map your fertile window, understand your luteal phase length, and pinpoint the exact days you are most likely to get pregnant.",
    meta: "TTC",
  },
  {
    q: "What is included in the $29 per month subscription?",
    a: "Your $29/month membership unlocks full access to the Catalyst Mom ecosystem. This includes customized trimester-by-trimester prenatal plans, postpartum deep-core restoration protocols, time-efficient 20-minute home workouts, family-friendly nutrition frameworks, milestone tracking tools, and our supportive community space.",
    meta: "Pricing",
  },
  {
    q: "Do I get access to a real coach?",
    a: "Yes. Catalyst Mom combines digital convenience with real human touch. While the app delivers your tailored daily plan, our certified coaches are accessible within the platform to answer your specific movement questions, review your form, and keep you accountable every step of the way.",
    meta: "Coaching",
  },
  {
    q: "Is there a money-back guarantee?",
    a: "Yes, we stand behind our method with a 30-day fair-try guarantee. Give it a genuine try for 30 days, and if the workouts, community, and protocols honestly aren't the right fit for your motherhood stage, contact our support team within those 30 days and we'll refund your payment. We only ask that you gave it a fair shot first.",
    meta: "Guarantee",
  },
  {
    q: "Does Catalyst Mom work on my phone without an app store?",
    a: "Yes! Catalyst Mom is built as a progressive web platform, meaning you get a seamless, fast app-like experience directly through your phone's browser without needing to download large updates from the app store. You can easily add an icon right to your home screen for one-tap access.",
    meta: "Access",
  },
  {
    q: "What makes Catalyst Mom different from other fitness apps?",
    a: "Most fitness apps treat women's bodies the same, whether they are pregnant, 6 weeks postpartum, or years into motherhood. Catalyst Mom is entirely customized around maternal health. We combine core/pelvic floor rehabilitation, functional strength, and metabolic health into short, intentional 20-minute windows that respect a busy mom's schedule.",
    meta: "About",
  },
  {
    q: "Can I import data from Flo, Clue, or Oura?",
    a: "Yes — if you are in the TTC stage you can import cycle and sleep data from Flo, Clue, or Oura by uploading a screenshot directly inside the app. The app automatically extracts your data from the image. Pregnancy and postpartum integrations are coming soon.",
    meta: "TTC",
  },
  {
    q: "Can I upload my bloodwork results?",
    a: "Yes — inside the TTC dashboard you can log bloodwork manually or upload a PDF of your lab results and the app will extract your values automatically. You can track FSH, LH, Estradiol, Progesterone, AMH, and other key fertility markers over time.",
    meta: "TTC",
  },
  {
    q: "Will this work if I am years postpartum — not just weeks?",
    a: "Yes. Diastasis recti and pelvic floor dysfunction can be addressed at any point postpartum — whether you are three months or three years after birth. The assessment identifies exactly where you are right now and builds your protocol from there.",
    meta: "Recovery",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(({ q, a }) => ({
    "@type": "Question",
    "name": q,
    "acceptedAnswer": { "@type": "Answer", "text": a },
  })),
};

const FAQ = () => {
  const { theme } = useTheme();
  const [introReady, setIntroReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById(INTRO_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = INTRO_STYLE_ID;
    style.innerHTML = `
      @keyframes faq1-fade-up {
        0% { transform: translate3d(0, 20px, 0); opacity: 0; filter: blur(6px); }
        60% { filter: blur(0); }
        100% { transform: translate3d(0, 0, 0); opacity: 1; filter: blur(0); }
      }
      @keyframes faq1-beam-spin {
        0% { transform: rotate(0deg) scale(1); }
        100% { transform: rotate(360deg) scale(1); }
      }
      @keyframes faq1-pulse {
        0% { transform: scale(0.7); opacity: 0.55; }
        60% { opacity: 0.1; }
        100% { transform: scale(1.25); opacity: 0; }
      }
      @keyframes faq1-meter {
        0%, 20% { transform: scaleX(0); transform-origin: left; }
        45%, 60% { transform: scaleX(1); transform-origin: left; }
        80%, 100% { transform: scaleX(0); transform-origin: right; }
      }
      @keyframes faq1-tick {
        0%, 30% { transform: translateX(-6px); opacity: 0.4; }
        50% { transform: translateX(2px); opacity: 1; }
        100% { transform: translateX(20px); opacity: 0; }
      }
      .faq1-intro {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.85rem;
        padding: 0.85rem 1.4rem;
        border-radius: 9999px;
        overflow: hidden;
        border: 1px solid hsl(var(--border));
        background: hsl(var(--card) / 0.6);
        color: hsl(var(--primary));
        text-transform: uppercase;
        letter-spacing: 0.35em;
        font-size: 0.65rem;
        width: 100%;
        max-width: 24rem;
        margin: 0 auto;
        opacity: 0;
        transform: translate3d(0, 12px, 0);
        filter: blur(8px);
        transition: opacity 720ms ease, transform 720ms ease, filter 720ms ease;
        isolation: isolate;
      }
      .faq1-intro--active {
        opacity: 1;
        transform: translate3d(0, 0, 0);
        filter: blur(0);
      }
      .faq1-intro__beam,
      .faq1-intro__pulse {
        position: absolute;
        inset: -110%;
        pointer-events: none;
        border-radius: 50%;
      }
      .faq1-intro__beam {
        background: conic-gradient(from 160deg, hsl(var(--primary) / 0.28), transparent 32%, hsl(var(--primary) / 0.18) 58%, transparent 78%, hsl(var(--primary) / 0.15));
        animation: faq1-beam-spin 18s linear infinite;
        opacity: 0.6;
      }
      .faq1-intro__pulse {
        border: 1px solid currentColor;
        opacity: 0.25;
        animation: faq1-pulse 3.4s ease-out infinite;
      }
      .faq1-intro__label {
        position: relative;
        z-index: 1;
        font-weight: 600;
        letter-spacing: 0.4em;
      }
      .faq1-intro__meter {
        position: relative;
        z-index: 1;
        flex: 1 1 auto;
        height: 1px;
        background: linear-gradient(90deg, transparent, currentColor 35%, transparent 85%);
        transform: scaleX(0);
        transform-origin: left;
        animation: faq1-meter 5.8s ease-in-out infinite;
        opacity: 0.7;
      }
      .faq1-intro__tick {
        position: relative;
        z-index: 1;
        width: 0.55rem;
        height: 0.55rem;
        border-radius: 9999px;
        background: currentColor;
        box-shadow: 0 0 0 4px hsl(var(--primary) / 0.12);
        animation: faq1-tick 3.2s ease-in-out infinite;
      }
      .faq1-fade {
        opacity: 0;
        transform: translate3d(0, 24px, 0);
        filter: blur(12px);
        transition: opacity 700ms ease, transform 700ms ease, filter 700ms ease;
      }
      .faq1-fade--ready {
        animation: faq1-fade-up 860ms cubic-bezier(0.22, 0.68, 0, 1) forwards;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (style.parentNode) style.remove();
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIntroReady(true);
      return;
    }
    const frame = window.requestAnimationFrame(() => setIntroReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggleQuestion = (index: number) => setActiveIndex((prev) => (prev === index ? -1 : index));

  useEffect(() => {
    if (typeof window === 'undefined') {
      setHasEntered(true);
      return;
    }
    let timeout: number;
    const onLoad = () => {
      timeout = window.setTimeout(() => setHasEntered(true), 120);
    };
    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad, { once: true });
    }
    return () => {
      window.removeEventListener('load', onLoad);
      window.clearTimeout(timeout);
    };
  }, []);

  const setCardGlow = (event: React.MouseEvent<HTMLLIElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    target.style.setProperty('--faq-x', `${event.clientX - rect.left}px`);
    target.style.setProperty('--faq-y', `${event.clientY - rect.top}px`);
  };

  const clearCardGlow = (event: React.MouseEvent<HTMLLIElement>) => {
    const target = event.currentTarget;
    target.style.removeProperty('--faq-x');
    target.style.removeProperty('--faq-y');
  };

  const cardShadow = useMemo(
    () => (theme === 'dark' ? 'shadow-[0_36px_140px_-60px_rgba(0,0,0,0.9)]' : 'shadow-[0_36px_120px_-70px_rgba(15,15,15,0.18)]'),
    [theme]
  );

  return (
    <PageLayout>
      <Helmet>
        <title>FAQ — Catalyst Mom</title>
        <meta name="description" content="Answers to common questions about Catalyst Mom's TTC, pregnancy, and postpartum programs — cycle tracking, coaching, pricing, and how the app works." />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="relative w-full overflow-hidden bg-background transition-colors duration-700">
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 12% 0%, hsl(var(--primary) / 0.15), transparent 65%)' }}
        />
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-80"
          style={{
            background: 'linear-gradient(130deg, hsl(var(--foreground) / 0.05) 0%, transparent 65%)',
            mixBlendMode: theme === 'dark' ? 'screen' : 'multiply',
          }}
        />

        <section
          className={`relative z-10 mx-auto flex max-w-4xl flex-col gap-12 px-6 py-20 lg:max-w-5xl lg:px-12 ${
            hasEntered ? 'faq1-fade--ready' : 'faq1-fade'
          }`}
        >
          <div className={`faq1-intro ${introReady ? 'faq1-intro--active' : ''}`}>
            <span className="faq1-intro__beam" aria-hidden="true" />
            <span className="faq1-intro__pulse" aria-hidden="true" />
            <span className="faq1-intro__label">Catalyst Mom FAQ</span>
            <span className="faq1-intro__meter" aria-hidden="true" />
            <span className="faq1-intro__tick" aria-hidden="true" />
          </div>

          <header className="space-y-4 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Common Questions</p>
            <h1 className="text-4xl font-semibold leading-tight text-foreground md:text-5xl">
              Everything you need to know.
            </h1>
            <p className="mx-auto max-w-xl text-base text-muted-foreground">
              Real answers to the questions mamas ask most — about recovery, coaching, pricing, and how Catalyst Mom actually works.
            </p>
          </header>

          <ul className="space-y-4">
            {faqs.map((item, index) => {
              const open = activeIndex === index;
              const panelId = `faq-panel-${index}`;
              const buttonId = `faq-trigger-${index}`;

              return (
                <li
                  key={item.q}
                  className={`group relative overflow-hidden rounded-3xl border border-border bg-card/60 backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 focus-within:-translate-y-0.5 ${cardShadow}`}
                  onMouseMove={setCardGlow}
                  onMouseLeave={clearCardGlow}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                      open ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                    style={{
                      background: 'radial-gradient(240px circle at var(--faq-x, 50%) var(--faq-y, 50%), hsl(var(--primary) / 0.12), transparent 70%)',
                    }}
                  />

                  <button
                    type="button"
                    id={buttonId}
                    aria-controls={panelId}
                    aria-expanded={open}
                    onClick={() => toggleQuestion(index)}
                    className="relative flex w-full items-start gap-6 px-6 py-6 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary/40 md:px-8 md:py-7"
                  >
                    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-muted/60 transition-all duration-500 group-hover:scale-105">
                      <span
                        className={`pointer-events-none absolute inset-0 rounded-full border border-border opacity-30 ${open ? 'animate-ping' : ''}`}
                      />
                      <svg
                        className={`relative h-5 w-5 text-primary transition-transform duration-500 ${open ? 'rotate-45' : ''}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 5v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>

                    <div className="flex flex-1 flex-col gap-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                        <h2 className="text-lg font-medium leading-tight text-foreground sm:text-xl">{item.q}</h2>
                        {item.meta && (
                          <span className="inline-flex w-fit items-center rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-muted-foreground sm:ml-auto">
                            {item.meta}
                          </span>
                        )}
                      </div>

                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        className={`overflow-hidden text-sm leading-relaxed text-muted-foreground transition-[max-height] duration-500 ease-out ${
                          open ? 'max-h-64' : 'max-h-0'
                        }`}
                      >
                        <p className="pr-2">{item.a}</p>
                        {index === 0 && (
                          <p className="pr-2 pt-2">
                            Read more recovery tips on our{' '}
                            <Link to="/blog" className="underline hover:opacity-80">wellness blog</Link>.
                          </p>
                        )}
                        {index === 7 && (
                          <p className="pr-2 pt-2">
                            Learn more about why we built Catalyst Mom on our{' '}
                            <Link to="/about" className="underline hover:opacity-80">about page</Link>.
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="rounded-3xl border border-border bg-card/60 p-8 text-center backdrop-blur-xl">
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
              <strong className="font-semibold text-foreground">Still have a question?</strong> We are here to
              help. Reach out at hello@catalystmomofficial.com and we will get back to you within 24 hours.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/register"
                className="rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Get Started
              </Link>
              <Link
                to="/questionnaire"
                className="rounded-full border border-border px-6 py-3 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Take the Free Assessment
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default FAQ;
