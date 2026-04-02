import ttcJourneySupportCover from '@/assets/community-covers/ttc-journey-support.jpg';
import fertilityNutritionCover from '@/assets/community-covers/fertility-nutrition.jpg';
import cycleTrackingBuddiesCover from '@/assets/community-covers/cycle-tracking-buddies.jpg';
import mindfulWellnessCover from '@/assets/community-covers/mindful-wellness.jpg';
import pregnancySupportCover from '@/assets/community-covers/pregnancy-support.jpg';
import firstTrimesterCrewCover from '@/assets/community-covers/first-trimester-crew.jpg';
import prenatalFitnessCover from '@/assets/community-covers/prenatal-fitness.jpg';
import postpartumSupportCover from '@/assets/community-covers/postpartum-support.jpg';
import workingMomsCover from '@/assets/community-covers/working-moms.jpg';
import mentalHealthCover from '@/assets/community-covers/mental-health.jpg';
import nutritionForMomsCover from '@/assets/community-covers/nutrition-for-moms.jpg';
import birthPrepCover from '@/assets/community-covers/birth-prep.jpg';
import birthBallGuideCover from '@/assets/ultimate-birth-ball-guide-cover.jpg';

export type JourneyType = 'ttc' | 'pregnant' | 'postpartum' | 'general';

export interface CommunityGroup {
  slug: string;
  name: string;
  description: string;
  journey: JourneyType;
  memberCount: number;
  coverImage: string;
  badge?: string;
  isFree?: boolean; // true = accessible without subscription
}

export const groups: CommunityGroup[] = [
  // ── General (free for all logged-in users) ──
  {
    slug: 'mom-life-general',
    name: 'Mom Life – General',
    description: 'The open hub for every mom on CatalystMom. Share wins, ask questions, and support one another — no subscription required!',
    journey: 'general',
    memberCount: 3_421,
    coverImage: mentalHealthCover,
    badge: 'ALL',
    isFree: true,
  },
  {
    slug: 'sleep-support',
    name: 'Sleep Support Circle',
    description: 'Tips, routines, and solidarity for moms navigating sleep challenges at every stage — newborn nights to toddler bedtimes.',
    journey: 'general',
    memberCount: 1_876,
    coverImage: mindfulWellnessCover,
    badge: 'ZZ',
    isFree: true,
  },
  {
    slug: 'toddler-moms',
    name: 'Toddler Moms',
    description: 'Tantrums, milestones, meal ideas, and laughs. A space for moms raising tiny humans with big personalities.',
    journey: 'general',
    memberCount: 2_103,
    coverImage: nutritionForMomsCover,
    badge: 'TM',
    isFree: true,
  },

  // ── TTC (subscription required) ──
  {
    slug: 'ttc-journey-support',
    name: 'TTC Journey Support',
    description: 'Share experiences, tips, and encouragement with others trying to conceive. Join our weekly Q&As with fertility specialists every Tuesday at 7 PM EST.',
    journey: 'ttc',
    memberCount: 1_124,
    coverImage: ttcJourneySupportCover,
    badge: 'TTC',
  },
  {
    slug: 'fertility-nutrition',
    name: 'Fertility Nutrition',
    description: 'Discuss foods, supplements, and daily habits that support fertility and hormonal balance. Monthly meal planning sessions with our nutritionist.',
    journey: 'ttc',
    memberCount: 687,
    coverImage: fertilityNutritionCover,
    badge: 'FN',
  },
  {
    slug: 'cycle-tracking-buddies',
    name: 'Cycle Tracking Buddies',
    description: 'Compare cycle insights, ovulation windows, and support each other through the TWW. Daily check-ins and success stories shared here!',
    journey: 'ttc',
    memberCount: 743,
    coverImage: cycleTrackingBuddiesCover,
    badge: 'CT',
  },

  // ── Pregnant (subscription required) ──
  {
    slug: 'pregnancy-support',
    name: 'Pregnancy Support',
    description: 'Complete pregnancy journey support from bump to birth. Weekly expert talks, symptom discussions, and preparation tips for all trimesters.',
    journey: 'pregnant',
    memberCount: 1_567,
    coverImage: pregnancySupportCover,
    badge: 'PS',
  },
  {
    slug: 'first-trimester-crew',
    name: 'First Trimester Crew',
    description: 'Connect with others in their 1st trimester—nausea tips, early scans, and support. Daily morning sickness remedies and success stories.',
    journey: 'pregnant',
    memberCount: 1_298,
    coverImage: firstTrimesterCrewCover,
    badge: 'T1',
  },
  {
    slug: 'prenatal-fitness',
    name: 'Prenatal Fitness',
    description: 'Safe workouts, mobility, and tips to stay active throughout pregnancy. Live prenatal yoga sessions every Wednesday at 6 PM.',
    journey: 'pregnant',
    memberCount: 1_034,
    coverImage: prenatalFitnessCover,
    badge: 'PF',
  },
  {
    slug: 'birth-ball',
    name: 'Birth Ball Community',
    description: 'Ultimate Birth Ball Community for Birth Prep',
    journey: 'pregnant',
    memberCount: 856,
    coverImage: birthBallGuideCover,
    badge: 'BB',
  },
  {
    slug: 'birth-prep',
    name: 'Birth Preparation',
    description: 'Get ready for labor and delivery with birth plans, breathing techniques, and expert guidance. Weekly childbirth classes and birth story sharing.',
    journey: 'pregnant',
    memberCount: 892,
    coverImage: birthPrepCover,
    badge: 'BP',
  },

  // ── Postpartum (subscription required) ──
  {
    slug: 'postpartum-support',
    name: 'Postpartum Support',
    description: 'Recovery, mental health, and gentle fitness—support for the fourth trimester. Postpartum depression support and healing journey stories shared daily.',
    journey: 'postpartum',
    memberCount: 1_456,
    coverImage: postpartumSupportCover,
    badge: 'PP',
  },
  {
    slug: 'working-moms',
    name: 'Working Moms',
    description: 'Balance career and motherhood—time-saving tips, routines, and solidarity. Monthly work-life balance workshops and productivity hacks.',
    journey: 'postpartum',
    memberCount: 1_123,
    coverImage: workingMomsCover,
    badge: 'WM',
  },
];

/**
 * Returns groups relevant to the user's stage.
 * Always includes general (free) groups + stage-specific groups.
 */
export function getGroupsForStage(stage?: string) {
  if (!stage) {
    // Not logged in or no stage set → show only general (free) groups
    return groups.filter(g => g.journey === 'general');
  }

  // Extract base journey from stage (e.g., "pregnant_trimester_2" -> "pregnant")
  const baseJourney = stage.split('_')[0] as JourneyType;

  // Return general groups + groups for their specific journey
  return groups.filter(g => g.journey === baseJourney || g.journey === 'general');
}

/**
 * Get all groups (for "View All" scenarios)
 */
export function getAllGroups() {
  return groups;
}
