import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import SEO from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/blog/Breadcrumb";

// SEO resource page: "Baby Allergen & First Foods Tracker (printable)." Targets
// the "oddly specific gap nobody filled" — parents wanting a simple checklist to
// track which solids/allergens baby has tried, resorting to the Notes app. This
// is strictly a TRACKING tool, not guidance on how/when to introduce foods:
// safety framing defers all how/when questions to the pediatrician, flags
// choking and reaction risks, and never prescribes.

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Baby Allergen & First Foods Tracker (Free Printable Checklist)",
    description:
      "A simple, printable checklist to track which first foods and common allergens your baby has tried and how they responded — a record-keeping tool to bring to your pediatrician.",
    author: { "@type": "Organization", name: "Catalyst Mom" },
    publisher: {
      "@type": "Organization",
      name: "Catalyst Mom",
      url: "https://catalystmomofficial.com",
    },
    mainEntityOfPage:
      "https://catalystmomofficial.com/baby-allergen-tracker",
  },
];

const allergens = [
  "Cow's milk (dairy)",
  "Egg",
  "Peanut",
  "Tree nuts",
  "Soy",
  "Wheat",
  "Fish",
  "Shellfish",
  "Sesame",
];

const firstFoods = [
  "Iron-rich foods (as advised)",
  "Avocado",
  "Banana",
  "Sweet potato",
  "Oats",
  "Apple / pear",
  "Carrot",
  "Yogurt (if dairy introduced)",
];

const BabyAllergenTracker = () => {
  return (
    <PageLayout>
      <SEO
        title="Baby Allergen & First Foods Tracker (Printable)"
        description="A simple, printable checklist to track which first foods and common allergens your baby has tried and how they responded — a record to bring to your pediatrician."
        canonical="https://catalystmomofficial.com/baby-allergen-tracker"
        type="article"
        structuredData={structuredData}
      />

      <article className="container mx-auto max-w-4xl px-4 py-10 md:py-16">
        <Breadcrumb
          items={[
            { label: "Free Guides", href: "/guides" },
            { label: "Baby Allergen Tracker", href: "/baby-allergen-tracker" },
          ]}
        />

        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-catalyst-brown">
            Baby Allergen &amp; First Foods Tracker
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            The simple checklist parents keep wishing existed — one place to note
            what your baby has tried and how they responded, instead of a chaotic
            Notes-app list. Print it, stick it on the fridge.
          </p>
        </header>

        <section className="mb-10">
          <div className="rounded-lg border-2 border-catalyst-copper/40 bg-catalyst-copper/5 p-5">
            <p className="font-semibold text-catalyst-brown mb-2">
              Please read first — this is a tracker, not feeding advice.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>When and how</strong> to start solids and introduce allergens is a conversation for your pediatrician — especially if your baby has eczema, a known allergy, or a family history of allergies.</li>
              <li>• Introduce <strong>one new food at a time</strong> and watch for a few days before the next, so anything unusual is easy to trace.</li>
              <li>• Learn the <strong>signs of an allergic reaction</strong> and what to do; serious reactions need emergency care (call 911). Ask your provider what to watch for.</li>
              <li>• Serve age-appropriate textures and sizes to reduce <strong>choking risk</strong>, and never leave a baby unattended while eating.</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-catalyst-brown mb-4">
            Common allergens — track each one
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm md:text-base">
              <thead className="bg-catalyst-copper/10">
                <tr>
                  <th className="p-3 font-semibold text-catalyst-brown">Allergen</th>
                  <th className="p-3 font-semibold text-catalyst-brown">Date first tried</th>
                  <th className="p-3 font-semibold text-catalyst-brown">Any reaction?</th>
                  <th className="p-3 font-semibold text-catalyst-brown">Notes</th>
                </tr>
              </thead>
              <tbody>
                {allergens.map((a) => (
                  <tr key={a} className="border-t border-border">
                    <td className="p-3 font-medium text-catalyst-brown">{a}</td>
                    <td className="p-3 text-muted-foreground">—</td>
                    <td className="p-3 text-muted-foreground">—</td>
                    <td className="p-3 text-muted-foreground">—</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-catalyst-brown mb-4">
            First foods — tick them off
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {firstFoods.map((f) => (
              <div key={f} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                <span className="h-5 w-5 rounded border-2 border-catalyst-copper/50 shrink-0" />
                <span className="text-muted-foreground">{f}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Tip: print this page (or screenshot it) and fill it in by hand — then
            bring it to your baby's next check-up.
          </p>
        </section>

        <section className="mb-6">
          <div className="rounded-lg border border-catalyst-copper/30 bg-catalyst-copper/5 p-6">
            <h2 className="text-2xl font-semibold text-catalyst-brown mb-3">
              One less thing to hold in your head
            </h2>
            <p className="mb-4 leading-relaxed">
              Keeping track of the little things is exactly the invisible load
              that wears moms down. Catalyst Mom is built to take some of it off
              your plate — nourishing meal plans, a community that gets it, and
              tools for the mental load, not one more thing to manage.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-catalyst-copper hover:bg-catalyst-copper/90">
                <Link to="/register">See what's inside Catalyst Mom</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/postpartum-freezer-meal-prep">Free freezer-meal prep plan</Link>
              </Button>
            </div>
          </div>
        </section>
      </article>
    </PageLayout>
  );
};

export default BabyAllergenTracker;
