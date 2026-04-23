import PageLayout from '@/components/layout/PageLayout';

const COPPER = '#B5651D';
const PEACH = '#F4C5A0';
const CREAM = '#FDF6EE';
const CREAM_DARK = '#F5EBE0';
const CHARCOAL = '#2C2218';
const WARM_GRAY = '#8A7060';
const DARK_BROWN = '#1A1008';

const styles = `
  .pp-root { background: ${CREAM}; color: ${CHARCOAL}; font-family: 'Jost', sans-serif; font-weight: 300; line-height: 1.8; }
  .pp-hero { background: ${DARK_BROWN}; padding: 4rem 2rem 3rem; text-align: center; position: relative; overflow: hidden; }
  .pp-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(181,101,29,0.15) 0%, transparent 70%); }
  .pp-hero-inner { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; }
  .pp-eyebrow { font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: ${COPPER}; margin-bottom: 1rem; font-weight: 500; }
  .pp-title { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 5vw, 3rem); font-weight: 400; color: white; margin-bottom: 1rem; }
  .pp-title em { font-style: italic; color: ${PEACH}; }
  .pp-dates { font-size: 0.85rem; color: ${WARM_GRAY}; }
  .pp-content { max-width: 780px; margin: 0 auto; padding: 4rem 2rem 6rem; }
  .pp-intro { background: ${CREAM_DARK}; border-left: 4px solid ${COPPER}; padding: 2rem 2.5rem; margin-bottom: 3rem; font-size: 1rem; color: ${CHARCOAL}; line-height: 1.85; }
  .pp-intro p { margin-bottom: 0.8rem; }
  .pp-intro p:last-child { margin-bottom: 0; }
  .pp-section { margin-bottom: 3rem; padding-bottom: 3rem; border-bottom: 1px solid rgba(181,101,29,0.1); }
  .pp-section:last-of-type { border-bottom: none; }
  .pp-section-heading { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700; color: ${COPPER}; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.8rem; }
  .pp-section-heading::after { content: ''; flex: 1; height: 1px; background: linear-gradient(to right, rgba(181,101,29,0.3), transparent); }
  .pp-sub-heading { font-size: 1rem; font-weight: 600; color: ${CHARCOAL}; margin: 1.5rem 0 0.6rem; }
  .pp-section p { font-size: 0.95rem; color: ${CHARCOAL}; line-height: 1.85; margin-bottom: 0.8rem; }
  .pp-section strong { font-weight: 600; color: ${CHARCOAL}; }
  .pp-list { list-style: none; margin: 0.8rem 0 1rem; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
  .pp-list li { font-size: 0.92rem; color: ${CHARCOAL}; display: flex; align-items: flex-start; gap: 0.8rem; line-height: 1.7; }
  .pp-list li::before { content: '—'; color: ${COPPER}; font-weight: 700; flex-shrink: 0; margin-top: 0.05rem; }
  .pp-contact-box { background: ${CHARCOAL}; padding: 2.5rem; margin-top: 1.5rem; position: relative; overflow: hidden; }
  .pp-contact-box::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: linear-gradient(to bottom, ${COPPER}, ${PEACH}); }
  .pp-contact-box p { color: rgba(253,246,238,0.8); font-size: 0.9rem; margin-bottom: 0.4rem; }
  .pp-contact-box strong { color: ${PEACH}; }
  .pp-contact-box a { color: ${COPPER}; text-decoration: none; }
  .pp-contact-box a:hover { color: ${PEACH}; text-decoration: underline; }
  @media (max-width: 640px) {
    .pp-content { padding: 3rem 1.5rem 4rem; }
    .pp-intro { padding: 1.5rem; }
  }
`;

const PrivacyPolicy = () => {
  return (
    <PageLayout withPadding={false}>
      <style>{styles}</style>
      <div className="pp-root">
        <section className="pp-hero">
          <div className="pp-hero-inner">
            <div className="pp-eyebrow">Legal</div>
            <h1 className="pp-title">Privacy <em>Policy</em></h1>
            <div className="pp-dates">Effective Date: April 22, 2026 · Last Updated: April 22, 2026</div>
          </div>
        </section>

        <div className="pp-content">
          <div className="pp-intro">
            <p>Welcome to Catalyst Mom. We are committed to protecting your privacy and handling your personal information with care, transparency, and respect. This Privacy Policy explains how we collect, use, store, and protect your information when you use the Catalyst Mom app and assessment website (collectively, the "Platform").</p>
            <p>By using our Platform, you agree to the terms of this Privacy Policy. If you do not agree, please do not use our services.</p>
          </div>

          <section className="pp-section">
            <h2 className="pp-section-heading">1. Who We Are</h2>
            <p>Catalyst Mom is a maternal wellness platform designed to support women through every stage of motherhood — Trying to Conceive (TTC), Pregnancy, and Postpartum recovery.</p>
            <ul className="pp-list">
              <li><span><strong>App:</strong> catalystmomofficial.com</span></li>
              <li><span><strong>Assessment:</strong> catalystmom.online</span></li>
              <li><span><strong>Contact:</strong> admin@catalystmom.online</span></li>
            </ul>
          </section>

          <section className="pp-section">
            <h2 className="pp-section-heading">2. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <h3 className="pp-sub-heading">2.1 Information You Provide Directly</h3>
            <ul className="pp-list">
              <li>Name and email address when you create an account or complete the assessment</li>
              <li>Motherhood stage selection (TTC, Pregnancy, or Postpartum)</li>
              <li>Health and wellness information you voluntarily enter (mood, sleep, symptoms, measurements)</li>
              <li>Payment information processed securely through Stripe — we do not store card details</li>
              <li>Messages and content posted in community groups</li>
              <li>Responses to assessments and questionnaires</li>
              <li>Communications with our support team</li>
            </ul>
            <h3 className="pp-sub-heading">2.2 Information Collected Automatically</h3>
            <ul className="pp-list">
              <li>Device type, browser, and operating system</li>
              <li>IP address and approximate location</li>
              <li>Pages visited, features used, and time spent on the Platform</li>
              <li>Push notification preferences and interaction data</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
            <h3 className="pp-sub-heading">2.3 Information from Third Parties</h3>
            <ul className="pp-list">
              <li>If you sign in with Google, we receive your name and email address from Google</li>
              <li>Payment status and transaction confirmation from Stripe</li>
              <li>Email engagement data from Omnisend and Resend</li>
            </ul>
          </section>

          <section className="pp-section">
            <h2 className="pp-section-heading">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="pp-list">
              <li>Create and manage your account</li>
              <li>Personalise your experience based on your motherhood stage</li>
              <li>Deliver workout programs, meal plans, wellness content, and expert resources</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send you push notifications, reminders, and program updates (with your consent)</li>
              <li>Send transactional and marketing emails (you can unsubscribe at any time)</li>
              <li>Improve our Platform through analytics and user feedback</li>
              <li>Respond to your questions and support requests</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="pp-section">
            <h2 className="pp-section-heading">4. Sensitive Health Information</h2>
            <p>Catalyst Mom is a wellness platform. Some information you share with us — such as postpartum symptoms, cycle data, pregnancy details, and physical measurements — is sensitive in nature.</p>
            <p>We treat all health-related information with the highest level of care. We do not sell this information. We do not share it with third parties for advertising purposes. We use it solely to personalise your experience on the Platform.</p>
            <p>Catalyst Mom provides wellness information for educational purposes only and is not a substitute for professional medical advice.</p>
          </section>

          <section className="pp-section">
            <h2 className="pp-section-heading">5. How We Share Your Information</h2>
            <p>We do not sell your personal data. We may share your information only in the following circumstances:</p>
            <h3 className="pp-sub-heading">5.1 Service Providers</h3>
            <p>We work with trusted third-party providers who help us operate the Platform:</p>
            <ul className="pp-list">
              <li><span><strong>Supabase</strong> — database, authentication, and backend infrastructure</span></li>
              <li><span><strong>Stripe</strong> — payment processing</span></li>
              <li><span><strong>Omnisend / Resend</strong> — email communication</span></li>
              <li><span><strong>Firebase</strong> — push notifications</span></li>
            </ul>
            <p>All service providers are contractually required to protect your data and use it only for the purposes we specify.</p>
            <h3 className="pp-sub-heading">5.2 Community Content</h3>
            <p>Content you post in community groups is visible to other members of that group. Please do not share sensitive personal information in public community spaces.</p>
            <h3 className="pp-sub-heading">5.3 Legal Requirements</h3>
            <p>We may disclose your information if required by law, court order, or to protect the rights and safety of our users or the public.</p>
          </section>

          <section className="pp-section">
            <h2 className="pp-section-heading">6. Cookies and Tracking</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul className="pp-list">
              <li>Keep you logged in to your account</li>
              <li>Remember your preferences</li>
              <li>Analyse how the Platform is used</li>
              <li>Improve performance and user experience</li>
            </ul>
            <p>You can control cookie settings through your browser. Note that disabling cookies may affect some features of the Platform.</p>
          </section>

          <section className="pp-section">
            <h2 className="pp-section-heading">7. Push Notifications</h2>
            <p>If you install the Catalyst Mom app on your device and grant permission, we may send you push notifications including workout reminders, program updates, community alerts, and wellness check-ins.</p>
            <p>You can turn off push notifications at any time through your device settings or within the app.</p>
          </section>

          <section className="pp-section">
            <h2 className="pp-section-heading">8. Data Retention</h2>
            <p>We retain your personal information for as long as your account is active or as needed to provide our services. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it by law.</p>
            <p>Anonymous and aggregated data that cannot identify you may be retained indefinitely for analytics purposes.</p>
          </section>

          <section className="pp-section">
            <h2 className="pp-section-heading">9. Data Security</h2>
            <p>We take the security of your data seriously. We implement industry-standard measures including:</p>
            <ul className="pp-list">
              <li>Encrypted data transmission (HTTPS/TLS)</li>
              <li>Secure authentication through Supabase</li>
              <li>Access controls limiting who can view your data</li>
              <li>Regular security reviews</li>
            </ul>
            <p>No system is 100% secure. While we work hard to protect your information, we cannot guarantee absolute security. If you believe your account has been compromised, please contact us immediately.</p>
          </section>

          <section className="pp-section">
            <h2 className="pp-section-heading">10. Your Rights</h2>
            <p>Depending on where you are located, you may have the following rights regarding your personal data:</p>
            <ul className="pp-list">
              <li><span><strong>Access</strong> — request a copy of the personal data we hold about you</span></li>
              <li><span><strong>Correction</strong> — request that we correct inaccurate or incomplete data</span></li>
              <li><span><strong>Deletion</strong> — request that we delete your personal data</span></li>
              <li><span><strong>Portability</strong> — request your data in a machine-readable format</span></li>
              <li><span><strong>Objection</strong> — object to certain types of processing</span></li>
              <li><span><strong>Withdrawal of consent</strong> — withdraw consent for marketing communications at any time</span></li>
            </ul>
            <p>To exercise any of these rights, please contact us at admin@catalystmom.online. We will respond within 30 days.</p>
          </section>

          <section className="pp-section">
            <h2 className="pp-section-heading">11. Children's Privacy</h2>
            <p>Catalyst Mom is designed for adult women navigating motherhood. Our Platform is not intended for children under the age of 18. We do not knowingly collect personal information from anyone under 18. If we become aware that a child under 18 has provided us with personal information, we will delete it immediately.</p>
          </section>

          <section className="pp-section">
            <h2 className="pp-section-heading">12. International Users</h2>
            <p>Catalyst Mom is operated globally. If you are accessing our Platform from outside the country where our servers are located, please be aware that your information may be transferred to and processed in different countries. By using our Platform, you consent to this transfer.</p>
            <p>If you are located in the European Economic Area (EEA) or the United Kingdom, we process your data in accordance with the General Data Protection Regulation (GDPR). If you are located in California, we comply with the California Consumer Privacy Act (CCPA).</p>
          </section>

          <section className="pp-section">
            <h2 className="pp-section-heading">13. Third-Party Links</h2>
            <p>Our Platform may contain links to third-party websites or services. We are not responsible for the privacy practices of those third parties. We encourage you to review their privacy policies before providing any information.</p>
          </section>

          <section className="pp-section">
            <h2 className="pp-section-heading">14. Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time. When we make significant changes, we will notify you by email or through a notice on the Platform. Your continued use of the Platform after changes are posted constitutes your acceptance of the updated policy.</p>
            <p>We encourage you to review this policy periodically.</p>
          </section>

          <section className="pp-section">
            <h2 className="pp-section-heading">15. Contact Us</h2>
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please contact us:</p>
            <div className="pp-contact-box">
              <p><strong>Catalyst Mom</strong></p>
              <p>Email: <a href="mailto:admin@catalystmom.online">admin@catalystmom.online</a></p>
              <p>App: <a href="https://catalystmomofficial.com">catalystmomofficial.com</a></p>
              <p>Assessment: <a href="https://catalystmom.online">catalystmom.online</a></p>
              <p style={{ marginTop: '1rem' }}>We are committed to resolving any concerns you have about your privacy promptly and transparently.</p>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default PrivacyPolicy;
