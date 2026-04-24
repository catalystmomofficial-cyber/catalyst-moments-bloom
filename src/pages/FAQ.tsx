import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';

const faqs = [
  {
    q: "How do I heal diastasis recti safely after a C-section?",
    a: "Healing diastasis recti after a C-section requires a progressive approach that focuses on deep core engagement rather than traditional sit-ups or crunches. Our Core Restore protocols are designed to protect your incision while progressively rebuilding your midsection strength — safely and at your own pace.",
  },
  {
    q: "Is it normal to leak when sneezing postpartum?",
    a: "Leaking when you sneeze, laugh, or jump is common — but it is not something you have to live with permanently. It is often a sign of pelvic floor dysfunction. Our postpartum recovery program focuses on rebuilding the connection between your breath and your pelvic floor to address leaking at the root.",
  },
  {
    q: "What are the best exercises to prepare for a VBAC?",
    a: "A successful VBAC often depends on pelvic mobility, breathing technique, and nervous system regulation. Our pregnancy protocol includes birth ball exercises and breathing techniques designed to help you feel prepared, in control, and confident on your birth day.",
  },
  {
    q: "Can I exercise while trying to conceive?",
    a: "Yes — but the type of movement matters. High intensity workouts can raise cortisol levels which may interfere with ovulation. Catalyst Mom provides fertility-friendly workouts that keep you strong without overstressing your body during the conception window.",
  },
  {
    q: "When should I start tracking my cycle for TTC?",
    a: "We recommend tracking for at least 3 months to understand your unique ovulation patterns. The Catalyst Mom App simplifies this with built-in cycle tracking, ovulation awareness tools, and nutrition guidance synced to your cycle phases.",
  },
  {
    q: "What is included in the $29 per month subscription?",
    a: "Your subscription includes stage-specific programs for TTC, pregnancy, and postpartum, nutrition guidance, wellness tracking, cycle tracking, baby kick counter, contraction tracker, community access, bi-weekly human coach check-ins, and 24/7 Catalyst AI wellness support.",
  },
  {
    q: "Do I get access to a real coach?",
    a: "Yes. Every active subscriber receives bi-weekly check-ins with a real wellness coach. Between check-ins our Catalyst AI provides instant answers to wellness questions 24/7.",
  },
  {
    q: "Is there a money-back guarantee?",
    a: "Yes. We offer a 30-day money-back guarantee on all new subscriptions. If Catalyst Mom is not right for you within the first 30 days contact us at admin@catalystmom.online and we will refund every penny. No questions asked.",
  },
  {
    q: "Does Catalyst Mom work on my phone without an app store?",
    a: "Yes. Catalyst Mom is a Progressive Web App which means it works directly in your phone browser and can be installed to your home screen in seconds — no app store required. On iPhone open the site in Safari, tap Share, then Add to Home Screen. On Android tap Install when prompted.",
  },
  {
    q: "What makes Catalyst Mom different from other fitness apps?",
    a: "Catalyst Mom is built exclusively for the three stages of maternal wellness — TTC, Pregnancy, and Postpartum. Every workout, protocol, and piece of guidance is specific to where you are right now. Combined with real human coach check-ins every two weeks and a community of mamas at the same stage — it is the only platform that covers the full maternal journey in one place.",
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
              <Link to="/auth/register" className="faq-btn">Get Started</Link>
              <Link to="/questionnaire" className="faq-btn-ghost">Take the Free Assessment</Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default FAQ;
