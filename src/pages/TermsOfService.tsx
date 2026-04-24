import PageLayout from '@/components/layout/PageLayout';

const TermsOfService = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Effective Date: April 22, 2026 · Last Updated: April 22, 2026
          </p>

          <div className="bg-muted/40 border-l-4 border-primary p-6 mb-8 rounded">
            <p>
              Please read these Terms of Service carefully before using the Catalyst Mom platform. By accessing or using our app, website, or assessment tool, you agree to be bound by these terms. If you do not agree, please do not use our services.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. About Catalyst Mom</h2>
            <p>
              Catalyst Mom is a maternal wellness platform designed to support women through every stage of motherhood — Trying to Conceive (TTC), Pregnancy, and Postpartum recovery. We provide fitness programs, nutrition guidance, wellness tools, community support, and coaching services.
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li>App: catalystmomofficial.com</li>
              <li>Assessment: catalystmom.online</li>
              <li>Contact: admin@catalystmom.online</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Eligibility</h2>
            <p>To use Catalyst Mom you must:</p>
            <ul className="list-disc ml-6 mt-4">
              <li>Be at least 18 years of age</li>
              <li>Be a human individual — not a company, bot, or automated service</li>
              <li>Provide accurate and truthful information when creating your account</li>
              <li>Have the legal capacity to enter into a binding agreement</li>
            </ul>
            <p className="mt-4">
              By using the Platform you represent and warrant that you meet all of these requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Your Account</h2>
            <p>When you create an account with Catalyst Mom you are responsible for:</p>
            <ul className="list-disc ml-6 mt-4">
              <li>Keeping your login credentials secure and confidential</li>
              <li>All activity that occurs under your account</li>
              <li>Notifying us immediately of any unauthorised access or security breach</li>
              <li>Ensuring your account information is accurate and up to date</li>
            </ul>
            <p className="mt-4">
              We reserve the right to suspend or terminate accounts that violate these terms or that we believe have been compromised.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Subscriptions and Payments</h2>

            <h3 className="text-xl font-semibold mt-6 mb-2">4.1 Subscription Plans</h3>
            <p>
              Catalyst Mom offers monthly and annual subscription plans. By subscribing you agree to pay the applicable fees as displayed at the time of purchase.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">4.2 Billing</h3>
            <p>
              Subscriptions are billed automatically at the start of each billing period. All payments are processed securely through Stripe. We do not store your payment card details.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">4.3 Cancellation</h3>
            <p>
              You may cancel your subscription at any time through your account settings or by contacting us at admin@catalystmom.online. Cancellation takes effect at the end of your current billing period. You will retain access to the platform until that date.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">4.4 Refunds</h3>
            <p>
              We offer a 30-day money-back guarantee on all new subscriptions. If you are not satisfied within the first 30 days, contact us at admin@catalystmom.online and we will issue a full refund — no questions asked. After 30 days, payments are non-refundable except where required by law.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">4.5 Price Changes</h3>
            <p>
              We reserve the right to change subscription pricing with reasonable notice. We will notify you at least 30 days before any price change takes effect on your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Medical Disclaimer</h2>
            <p className="font-semibold text-orange-600">
              Catalyst Mom provides wellness information for educational purposes only and is not a substitute for professional medical advice. Our programs, guides, and coaching services are not medical treatment. Always consult a qualified healthcare provider before beginning any new exercise or nutrition program — especially during pregnancy, postpartum recovery, or while trying to conceive.
            </p>
            <p className="mt-4">
              By using Catalyst Mom you acknowledge that you are solely responsible for your health decisions and that Catalyst Mom is not liable for any health outcomes arising from your use of the platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Platform Content and Programs</h2>
            <p>
              All content on the Catalyst Mom platform — including workout programs, meal plans, guides, assessments, and educational materials — is created and owned by Catalyst Mom unless otherwise stated.
            </p>
            <p className="mt-4">
              You may access and use this content for your personal, non-commercial use only. You may not:
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li>Copy, reproduce, or distribute our content without written permission</li>
              <li>Resell or sublicense access to the platform or its content</li>
              <li>Use our content to create competing products or services</li>
              <li>Remove any copyright, trademark, or proprietary notices from our content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Community Guidelines</h2>
            <p>
              Catalyst Mom includes a community space where members can connect, share, and support each other. By participating in the community you agree to:
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li>Be respectful and kind to all community members at all times</li>
              <li>Not share medical advice or diagnose other members</li>
              <li>Not post spam, promotional content, or advertising without permission</li>
              <li>Not share offensive, harmful, or discriminatory content</li>
              <li>Not share another member's personal information without their consent</li>
              <li>Not impersonate Catalyst Mom staff, coaches, or other members</li>
            </ul>
            <p className="mt-4">
              We reserve the right to remove content and suspend or ban members who violate these guidelines without notice or refund.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Coaching Services</h2>
            <p>
              Catalyst Mom includes access to human coach check-ins and AI-powered wellness support as part of eligible subscription plans.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">8.1 Human Coach Check-ins</h3>
            <p>
              Bi-weekly progress reviews are provided by wellness professionals aligned with Catalyst Mom. These check-ins are for motivational and accountability purposes and do not constitute medical advice or clinical treatment.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">8.2 Catalyst AI</h3>
            <p>
              Our AI-powered wellness assistant provides general information and guidance based on the Catalyst Mom knowledge base. Catalyst AI responses are not a substitute for professional medical advice. Always consult your healthcare provider for medical concerns.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Affiliate and Partner Program</h2>
            <p>
              Catalyst Mom operates a referral and affiliate program. By participating you agree to:
            </p>
            <ul className="list-disc ml-6 mt-4">
              <li>Only promote Catalyst Mom honestly and accurately</li>
              <li>Not make false or misleading claims about the platform or its results</li>
              <li>Comply with all applicable advertising disclosure requirements</li>
              <li>Not engage in spam or unsolicited promotion</li>
            </ul>
            <p className="mt-4">
              Catalyst Mom reserves the right to terminate affiliate agreements and withhold unpaid commissions if these terms are violated.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Intellectual Property</h2>
            <p>
              All content, branding, trademarks, logos, and intellectual property on the Catalyst Mom platform are owned by or licensed to Catalyst Mom. Nothing in these terms grants you any right to use our intellectual property without our prior written permission.
            </p>
            <p className="mt-4">
              If you believe any content on our platform infringes your intellectual property rights, please contact us at admin@catalystmom.online.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Catalyst Mom shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform — including but not limited to health outcomes, loss of data, or interruption of service.
            </p>
            <p className="mt-4">
              Our total liability to you for any claim arising from your use of the platform shall not exceed the amount you paid to us in the 3 months preceding the claim.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Indemnification</h2>
            <p>
              You agree to indemnify and hold Catalyst Mom, its founders, team members, coaches, and partners harmless from any claims, damages, losses, or expenses — including legal fees — arising from your use of the platform, your violation of these terms, or your violation of any third party rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the platform at any time and for any reason — including violation of these terms — with or without notice.
            </p>
            <p className="mt-4">
              If we terminate your account due to a violation of these terms, you will not be entitled to a refund of any subscription fees paid.
            </p>
            <p className="mt-4">
              You may terminate your account at any time by contacting us at admin@catalystmom.online.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. Changes to These Terms</h2>
            <p>
              We may update these Terms of Service from time to time. When we make significant changes, we will notify you by email or through a notice on the platform at least 14 days before the changes take effect.
            </p>
            <p className="mt-4">
              Your continued use of the platform after changes take effect constitutes your acceptance of the updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">15. Governing Law</h2>
            <p>
              These Terms of Service are governed by and construed in accordance with applicable law. Any disputes arising from these terms or your use of the platform shall be resolved through good faith negotiation first. If resolution cannot be reached, disputes shall be submitted to binding arbitration.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">16. Contact Us</h2>
            <p>If you have any questions about these Terms of Service please contact us:</p>
            <p className="mt-4">
              <strong>Catalyst Mom</strong><br />
              Email: admin@catalystmom.online<br />
              App: catalystmomofficial.com<br />
              Assessment: catalystmom.online
            </p>
            <p className="mt-4">
              We are committed to being fair, transparent, and responsive to any concerns you have.
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default TermsOfService;
