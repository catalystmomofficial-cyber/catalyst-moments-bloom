import momodoroCover from '@/assets/momodoro-planner-cover.png';
import selfCareCover from '@/assets/busy-mom-self-care-cover.png';
import sleepResetCover from '@/assets/sleep-reset-guide-cover.jpg';
import emotionalLoadCover from '@/assets/emotional-load-workbook-cover.jpg';

export type Journey = 'ttc' | 'pregnant' | 'postpartum';
export type ProductStatus = 'available' | 'coming-soon';

export interface DigitalProduct {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  /**
   * Real uploaded cover art. When absent, the branded ProductCoverArt renders
   * instead — which is exactly what the not-yet-uploaded guides use as a
   * placeholder until the finished PDF and its cover land.
   */
  cover?: string;
  /**
   * The finished file. Keep it as '#' until the real PDF is uploaded — that is
   * the single switch that flips a guide from "Coming Soon" to purchasable, so
   * a placeholder can never be sold before it exists.
   */
  pdf: string;
  cta: string;
  priceCents: number;
  pointsCost: number;
  demand: 'HIGH' | 'MEDIUM';
  category: string;
  /** Which journeys this guide should surface for on the wellness funnel. */
  journeys: Journey[];
  /** Short, benefit-led hook used on the wellness funnel cards. */
  hook: string;
}

// The tabs on the resources page. 'Recovery' was added for the postpartum
// prep guides; keep this list and each product's `category` in sync.
export const PRODUCT_CATEGORIES = [
  'All Resources',
  'Self-Care',
  'Sleep',
  'Mindfulness',
  'Recovery',
] as const;

/**
 * The single catalog of digital guides. Both the storefront (/wellness/resources)
 * and the wellness funnel read from here, so uploading a finished guide is a
 * one-place change: drop the PDF URL into `pdf` and, if you have finished cover
 * art, point `cover` at the bundled asset.
 *
 * A guide is "Coming Soon" purely because its `pdf` is still '#'. That keeps the
 * promise honest — nothing is ever sold before the file behind it is real.
 */
export const DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    slug: 'momodoro-planner',
    title: 'The Momodoro Planner',
    tagline: '15-Minute Focus Sessions for Busy Moms',
    description:
      'A beautifully structured premium time-management tool that helps busy moms organize their days and reclaim their time — one focused 15-minute session at a time.',
    cover: momodoroCover,
    pdf: 'https://catalystmomofficial.com/Momon%20guide/The%20Momodoro%20Planner.pdf',
    cta: 'Download Planner',
    priceCents: 1200,
    pointsCost: 1200,
    demand: 'HIGH',
    category: 'Self-Care',
    journeys: ['ttc', 'pregnant', 'postpartum'],
    hook: 'Reclaim your day in focused 15-minute blocks — even on no sleep.',
  },
  {
    slug: 'busy-mom-self-care',
    title: "The Busy Mom's Self-Care & Stress Relief System",
    tagline: 'Simple Daily Habits to Feel Energized, Relaxed & In Control',
    description:
      'A practical, stress-relief system designed specifically to help busy mothers find calm, recharge, and feel in control — every single day.',
    cover: selfCareCover,
    pdf: 'https://catalystmomofficial.com/catalyst%20guide/The%20Busy%20Mom%E2%80%99s%20Self-Care%20%26%20Stress%20Relief%20System.pdf',
    cta: 'Download System',
    priceCents: 1700,
    pointsCost: 1700,
    demand: 'HIGH',
    category: 'Self-Care',
    journeys: ['ttc', 'pregnant', 'postpartum'],
    hook: 'A daily rhythm that puts calm and energy back within reach.',
  },
  {
    slug: 'sleep-reset-guide',
    title: 'Sleep Reset Guide',
    tagline: 'Maximize Rest as a New or Expecting Mom',
    description:
      'A practical guide to resetting your sleep patterns and maximizing rest, even with a newborn or during pregnancy.',
    cover: sleepResetCover,
    pdf: '#',
    cta: 'Download Guide',
    priceCents: 1500,
    pointsCost: 1500,
    demand: 'MEDIUM',
    category: 'Sleep',
    journeys: ['pregnant', 'postpartum'],
    hook: 'Find real rest — the plan works around a newborn, not against you.',
  },
  {
    slug: 'emotional-load-workbook',
    title: 'Emotional Load Workbook',
    tagline: 'Process and Release the Invisible Mental Load',
    description:
      'A guided workbook to help you identify, process, and lighten the invisible emotional and mental load of motherhood.',
    cover: emotionalLoadCover,
    pdf: '#',
    cta: 'Download Workbook',
    priceCents: 1000,
    pointsCost: 1000,
    demand: 'MEDIUM',
    category: 'Mindfulness',
    journeys: ['ttc', 'pregnant', 'postpartum'],
    hook: 'Name the invisible weight you carry — then set some of it down.',
  },
  {
    slug: 'freezer-stash-guide',
    title: 'The Freezer Stash Guide',
    tagline: 'Postpartum Meals You Prep Once and Lean On for Weeks',
    description:
      'A done-for-you plan to fill your freezer before the baby comes — nourishing, one-handed meals, batch-cook maps, and shopping lists built for recovery, not fuss.',
    pdf: '#',
    cta: 'Download Guide',
    priceCents: 1500,
    pointsCost: 1500,
    demand: 'MEDIUM',
    category: 'Recovery',
    journeys: ['pregnant', 'postpartum'],
    hook: 'Fill the freezer now so the fourth trimester feeds itself.',
  },
  {
    slug: 'keepsake-journal',
    title: 'The Keepsake Journal',
    tagline: 'Gentle Prompts to Hold On to the Days That Blur Together',
    description:
      'A guided journal for the season you will not remember clearly later — soft daily prompts, milestone pages, and space to keep the small moments before they slip away.',
    pdf: '#',
    cta: 'Download Journal',
    priceCents: 1400,
    pointsCost: 1400,
    demand: 'MEDIUM',
    category: 'Mindfulness',
    journeys: ['pregnant', 'postpartum'],
    hook: 'Keep the moments that blur together before they slip away.',
  },
];

/** A guide is purchasable only once its real file exists. */
export const isAvailable = (p: DigitalProduct): boolean => p.pdf !== '#';

export const productBySlug = (slug: string): DigitalProduct | undefined =>
  DIGITAL_PRODUCTS.find((p) => p.slug === slug);

/**
 * Guides to surface on the wellness funnel for a given journey. Available
 * guides come first (they can convert today); the placeholders still show so a
 * mother sees what is coming and lands in the right place when it ships.
 */
export const productsForJourney = (
  journey: Journey | null | undefined,
  limit = 4,
): DigitalProduct[] => {
  const j = journey ?? 'postpartum';
  return [...DIGITAL_PRODUCTS]
    .filter((p) => p.journeys.includes(j))
    .sort((a, b) => Number(isAvailable(b)) - Number(isAvailable(a)))
    .slice(0, limit);
};
