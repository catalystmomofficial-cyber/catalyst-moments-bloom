import PageLayout from '@/components/layout/PageLayout';

const COPPER = '#B5651D';
const CREAM = '#FDF6EE';
const CHARCOAL = '#2C2218';
const WARM_GRAY = '#8A7060';

const Experts = () => {
  return (
    <PageLayout>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      <div style={{ background: CREAM, color: CHARCOAL, fontFamily: 'Jost, sans-serif' }}>
        <div className="container mx-auto px-4 py-20 md:py-28">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center">
            <p
              style={{
                color: COPPER,
                fontSize: '0.7rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
              }}
            >
              The Catalyst Method
            </p>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
                lineHeight: 1.1,
                fontWeight: 700,
                color: CHARCOAL,
                marginBottom: '1.5rem',
              }}
            >
              Built on Evidence.{' '}
              <em style={{ color: COPPER, fontStyle: 'italic', fontWeight: 400 }}>
                Guided by Experience.
              </em>
            </h1>
            <p
              style={{
                color: WARM_GRAY,
                fontSize: '1.05rem',
                lineHeight: 1.7,
                maxWidth: '40rem',
                margin: '0 auto',
              }}
            >
              Catalyst Mom programs are built around clinical standards for maternal health —
              not generic fitness content. Every workout, meal plan, and recovery protocol is
              shaped by specialists who understand what a mother's body actually needs at each
              stage.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-6xl mx-auto">
            {[
              {
                icon: '🫁',
                title: 'Core & Pelvic Floor Recovery',
                text: 'Safe progressive protocols aligned with ACOG and NASM guidelines. Every exercise is screened for diastasis recti safety, pelvic floor integrity, and stage-appropriate load.',
              },
              {
                icon: '🥗',
                title: 'Postnatal Nutrition & Hormone Health',
                text: "Evidence-based nutrition frameworks for postpartum depletion, TTC hormone support, and pregnancy nourishment — built around a real mama's schedule.",
              },
              {
                icon: '🧠',
                title: 'The Mental Load of Motherhood',
                text: 'Matrescence, postpartum anxiety, and the emotional weight of every stage are not afterthoughts. They are part of the program. Because healing is never just physical.',
              },
            ].map((c) => (
              <div
                key={c.title}
                style={{
                  background: '#fff',
                  border: `1px solid ${COPPER}`,
                  borderRadius: '1rem',
                  padding: '2rem 1.75rem',
                  boxShadow: '0 4px 20px -8px rgba(181,101,29,0.15)',
                }}
              >
                <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>{c.icon}</div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: CHARCOAL,
                    marginBottom: '0.75rem',
                    lineHeight: 1.25,
                  }}
                >
                  {c.title}
                </h3>
                <p style={{ color: WARM_GRAY, fontSize: '0.95rem', lineHeight: 1.65 }}>
                  {c.text}
                </p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div
            style={{
              maxWidth: '4rem',
              height: '1px',
              background: COPPER,
              opacity: 0.4,
              margin: '5rem auto 3rem',
            }}
          />

          {/* Quote */}
          <blockquote
            style={{
              maxWidth: '46rem',
              margin: '0 auto',
              textAlign: 'center',
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1.15rem, 2vw, 1.5rem)',
              lineHeight: 1.55,
              color: CHARCOAL,
            }}
          >
            "We do not just build workouts. We partner with specialists who understand the
            maternal body at a clinical level — and every program reflects that standard."
          </blockquote>

          {/* Badge */}
          <div className="flex justify-center mt-10">
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                border: `1px solid ${COPPER}`,
                background: 'rgba(181,101,29,0.08)',
                color: COPPER,
                padding: '0.55rem 1.1rem',
                borderRadius: '999px',
                fontSize: '0.78rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              <span
                style={{
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '50%',
                  background: COPPER,
                  display: 'inline-block',
                }}
              />
              Clinical Standards: ACOG &amp; NASM Aligned
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Experts;
