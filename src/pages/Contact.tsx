import PageLayout from "@/components/layout/PageLayout";
import SEO from "@/components/seo/SEO";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Instagram, Facebook, HelpCircle } from "lucide-react";

const SUPPORT_EMAIL = "catalystmomofficial@gmail.com";

const Contact = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Catalyst Mom",
    url: "https://catalystmomofficial.com/contact",
    description:
      "Get in touch with the Catalyst Mom team for support, questions, or partnership enquiries.",
    publisher: {
      "@type": "Organization",
      name: "Catalyst Mom",
      url: "https://catalystmomofficial.com",
      email: SUPPORT_EMAIL,
      sameAs: [
        "https://www.instagram.com/catalyst_mom/",
        "https://www.pinterest.com/catalystmoms/",
        "https://www.facebook.com/profile.php?id=61554306726027",
      ],
    },
  };

  return (
    <PageLayout>
      <SEO
        title="Contact Us — Catalyst Mom"
        description="Reach the Catalyst Mom team for support with your account, programs, or partnership questions. We typically reply within 1–2 business days."
        structuredData={structuredData}
      />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground mb-8">
            We're a small team that genuinely reads every message. Whether you
            need help with your account, have a question about a program, or want
            to partner with us, here's how to reach the right place. We typically
            reply within 1–2 business days.
          </p>

          <div className="space-y-4">
            <Card>
              <CardContent className="flex items-start gap-4 pt-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Email support</h2>
                  <p className="text-sm text-muted-foreground mb-1">
                    Account help, billing, programs, or anything else.
                  </p>
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="text-primary hover:underline break-all"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-start gap-4 pt-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Check the FAQ first</h2>
                  <p className="text-sm text-muted-foreground mb-1">
                    Many questions about programs, subscriptions, and refunds are
                    answered instantly.
                  </p>
                  <Link to="/faq" className="text-primary hover:underline">
                    Visit our FAQ
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-start gap-4 pt-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <Instagram className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Find us on social</h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    Daily tips and community on your favorite platform.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <a
                      href="https://www.instagram.com/catalyst_mom/?hl=en"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <Instagram className="h-4 w-4" /> Instagram
                    </a>
                    <a
                      href="https://www.facebook.com/profile.php?id=61554306726027"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <Facebook className="h-4 w-4" /> Facebook
                    </a>
                    <a
                      href="https://www.pinterest.com/catalystmoms/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      Pinterest
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            Please note: Catalyst Mom provides educational content and support,
            not medical care. For anything health-related, see our{" "}
            <Link to="/medical-disclaimer" className="text-primary hover:underline">
              medical disclaimer
            </Link>{" "}
            and consult your healthcare provider.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Contact;
