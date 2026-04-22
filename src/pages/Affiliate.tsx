import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AffiliateSignupModal from "@/components/affiliate/AffiliateSignupModal";

export default function Affiliate() {
  const { user } = useAuth();
  const [affiliateStatus, setAffiliateStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [isLoading, setIsLoading] = useState(true);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  useEffect(() => {
    if (user) {
      checkAffiliateStatus();
    } else {
      setAffiliateStatus('none');
      setIsLoading(false);
    }
  }, [user]);

  const checkAffiliateStatus = async () => {
    if (!user) {
      setAffiliateStatus('none');
      setIsLoading(false);
      return;
    }
    try {
      const { data, error } = await (supabase as any)
        .rpc('get_affiliate_status', { user_id_param: user?.id });
      if (error) {
        setAffiliateStatus('none');
      } else if (data && data.length > 0) {
        setAffiliateStatus(data[0].status);
      } else {
        setAffiliateStatus('none');
      }
    } catch {
      setAffiliateStatus('none');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">Loading...</div>
        </div>
      </PageLayout>
    );
  }

  if (affiliateStatus === 'pending') {
    return (
      <PageLayout>
        <div className="container mx-auto py-16 max-w-2xl text-center">
          <h1 className="text-4xl font-bold mb-6">Application Under Review</h1>
          <div className="p-8 border rounded-lg bg-card">
            <Clock className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
            <p className="text-muted-foreground mb-6">
              We're reviewing your partner application. You'll receive an email within 48 hours with our decision.
            </p>
            <ul className="text-left space-y-2 max-w-sm mx-auto">
              <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /><span className="text-sm">Application submitted</span></li>
              <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-yellow-500" /><span className="text-sm">Under review</span></li>
              <li className="flex items-center gap-2"><div className="h-4 w-4 border-2 border-muted rounded-full" /><span className="text-sm text-muted-foreground">Email notification</span></li>
              <li className="flex items-center gap-2"><div className="h-4 w-4 border-2 border-muted rounded-full" /><span className="text-sm text-muted-foreground">Partner dashboard access</span></li>
            </ul>
          </div>
        </div>
      </PageLayout>
    );
  }

  const openApply = () => setIsSignupOpen(true);

  return (
    <PageLayout>
      <div className="affiliate-landing">
        <style>{`
          .affiliate-landing {
            --copper: #B5651D;
            --copper-dark: #8B4513;
            --copper-light: #C8782A;
            --peach: #F4C5A0;
            --peach-light: #FAE0CC;
            --cream: #FDF6EE;
            --cream-dark: #F5EBE0;
            --charcoal: #2C2218;
            --warm-gray: #8A7060;
            --dark-brown: #1A1008;
            font-family: 'Jost', system-ui, sans-serif;
            font-weight: 300;
            color: var(--charcoal);
            background: var(--cream);
          }
          .affiliate-landing .display { font-family: 'Playfair Display', Georgia, serif; }
          .affiliate-landing .hero { min-height: 80vh; background: var(--dark-brown); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; padding: 6rem 2rem 5rem; }
          .affiliate-landing .hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 20% 50%, rgba(181,101,29,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(244,197,160,0.08) 0%, transparent 50%); }
          .affiliate-landing .hero-inner { position: relative; z-index: 1; text-align: center; max-width: 800px; }
          .affiliate-landing .eyebrow { font-size: 0.65rem; letter-spacing: 0.35em; text-transform: uppercase; color: var(--copper); margin-bottom: 1.5rem; }
          .affiliate-landing .hero-title { font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 400; line-height: 1.15; color: white; margin-bottom: 1.8rem; }
          .affiliate-landing .hero-title em { font-style: italic; color: var(--peach); }
          .affiliate-landing .hero-sub { font-size: 1.05rem; color: rgba(244,197,160,0.75); line-height: 1.8; max-width: 580px; margin: 0 auto 2.5rem; }
          .affiliate-landing .ctas { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
          .affiliate-landing .btn-primary { background: var(--copper); color: white; padding: 1rem 2.5rem; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; border: 2px solid var(--copper); transition: all 0.3s ease; cursor: pointer; }
          .affiliate-landing .btn-primary:hover { background: transparent; color: var(--copper); }
          .affiliate-landing .btn-ghost { background: transparent; color: var(--peach); padding: 1rem 2.5rem; font-size: 0.8rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; border: 1px solid rgba(244,197,160,0.3); transition: all 0.3s ease; cursor: pointer; }
          .affiliate-landing .btn-ghost:hover { border-color: var(--peach); color: white; }
          .affiliate-landing section { padding: 5rem 2rem; }
          .affiliate-landing .container-x { max-width: 1100px; margin: 0 auto; }
          .affiliate-landing .section-eyebrow { font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--copper); margin-bottom: 1.2rem; display: flex; align-items: center; gap: 1rem; }
          .affiliate-landing .section-eyebrow::after { content: ''; flex: 1; height: 1px; background: linear-gradient(to right, rgba(181,101,29,0.4), transparent); max-width: 60px; }
          .affiliate-landing .section-title { font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 400; line-height: 1.2; margin-bottom: 1.2rem; color: var(--charcoal); }
          .affiliate-landing .section-title em { font-style: italic; color: var(--copper); }
          .affiliate-landing .section-body { font-size: 1rem; line-height: 1.85; color: var(--warm-gray); max-width: 580px; }
          .affiliate-landing .who-section { background: var(--cream-dark); }
          .affiliate-landing .who-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5px; background: rgba(181,101,29,0.12); border: 1px solid rgba(181,101,29,0.12); margin-top: 3rem; }
          .affiliate-landing .who-card { background: var(--cream); padding: 2.5rem 2rem; position: relative; transition: background 0.3s ease; }
          .affiliate-landing .who-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(to right, var(--copper), var(--peach)); transform: scaleX(0); transform-origin: left; transition: transform 0.4s ease; }
          .affiliate-landing .who-card:hover { background: white; }
          .affiliate-landing .who-card:hover::before { transform: scaleX(1); }
          .affiliate-landing .who-icon { font-size: 1.8rem; margin-bottom: 1rem; }
          .affiliate-landing .who-title { font-weight: 600; font-size: 1.2rem; color: var(--charcoal); margin-bottom: 0.6rem; }
          .affiliate-landing .who-desc { font-size: 0.9rem; color: var(--warm-gray); line-height: 1.7; }
          .affiliate-landing .tiers-section { background: var(--charcoal); color: white; }
          .affiliate-landing .tiers-section .section-title { color: white; }
          .affiliate-landing .tiers-section .section-body { color: rgba(244,197,160,0.7); }
          .affiliate-landing .bounty-grid-main { display: grid; grid-template-columns: 1.4fr 1fr; gap: 3rem; margin-top: 3rem; align-items: start; }
          .affiliate-landing .bounty-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(244,197,160,0.15); padding: 2.5rem; }
          .affiliate-landing .bounty-headline { font-size: 0.7rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--peach); margin-bottom: 0.8rem; }
          .affiliate-landing .bounty-amount { font-size: 4rem; color: white; font-weight: 700; line-height: 1; margin-bottom: 0.5rem; }
          .affiliate-landing .bounty-sub { color: rgba(244,197,160,0.7); margin-bottom: 1.5rem; }
          .affiliate-landing .bounty-desc { font-size: 0.9rem; color: rgba(244,197,160,0.65); line-height: 1.8; padding-bottom: 2rem; border-bottom: 1px solid rgba(244,197,160,0.12); margin-bottom: 2rem; }
          .affiliate-landing .bounty-rule { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
          .affiliate-landing .bounty-rule-num { width: 2rem; height: 2rem; border-radius: 50%; background: var(--copper); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.85rem; flex-shrink: 0; }
          .affiliate-landing .bounty-rule-title { font-weight: 600; color: white; margin-bottom: 0.3rem; font-size: 0.95rem; }
          .affiliate-landing .bounty-rule-desc { font-size: 0.85rem; color: rgba(244,197,160,0.65); line-height: 1.6; }
          .affiliate-landing .earn-stack { display: flex; flex-direction: column; gap: 1rem; }
          .affiliate-landing .earn-item { background: rgba(244,197,160,0.05); border-left: 3px solid var(--copper); padding: 1.5rem; }
          .affiliate-landing .earn-num { font-size: 2rem; color: var(--peach); font-weight: 700; line-height: 1; }
          .affiliate-landing .earn-text { font-size: 0.9rem; color: rgba(244,197,160,0.8); margin-top: 0.4rem; }
          .affiliate-landing .payout-note { text-align: center; margin-top: 2.5rem; font-size: 0.8rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(244,197,160,0.5); }
          .affiliate-landing .how-section { background: var(--cream); }
          .affiliate-landing .steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; margin-top: 3.5rem; position: relative; }
          .affiliate-landing .steps-grid::before { content: ''; position: absolute; top: 2rem; left: 12%; right: 12%; height: 1px; background: linear-gradient(to right, transparent, rgba(181,101,29,0.3), transparent); }
          .affiliate-landing .step { text-align: center; padding: 0 1rem; }
          .affiliate-landing .step-num { width: 4rem; height: 4rem; border-radius: 50%; background: var(--cream-dark); border: 2px solid rgba(181,101,29,0.2); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 1.3rem; color: var(--copper); font-weight: 700; position: relative; z-index: 1; transition: all 0.3s ease; }
          .affiliate-landing .step:hover .step-num { background: var(--copper); color: white; border-color: var(--copper); }
          .affiliate-landing .step-title { font-weight: 600; font-size: 0.95rem; color: var(--charcoal); margin-bottom: 0.5rem; }
          .affiliate-landing .step-desc { font-size: 0.82rem; color: var(--warm-gray); line-height: 1.65; }
          .affiliate-landing .why-section { background: var(--cream-dark); }
          .affiliate-landing .why-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; margin-top: 1rem; }
          .affiliate-landing .why-points { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 2rem; }
          .affiliate-landing .why-point { display: flex; gap: 1.2rem; align-items: flex-start; }
          .affiliate-landing .why-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--copper); flex-shrink: 0; margin-top: 0.5rem; }
          .affiliate-landing .why-point-text { font-size: 0.95rem; color: var(--charcoal); line-height: 1.7; }
          .affiliate-landing .why-point-text strong { color: var(--copper); font-weight: 600; }
          .affiliate-landing .why-stat-box { background: var(--charcoal); padding: 3rem; position: relative; overflow: hidden; }
          .affiliate-landing .why-stat-box::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: linear-gradient(to bottom, var(--copper), var(--peach)); }
          .affiliate-landing .stat-item { margin-bottom: 2rem; }
          .affiliate-landing .stat-item:last-child { margin-bottom: 0; }
          .affiliate-landing .stat-num { font-size: 2.6rem; font-weight: 700; color: var(--peach); line-height: 1; margin-bottom: 0.3rem; }
          .affiliate-landing .stat-label { font-size: 0.85rem; color: rgba(253,246,238,0.6); line-height: 1.5; }
          .affiliate-landing .testimonial-section { background: var(--copper); padding: 5rem 2rem; text-align: center; }
          .affiliate-landing .testimonial-quote { font-size: clamp(1.3rem, 3vw, 1.9rem); font-style: italic; color: white; max-width: 700px; margin: 0 auto 1.5rem; line-height: 1.5; }
          .affiliate-landing .testimonial-attr { font-size: 0.8rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.7); }
          .affiliate-landing .faq-section { background: var(--cream); }
          .affiliate-landing .faq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 3rem; }
          .affiliate-landing .faq-item { padding: 2rem; border: 1px solid rgba(181,101,29,0.15); background: white; }
          .affiliate-landing .faq-q { font-weight: 600; font-size: 0.95rem; color: var(--charcoal); margin-bottom: 0.8rem; line-height: 1.4; }
          .affiliate-landing .faq-a { font-size: 0.88rem; color: var(--warm-gray); line-height: 1.7; }
          .affiliate-landing .cta-section { background: var(--dark-brown); padding: 6rem 2rem; text-align: center; position: relative; overflow: hidden; }
          .affiliate-landing .cta-section::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(181,101,29,0.2) 0%, transparent 70%); }
          .affiliate-landing .cta-inner { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; }
          .affiliate-landing .cta-title { font-size: clamp(1.8rem, 5vw, 3rem); font-weight: 400; color: white; line-height: 1.2; margin-bottom: 1.2rem; }
          .affiliate-landing .cta-title em { font-style: italic; color: var(--peach); }
          .affiliate-landing .cta-body { font-size: 1rem; color: rgba(244,197,160,0.7); line-height: 1.8; margin-bottom: 2.5rem; }
          @media (max-width: 768px) {
            .affiliate-landing .who-grid { grid-template-columns: 1fr; }
            .affiliate-landing .bounty-grid-main { grid-template-columns: 1fr; gap: 2rem; }
            .affiliate-landing .steps-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
            .affiliate-landing .steps-grid::before { display: none; }
            .affiliate-landing .why-layout { grid-template-columns: 1fr; gap: 3rem; }
            .affiliate-landing .faq-grid { grid-template-columns: 1fr; }
          }
        `}</style>

        {/* Hero */}
        <section className="hero">
          <div className="hero-inner">
            <div className="eyebrow">Partner Program — Catalyst Mom</div>
            <h1 className="display hero-title">Help a Mama Heal.<br/><em>Earn While You Do It.</em></h1>
            <p className="hero-sub">Catalyst Mom was built because no woman should have to navigate motherhood alone. If you believe that too — this partnership was made for you.</p>
            <div className="ctas">
              <button className="btn-primary" onClick={openApply}>Apply to Partner</button>
              <a className="btn-ghost" href="#how">See How It Works</a>
            </div>
            {affiliateStatus === 'rejected' && (
              <div className="mt-8 max-w-md mx-auto p-4 bg-red-50/10 border border-red-300/30 rounded-lg text-left">
                <div className="flex items-center gap-2 text-red-200">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">Previous application not approved</span>
                </div>
                <p className="text-sm text-red-100/80 mt-1">You can apply again with updated information.</p>
              </div>
            )}
          </div>
        </section>

        {/* Who */}
        <section className="who-section">
          <div className="container-x">
            <div className="section-eyebrow">Who This Is For</div>
            <h2 className="display section-title">Built for people who <em>already care about moms.</em></h2>
            <p className="section-body">You do not need to be a fitness expert or a big creator. You just need to genuinely care about the women in your community and want to point them toward something that actually works.</p>
            <div className="who-grid">
              <div className="who-card">
                <div className="who-icon">🤱</div>
                <h3 className="display who-title">Active Members</h3>
                <p className="who-desc">You have used the app. You know what it did for you. Share your referral link with friends and help another mama feel like herself again.</p>
              </div>
              <div className="who-card">
                <div className="who-icon">🩺</div>
                <h3 className="display who-title">Wellness Professionals</h3>
                <p className="who-desc">OBGYNs, midwives, doulas, and pelvic floor physios who want to give their clients a trusted, holistic daily support tool they will actually use.</p>
              </div>
              <div className="who-card">
                <div className="who-icon">📱</div>
                <h3 className="display who-title">Creators & Advocates</h3>
                <p className="who-desc">Mom bloggers and content creators who want to partner with a brand that has a real story, real results, and a community that is genuinely growing.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tiers / Bounty */}
        <section className="tiers-section">
          <div className="container-x">
            <div className="section-eyebrow">Give a Month, Get a Month</div>
            <h2 className="display section-title">One number.<br/><em>$29. Period.</em></h2>
            <p className="section-body">We do not do complex tiers or small percentages. We would rather pay you than pay for Big Tech ads. We believe our community is our greatest catalyst.</p>

            <div className="bounty-grid-main">
              <div className="bounty-card">
                <div className="bounty-headline">The Referral Bounty</div>
                <div className="display bounty-amount">$29</div>
                <div className="bounty-sub">for every mama who joins.</div>
                <p className="bounty-desc">When you refer a friend and they stay for their second month — we send the full value of a monthly subscription back to you. No caps. No limits.</p>

                <div className="bounty-rule">
                  <div className="bounty-rule-num">1</div>
                  <div>
                    <div className="bounty-rule-title">The 2nd Month Lock</div>
                    <div className="bounty-rule-desc">Reward triggers after your referral's second payment clears. This ensures we are growing with real, committed mamas.</div>
                  </div>
                </div>
                <div className="bounty-rule">
                  <div className="bounty-rule-num">2</div>
                  <div>
                    <div className="bounty-rule-title">The 7-Day Buffer</div>
                    <div className="bounty-rule-desc">Payouts process 7 days after the second payment to protect against chargebacks and keep our community secure.</div>
                  </div>
                </div>
                <div className="bounty-rule">
                  <div className="bounty-rule-num">3</div>
                  <div>
                    <div className="bounty-rule-title">Active Status Required</div>
                    <div className="bounty-rule-desc">You must have an active Catalyst Mom subscription to receive payouts. Real mamas growing a real community.</div>
                  </div>
                </div>
              </div>

              <div className="earn-stack">
                <div className="earn-item">
                  <div className="display earn-num">$29</div>
                  <div className="earn-text">Refer 1 friend. Earn $29.</div>
                </div>
                <div className="earn-item">
                  <div className="display earn-num">$290</div>
                  <div className="earn-text">Refer 10 friends. Earn $290.</div>
                </div>
                <div className="earn-item">
                  <div className="display earn-num">∞</div>
                  <div className="earn-text">No cap on your side hustle.</div>
                </div>
              </div>
            </div>
            <div className="payout-note">Paid via PayPal or Direct Bank Transfer.</div>
          </div>
        </section>

        {/* How */}
        <section className="how-section" id="how">
          <div className="container-x">
            <div className="section-eyebrow">The Process</div>
            <h2 className="display section-title">Four steps.<br/><em>That is it.</em></h2>
            <div className="steps-grid">
              {[
                { n: 1, t: 'Apply', d: 'Fill out the short form. We review applications and approve members quickly.' },
                { n: 2, t: 'Get Your Link', d: 'Access your dashboard to find your unique link and social media assets.' },
                { n: 3, t: 'Share Authentically', d: 'Share with your friends or community. In your own voice. Using your own real story.' },
                { n: 4, t: 'Get Paid', d: 'Once a referral hits their second month, the $29 is yours. Track it all in real-time.' },
              ].map(s => (
                <div className="step" key={s.n}>
                  <div className="display step-num">{s.n}</div>
                  <div className="step-title">{s.t}</div>
                  <div className="step-desc">{s.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why */}
        <section className="why-section">
          <div className="container-x">
            <div className="why-layout">
              <div>
                <div className="section-eyebrow">The Difference</div>
                <h2 className="display section-title">You are not promoting <em>just another product.</em></h2>
                <p className="section-body">You are pointing a mama toward the support she has been looking for. That is why this works — because it is real.</p>
                <div className="why-points">
                  <div className="why-point"><div className="why-dot" /><div className="why-point-text"><strong>All-In-One Support</strong> — TTC, Pregnancy, and Postpartum in one place. No jumping between apps.</div></div>
                  <div className="why-point"><div className="why-dot" /><div className="why-point-text"><strong>Personal Origin Story</strong> — Built from real struggles and real healing, not by a corporate board.</div></div>
                  <div className="why-point"><div className="why-dot" /><div className="why-point-text"><strong>Physical & Emotional</strong> — We cover fitness and nutrition, but also the mental load of motherhood.</div></div>
                  <div className="why-point"><div className="why-dot" /><div className="why-point-text"><strong>Growing Momentum</strong> — Over 12 million monthly views across social media. You are joining a movement.</div></div>
                </div>
              </div>
              <div className="why-stat-box">
                <div className="stat-item"><div className="display stat-num">12M+</div><div className="stat-label">Monthly views — the world is looking for this support</div></div>
                <div className="stat-item"><div className="display stat-num">100%</div><div className="stat-label">Bounty payout — we give the first month's revenue back to you</div></div>
                <div className="stat-item"><div className="display stat-num">$29</div><div className="stat-label">Accessible monthly pricing that makes it an easy yes for any mama</div></div>
                <div className="stat-item"><div className="display stat-num">48h</div><div className="stat-label">Application review time — get started almost immediately</div></div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="testimonial-section">
          <p className="display testimonial-quote">"I couldn't sneeze without leaking and my core felt like it was gone. Three weeks into this program, I feel like myself again. I cried during my check-in. Do not sleep on this."</p>
          <div className="testimonial-attr">Catalyst Mom Community Member</div>
        </section>

        {/* FAQ */}
        <section className="faq-section">
          <div className="container-x">
            <div className="section-eyebrow">Common Questions</div>
            <h2 className="display section-title">Everything you need <em>to know.</em></h2>
            <div className="faq-grid">
              {[
                ['Do I have to be a member to refer friends?', 'Yes. To earn the $29 bounty, you must be an active subscriber yourself. This ensures our community is built by people who actually use and believe in the platform.'],
                ['Why do I have to wait until their 2nd month?', 'This protects the community from abuse and ensures you are being rewarded for bringing in mamas who truly want to be here. Once their 2nd payment clears, you get paid.'],
                ['Is there a limit to how much I can earn?', 'No. If you refer 1 person, you earn $29. If you refer 100 people, you earn $2,900. Your impact has no ceiling.'],
                ['How do I receive my payments?', 'Payments are processed via PayPal or Direct Bank Transfer. You can set your preference inside your Partner Dashboard.'],
                ['What if my referral cancels in the first month?', 'Since the bounty is based on long-term community growth, we only pay out for members who stay for at least two months. If they cancel in month 1, no bounty is triggered.'],
                ['Do you provide images and videos for me to use?', 'Yes. Upon approval you will get a welcome kit with high-quality graphics, Reel ideas, and talking points to make sharing easy and authentic.'],
              ].map(([q, a]) => (
                <div className="faq-item" key={q}>
                  <div className="faq-q">{q}</div>
                  <div className="faq-a">{a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="cta-inner">
            <div className="eyebrow">Ready to Partner?</div>
            <h2 className="display cta-title">Every mama you refer <em>is one less woman doing this alone.</em></h2>
            <p className="cta-body">Help us heal the world, one mama at a time. Apply below and we will be in touch within 48 hours.</p>
            <div className="ctas">
              <button className="btn-primary" onClick={openApply}>Apply to Partner</button>
            </div>
          </div>
        </section>
      </div>

      <AffiliateSignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </PageLayout>
  );
}
