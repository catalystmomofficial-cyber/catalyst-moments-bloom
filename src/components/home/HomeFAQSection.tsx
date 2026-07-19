import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";

const INTRO_STYLE_ID = 'home-faq-intro-animations';

export const homeFaqs = [
  {
    q: "What is Catalyst Mom?",
    a: "Catalyst Mom is a wellness, fitness, and nutrition platform built for every stage of motherhood — trying to conceive (TTC), pregnancy, and postpartum. It combines personalized workouts, meal plans, milestone tracking, and a supportive community in one place.",
  },
  {
    q: "Who is Catalyst Mom for?",
    a: "Catalyst Mom is for women trying to conceive, currently pregnant, or recovering postpartum — whether that's weeks or years after birth. Programs adapt to your current stage, energy levels, and goals.",
  },
  {
    q: "What is included in a Catalyst Mom membership?",
    a: "A membership includes trimester-by-trimester prenatal plans, postpartum core and pelvic floor restoration protocols, time-efficient 20-minute home workouts, nutrition frameworks, milestone tracking tools, and access to our supportive community space.",
  },
  {
    q: "Do I need any equipment to get started?",
    a: "No. Most Catalyst Mom workouts are designed to be done at home with minimal or no equipment, making it easy to fit movement into a busy day as a mom.",
  },
  {
    q: "Is there a free trial or money-back guarantee?",
    a: "Yes. Catalyst Mom offers a risk-free 7-day money-back guarantee, so you can try the workouts, community, and protocols and get a full refund if it isn't the right fit.",
  },
];

export const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": homeFaqs.map(({ q, a }) => ({
    "@type": "Question",
    "name": q,
    "acceptedAnswer": { "@type": "Answer", "text": a },
  })),
};

const HomeFAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById(INTRO_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = INTRO_STYLE_ID;
    style.innerHTML = `
      @keyframes home-faq-pulse {
        0% { transform: scale(0.7); opacity: 0.55; }
        60% { opacity: 0.1; }
        100% { transform: scale(1.25); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (style.parentNode) style.remove();
    };
  }, []);

  const toggleQuestion = (index: number) => setActiveIndex((prev) => (prev === index ? -1 : index));

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

  return (
    <section aria-label="Frequently Asked Questions" className="relative section-padding bg-muted/30 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: 'radial-gradient(ellipse 50% 80% at 85% 0%, hsl(var(--primary) / 0.1), transparent 65%)' }}
      />

      <div className="relative z-10 container container-padding mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-4 px-3 py-1 border-primary/30 text-primary dark:text-catalyst-gold dark:border-catalyst-gold/40">
            FAQ
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Frequently Asked Questions
          </h2>
        </div>

        <ul className="space-y-4">
          {homeFaqs.map((item, index) => {
            const open = activeIndex === index;
            const panelId = `home-faq-panel-${index}`;
            const buttonId = `home-faq-trigger-${index}`;

            return (
              <li
                key={item.q}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card/60 backdrop-blur-xl shadow-sm transition-all duration-500 hover:-translate-y-0.5 focus-within:-translate-y-0.5"
                onMouseMove={setCardGlow}
                onMouseLeave={clearCardGlow}
              >
                <div
                  className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                    open ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                  style={{
                    background: 'radial-gradient(220px circle at var(--faq-x, 50%) var(--faq-y, 50%), hsl(var(--primary) / 0.1), transparent 70%)',
                  }}
                />

                <button
                  type="button"
                  id={buttonId}
                  aria-controls={panelId}
                  aria-expanded={open}
                  onClick={() => toggleQuestion(index)}
                  className="relative flex w-full items-start gap-4 px-5 py-5 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary/40 sm:px-6 sm:py-6"
                >
                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted/60 transition-all duration-500 group-hover:scale-105">
                    <span
                      className="pointer-events-none absolute inset-0 rounded-full border border-border opacity-30"
                      style={{ animation: open ? 'home-faq-pulse 1.6s ease-out infinite' : 'none' }}
                    />
                    <svg
                      className={`relative h-4 w-4 text-primary transition-transform duration-500 ${open ? 'rotate-45' : ''}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 5v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>

                  <div className="flex flex-1 flex-col gap-3">
                    <h3 className="text-base font-medium leading-tight text-foreground sm:text-lg">{item.q}</h3>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={`overflow-hidden text-sm leading-relaxed text-muted-foreground transition-[max-height] duration-500 ease-out ${
                        open ? 'max-h-64' : 'max-h-0'
                      }`}
                    >
                      <p className="pr-2">{item.a}</p>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 rounded-3xl border border-border bg-card/60 px-6 py-5 text-center backdrop-blur-xl">
          <p className="text-muted-foreground">
            Have more questions? Visit our{' '}
            <Link to="/faq" className="underline text-primary hover:opacity-80">
              full FAQ page
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default HomeFAQSection;
