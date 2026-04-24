import { useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';

const HTML = `
<style>
  .pp-scope { --copper: #B5651D; --copper-dark: #8B4513; --peach: #F4C5A0; --peach-light: #FAE0CC; --cream: #FDF6EE; --cream-dark: #F5EBE0; --charcoal: #2C2218; --warm-gray: #8A7060; --dark-brown: #1A1008; background: var(--cream); color: var(--charcoal); font-family: 'Jost', sans-serif; font-weight: 300; line-height: 1.8; }
  .pp-scope * { box-sizing: border-box; }
  .pp-scope .policy-hero { background: var(--dark-brown); padding: 4rem 2rem 3rem; text-align: center; position: relative; overflow: hidden; }
  .pp-scope .policy-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(181,101,29,0.15) 0%, transparent 70%); }
  .pp-scope .policy-hero-inner { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; }
  .pp-scope .policy-eyebrow { font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--copper); margin-bottom: 1rem; font-weight: 500; }
  .pp-scope .policy-title { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 5vw, 3rem); font-weight: 400; color: white; margin-bottom: 1rem; }
  .pp-scope .policy-title em { font-style: italic; color: var(--peach); }
  .pp-scope .policy-dates { font-size: 0.85rem; color: var(--warm-gray); }
  .pp-scope .policy-content { max-width: 780px; margin: 0 auto; padding: 4rem 2rem 6rem; }
  .pp-scope .policy-intro { background: var(--cream-dark); border-left: 4px solid var(--copper); padding: 2rem 2.5rem; margin-bottom: 3rem; font-size: 1rem; color: var(--charcoal); line-height: 1.85; }
  .pp-scope .policy-intro p { margin-bottom: 0.8rem; }
  .pp-scope .policy-intro p:last-child { margin-bottom: 0; }
  .pp-scope .policy-section { margin-bottom: 3rem; padding-bottom: 3rem; border-bottom: 1px solid rgba(181,101,29,0.1); }
  .pp-scope .policy-section:last-of-type { border-bottom: none; }
  .pp-scope .section-heading { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700; color: var(--copper); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.8rem; }
  .pp-scope .section-heading::after { content: ''; flex: 1; height: 1px; background: linear-gradient(to right, rgba(181,101,29,0.3), transparent); }
  .pp-scope .sub-heading { font-size: 1rem; font-weight: 600; color: var(--charcoal); margin: 1.5rem 0 0.6rem; }
  .pp-scope .policy-section p { font-size: 0.95rem; color: var(--charcoal); line-height: 1.85; margin-bottom: 0.8rem; }
  .pp-scope .policy-section p strong { font-weight: 600; color: var(--charcoal); }
  .pp-scope .policy-list { list-style: none; margin: 0.8rem 0 1rem; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
  .pp-scope .policy-list li { font-size: 0.92rem; color: var(--charcoal); display: flex; align-items: flex-start; gap: 0.8rem; line-height: 1.7; }
  .pp-scope .policy-list li::before { content: '—'; color: var(--copper); font-weight: 700; flex-shrink: 0; margin-top: 0.05rem; }
  .pp-scope .highlight-box { background: rgba(181,101,29,0.06); border: 1px solid rgba(181,101,29,0.2); padding: 1.5rem 2rem; margin: 1rem 0; }
  .pp-scope .highlight-box p { font-size: 0.92rem !important; color: var(--warm-gray) !important; margin: 0 !important; line-height: 1.7; }
  .pp-scope .contact-box { background: var(--charcoal); padding: 2.5rem; margin-top: 1.5rem; position: relative; overflow: hidden; }
  .pp-scope .contact-box::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: linear-gradient(to bottom, var(--copper), var(--peach)); }
  .pp-scope .contact-box p { color: rgba(253,246,238,0.8) !important; font-size: 0.9rem !important; margin-bottom: 0.4rem !important; }
  .pp-scope .contact-box strong { color: var(--peach) !important; }
  .pp-scope .contact-box a { color: var(--copper); text-decoration: none; }
  .pp-scope .contact-box a:hover { color: var(--peach); text-decoration: underline; }
  @media (max-width: 640px) {
    .pp-scope .policy-content { padding: 3rem 1.5rem 4rem; }
    .pp-scope .policy-intro { padding: 1.5rem; }
    .pp-scope .highlight-box { padding: 1.2rem 1.5rem; }
  }
</style>
<div class="pp-scope">
  <section class="policy-hero">
    <div class="policy-hero-inner">
      <div class="policy-eyebrow">Legal</div>
      <h1 class="policy-title">Terms of <em>Service</em></h1>
      <div class="policy-dates">Effective Date: April 22, 2026  ·  Last Updated: April 22, 2026</div>
    </div>
  </section>

  <div class="policy-content">
    <div class="policy-intro">
      <p>Please read these Terms of Service carefully before using the Catalyst Mom platform. By accessing or using our app, website, or assessment tool, you agree to be bound by these terms. If you do not agree, please do not use our services.</p>
    </div>

    <section class="policy-section">
      <h2 class="section-heading">1. About Catalyst Mom</h2>
      <p>Catalyst Mom is a maternal wellness platform designed to support women through every stage of motherhood — Trying to Conceive (TTC), Pregnancy, and Postpartum recovery. We provide fitness programs, nutrition guidance, wellness tools, community support, and coaching services.</p>
      <ul class="policy-list">
        <li><span><strong>App:</strong> catalystmomofficial.com</span></li>
        <li><span><strong>Assessment:</strong> catalystmom.online</span></li>
        <li><span><strong>Contact:</strong> admin@catalystmom.online</span></li>
      </ul>
    </section>

    <section class="policy-section">
      <h2 class="section-heading">2. Eligibility</h2>
      <p>To use Catalyst Mom you must:</p>
      <ul class="policy-list">
        <li>Be at least 18 years of age</li>
        <li>Be a human individual — not a company, bot, or automated service</li>
        <li>Provide accurate and truthful information when creating your account</li>
        <li>Have the legal capacity to enter into a binding agreement</li>
      </ul>
      <p>By using the Platform you represent and warrant that you meet all of these requirements.</p>
    </section>

    <section class="policy-section">
      <h2 class="section-heading">3. Your Account</h2>
      <p>When you create an account with Catalyst Mom you are responsible for:</p>
      <ul class="policy-list">
        <li>Keeping your login credentials secure and confidential</li>
        <li>All activity that occurs under your account</li>
        <li>Notifying us immediately of any unauthorised access or security breach</li>
        <li>Ensuring your account information is accurate and up to date</li>
      </ul>
      <p>We reserve the right to suspend or terminate accounts that violate these terms or that we believe have been compromised.</p>
    </section>

    <section class="policy-section">
      <h2 class="section-heading">4. Subscriptions and Payments</h2>
      <h3 class="sub-heading">4.1 Subscription Plans</h3>
      <p>Catalyst Mom offers monthly and annual subscription plans. By subscribing you agree to pay the applicable fees as displayed at the time of purchase.</p>
      <h3 class="sub-heading">4.2 Billing</h3>
      <p>Subscriptions are billed automatically at the start of each billing period. All payments are processed securely through Stripe. We do not store your payment card details.</p>
      <h3 class="sub-heading">4.3 Cancellation</h3>
      <p>You may cancel your subscription at any time through your account settings or by contacting us at admin@catalystmom.online. Cancellation takes effect at the end of your current billing period. You will retain access to the platform until that date.</p>
      <h3 class="sub-heading">4.4 Refunds</h3>
      <p>We offer a 30-day money-back guarantee on all new subscriptions. If you are not satisfied within the first 30 days, contact us at admin@catalystmom.online and we will issue a full refund — no questions asked. After 30 days, payments are non-refundable except where required by law.</p>
      <h3 class="sub-heading">4.5 Price Changes</h3>
      <p>We reserve the right to change subscription pricing with reasonable notice. We will notify you at least 30 days before any price change takes effect on your account.</p>
    </section>

    <section class="policy-section">
      <h2 class="section-heading">5. Medical Disclaimer</h2>
      <div class="highlight-box">
        <p>Catalyst Mom provides wellness information for educational purposes only and is not a substitute for professional medical advice. Our programs, guides, and coaching services are not medical treatment. Always consult a qualified healthcare provider before beginning any new exercise or nutrition program — especially during pregnancy, postpartum recovery, or while trying to conceive.</p>
      </div>
      <p>By using Catalyst Mom you acknowledge that you are solely responsible for your health decisions and that Catalyst Mom is not liable for any health outcomes arising from your use of the platform.</p>
    </section>

    <section class="policy-section">
      <h2 class="section-heading">6. Platform Content and Programs</h2>
      <p>All content on the Catalyst Mom platform — including workout programs, meal plans, guides, assessments, and educational materials — is created and owned by Catalyst Mom unless otherwise stated.</p>
      <p>You may access and use this content for your personal, non-commercial use only. You may not:</p>
      <ul class="policy-list">
        <li>Copy, reproduce, or distribute our content without written permission</li>
        <li>Resell or sublicense access to the platform or its content</li>
        <li>Use our content to create competing products or services</li>
        <li>Remove any copyright, trademark, or proprietary notices from our content</li>
      </ul>
    </section>

    <section class="policy-section">
      <h2 class="section-heading">7. Community Guidelines</h2>
      <p>Catalyst Mom includes a community space where members can connect, share, and support each other. By participating in the community you agree to:</p>
      <ul class="policy-list">
        <li>Be respectful and kind to all community members at all times</li>
        <li>Not share medical advice or diagnose other members</li>
        <li>Not post spam, promotional content, or advertising without permission</li>
        <li>Not share offensive, harmful, or discriminatory content</li>
        <li>Not share another member's personal information without their consent</li>
        <li>Not impersonate Catalyst Mom staff, coaches, or other members</li>
      </ul>
      <p>We reserve the right to remove content and suspend or ban members who violate these guidelines without notice or refund.</p>
    </section>

    <section class="policy-section">
      <h2 class="section-heading">8. Coaching Services</h2>
      <p>Catalyst Mom includes access to human coach check-ins and AI-powered wellness support as part of eligible subscription plans.</p>
      <h3 class="sub-heading">8.1 Human Coach Check-ins</h3>
      <p>Bi-weekly progress reviews are provided by wellness professionals aligned with Catalyst Mom. These check-ins are for motivational and accountability purposes and do not constitute medical advice or clinical treatment.</p>
      <h3 class="sub-heading">8.2 Catalyst AI</h3>
      <p>Our AI-powered wellness assistant provides general information and guidance based on the Catalyst Mom knowledge base. Catalyst AI responses are not a substitute for professional medical advice. Always consult your healthcare provider for medical concerns.</p>
    </section>

    <section class="policy-section">
      <h2 class="section-heading">9. Affiliate and Partner Program</h2>
      <p>Catalyst Mom operates a referral and affiliate program. By participating you agree to:</p>
      <ul class="policy-list">
        <li>Only promote Catalyst Mom honestly and accurately</li>
        <li>Not make false or misleading claims about the platform or its results</li>
        <li>Comply with all applicable advertising disclosure requirements</li>
        <li>Not engage in spam or unsolicited promotion</li>
      </ul>
      <p>Catalyst Mom reserves the right to terminate affiliate agreements and withhold unpaid commissions if these terms are violated.</p>
    </section>

    <section class="policy-section">
      <h2 class="section-heading">10. Intellectual Property</h2>
      <p>All content, branding, trademarks, logos, and intellectual property on the Catalyst Mom platform are owned by or licensed to Catalyst Mom. Nothing in these terms grants you any right to use our intellectual property without our prior written permission.</p>
      <p>If you believe any content on our platform infringes your intellectual property rights, please contact us at admin@catalystmom.online.</p>
    </section>

    <section class="policy-section">
      <h2 class="section-heading">11. Limitation of Liability</h2>
      <p>To the fullest extent permitted by law, Catalyst Mom shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform — including but not limited to health outcomes, loss of data, or interruption of service.</p>
      <p>Our total liability to you for any claim arising from your use of the platform shall not exceed the amount you paid to us in the 3 months preceding the claim.</p>
    </section>

    <section class="policy-section">
      <h2 class="section-heading">12. Indemnification</h2>
      <p>You agree to indemnify and hold Catalyst Mom, its founders, team members, coaches, and partners harmless from any claims, damages, losses, or expenses — including legal fees — arising from your use of the platform, your violation of these terms, or your violation of any third party rights.</p>
    </section>

    <section class="policy-section">
      <h2 class="section-heading">13. Termination</h2>
      <p>We reserve the right to suspend or terminate your access to the platform at any time and for any reason — including violation of these terms — with or without notice.</p>
      <p>If we terminate your account due to a violation of these terms, you will not be entitled to a refund of any subscription fees paid.</p>
      <p>You may terminate your account at any time by contacting us at admin@catalystmom.online.</p>
    </section>

    <section class="policy-section">
      <h2 class="section-heading">14. Changes to These Terms</h2>
      <p>We may update these Terms of Service from time to time. When we make significant changes, we will notify you by email or through a notice on the platform at least 14 days before the changes take effect.</p>
      <p>Your continued use of the platform after changes take effect constitutes your acceptance of the updated terms.</p>
    </section>

    <section class="policy-section">
      <h2 class="section-heading">15. Governing Law</h2>
      <p>These Terms of Service are governed by and construed in accordance with applicable law. Any disputes arising from these terms or your use of the platform shall be resolved through good faith negotiation first. If resolution cannot be reached, disputes shall be submitted to binding arbitration.</p>
    </section>

    <section class="policy-section">
      <h2 class="section-heading">16. Contact Us</h2>
      <p>If you have any questions about these Terms of Service please contact us:</p>
      <div class="contact-box">
        <p><strong>Catalyst Mom</strong></p>
        <p>Email: <a href="mailto:admin@catalystmom.online">admin@catalystmom.online</a></p>
        <p>App: <a href="https://catalystmomofficial.com">catalystmomofficial.com</a></p>
        <p>Assessment: <a href="https://catalystmom.online">catalystmom.online</a></p>
        <p style="margin-top:1rem;">We are committed to being fair, transparent, and responsive to any concerns you have.</p>
      </div>
    </section>
  </div>
</div>
`;

const TermsOfService = () => {
  useEffect(() => {
    const id = 'pp-fonts-link';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Jost:wght@300;400;500&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <PageLayout withPadding={false}>
      <div dangerouslySetInnerHTML={{ __html: HTML }} />
    </PageLayout>
  );
};

export default TermsOfService;
