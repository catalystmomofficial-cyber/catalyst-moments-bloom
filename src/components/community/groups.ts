import ttcJourneySupportCover from '@/assets/community-covers/ttc-journey-support.jpg';
import pregnancySupportCover from '@/assets/community-covers/pregnancy-support.jpg';
import postpartumSupportCover from '@/assets/community-covers/postpartum-support.jpg';
import mentalHealthCover from '@/assets/community-covers/mental-health.jpg';

export type JourneyType = 'ttc' | 'pregnant' | 'postpartum' | 'general';

export interface SubCategory {
  id: string;
  label: string;
  description: string;
}

export interface CommunityGroup {
  slug: string;
  name: string;
  description: string;
  journey: JourneyType;
  memberCount: number;
  coverImage: string;
  badge?: string;
  isFree?: boolean;
  subCategories: SubCategory[];
}

export const groups: CommunityGroup[] = [
  // ── TTC Community (subscription required) ──
  {
    slug: 'ttc-community',
    name: 'TTC Community',
    description: 'Your complete hub for the trying-to-conceive journey — fertility tips, cycle tracking, milestones, and support from women who understand.',
    journey: 'ttc',
    memberCount: 2_554,
    coverImage: ttcJourneySupportCover,
    badge: 'TTC',
    subCategories: [
      { id: 'general', label: 'General Discussion', description: 'Open conversation for all TTC topics' },
      { id: 'cycle-tracking', label: 'Cycle Tracking & Fertility', description: 'Ovulation windows, charting, and fertility insights' },
      { id: 'wins', label: 'TTC Wins & Milestones', description: 'Celebrate BFPs, positive steps, and small victories' },
    ],
  },

  // ── Pregnancy Community (subscription required) ──
  {
    slug: 'pregnancy-community',
    name: 'Pregnancy Community',
    description: 'Everything pregnancy — from first trimester symptoms to birth prep. Safe workouts, nutrition, birth ball exercises, and weekly expert talks.',
    journey: 'pregnant',
    memberCount: 4_647,
    coverImage: pregnancySupportCover,
    badge: 'PREG',
    subCategories: [
      { id: 'general', label: 'General Discussion', description: 'Open chat for all pregnancy topics' },
      { id: 'prenatal-fitness', label: 'Prenatal Fitness', description: 'Safe workouts and mobility through every trimester' },
      { id: 'birth-ball', label: 'Birth Ball', description: 'Birth ball exercises, techniques, and community challenges' },
      { id: 'birth-prep', label: 'Birth Preparation', description: 'Labor plans, breathing techniques, and delivery readiness' },
    ],
  },

  // ── Postpartum Community (subscription required) ──
  {
    slug: 'postpartum-community',
    name: 'Postpartum Community',
    description: 'Recovery, mental wellness, gentle fitness, and real talk for the fourth trimester and beyond. You\'re not alone in this.',
    journey: 'postpartum',
    memberCount: 3_702,
    coverImage: postpartumSupportCover,
    badge: 'PP',
    subCategories: [
      { id: 'general', label: 'General Discussion', description: 'Open conversation for all postpartum topics' },
      { id: 'core-restore', label: 'Core Restore & Recovery', description: 'Healing, diastasis recti, pelvic floor, and gentle movement' },
      { id: 'breastfeeding', label: 'Breastfeeding Support', description: 'Latching tips, pumping schedules, and solidarity' },
    ],
  },

  // ── Mom Life General (free for ALL users) ──
  {
    slug: 'mom-life-general',
    name: 'Mom Life General',
    description: 'The open hub for every mom on CatalystMom. Share wins, ask questions, and support one another — no subscription required!',
    journey: 'general',
    memberCount: 5_400,
    coverImage: mentalHealthCover,
    badge: 'ALL',
    isFree: true,
    subCategories: [
      { id: 'general', label: 'General Chat', description: 'Talk about anything and everything mom life' },
      { id: 'sleep', label: 'Sleep Support', description: 'Tips, routines, and solidarity for sleep challenges at every stage' },
      { id: 'toddler', label: 'Toddler Moms', description: 'Tantrums, milestones, meal ideas, and laughs for moms of tiny humans' },
    ],
  },
];

/**
 * Returns groups relevant to the user's stage.
 * Always includes general (free) group + stage-specific group.
 */
export function getGroupsForStage(stage?: string | null) {
  if (!stage) {
    return groups.filter(g => g.journey === 'general');
  }

  let baseJourney: JourneyType;
  if (stage.includes('ttc')) baseJourney = 'ttc';
  else if (stage.includes('trimester') || stage === 'pregnant') baseJourney = 'pregnant';
  else if (stage.includes('postpartum')) baseJourney = 'postpartum';
  else baseJourney = 'general';

  return groups.filter(g => g.journey === baseJourney || g.journey === 'general');
}

/**
 * Get all groups
 */
export function getAllGroups() {
  return groups;
}
