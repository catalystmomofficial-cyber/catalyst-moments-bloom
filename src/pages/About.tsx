import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";

const About = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    document
      .querySelectorAll(".chapter, .chapter-divider, .cta-content")
      .forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  const handleStart = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(user ? "/dashboard" : "/register");
  };

  return (
    <>
      <Helmet>
        <title>Our Story — Catalyst Mom</title>
        <meta
          name="description"
          content="Catalyst Mom was born from love — built by a couple who refused to let any mama walk the TTC, pregnancy, or postpartum journey alone."
        />
        <link rel="canonical" href="https://catalystmomofficial.com/about" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Jost:wght@300;400;500&display=swap"
        />
      </Helmet>

      <style>{`
        .our-story-page {
          --copper: #B5651D;
          --copper-light: #C8782A;
          --peach: #F4C5A0;
          --peach-light: #FAE0CC;
          --cream: #FDF6EE;
          --charcoal: #2C2218;
          --warm-gray: #8A7060;
          --dark-brown: #1A1008;
          background: var(--dark-brown);
          color: var(--cream);
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          overflow-x: hidden;
          min-height: 100vh;
        }
        .our-story-page::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 999;
          opacity: 0.3;
        }
        .our-story-page nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 1.5rem 3rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(to bottom, rgba(26,16,8,0.95), transparent);
        }
        .our-story-page .nav-logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          color: var(--peach);
          letter-spacing: 0.08em;
          text-decoration: none;
        }
        .our-story-page .nav-cta {
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--copper);
          text-decoration: none;
          border: 1px solid rgba(181,101,29,0.4);
          padding: 0.5rem 1.2rem;
          transition: all 0.3s ease;
          cursor: pointer;
          background: transparent;
          font-family: inherit;
        }
        .our-story-page .nav-cta:hover { background: var(--copper); color: white; }
        .our-story-page .hero {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
          padding: 8rem 2rem 5rem;
        }
        .our-story-page .hero-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse at 20% 50%, rgba(181,101,29,0.12) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(244,197,160,0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 100%, rgba(181,101,29,0.08) 0%, transparent 50%);
        }
        .our-story-page .hero-content { position: relative; z-index: 1; text-align: center; max-width: 780px; }
        .our-story-page .hero-eyebrow {
          font-size: 0.65rem; letter-spacing: 0.35em; text-transform: uppercase;
          color: var(--copper); margin-bottom: 2rem;
          opacity: 0; animation: os-rise 1s ease 0.2s forwards;
        }
        .our-story-page .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.8rem, 7vw, 5.5rem);
          font-weight: 400; line-height: 1.15; margin-bottom: 2rem;
          opacity: 0; animation: os-rise 1s ease 0.4s forwards;
        }
        .our-story-page .hero-title em { font-style: italic; color: var(--peach); }
        .our-story-page .hero-sub {
          font-size: 1.05rem; color: rgba(253,246,238,0.6);
          line-height: 1.8; max-width: 560px; margin: 0 auto 3rem;
          opacity: 0; animation: os-rise 1s ease 0.6s forwards;
        }
        .our-story-page .scroll-indicator {
          display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
          opacity: 0; animation: os-rise 1s ease 0.9s forwards;
        }
        .our-story-page .scroll-line {
          width: 1px; height: 60px;
          background: linear-gradient(to bottom, var(--copper), transparent);
          animation: os-pulse-line 2s ease-in-out infinite;
        }
        .our-story-page .scroll-text {
          font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--warm-gray);
        }
        @keyframes os-pulse-line { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        .our-story-page .story { max-width: 680px; margin: 0 auto; padding: 0 2rem; }
        .our-story-page .chapter {
          padding: 6rem 0;
          opacity: 0; transform: translateY(40px);
          transition: opacity 0.9s ease, transform 0.9s ease;
        }
        .our-story-page .chapter.visible { opacity: 1; transform: translateY(0); }
        .our-story-page .chapter-number {
          font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--copper); margin-bottom: 1.5rem;
          display: flex; align-items: center; gap: 1rem;
        }
        .our-story-page .chapter-number::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(to right, rgba(181,101,29,0.4), transparent);
          max-width: 80px;
        }
        .our-story-page .chapter-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 400; line-height: 1.2; margin-bottom: 2rem; color: var(--cream);
        }
        .our-story-page .chapter-title em { font-style: italic; color: var(--peach); }
        .our-story-page .chapter p {
          font-size: 1.05rem; line-height: 1.95;
          color: rgba(253,246,238,0.75); margin-bottom: 1.4rem;
        }
        .our-story-page .chapter p strong { color: var(--cream); font-weight: 500; }
        .our-story-page .pull-quote {
          margin: 3rem -2rem; padding: 3rem 3rem;
          border-left: 3px solid var(--copper);
          background: rgba(181,101,29,0.06); position: relative;
        }
        .our-story-page .pull-quote::before {
          content: '\\201C';
          font-family: 'Playfair Display', serif;
          font-size: 5rem; color: rgba(181,101,29,0.2);
          position: absolute; top: 0.5rem; left: 1rem; line-height: 1;
        }
        .our-story-page .pull-quote p {
          font-family: 'Playfair Display', serif !important;
          font-style: italic !important;
          font-size: clamp(1.1rem, 2.5vw, 1.4rem) !important;
          line-height: 1.6 !important; color: var(--peach-light) !important;
          margin: 0 !important;
        }
        .our-story-page .chapter-divider {
          display: flex; align-items: center; justify-content: center;
          gap: 1.5rem; padding: 2rem 0;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .our-story-page .chapter-divider.visible { opacity: 1; transform: translateY(0); }
        .our-story-page .divider-line { width: 80px; height: 1px; background: rgba(181,101,29,0.3); }
        .our-story-page .divider-diamond { width: 6px; height: 6px; background: var(--copper); transform: rotate(45deg); }
        .our-story-page .stats-block {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
          background: rgba(181,101,29,0.15);
          border: 1px solid rgba(181,101,29,0.15);
          margin: 3rem 0;
        }
        .our-story-page .stat { background: rgba(26,16,8,0.8); padding: 2.5rem 1.5rem; text-align: center; }
        .our-story-page .stat-number {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem; color: var(--peach); line-height: 1; margin-bottom: 0.5rem;
        }
        .our-story-page .stat-label {
          font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--warm-gray);
        }
        .our-story-page .values { margin: 3rem 0; }
        .our-story-page .value-item {
          display: grid; grid-template-columns: auto 1fr; gap: 1.5rem;
          padding: 1.5rem 0; border-bottom: 1px solid rgba(181,101,29,0.1); align-items: start;
        }
        .our-story-page .value-icon {
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(181,101,29,0.1); border: 1px solid rgba(181,101,29,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; flex-shrink: 0; margin-top: 0.1rem;
        }
        .our-story-page .value-title {
          font-size: 0.8rem; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--copper); margin-bottom: 0.4rem; font-weight: 500;
        }
        .our-story-page .value-desc {
          font-size: 0.95rem; color: rgba(253,246,238,0.65); line-height: 1.7;
        }
        .our-story-page .cta-section {
          padding: 8rem 2rem; text-align: center;
          position: relative; overflow: hidden;
        }
        .our-story-page .cta-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at center, rgba(181,101,29,0.15) 0%, transparent 70%);
        }
        .our-story-page .cta-content {
          position: relative; z-index: 1; max-width: 600px; margin: 0 auto;
          opacity: 0; transform: translateY(30px);
          transition: opacity 0.9s ease, transform 0.9s ease;
        }
        .our-story-page .cta-content.visible { opacity: 1; transform: translateY(0); }
        .our-story-page .cta-eyebrow {
          font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--copper); margin-bottom: 1.5rem;
        }
        .our-story-page .cta-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 400; line-height: 1.2; margin-bottom: 1.5rem;
        }
        .our-story-page .cta-title em { font-style: italic; color: var(--peach); }
        .our-story-page .cta-body {
          font-size: 1rem; color: rgba(253,246,238,0.6); line-height: 1.8; margin-bottom: 2.5rem;
        }
        .our-story-page .cta-btn {
          display: inline-block; background: var(--copper); color: white;
          padding: 1rem 2.5rem; font-family: 'Jost', sans-serif;
          font-size: 0.8rem; font-weight: 500; letter-spacing: 0.15em;
          text-transform: uppercase; text-decoration: none;
          transition: all 0.3s ease; border: 1px solid var(--copper);
          cursor: pointer;
        }
        .our-story-page .cta-btn:hover { background: transparent; color: var(--copper); }
        .our-story-page .cta-btn-ghost {
          display: inline-block; color: var(--warm-gray);
          padding: 1rem 2rem; font-size: 0.8rem; letter-spacing: 0.1em;
          text-transform: uppercase; text-decoration: none;
          border: 1px solid rgba(138,112,96,0.3); margin-left: 1rem;
          transition: all 0.3s ease;
        }
        .our-story-page .cta-btn-ghost:hover { color: var(--cream); border-color: var(--cream); }
        .our-story-page footer {
          border-top: 1px solid rgba(181,101,29,0.15);
          padding: 2rem 3rem;
          display: flex; justify-content: space-between; align-items: center;
        }
        .our-story-page .footer-logo {
          font-family: 'Playfair Display', serif;
          font-size: 1rem; color: var(--peach); font-style: italic;
        }
        .our-story-page .footer-text { font-size: 0.75rem; color: var(--warm-gray); }
        @keyframes os-rise {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 640px) {
          .our-story-page nav { padding: 1.2rem 1.5rem; }
          .our-story-page .pull-quote { margin: 2rem -1rem; padding: 2rem 1.5rem; }
          .our-story-page .stats-block { grid-template-columns: 1fr; }
          .our-story-page .cta-btn-ghost { margin-left: 0; margin-top: 0.8rem; display: block; }
          .our-story-page footer { flex-direction: column; gap: 0.8rem; text-align: center; }
        }
      `}</style>

      <div className="our-story-page">
        <nav>
          <Link to="/" className="nav-logo">Catalyst Mom</Link>
          <a href={user ? "/dashboard" : "/register"} onClick={handleStart} className="nav-cta">
            Join the Movement
          </a>
        </nav>

        <section className="hero">
          <div className="hero-bg" />
          <div className="hero-content">
            <div className="hero-eyebrow">Our Story</div>
            <h1 className="hero-title">
              This was never just<br />
              about <em>fitness.</em>
            </h1>
            <p className="hero-sub">
              Catalyst Mom was born from love, from grief, from watching the women who matter most suffer through something that didn't have to be that hard.
            </p>
            <div className="scroll-indicator">
              <div className="scroll-line" />
              <div className="scroll-text">Read our story</div>
            </div>
          </div>
        </section>

        <div className="story">
          <article className="chapter">
            <div className="chapter-number">Chapter One</div>
            <h2 className="chapter-title">
              Born from love.<br />
              Built <em>together.</em>
            </h2>
            <p>
              Before there was an app, before there was a program, before there was anything — there was a young couple navigating one of the biggest moments of their lives with no one to show them the way.
            </p>
            <p>
              <strong>No village. No experienced hands nearby.</strong> Just the two of them — figuring out pregnancy, birth, and postpartum together, one day at a time.
            </p>
            <p>
              She went through every stage. He stayed in every stage with her. When her body felt unfamiliar after birth, when the recovery was harder than anyone warned her, when the questions had no easy answers — they searched together, learned together, and figured it out together.
            </p>
            <div className="pull-quote">
              <p>When the woman you love is going through something hard and you realise the world hasn't built the right support for her — you stop waiting for someone else to build it.</p>
            </div>
            <p>
              That is where Catalyst Mom began. <strong>Not in a boardroom. Not from a business idea.</strong> From a real experience, lived by two real people, who decided that no mama should have to figure out this journey alone.
            </p>
          </article>

          <div className="chapter-divider">
            <div className="divider-line" />
            <div className="divider-diamond" />
            <div className="divider-line" />
          </div>

          <article className="chapter">
            <div className="chapter-number">Chapter Two</div>
            <h2 className="chapter-title">
              A husband who refused<br />
              to <em>look away.</em>
            </h2>
            <p>
              When she was postpartum — navigating the core weakness, the emotional weight, the body she didn't recognise — he didn't step back. <strong>He leaned in.</strong>
            </p>
            <p>
              He started researching everything. Diastasis recti. Pelvic floor recovery. Prenatal fitness. Postnatal nutrition. Fertility wellness. He became obsessed with understanding what women's bodies actually go through — at every stage of motherhood. And she was honest with him about what the information got right, what it missed, and what a real mama actually needs.
            </p>
            <p>
              The more they learned, the more frustrated they became. Because the answers existed. The exercises existed. The solutions existed.
            </p>
            <div className="pull-quote">
              <p>Women weren't suffering because there was no answer. They were suffering because nobody had put it all in one place — for real moms, at every stage, without the overwhelm.</p>
            </div>
            <p>
              So they built it. Together. <strong>Not as fitness entrepreneurs. Not as tech founders.</strong> As two people who had lived it — and refused to let other women go through it without the support they deserved.
            </p>
          </article>

          <div className="chapter-divider">
            <div className="divider-line" />
            <div className="divider-diamond" />
            <div className="divider-line" />
          </div>

          <article className="chapter">
            <div className="chapter-number">Chapter Three</div>
            <h2 className="chapter-title">
              What we <em>actually</em> built.
            </h2>
            <p>
              Catalyst Mom is not a fitness app. It is not a postpartum recovery program. It is not a pregnancy guide.
            </p>
            <p>
              <strong>It is the thing that should have existed</strong> for every woman who ever went through motherhood without a roadmap.
            </p>
            <p>
              It covers all three stages of the maternal journey — Trying to Conceive, Pregnancy, and Postpartum — because a woman's body doesn't stop needing support just because she crossed from one chapter to the next.
            </p>
            <div className="stats-block">
              <div className="stat">
                <div className="stat-number">3</div>
                <div className="stat-label">Stages of motherhood covered</div>
              </div>
              <div className="stat">
                <div className="stat-number">10+</div>
                <div className="stat-label">Years of research &amp; experience</div>
              </div>
              <div className="stat">
                <div className="stat-number">1</div>
                <div className="stat-label">Place for every woman on this journey</div>
              </div>
            </div>
            <p>
              Every workout is designed for where she actually is — not where the internet assumes she should be. Every guide is built around the real challenges: diastasis recti, pelvic floor weakness, fertility, the postpartum core, the mental weight of matrescence.
            </p>
            <p>
              And it is led by women, for women. <strong>Because every Catalyst Mom is a woman who has been through it</strong> — and is now lighting the way for the one behind her.
            </p>
          </article>

          <div className="chapter-divider">
            <div className="divider-line" />
            <div className="divider-diamond" />
            <div className="divider-line" />
          </div>

          <article className="chapter">
            <div className="chapter-number">What we stand for</div>
            <h2 className="chapter-title">
              The beliefs this<br />
              brand was <em>built on.</em>
            </h2>
            <div className="values">
              <div className="value-item">
                <div className="value-icon">🌱</div>
                <div>
                  <div className="value-title">Every stage deserves a plan</div>
                  <div className="value-desc">TTC, pregnancy, and postpartum are seasons that deserve intentional preparation — not guesswork and Google searches at 2am.</div>
                </div>
              </div>
              <div className="value-item">
                <div className="value-icon">💪</div>
                <div>
                  <div className="value-title">Your body was built for this</div>
                  <div className="value-desc">It is not broken. It is not failing. It was never taught to heal the right way. That is what we are here to change.</div>
                </div>
              </div>
              <div className="value-item">
                <div className="value-icon">🤝</div>
                <div>
                  <div className="value-title">No woman should do this alone</div>
                  <div className="value-desc">The loneliness of postpartum. The anxiety of trying to conceive. The overwhelm of pregnancy. None of it has to be carried alone.</div>
                </div>
              </div>
              <div className="value-item">
                <div className="value-icon">✨</div>
                <div>
                  <div className="value-title">Transformation from the inside out</div>
                  <div className="value-desc">We are not here to help you snap back. We are here to help you rise forward — stronger, more connected, and fully yourself.</div>
                </div>
              </div>
            </div>
          </article>
        </div>

        <section className="cta-section">
          <div className="cta-bg" />
          <div className="cta-content">
            <div className="cta-eyebrow">You found us for a reason</div>
            <h2 className="cta-title">
              Every woman on this journey<br />
              <em>deserves this.</em>
            </h2>
            <p className="cta-body">
              Whether you are trying to conceive, navigating pregnancy, or finding your way back postpartum — there is a place for you here. A program built for where you actually are. A community that knows exactly how you feel.
            </p>
            <a href={user ? "/dashboard" : "/register"} onClick={handleStart} className="cta-btn">
              Start Your Journey
            </a>
            <Link to="/questionnaire" className="cta-btn-ghost">
              Take the Free Assessment
            </Link>
          </div>
        </section>

        <footer>
          <div className="footer-logo">Catalyst Mom</div>
          <div className="footer-text">Built from love. For every mama on the journey.</div>
          <div className="footer-text">catalystmomofficial.com</div>
        </footer>
      </div>
    </>
  );
};

export default About;
