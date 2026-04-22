import PageLayout from '@/components/layout/PageLayout';

const PrivacyPolicy = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy: Catalyst Mom</h1>
          <p className="text-sm text-muted-foreground mb-8">Effective Date: April 22, 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Who We Are</h2>
            <p>
              Catalyst Mom is a maternal wellness platform designed to support you through every stage of motherhood. This service is operated by Catalyst Chamber.
            </p>
            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li><strong>Main Platform:</strong> catalystmomofficial.com</li>
              <li><strong>Assessment:</strong> catalystmom.online</li>
              <li><strong>Contact:</strong> admin@catalystmom.online</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <p>We collect only what is necessary to personalize your journey:</p>
            <ul className="list-disc ml-6 mt-4 space-y-3">
              <li><strong>Account Info:</strong> Name and email for your secure login.</li>
              <li><strong>Motherhood Stage:</strong> Whether you are TTC (Trying to Conceive), Pregnant, or Postpartum.</li>
              <li><strong>Wellness Logs:</strong> Mood, sleep, activity, and goals you choose to track.</li>
              <li><strong>Technical Data:</strong> IP address and device info to keep the app running smoothly.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. AI & Personalized Accountability</h2>
            <p>We use artificial intelligence to ensure your experience evolves with you:</p>
            <ul className="list-disc ml-6 mt-4 space-y-3">
              <li><strong>Adaptive Nutrition & Planning:</strong> Our AI identifies patterns in your progress to generate meal plans and nutrition guides tailored to your current motherhood stage.</li>
              <li><strong>Smart Accountability:</strong> We process your activity logs and check-ins to provide automated progress insights.</li>
              <li><strong>Data Protection:</strong> Your inputs are used only to generate your personal results. We do not sell your progress data to third-party AI providers.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Push Notifications</h2>
            <p>
              With your consent, we send push notifications to your device for workout reminders, accountability check-ins, and app updates. You can opt-out or manage these at any time in your device settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>
            <p>We partner with industry leaders to keep your data secure:</p>
            <ul className="list-disc ml-6 mt-4 space-y-3">
              <li><strong>Infrastructure & Security:</strong> We use Supabase for secure data storage and authentication.</li>
              <li><strong>Communications:</strong> We use Omnisend and Firebase for email and app notifications.</li>
              <li><strong>Payments:</strong> All transactions are handled by Stripe. We never see or store your credit card numbers.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Security & Rights</h2>
            <ul className="list-disc ml-6 mt-4 space-y-3">
              <li><strong>No Sale of Data:</strong> We do not sell your personal info or motherhood status to advertisers.</li>
              <li><strong>Control:</strong> You can view, update, or delete your information at any time.</li>
              <li><strong>Full Deletion:</strong> Request a complete data wipe via app settings or email: admin@catalystmom.online.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
            <p>
              Our platform is intended for use by adults (18+) only. We do not knowingly collect information from individuals under the age of 18.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Disclaimer</h2>
            <p>
              Catalyst Mom provides wellness information for educational purposes only and is not a substitute for professional medical advice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
            <p>Questions? Reach out to us: admin@catalystmom.online</p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default PrivacyPolicy;
