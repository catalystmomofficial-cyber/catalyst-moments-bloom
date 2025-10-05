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
    coverImage: ttcJourneySupportCover,
    badge: 'TTC'
  },
  {
    slug: 'fertility-nutrition',
    name: 'Fertility Nutrition',
    description: 'Discuss foods, supplements, and daily habits that support fertility and hormonal balance. Monthly meal planning sessions with our nutritionist.',
    journey: 'ttc',
    memberCount: 687,
    coverImage: fertilityNutritionCover,
    badge: 'FN'
  },
  {
    slug: 'cycle-tracking-buddies',
    name: 'Cycle Tracking Buddies',
    description: 'Compare cycle insights, ovulation windows, and support each other through the TWW. Daily check-ins and success stories shared here!',
    journey: 'ttc',
    memberCount: 743,
    coverImage: cycleTrackingBuddiesCover,
    badge: 'CT'
  },
  {
    slug: 'mindful-wellness',
    name: 'Mindful Wellness',
    description: 'Stress relief, yoga, and mindfulness to stay grounded throughout your journey. Join our virtual meditation sessions every Sunday at 9 AM.',
    journey: 'ttc',
    memberCount: 892,
    coverImage: mindfulWellnessCover,
    badge: 'MW'
  },

  // Pregnant groups
  {
    slug: 'pregnancy-support',
    name: 'Pregnancy Support',
    description: 'Complete pregnancy journey support from bump to birth. Weekly expert talks, symptom discussions, and preparation tips for all trimesters.',
    journey: 'pregnant',
    memberCount: 1_567,
    coverImage: pregnancySupportCover,
    badge: 'PS'
  },
  {
    slug: 'first-trimester-crew',
    name: 'First Trimester Crew',
    description: 'Connect with others in their 1st trimester—nausea tips, early scans, and support. Daily morning sickness remedies and success stories.',
    journey: 'pregnant',
    memberCount: 1_298,
    coverImage: firstTrimesterCrewCover,
    badge: 'T1'
  },
  {
    slug: 'prenatal-fitness',
    name: 'Prenatal Fitness',
    description: 'Safe workouts, mobility, and tips to stay active throughout pregnancy. Live prenatal yoga sessions every Wednesday at 6 PM.',
    journey: 'pregnant',
    memberCount: 1_034,
    coverImage: prenatalFitnessCover,
    badge: 'PF'
  },

  // Postpartum groups
  {
    slug: 'postpartum-support',
    name: 'Postpartum Support',
    description: 'Recovery, mental health, and gentle fitness—support for the fourth trimester. Postpartum depression support and healing journey stories shared daily.',
    journey: 'postpartum',
    memberCount: 1_456,
    coverImage: postpartumSupportCover,
    badge: 'PP'
  },
  {
    slug: 'working-moms',
    name: 'Working Moms',
    description: 'Balance career and motherhood—time-saving tips, routines, and solidarity. Monthly work-life balance workshops and productivity hacks.',
    journey: 'postpartum',
    memberCount: 1_123,
    coverImage: workingMomsCover,
    badge: 'WM'
  },
  {
    slug: 'mental-health',
    name: 'Mental Health for Moms',
    description: 'Safe space for discussing anxiety, depression, and mental wellness. Weekly virtual support circles and professional guidance available.',
    journey: 'postpartum',
    memberCount: 967,
    coverImage: mentalHealthCover,
    badge: 'MH'
  },

  // General groups
  {
    slug: 'nutrition-for-moms',
    name: 'Nutrition for Moms',
    description: 'Healthy, simple recipes and smart planning for busy mom life. Weekly meal prep sessions and family-friendly recipe exchanges.',
    journey: 'general',
    memberCount: 2_187,
    coverImage: nutritionForMomsCover,
    badge: 'NF'
  },
  {
    slug: 'birth-prep',
    name: 'Birth Preparation',
    description: 'Get ready for labor and delivery with birth plans, breathing techniques, and expert guidance. Weekly childbirth classes and birth story sharing.',
    journey: 'pregnant',
    memberCount: 892,
    coverImage: birthPrepCover,
    badge: 'BP'
  }
];

export function getGroupsForStage(stage?: string) {
  if (!stage) {
    return groups.filter(g => g.journey === 'general');
  }
  
  // Return groups for specific stage + general groups
  return groups.filter(g => g.journey === stage || g.journey === 'general');
}