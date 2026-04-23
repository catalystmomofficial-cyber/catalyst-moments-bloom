import { useEffect, useRef, useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';

const useReveal = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.15 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
};

const Experts = () => {
  const header = useReveal<HTMLDivElement>();
  const grid = useReveal<HTMLDivElement>();
  const bottom = useReveal<HTMLDivElement>();
  const future = useReveal<HTMLDivElement>();

  return (
    <PageLayout>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .standards-scope { --copper:#B5651D; --copper-light:#C8782A; --peach:#F4C5A0; --cream:#FDF6EE; --charcoal:#2C2218; --warm-gray:#8A7060; background:var(--cream); font-family:'Jost',sans-serif; font-weight:300; color:var(--charcoal); }
        .standards-section { padding: 7rem 2rem; }
        .standards-container { max-width: 1100px; margin: 0 auto; }

        .standards-header { text-align:center; margin-bottom:5rem; opacity:0; transform:translateY(24px); transition:opacity .9s ease, transform .9s ease; }
        .standards-header.visible { opacity:1; transform:translateY(0); }
        .standards-eyebrow { display:inline-flex; align-items:center; gap:.8rem; font-size:.65rem; letter-spacing:.35em; text-transform:uppercase; color:var(--copper); font-weight:500; margin-bottom:1.5rem; }
        .standards-eyebrow::before, .standards-eyebrow::after { content:''; width:40px; height:1px; background:rgba(181,101,29,.4); }
        .standards-title { font-family:'Playfair Display',serif; font-size:clamp(2.2rem,5vw,3.8rem); font-weight:400; line-height:1.15; margin-bottom:1.5rem; }
        .standards-title em { font-style:italic; color:var(--copper); }
        .standards-subtitle { max-width:660px; margin:0 auto; font-size:1.05rem; line-height:1.85; color:var(--warm-gray); }

        .pillars-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5px; background:rgba(181,101,29,.12); border:1px solid rgba(181,101,29,.12); margin-bottom:5rem; opacity:0; transform:translateY(30px); transition:opacity .9s ease .2s, transform .9s ease .2s; }
        .pillars-grid.visible { opacity:1; transform:translateY(0); }
        .pillar-card { background:var(--cream); padding:3.5rem 2.5rem; position:relative; transition:background .3s ease; overflow:hidden; }
        .pillar-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(to right,var(--copper),var(--peach)); transform:scaleX(0); transform-origin:left; transition:transform .4s ease; }
        .pillar-card:hover { background:#fff; }
        .pillar-card:hover::before { transform:scaleX(1); }
        .pillar-number { position:absolute; top:2rem; right:2rem; font-family:'Playfair Display',serif; font-size:4rem; font-weight:700; color:rgba(181,101,29,.08); line-height:1; user-select:none; }
        .pillar-icon { width:56px; height:56px; border-radius:50%; background:linear-gradient(135deg,rgba(181,101,29,.1),rgba(244,197,160,.2)); border:1px solid rgba(181,101,29,.2); display:flex; align-items:center; justify-content:center; font-size:1.5rem; margin-bottom:2rem; transition:all .3s ease; }
        .pillar-card:hover .pillar-icon { background:linear-gradient(135deg,var(--copper),var(--copper-light)); border-color:var(--copper); }
        .pillar-tag { font-size:.6rem; letter-spacing:.25em; text-transform:uppercase; color:var(--copper); font-weight:500; margin-bottom:.8rem; }
        .pillar-title { font-family:'Playfair Display',serif; font-size:1.35rem; font-weight:600; margin-bottom:1rem; line-height:1.3; }
        .pillar-body { font-size:.9rem; line-height:1.8; color:var(--warm-gray); }

        .standards-bottom { display:grid; grid-template-columns:1fr auto; gap:3rem; align-items:center; padding:3.5rem 4rem; background:var(--charcoal); position:relative; overflow:hidden; opacity:0; transform:translateY(30px); transition:opacity .9s ease .4s, transform .9s ease .4s; }
        .standards-bottom.visible { opacity:1; transform:translateY(0); }
        .standards-bottom::before { content:''; position:absolute; top:0; left:0; width:4px; height:100%; background:linear-gradient(to bottom,var(--copper),var(--peach)); }
        .standards-bottom::after { content:''; position:absolute; top:0; right:0; width:200px; height:200px; background:radial-gradient(circle,rgba(181,101,29,.12) 0%,transparent 70%); pointer-events:none; }
        .standards-statement { font-family:'Playfair Display',serif; font-size:clamp(1rem,2vw,1.25rem); font-style:italic; color:rgba(253,246,238,.85); line-height:1.7; position:relative; z-index:1; padding-left:1rem; }

        .badge { display:flex; flex-direction:column; align-items:center; gap:.8rem; flex-shrink:0; position:relative; z-index:1; }
        .badge-dot-row { display:flex; align-items:center; gap:.5rem; }
        .badge-dot { width:8px; height:8px; border-radius:50%; background:var(--copper); animation:pulse-dot 2s ease-in-out infinite; }
        @keyframes pulse-dot { 0%,100%{opacity:1; transform:scale(1);} 50%{opacity:.6; transform:scale(.85);} }
        .badge-inner { display:flex; flex-direction:column; align-items:center; gap:.5rem; padding:1.2rem 1.8rem; border:1px solid rgba(181,101,29,.4); background:rgba(181,101,29,.06); }
        .badge-label { font-size:.6rem; letter-spacing:.25em; text-transform:uppercase; color:var(--warm-gray); font-weight:500; }
        .badge-text { font-size:.72rem; letter-spacing:.18em; text-transform:uppercase; color:var(--peach); font-weight:600; text-align:center; line-height:1.4; }

        .future-experts { margin-top:5rem; padding:3rem; border:1px dashed rgba(181,101,29,.2); text-align:center; opacity:0; transform:translateY(20px); transition:opacity .9s ease .6s, transform .9s ease .6s; }
        .future-experts.visible { opacity:1; transform:translateY(0); }
        .future-eyebrow { font-size:.6rem; letter-spacing:.3em; text-transform:uppercase; color:var(--copper); font-weight:500; margin-bottom:.8rem; }
        .future-title { font-family:'Playfair Display',serif; font-size:1.3rem; margin-bottom:.6rem; font-weight:400; }
        .future-body { font-size:.88rem; color:var(--warm-gray); line-height:1.7; max-width:500px; margin:0 auto; }

        @media (max-width: 900px) {
          .pillars-grid { grid-template-columns: 1fr; }
          .standards-bottom { grid-template-columns: 1fr; padding: 2.5rem 2rem; gap: 2rem; }
          .badge { flex-direction: row; }
        }
      `}</style>

      <div className="standards-scope">
        <section className="standards-section">
          <div className="standards-container">
            {/* Header */}
            <div ref={header.ref} className={`standards-header ${header.visible ? 'visible' : ''}`}>
              <div className="standards-eyebrow">The Catalyst Method</div>
              <h1 className="standards-title">
                Built on Evidence.<br />
                <em>Guided by Experience.</em>
              </h1>
              <p className="standards-subtitle">
                Catalyst Mom programs are not generic fitness content. Every workout, protocol,
                and guide is built around clinical standards for maternal health — because a
                postpartum body is not just a fitness goal. It is a clinical reality.
              </p>
            </div>

            {/* Pillars */}
            <div ref={grid.ref} className={`pillars-grid ${grid.visible ? 'visible' : ''}`}>
              {[
                {
                  n: '01', icon: '🫁', tag: 'Physical Recovery',
                  title: 'Core & Pelvic Floor Recovery',
                  body: 'Safe, progressive protocols aligned with ACOG and NASM guidelines. Every exercise is screened for diastasis recti safety, pelvic floor integrity, and stage-appropriate load — whether you are 6 weeks or 3 years postpartum.',
                },
                {
                  n: '02', icon: '🥗', tag: 'Nourishment',
                  title: 'Postnatal Nutrition & Hormone Health',
                  body: "Evidence-based nutrition frameworks for postpartum depletion, TTC hormone support, and pregnancy nourishment — built around a real mama's schedule, not a meal prep fantasy or a calorie deficit.",
                },
                {
                  n: '03', icon: '🧠', tag: 'Mental Wellness',
                  title: 'The Mental Load of Motherhood',
                  body: 'Matrescence, postpartum anxiety, and the emotional weight of every stage are not afterthoughts here. They are part of the program. Because healing is never just physical — and no mama should carry this alone.',
                },
              ].map((p) => (
                <div key={p.n} className="pillar-card">
                  <div className="pillar-number">{p.n}</div>
                  <div className="pillar-icon">{p.icon}</div>
                  <div className="pillar-tag">{p.tag}</div>
                  <h3 className="pillar-title">{p.title}</h3>
                  <p className="pillar-body">{p.body}</p>
                </div>
              ))}
            </div>

            {/* Bottom statement + badge */}
            <div ref={bottom.ref} className={`standards-bottom ${bottom.visible ? 'visible' : ''}`}>
              <p className="standards-statement">
                "We do not just build workouts. We partner with specialists who understand the
                maternal body at a clinical level — and every program reflects that standard."
              </p>
              <div className="badge">
                <div className="badge-dot-row">
                  <span className="badge-dot" />
                  <span className="badge-label">Verified Standard</span>
                  <span className="badge-dot" />
                </div>
                <div className="badge-inner">
                  <div className="badge-text">
                    Clinical Standards<br />ACOG &amp; NASM Aligned
                  </div>
                </div>
              </div>
            </div>

            {/* Future experts */}
            <div ref={future.ref} className={`future-experts ${future.visible ? 'visible' : ''}`}>
              <div className="future-eyebrow">Coming Soon</div>
              <h3 className="future-title">Meet Our Expert Partners</h3>
              <p className="future-body">
                We are currently partnering with OBGYNs, pelvic floor physiotherapists,
                registered dietitians, and maternal mental health specialists. Our advisory
                circle will be announced soon.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Experts;
