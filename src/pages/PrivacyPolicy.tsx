import PageLayout from '@/components/layout/PageLayout';

const PrivacyPolicy = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Catalyst Chamber LLC ("we," "us," or "our") operates Catalyst Mom, the #1 wellness brand for busy moms. We are committed to protecting your privacy and being transparent about how we collect, use, and protect your personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
            <p>We collect information you provide directly, including:</p>
            <ul className="list-disc ml-6 mt-4">
              <li>Name and email address</li>
              <li>Profile information (age, fitness level, health goals)</li>
              <li>Pregnancy or postpartum status</li>
              <li>Workout preferences and progress data</li>
              <li>Community forum posts and interactions</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">Automatically Collected Information</h3>
            <ul className="list-disc ml-6">
              <li>Device information and IP address</li>
              <li>Usage patterns and app interactions</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc ml-6 mt-4">
              <li>Provide personalized wellness programs and recommendations</li>
              <li>Track your progress and achievements</li>
              <li>Send relevant content and program updates</li>
              <li>Facilitate community interactions</li>
              <li>Improve our services and user experience</li>
              <li>Provide customer support</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
            <p>We do not sell your personal information. We may share information with:</p>
            
            <h3 className="text-xl font-semibold mb-3">Service Providers</h3>
            <ul className="list-disc ml-6">
              <li><strong>Payment Processors:</strong> Stripe, PayPal, and Stan Store for secure transaction processing</li>
              <li><strong>Analytics Providers:</strong> To understand app usage and improve services</li>
              <li><strong>Cloud Hosting:</strong> Secure data storage and app functionality</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">Legal Requirements</h3>
            <p>We may disclose information when required by law or to protect our rights and safety.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Payment Information Security</h2>
            <p>
              We prioritize your financial security. We do not store credit card numbers, CVV codes, or other sensitive payment details on our servers. All payment processing is handled by:
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li><strong>Stripe:</strong> PCI DSS Level 1 certified payment processor</li>
              <li><strong>PayPal:</strong> Industry-leading secure payment platform</li>
              <li><strong>Stan Store:</strong> Secure e-commerce platform</li>
            </ul>
            <p className="mt-4">
              These providers use advanced encryption and security measures to protect your payment information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
            <p>
              We implement robust security measures to protect your information, including:
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication protocols</li>
              <li>Secure hosting infrastructure</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights and Choices</h2>
            <p>You have the right to:</p>
            <ul className="list-disc ml-6 mt-4">
              <li>Access, update, or delete your personal information</li>
              <li>Opt out of marketing communications</li>
              <li>Request data portability</li>
              <li>Withdraw consent where applicable</li>
              <li>File a complaint with regulatory authorities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
            <p>
              We retain your information for as long as your account is active or as needed to provide services. After account deletion, we may retain certain information for legal compliance and legitimate business purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children under 18.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
            <p>
              As a US-based company, your information may be transferred to and processed in the United States. We ensure appropriate safeguards are in place for international transfers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or want to exercise your rights, please contact us:
            </p>
            <p className="mt-4">
              <strong>Catalyst Chamber LLC</strong><br />
              Email: info.mom@catalystchamber.com<br />
              United States
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Policy Updates</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you of significant changes via email or through our platform. The "Last updated" date indicates when the policy was last revised.
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default PrivacyPolicy;