import PageLayout from '@/components/layout/PageLayout';

const TermsOfService = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. About Catalyst Mom</h2>
            <p>
              Welcome to Catalyst Mom, the #1 wellness brand for busy moms. These Terms of Service ("Terms") govern your use of our platform, services, and content provided by Catalyst Chamber LLC ("we," "us," or "our"), a company organized under the laws of the United States.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Acceptance of Terms</h2>
            <p>
              By accessing or using Catalyst Mom, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Eligibility</h2>
            <p>
              You must be at least 18 years old to use our services. By using Catalyst Mom, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Our Services</h2>
            <p>
              Catalyst Mom provides personalized wellness programs, workout plans, nutrition guidance, and community support specifically designed for women during preconception, pregnancy, and postpartum phases. Our services include:
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li>Customized fitness programs and workout videos</li>
              <li>Nutritional guidance and meal planning</li>
              <li>Wellness coaching and mental health support</li>
              <li>Community forums and peer support</li>
              <li>Educational content and resources</li>
              <li>Progress tracking and accountability tools</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Subscriptions and Payments</h2>
            <p>
              Our premium services are available through various subscription plans with flexible pricing options. We offer:
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li><strong>Monthly Premium:</strong> Full access to all programs and features</li>
              <li><strong>Annual Premium:</strong> Full access with significant savings</li>
              <li><strong>Lifetime Access:</strong> One-time payment for permanent access</li>
              <li><strong>Free Tier:</strong> Limited access to basic content</li>
            </ul>
            <p className="mt-4">
              Payment processing is handled securely through trusted third-party providers including Stripe, PayPal, and Stan Store. We do not store your payment information directly. All transactions are processed securely and in compliance with industry standards.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Medical Disclaimer</h2>
            <p className="font-semibold text-orange-600">
              IMPORTANT: The content provided by Catalyst Mom is for informational and educational purposes only and is not intended as medical advice.
            </p>
            <p className="mt-4">
              Always consult with your healthcare provider before beginning any fitness program, especially during pregnancy or postpartum recovery. Every individual's health situation is unique, and what works for one person may not be appropriate for another.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. User Responsibilities</h2>
            <p>You agree to:</p>
            <ul className="list-disc ml-6 mt-4">
              <li>Provide accurate and truthful information</li>
              <li>Use our services in compliance with all applicable laws</li>
              <li>Respect other community members</li>
              <li>Not share your account credentials</li>
              <li>Consult healthcare professionals before making health decisions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
            <p>
              All content, including workout videos, meal plans, educational materials, and software, is owned by Catalyst Chamber LLC and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Cancellation and Refunds</h2>
            <p>
              You may cancel your subscription at any time through your account settings or by contacting us at info.mom@catalystchamber.com. Cancellations take effect at the end of your current billing period. Refund policies vary by subscription type and will be clearly communicated at the time of purchase.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Catalyst Chamber LLC shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
            <p>
              If you have questions about these Terms, please contact us at:
            </p>
            <p className="mt-4">
              <strong>Catalyst Chamber LLC</strong><br />
              Email: info.mom@catalystchamber.com<br />
              United States
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or through our platform. Continued use of our services after changes constitutes acceptance of the new Terms.
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default TermsOfService;