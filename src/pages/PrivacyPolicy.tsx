import PageLayout from '@/components/layout/PageLayout';

const PrivacyPolicy = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy: Catalyst Mom</h1>
          <p className="text-sm text-muted-foreground mb-8">Last Updated: April 22, 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Welcome to Catalyst Mom, the premier wellness platform for the modern mother. This service is a brand of the Catalyst Chamber family of companies (referred to as "we," "us," or "our"). We are committed to protecting your privacy, especially regarding the sensitive health and wellness data you trust us with.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <ul className="list-disc ml-6 mt-4 space-y-3">
              <li><strong>Direct Disclosures:</strong> We collect information you provide during your Wellness Assessment, including name, email, age, fitness level, and health goals.</li>
              <li><strong>Sensitive Health Data:</strong> To provide personalized programming, we collect information regarding your pregnancy or postpartum status. We treat this data with heightened security and do not use it for third-party advertising.</li>
              <li><strong>Technical Data:</strong> We automatically collect device info, IP addresses, and usage patterns to optimize app performance.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>To calculate your Assessment Score and generate custom wellness plans.</li>
              <li>To track progress and send "Moments of Catalyst" (program updates).</li>
              <li>To facilitate community interactions and improve the platform's AI-driven personalization.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. 2026 Privacy Compliance (CCPA & GPC)</h2>
            <ul className="list-disc ml-6 mt-4 space-y-3">
              <li><strong>Global Privacy Control (GPC):</strong> We honor GPC signals. If your browser sends a GPC signal, we automatically opt you out of any "sale" or "sharing" of your data.</li>
              <li><strong>Sensitive Data Limitation:</strong> We only process your health-related data (pregnancy status, etc.) to provide the specific wellness services you requested.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Payment & Financial Security</h2>
            <p>
              We do not store credit card numbers on our servers. All transactions are handled by PCI-DSS Level 1 certified processors: Stripe, PayPal, and Stan Store.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Data Retention & Deletion</h2>
            <p>
              We keep your wellness data as long as your account is active. You have the right to delete your data at any time. Upon request, we will purge your assessment scores and personal profile from our active databases.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Health & Medical Disclaimer</h2>
            <p>
              Catalyst Mom provides wellness and fitness information for educational purposes. We are not medical professionals. Always consult with a licensed physician before starting a new fitness or nutrition program, especially during or after pregnancy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
            <p>For privacy inquiries or to exercise your data rights:</p>
            <p className="mt-4">
              <strong>Catalyst Chamber</strong><br />
              Email: info.mom@catalystchamber.com<br />
              United States
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default PrivacyPolicy;
