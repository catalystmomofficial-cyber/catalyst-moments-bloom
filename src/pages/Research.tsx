import PageLayout from '@/components/layout/PageLayout';

const Research = () => {
  return (
    <PageLayout>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .cs-scope {
          --copper:#B5651D; --peach:#F4C5A0; --peach-light:#FAE0CC;
          --cream:#FDF6EE; --cream-dark:#F5EBE0; --charcoal:#2C2218;
          --warm-gray:#8A7060; --dark-brown:#1A1008;
          background:var(--cream); font-family:'Jost',sans-serif; font-weight:300;
        }
        .cs-scope * { box-sizing:border-box; }
        .cs-section { padding:7rem 2rem; background:var(--cream); }
        .cs-container { max-width:1100px; margin:0 auto; }

        .cs-header { text-align:center; margin-bottom:5rem; }
        .cs-eyebrow { display:inline-flex; align-items:center; gap:.8rem; font-size:.65rem; letter-spacing:.35em; text-transform:uppercase; color:var(--copper); font-weight:500; margin-bottom:1.5rem; }
        .cs-eyebrow::before, .cs-eyebrow::after { content:''; width:40px; height:1px; background:rgba(181,101,29,.4); }
        .cs-title { font-family:'Playfair Display',serif; font-size:clamp(2.2rem,5vw,3.5rem); font-weight:400; color:var(--charcoal); line-height:1.15; margin-bottom:1rem; }
        .cs-title em { font-style:italic; color:var(--copper); }
        .cs-subtitle { font-size:1rem; color:var(--warm-gray); max-width:580px; margin:0 auto; line-height:1.8; }

        .cs-main-card { background:var(--charcoal); padding:4rem; position:relative; overflow:hidden; margin-bottom:2rem; }
        .cs-main-card::before { content:''; position:absolute; top:0; left:0; width:5px; height:100%; background:linear-gradient(to bottom,var(--copper),var(--peach)); }
        .cs-main-card::after { content:''; position:absolute; top:0; right:0; width:300px; height:300px; background:radial-gradient(circle,rgba(181,101,29,.12) 0%,transparent 70%); pointer-events:none; }
        .cs-main-inner { display:grid; grid-template-columns:1fr 1fr; gap:4rem; align-items:center; position:relative; z-index:1; }
        .cs-main-left h3 { font-family:'Playfair Display',serif; font-size:clamp(1.5rem,3vw,2.2rem); font-weight:400; color:#fff; line-height:1.3; margin-bottom:1.5rem; }
        .cs-main-left h3 em { font-style:italic; color:var(--peach); }
        .cs-main-left p { font-size:.95rem; color:rgba(253,246,238,.7); line-height:1.85; }

        .cs-standards { display:flex; flex-direction:column; gap:1rem; }
        .cs-badge { display:flex; align-items:flex-start; gap:1rem; padding:1.2rem 1.5rem; border:1px solid rgba(181,101,29,.3); background:rgba(181,101,29,.06); }
        .cs-badge-dot { width:10px; height:10px; border-radius:50%; background:var(--copper); flex-shrink:0; margin-top:.4rem; }
        .cs-badge-title { font-size:.75rem; font-weight:600; color:var(--peach); letter-spacing:.1em; text-transform:uppercase; margin-bottom:.2rem; }
        .cs-badge-desc { font-size:.8rem; color:rgba(253,246,238,.55); line-height:1.5; }

        .cs-pillars { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5px; background:rgba(181,101,29,.12); border:1px solid rgba(181,101,29,.12); margin-bottom:2rem; }
        .cs-pillar { background:var(--cream); padding:2.5rem 2rem; position:relative; transition:background .3s ease; }
        .cs-pillar::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(to right,var(--copper),var(--peach)); transform:scaleX(0); transform-origin:left; transition:transform .4s ease; }
        .cs-pillar:hover { background:#fff; }
        .cs-pillar:hover::before { transform:scaleX(1); }
        .cs-pillar-num { font-family:'Playfair Display',serif; font-size:3rem; color:rgba(181,101,29,.1); line-height:1; margin-bottom:1rem; font-weight:700; }
        .cs-pillar-icon { font-size:1.5rem; margin-bottom:1rem; }
        .cs-pillar-title { font-family:'Playfair Display',serif; font-size:1.15rem; font-weight:600; color:var(--charcoal); margin-bottom:.8rem; line-height:1.3; }
        .cs-pillar-body { font-size:.88rem; color:var(--warm-gray); line-height:1.75; }

        .cs-proof { background:var(--copper); padding:2.5rem 3rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:2rem; }
        .cs-proof-statement { font-family:'Playfair Display',serif; font-size:clamp(1rem,2vw,1.3rem); font-style:italic; color:#fff; max-width:600px; line-height:1.5; }
        .cs-proof-stat { text-align:center; flex-shrink:0; }
        .cs-proof-num { font-family:'Playfair Display',serif; font-size:2.5rem; font-weight:700; color:#fff; line-height:1; margin-bottom:.3rem; }
        .cs-proof-label { font-size:.7rem; letter-spacing:.15em; text-transform:uppercase; color:rgba(255,255,255,.7); }

        .cs-disclaimer { text-align:center; margin-top:2rem; font-size:.8rem; color:var(--warm-gray); font-style:italic; line-height:1.6; }

        @media (max-width:900px) {
          .cs-main-inner { grid-template-columns:1fr; gap:2.5rem; }
          .cs-pillars { grid-template-columns:1fr; }
          .cs-proof { flex-direction:column; text-align:center; }
          .cs-main-card { padding:2.5rem 1.5rem; }
          .cs-section { padding:4rem 1.25rem; }
        }
      `}</style>

      <div className="cs-scope">
        <section className="cs-section">
          <div className="cs-container">
            <div className="cs-header">
              <div className="cs-eyebrow">Our Approach</div>
              <h1 className="cs-title">The Catalyst <em>Standard</em></h1>
              <p className="cs-subtitle">
                Built on science. Shaped by real mamas. Every protocol we create is grounded in
                clinical guidelines and refined through the lived experience of the women who use it.
              </p>
            </div>

            <div className="cs-main-card">
              <div className="cs-main-inner">
                <div className="cs-main-left">
                  <h3>We don't guess<br /><em>with your recovery.</em></h3>
                  <p>
                    Every Catalyst Mom protocol is aligned with the clinical guidelines set by
                    ACOG and NASM — the gold standard for prenatal and postnatal care. We combine
                    these evidence-based standards with real-world results from our community to
                    create programs that actually work for the modern mama.
                  </p>
                </div>
                <div className="cs-standards">
                  {[
                    { t: 'ACOG Aligned', d: 'American College of Obstetricians and Gynecologists — the leading authority on maternal health' },
                    { t: 'NASM Aligned', d: 'National Academy of Sports Medicine — gold standard for safe, progressive fitness programming' },
                    { t: 'Built With Real Mamas', d: 'Shaped by the feedback, results, and lived experience of our community' },
                  ].map((b) => (
                    <div key={b.t} className="cs-badge">
                      <span className="cs-badge-dot" />
                      <div>
                        <div className="cs-badge-title">{b.t}</div>
                        <div className="cs-badge-desc">{b.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="cs-pillars">
              {[
                { n: '01', i: '🫁', t: 'Core & Pelvic Floor Recovery', b: 'Safe, progressive protocols screened for diastasis recti safety and pelvic floor integrity at every stage. No guessing. No exercises that make things worse.' },
                { n: '02', i: '🥗', t: 'Postnatal Nutrition & Hormone Health', b: "Evidence-based nutrition frameworks for postpartum depletion, TTC hormone support, and pregnancy nourishment — built around a real mama's schedule." },
                { n: '03', i: '🧠', t: 'The Mental Load of Motherhood', b: 'Matrescence, postpartum anxiety, and emotional wellness are not afterthoughts here. They are part of the protocol. Because healing is never just physical.' },
              ].map((p) => (
                <div key={p.n} className="cs-pillar">
                  <div className="cs-pillar-num">{p.n}</div>
                  <div className="cs-pillar-icon">{p.i}</div>
                  <div className="cs-pillar-title">{p.t}</div>
                  <div className="cs-pillar-body">{p.b}</div>
                </div>
              ))}
            </div>

            <div className="cs-proof">
              <p className="cs-proof-statement">
                "The proof is not just in the guidelines — it is in the mamas who carried their
                toddlers upstairs without back pain for the first time."
              </p>
              <div className="cs-proof-stat">
                <div className="cs-proof-num">2,000+</div>
                <div className="cs-proof-label">Mamas Supported</div>
              </div>
            </div>

            <p className="cs-disclaimer">
              Catalyst Mom provides wellness information for educational purposes only and is not
              a substitute for professional medical advice. Always consult your healthcare provider.
            </p>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Research;
