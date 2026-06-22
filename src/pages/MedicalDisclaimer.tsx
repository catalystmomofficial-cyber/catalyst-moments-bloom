import PageLayout from "@/components/layout/PageLayout";
import SEO from "@/components/seo/SEO";

const LAST_UPDATED = "June 18, 2026";

const MedicalDisclaimer = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Medical Disclaimer",
    description:
      "Catalyst Mom provides educational content for mothers and is not a substitute for professional medical advice, diagnosis, or treatment.",
    url: "https://catalystmomofficial.com/medical-disclaimer",
    publisher: {
      "@type": "Organization",
      name: "Catalyst Mom",
      url: "https://catalystmomofficial.com",
    },
  };

  return (
    <PageLayout>
      <SEO
        title="Medical Disclaimer — Catalyst Mom"
        description="Catalyst Mom's content is for education and support only and is not a substitute for professional medical advice. Always consult your healthcare provider."
        structuredData={structuredData}
      />
      <div className="container mx-auto px-4 py-12">
        <article className="max-w-3xl mx-auto prose prose-lg dark:prose-invert prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-primary">
          <h1>Medical Disclaimer</h1>
          <p className="text-sm">Last updated: {LAST_UPDATED}</p>

          <p>
            The content provided by Catalyst Mom — including our website, blog,
            guides, workout and birth ball programs, meal plans, community, and
            any related materials — is intended for <strong>general educational
            and informational purposes only</strong>. It is not medical advice
            and is <strong>not a substitute for professional medical advice,
            diagnosis, or treatment</strong>.
          </p>

          <h2>Always consult your healthcare provider</h2>
          <p>
            Pregnancy, trying to conceive, and postpartum recovery are deeply
            individual. Before beginning any exercise program, changing your
            nutrition, or acting on anything you read here, talk with a qualified
            healthcare professional who knows your personal history — such as your
            OB-GYN, midwife, pelvic floor physical therapist, or registered
            dietitian. Never disregard professional medical advice or delay
            seeking it because of something you read on Catalyst Mom.
          </p>

          <h2>If something doesn't feel right, stop</h2>
          <p>
            Stop any activity and contact your provider if you experience pain,
            vaginal bleeding, fluid leakage, dizziness, shortness of breath,
            chest pain, regular painful contractions, calf pain or swelling,
            reduced fetal movement, or any symptom that concerns you.
          </p>

          <h2>In an emergency, call for help</h2>
          <p>
            If you think you are having a medical emergency, call your local
            emergency number (such as 911 in the United States) or go to the
            nearest emergency department immediately. Do not rely on this website
            for urgent care.
          </p>

          <h2>No doctor–patient relationship</h2>
          <p>
            Using Catalyst Mom, contacting us, or participating in our community
            does not create a doctor–patient, therapist–client, or any other
            professional healthcare relationship. Our experts and contributors
            share general guidance, not individualized medical care.
          </p>

          <h2>Accuracy and individual results</h2>
          <p>
            We work to keep our content evidence-informed and current, but we
            make no guarantee that it is complete, accurate, or applicable to
            your situation. Individual results vary, and any testimonials reflect
            individual experiences rather than promised outcomes.
          </p>

          <h2>Questions</h2>
          <p>
            If you have questions about this disclaimer, please reach us through
            our <a href="/contact">contact page</a>.
          </p>
        </article>
      </div>
    </PageLayout>
  );
};

export default MedicalDisclaimer;
