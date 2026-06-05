import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';

const faqs = [
  {
    q: "Can you heal diastasis recti with 20-minute home workouts?",
    a: "Yes. Healing diastasis recti doesn’t require hours in the gym; it requires intentional, deep-core activation. Short, targeted 20-minute routines focusing on proper breathing and transverse abdominis engagement can safely close the gap and rebuild stability without equipment.",
  },
  {
    q: "How can I prepare my body for a natural birth and prevent tearing?",
    a: "Preparing for a natural, tear-free birth involves functional pelvic floor training, mobility work, and learning to breathe with contractions. Moving purposefully during pregnancy releases hip and pelvic tension, allowing your body to relax naturally during delivery.",
  },
  {
    q: "How do I heal diastasis recti safely after a C-section?",
    a: "Healing diastasis recti after a C-section requires a progressive approach that focuses on deep core engagement rather than traditional sit-ups or crunches. Our Core Restore protocols are designed to protect your incision while progressively rebuilding your midsection strength — safely and at your own pace.",
  },
  {
    q: "Is it normal to leak when sneezing postpartum?",
    a: "While leaking (urinary incontinence) is common, it is not something you just have to live with. It is a sign of pelvic floor dysfunction or coordination issues. Our targeted core and pelvic floor rehabilitation exercises help rebuild automatic reflex control so you can sneeze, jump, and run completely leak-free.",
  },
  {
    q: "What are the best exercises to prepare for a VBAC?",
    a: "Preparing for a Vaginal Birth After Cesarean (VBAC) focuses heavily on pelvic mobility, deep core breathing, and optimal fetal positioning. Exercises like deep squats, pelvic tilts, asymmetric lunges, and learning to release the pelvic floor during contractions help open the birth canal and build the stamina needed for a successful labor.",
  },
  {
    q: "Can I exercise while trying to conceive?",
    a: "Absolutely. Exercise is highly beneficial when trying to conceive (TTC) because it manages stress, improves insulin sensitivity, and optimizes blood flow to the reproductive organs. The key is balance—focusing on moderate strength training, mobility work, and steady cardio rather than extreme, exhaustive workouts.",
  },
  {
    q: "When should I start tracking my cycle for TTC?",
    a: "You should start tracking your cycle immediately if you are trying to conceive. Tracking your basal body temperature (BBT), cervical mucus changes, and utilizing ovulation predictor kits (OPKs) helps you accurately map your fertile window, understand your luteal phase length, and pinpoint the exact days you are most likely to get pregnant.",
  },
  {
    q: "What is included in the $29 per month subscription?",
    a: "Your $29/month membership unlocks full access to the Catalyst Mom ecosystem. This includes customized trimester-by-trimester prenatal plans, postpartum deep-core restoration protocols, time-efficient 20-minute home workouts, family-friendly nutrition frameworks, milestone tracking tools, and our supportive community space.",
  },
  {
    q: "Do I get access to a real coach?",
    a: "Yes. Catalyst Mom combines digital convenience with real human touch. While the app delivers your tailored daily plan, our certified coaches are accessible within the platform to answer your specific movement questions, review your form, and keep you accountable every step of the way.",
  },
  {
    q: "Is there a money-back guarantee?",
    a: "Yes, we stand behind our method. We offer a risk-free 7-day money-back guarantee. If you join and feel like the workouts, community, or protocols aren't the right fit for your motherhood stage, simply contact our support team within your first week for a full, hassle-free refund.",
  },
  {
    q: "Does Catalyst Mom work on my phone without an app store?",
    a: "Yes! Catalyst Mom is built as a progressive web platform, meaning you get a seamless, fast app-like experience directly through your phone's browser without needing to download large updates from the app store. You can easily add an icon right to your home screen for one-tap access.",
  },
  {
    q: "What makes Catalyst Mom different from other fitness apps?",
    a: "Most fitness apps treat women's bodies the same, whether they are pregnant, 6 weeks postpartum, or years into motherhood. Catalyst Mom is entirely customized around maternal health. We combine core/pelvic floor rehabilitation, functional strength, and metabolic health into short, intentional 20-minute windows that respect a busy mom's schedule.",
  },
  {
    q: "Can I import data from Flo, Clue, or Oura?",
    a: "Yes — if you are in the TTC stage you can import cycle and sleep data from Flo, Clue, or Oura by uploading a screenshot directly inside the app. The app automatically extracts your data from the image. Pregnancy and postpartum integrations are coming soon.",
  },
  {
    q: "Can I upload my bloodwork results?",
    a: "Yes — inside the TTC dashboard you can log bloodwork manually or upload a PDF of your lab results and the app will extract your values automatically. You can track FSH, LH, Estradiol, Progesterone, AMH, and other key fertility markers over time.",
  },
  {
    q: "Will this work if I am years postpartum — not just weeks?",
    a: "Yes. Diastasis recti and pelvic floor dysfunction can be addressed at any point postpartum — whether you are three months or three years after birth. The assessment identifies exactly where you are right now and builds your protocol from there.",
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
  const [activeIdx, setActiveIdx] = useState<number | null>(0);

  return (
    <PageLayout>
      <Helmet>
        <title>FAQ — Catalyst Mom</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <style>{`
        .faq-scope {
          --copper: #B5651D;
          --peach: #F4C5A0;
          --cream: #FDF6EE;
          --cream-dark: #F5EBE0;
          --charcoal: #2C2218;
          --warm-gray: #8A7060;
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          background: var(--cream-dark);
        }
        .faq-scope .faq-section { padding: 7rem 2rem; background: var(--cream-dark); }
        .faq-scope .faq-container { max-width: 860px; margin: 0 auto; }
        .faq-scope .faq-header { text-align: center; margin-bottom: 4rem; }
        .faq-scope .faq-eyebrow {
          display: inline-flex; align-items: center; gap: 0.8rem;
          font-size: 0.65rem; letter-spacing: 0.35em; text-transform: uppercase;
          color: var(--copper); font-weight: 500; margin-bottom: 1.2rem;
        }
        .faq-scope .faq-eyebrow::before, .faq-scope .faq-eyebrow::after {
          content: ''; width: 36px; height: 1px; background: rgba(181,101,29,0.4);
        }
        .faq-scope .faq-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 400; color: var(--charcoal); line-height: 1.2; margin-bottom: 1rem;
        }
        .faq-scope .faq-title em { font-style: italic; color: var(--copper); }
        .faq-scope .faq-subtitle {
          font-size: 0.95rem; color: var(--warm-gray); line-height: 1.8;
          max-width: 520px; margin: 0 auto;
        }
        .faq-scope .faq-list {
          display: flex; flex-direction: column; gap: 1px;
          background: rgba(181,101,29,0.1);
          border: 1px solid rgba(181,101,29,0.1);
          margin-bottom: 3rem;
        }
        .faq-scope .faq-item {
          background: var(--cream); overflow: hidden;
          transition: background 0.3s ease; position: relative;
        }
        .faq-scope .faq-item.active { background: white; }
        .faq-scope .faq-item::before {
          content: ''; position: absolute; top: 0; left: 0;
          width: 3px; height: 100%; background: var(--copper);
          transform: scaleY(0); transform-origin: top; transition: transform 0.3s ease;
        }
        .faq-scope .faq-item.active::before { transform: scaleY(1); }
        .faq-scope .faq-question {
          width: 100%; background: none; border: none;
          padding: 1.8rem 2rem;
          display: flex; justify-content: space-between; align-items: flex-start;
          gap: 1.5rem; cursor: pointer; text-align: left; transition: all 0.3s ease;
        }
        .faq-scope .faq-question:hover { background: rgba(181,101,29,0.03); }
        .faq-scope .faq-question h3 {
          font-family: 'Jost', sans-serif; font-size: 0.95rem; font-weight: 500;
          color: var(--charcoal); line-height: 1.5; transition: color 0.3s ease; margin: 0;
        }
        .faq-scope .faq-item.active .faq-question h3 { color: var(--copper); }
        .faq-scope .faq-icon {
          width: 28px; height: 28px; border-radius: 50%;
          border: 1px solid rgba(181,101,29,0.25);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 0.1rem; transition: all 0.3s ease; background: transparent;
        }
        .faq-scope .faq-item.active .faq-icon { background: var(--copper); border-color: var(--copper); }
        .faq-scope .faq-icon svg { width: 12px; height: 12px; stroke: var(--copper); transition: all 0.3s ease; }
        .faq-scope .faq-item.active .faq-icon svg { stroke: white; transform: rotate(45deg); }
        .faq-scope .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }
        .faq-scope .faq-item.active .faq-answer { max-height: 500px; }
        .faq-scope .faq-answer-inner {
          padding: 1.2rem 2rem 2rem;
          border-top: 1px solid rgba(181,101,29,0.08);
        }
        .faq-scope .faq-answer-inner p {
          font-size: 0.92rem; color: var(--warm-gray); line-height: 1.85; margin: 0;
        }
        .faq-scope .faq-cta {
          text-align: center; padding: 2.5rem;
          border: 1px solid rgba(181,101,29,0.15); background: var(--cream);
        }
        .faq-scope .faq-cta p {
          font-size: 0.92rem; color: var(--warm-gray);
          margin-bottom: 1.2rem; line-height: 1.7;
        }
        .faq-scope .faq-cta p strong { color: var(--charcoal); font-weight: 500; }
        .faq-scope .faq-btn {
          display: inline-block; background: var(--copper); color: white;
          padding: 0.9rem 2.2rem; font-family: 'Jost', sans-serif;
          font-size: 0.78rem; font-weight: 600; letter-spacing: 0.15em;
          text-transform: uppercase; text-decoration: none;
          border: 2px solid var(--copper); transition: all 0.3s ease;
          margin-right: 0.8rem; margin-bottom: 0.5rem;
        }
        .faq-scope .faq-btn:hover { background: transparent; color: var(--copper); }
        .faq-scope .faq-btn-ghost {
          display: inline-block; color: var(--warm-gray);
          padding: 0.9rem 2rem; font-family: 'Jost', sans-serif;
          font-size: 0.78rem; font-weight: 500; letter-spacing: 0.12em;
          text-transform: uppercase; text-decoration: none;
          border: 1px solid rgba(138,112,96,0.3);
          transition: all 0.3s ease; margin-bottom: 0.5rem;
        }
        .faq-scope .faq-btn-ghost:hover { color: var(--charcoal); border-color: var(--charcoal); }
        @media (max-width: 640px) {
          .faq-scope .faq-section { padding: 5rem 1.5rem; }
          .faq-scope .faq-question { padding: 1.4rem 1.5rem; }
          .faq-scope .faq-answer-inner { padding: 1rem 1.5rem 1.5rem; }
          .faq-scope .faq-btn, .faq-scope .faq-btn-ghost { display: block; text-align: center; margin-right: 0; }
        }
      `}</style>

      <div className="faq-scope">
        <section className="faq-section">
          <div className="faq-container">
            <header className="faq-header">
              <div className="faq-eyebrow">Common Questions</div>
              <h1 className="faq-title">Everything you need <em>to know.</em></h1>
              <p className="faq-subtitle">
                Real answers to the questions mamas ask most — about recovery, coaching, pricing, and how Catalyst Mom actually works.
              </p>
            </header>

            <div className="faq-list">
              {faqs.map((item, idx) => {
                const active = activeIdx === idx;
                return (
                  <div key={idx} className={`faq-item ${active ? 'active' : ''}`}>
                    <button
                      className="faq-question"
                      onClick={() => setActiveIdx(active ? null : idx)}
                      aria-expanded={active}
                    >
                      <h3>{item.q}</h3>
                      <span className="faq-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </span>
                    </button>
                    <div className="faq-answer">
                      <div className="faq-answer-inner">
                        <p>{item.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="faq-cta">
              <p>
                <strong>Still have a question?</strong> We are here to help. Reach out at admin@catalystmom.online and we will get back to you within 24 hours.
              </p>
              <Link to="/register" className="faq-btn">Get Started</Link>
              <Link to="/questionnaire" className="faq-btn-ghost">Take the Free Assessment</Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default FAQ;
