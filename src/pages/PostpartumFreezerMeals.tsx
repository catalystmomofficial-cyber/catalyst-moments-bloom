import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import SEO from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/blog/Breadcrumb";
import { GlowingEffect } from "@/components/ui/glowing-effect";

// SEO resource page: "Postpartum Freezer Meal Prep + Grocery List." Targets the
// single most concretely validated seller in the research, mental-load threads
// where freezer-meal-prep guides with grocery lists were credited by name with
// actually reducing the load. Free lead magnet: a usable one-afternoon plan +
// aisle-grouped grocery list that funnels into the app's personalized meal
// plans. Generic, safe recipes; no dietary/medical or milk-supply claims.

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Postpartum Freezer Meal Prep: One Afternoon, Weeks of Dinners",
    description:
      "A free freezer-meal-prep plan and grocery list for new moms, batch six freezer-friendly dinners in one afternoon so future-you doesn't have to think about food.",
    author: { "@type": "Organization", name: "Catalyst Mom" },
    publisher: {
      "@type": "Organization",
      name: "Catalyst Mom",
      url: "https://catalystmomofficial.com",
    },
    mainEntityOfPage:
      "https://catalystmomofficial.com/postpartum-freezer-meal-prep",
  },
];

const meals = [
  { name: "Big-batch chili", note: "Freezes and reheats beautifully; stretch it over rice, on a potato, or as-is." },
  { name: "Baked ziti / pasta bake", note: "Assemble in foil trays, freeze unbaked, bake straight from frozen." },
  { name: "Hearty soup (minestrone or lentil)", note: "One-pot, freezes flat in bags, thaws fast for a one-handed lunch." },
  { name: "Breakfast burritos", note: "Wrap individually; microwave one-handed while feeding the baby." },
  { name: "Marinated freezer chicken", note: "Raw chicken + marinade in a bag; thaws while it seasons, then just cook." },
  { name: "Veggie-loaded curry or stew", note: "Batch big, portion into single servings, freeze for the hardest days." },
];

const groceryList = [
  { aisle: "Proteins", items: "Ground beef or turkey, chicken thighs, canned beans (black, kidney), lentils, eggs" },
  { aisle: "Produce", items: "Onions, garlic, carrots, celery, spinach, bell peppers, potatoes, tomatoes" },
  { aisle: "Pantry", items: "Canned tomatoes, broth, rice, pasta, tortillas, curry paste or spices, olive oil" },
  { aisle: "Dairy / cold", items: "Shredded cheese, butter; optional yogurt or coconut milk for curries" },
  { aisle: "Supplies", items: "Freezer bags, foil trays, a marker for labeling (name + date)" },
];

const freezerTips = [
  "Label everything with the meal name and the date, frozen food all looks the same at 2am.",
  "Freeze soups and stews flat in bags so they stack and thaw fast.",
  "Cool food fully before freezing, and thaw in the fridge overnight for best results.",
  "Most cooked freezer meals are best used within about 3 months.",
  "Note any allergies or preferences before you batch, you're cooking for future-you.",
];

const PostpartumFreezerMeals = () => {
  return (
    <PageLayout>
      <SEO
        title="Postpartum Freezer Meals: Prep & Grocery List"
        description="A free freezer-meal-prep plan and grocery list for new moms, batch six freezer-friendly dinners in one afternoon so future-you doesn't have to think about food."
        canonical="https://catalystmomofficial.com/postpartum-freezer-meal-prep"
        type="article"
        structuredData={structuredData}
      />

      <article className="container mx-auto max-w-4xl px-4 py-10 md:py-16">
        <Breadcrumb
          items={[
            { label: "Free Guides", href: "/guides" },
            {
              label: "Postpartum Freezer Meal Prep",
              href: "/postpartum-freezer-meal-prep",
            },
          ]}
        />

        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-catalyst-brown">
            One Afternoon of Freezer Prep = Weeks of Dinners
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            The mental load isn't the cooking, it's the deciding, every single
            night, when you have nothing left. Front-load it once and hand
            future-you a freezer full of "already handled."
          </p>
        </header>

        <section className="mb-12">
          <p className="mb-4 leading-relaxed">
            Ask a room of tired moms what actually cut their mental load and
            almost nobody names a gadget. They name the Sunday they batch-cooked
            a freezer full of dinners. That's what{" "}
            <strong>freezer-meal prep with a grocery list</strong> buys you: one
            afternoon of work for weeks of nights where "what's for dinner" is
            already answered. Here's a plan you can run this weekend, free.
          </p>
          <div className="rounded-lg border border-border bg-catalyst-copper/5 p-4 text-sm text-muted-foreground">
            General food-prep ideas, not dietary or medical advice. Adjust for
            your own allergies, preferences, and anything your provider has
            advised, and follow safe food-storage practices.
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-catalyst-brown mb-4">
            The six meals (all freeze &amp; reheat well)
          </h2>
          <div className="space-y-3">
            {meals.map((m) => (
              <div key={m.name} className="relative rounded-lg">
                <GlowingEffect disabled={false} proximity={70} spread={25} borderWidth={2} inactiveZone={0.4} />
                <div className="relative rounded-lg border border-border bg-card p-4">
                  <p className="font-semibold text-catalyst-brown">{m.name}</p>
                  <p className="text-muted-foreground mt-1">{m.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-catalyst-brown mb-4">
            The grocery list (one trip)
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm md:text-base">
              <thead className="bg-catalyst-copper/10">
                <tr>
                  <th className="p-4 font-semibold text-catalyst-brown w-1/4">Aisle</th>
                  <th className="p-4 font-semibold text-catalyst-brown">Grab</th>
                </tr>
              </thead>
              <tbody>
                {groceryList.map((row) => (
                  <tr key={row.aisle} className="border-t border-border align-top">
                    <td className="p-4 font-medium text-catalyst-brown">{row.aisle}</td>
                    <td className="p-4 text-muted-foreground">{row.items}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-catalyst-brown mb-4">
            Freezer prep tips
          </h2>
          <ul className="space-y-3">
            {freezerTips.map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-1 text-catalyst-copper">✓</span>
                <span className="text-muted-foreground">{t}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-6">
          <div className="rounded-lg border border-catalyst-copper/30 bg-catalyst-copper/5 p-6">
            <h2 className="text-2xl font-semibold text-catalyst-brown mb-3">
              Want it done for you, every week?
            </h2>
            <p className="mb-4 leading-relaxed">
              This is the free starter. Inside Catalyst Mom, the{" "}
              <strong>meal plans</strong> do the deciding for you on repeat —
              plans and recipes matched to your stage, with the grocery list
              built in, so batch day gets easier every single week and the
              mental load stops resetting every night.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-catalyst-copper hover:bg-catalyst-copper/90">
                <Link to="/register">Get your meal plans in the app</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/exhausted-mom-sleep-troubleshooting">
                  While you're at it: fix the exhaustion
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </article>
    </PageLayout>
  );
};

export default PostpartumFreezerMeals;
