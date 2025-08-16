export type JourneyType = 'ttc' | 'pregnant' | 'postpartum' | 'general';

export interface CommunityGroup {
  slug: string;
  name: string;
  description: string;
  journey: JourneyType;
  memberCount: number;
  coverImage: string;
  badge?: string;
}

export const groups: CommunityGroup[] = [
  // TTC groups
  {
    slug: 'ttc-journey-support',
    name: 'TTC Journey Support',
    description: 'Share experiences, tips, and encouragement with others trying to conceive. Join our weekly Q&As with fertility specialists every Tuesday at 7 PM EST.',
    journey: 'ttc',
    memberCount: 1_124,
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    badge: 'TTC'
  },
  {
    slug: 'fertility-nutrition',
    name: 'Fertility Nutrition',
    description: 'Discuss foods, supplements, and daily habits that support fertility and hormonal balance. Monthly meal planning sessions with our nutritionist.',
    journey: 'ttc',
    memberCount: 687,
    coverImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
    badge: 'FN'
  },
  {
    slug: 'cycle-tracking-buddies',
    name: 'Cycle Tracking Buddies',
    description: 'Compare cycle insights, ovulation windows, and support each other through the TWW. Daily check-ins and success stories shared here!',
    journey: 'ttc',
    memberCount: 743,
    coverImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9',
    badge: 'CT'
  },
  {
    slug: 'mindful-wellness',
    name: 'Mindful Wellness',
    description: 'Stress relief, yoga, and mindfulness to stay grounded throughout your journey. Join our virtual meditation sessions every Sunday at 9 AM.',
    journey: 'ttc',
    memberCount: 892,
    coverImage: 'https://images.unsplash.com/photo-1519181245277-cffeb31da2fb',
    badge: 'MW'
  },

  // Pregnant groups
  {
    slug: 'pregnancy-support',
    name: 'Pregnancy Support',
    description: 'Complete pregnancy journey support from bump to birth. Weekly expert talks, symptom discussions, and preparation tips for all trimesters.',
    journey: 'pregnant',
    memberCount: 1_567,
    coverImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
    badge: 'PS'
  },
  {
    slug: 'first-trimester-crew',
    name: 'First Trimester Crew',
    description: 'Connect with others in their 1st trimester—nausea tips, early scans, and support. Daily morning sickness remedies and success stories.',
    journey: 'pregnant',
    memberCount: 1_298,
    coverImage: 'https://images.unsplash.com/photo-1522335789203-9d73c12b9b59',
    badge: 'T1'
  },
  {
    slug: 'prenatal-fitness',
    name: 'Prenatal Fitness',
    description: 'Safe workouts, mobility, and tips to stay active throughout pregnancy. Live prenatal yoga sessions every Wednesday at 6 PM.',
    journey: 'pregnant',
    memberCount: 1_034,
    coverImage: 'https://images.unsplash.com/photo-1518600506278-4e8ef466b810',
    badge: 'PF'
  },

  // Postpartum groups
  {
    slug: 'postpartum-support',
    name: 'Postpartum Support',
    description: 'Recovery, mental health, and gentle fitness—support for the fourth trimester. Postpartum depression support and healing journey stories shared daily.',
    journey: 'postpartum',
    memberCount: 1_456,
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    badge: 'PP'
  },
  {
    slug: 'working-moms',
    name: 'Working Moms',
    description: 'Balance career and motherhood—time-saving tips, routines, and solidarity. Monthly work-life balance workshops and productivity hacks.',
    journey: 'postpartum',
    memberCount: 1_123,
    coverImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    badge: 'WM'
  },
  {
    slug: 'mental-health',
    name: 'Mental Health for Moms',
    description: 'Safe space for discussing anxiety, depression, and mental wellness. Weekly virtual support circles and professional guidance available.',
    journey: 'postpartum',
    memberCount: 967,
    coverImage: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f',
    badge: 'MH'
  },

  // General groups
  {
    slug: 'nutrition-for-moms',
    name: 'Nutrition for Moms',
    description: 'Healthy, simple recipes and smart planning for busy mom life. Weekly meal prep sessions and family-friendly recipe exchanges.',
    journey: 'general',
    memberCount: 2_187,
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    badge: 'NF'
  },
  {
    slug: 'birth-prep',
    name: 'Birth Preparation',
    description: 'Get ready for labor and delivery with birth plans, breathing techniques, and expert guidance. Weekly childbirth classes and birth story sharing.',
    journey: 'pregnant',
    memberCount: 892,
    coverImage: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b',
    badge: 'BP'
  }
];

export function getGroupsForStage(stage?: string) {
  if (stage === 'ttc') return groups.filter(g => g.journey === 'ttc' || g.journey === 'general');
  if (stage === 'pregnant') return groups.filter(g => g.journey === 'pregnant' || g.journey === 'general');
  // default to postpartum groups if not TTC or pregnant
  return groups.filter(g => g.journey === 'postpartum' || g.journey === 'general');
}
