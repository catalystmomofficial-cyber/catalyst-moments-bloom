import type { GoldieConfig } from "/Users/cambautista/.local/lib/node_modules/goldie/dist/config.d.ts";

const APP_ROOT = "/Users/cambautista/Downloads/catalyst-moments-bloom";

const config: GoldieConfig = {
  appRoot: APP_ROOT,
  appPath: "/tmp/CatalystMomPreview.app",
  bundleId: "com.catalystmomofficial.app",
  devices: ["iphone-6.9"],
  locales: ["en-US"],
  appearance: "light",
  frame: { variant: "17-pro-silver" },
  theme: {
    background: "linear-gradient(155deg, #FFF9F3 0%, #FBE7DD 58%, #F5D6C5 100%)",
    headlineColor: "#4A2F26",
    subheadColor: "#75594F",
    fontFamily: "DM Sans",
    copyHeightRatio: 0.24,
    deviceWidthRatio: 0.84,
    template: "editorial",
    layout: "classic",
  },
  store: {
    name: "Catalyst Mom",
    subtitle: { "en-US": "Wellness through every stage" },
    developer: "Catalyst Mom",
    category: "Health & Fitness",
    ageRating: "4+",
    price: "Free",
    description: {
      "en-US": "Stage-aware wellness support for TTC, pregnancy, postpartum, and motherhood. Start with a clearer next step, then keep workouts, meal planning, wellness check-ins, and community together in one account.",
    },
  },
  scenes: [
    {
      kind: "screenshot",
      id: "dashboard",
      flow: "store-01-dashboard",
      layout: "hero",
      headline: { "en-US": "Know what to do today" },
      subhead: { "en-US": "Your stage, next step, and support in one calm view." },
    },
    {
      kind: "screenshot",
      id: "workouts",
      flow: "store-02-workouts",
      headline: { "en-US": "Build strength progressively" },
      subhead: { "en-US": "Choose movement shaped for your current motherhood stage." },
    },
    {
      kind: "screenshot",
      id: "meals",
      flow: "store-03-meals",
      headline: { "en-US": "Nutrition for your exact stage" },
      subhead: { "en-US": "TTC, pregnancy, and postpartum plans—not one generic menu." },
    },
    {
      kind: "screenshot",
      id: "wellness",
      flow: "store-04-wellness",
      headline: { "en-US": "See the whole picture" },
      subhead: { "en-US": "Bring mood, rest, hydration, and self-care into view." },
    },
    {
      kind: "screenshot",
      id: "community",
      flow: "store-05-community",
      headline: { "en-US": "Support that grows with you" },
      subhead: { "en-US": "Stay connected through TTC, pregnancy, postpartum, and beyond." },
    },
  ],
};

export default config;
