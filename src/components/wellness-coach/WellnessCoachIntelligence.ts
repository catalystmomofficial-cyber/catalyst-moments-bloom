import { MotherhoodStage } from '@/contexts/AuthContext';

// ---------------------------------------------------------------------------
// App Navigation Knowledge Base
// Maps topics/keywords the user might mention → the exact in-app route + a
// friendly direction the coach can include in its response.
// ---------------------------------------------------------------------------

interface AppPage {
  label: string;
  route: string;
  /** Short human-readable direction (e.g. "Tap Workouts in the menu") */
  direction: string;
  keywords: string[];
  /** Which stages this page is most relevant for (empty = all) */
  stages?: MotherhoodStage[];
}

export const APP_NAVIGATION_MAP: AppPage[] = [
  // ── Workouts ──────────────────────────────────────────────────────────────
  {
    label: 'Workouts',
    route: '/workouts',
    direction: 'Go to the Workouts page from the main menu.',
    keywords: ['workout', 'exercise', 'movement', 'training', 'fitness', 'active', 'gym', 'strength'],
  },
  {
    label: 'Prenatal Workouts',
    route: '/workouts?stage=pregnancy',
    direction: 'Go to Workouts and select the Pregnancy filter.',
    keywords: ['prenatal', 'pregnancy workout', 'pregnant exercise', 'safe pregnancy workout'],
    stages: ['pregnant'],
  },
  {
    label: 'Postpartum Workouts',
    route: '/workouts?stage=postpartum',
    direction: 'Go to Workouts and select the Postpartum filter.',
    keywords: ['postpartum workout', 'after birth exercise', 'postnatal workout', 'return to exercise'],
    stages: ['postpartum'],
  },
  {
    label: 'Core Restore Foundations',
    route: '/workouts/core-restore-foundations',
    direction: 'Find the Core Restore program under Workouts.',
    keywords: ['core restore', 'diastasis', 'ab separation', 'core healing', 'pelvic floor workout', 'core recovery'],
    stages: ['postpartum'],
  },
  {
    label: 'Glow and Go Prenatal Program',
    route: '/programs/glow-and-go',
    direction: 'Open the Glow and Go Prenatal Program under Programs.',
    keywords: ['glow and go', 'prenatal program', 'pregnancy program'],
    stages: ['pregnant'],
  },

  // ── Nutrition / Meal Plan ─────────────────────────────────────────────────
  {
    label: 'Meal Plans',
    route: '/meal-plan',
    direction: 'Tap Meal Plan in the menu to see your personalized plan.',
    keywords: ['meal plan', 'meal', 'food plan', 'eat', 'nutrition plan', 'diet', 'recipes', 'what to eat'],
  },
  {
    label: 'Pregnancy Meal Plan',
    route: '/meal-plan?stage=pregnancy',
    direction: 'Go to Meal Plan and select the Pregnancy stage.',
    keywords: ['pregnancy meal', 'prenatal nutrition', 'what to eat pregnant', 'pregnancy diet'],
    stages: ['pregnant'],
  },
  {
    label: 'Postpartum Meal Plan',
    route: '/meal-plan?stage=postpartum',
    direction: 'Go to Meal Plan and select the Postpartum stage.',
    keywords: ['postpartum meal', 'postnatal nutrition', 'breastfeeding diet', 'milk supply food', 'postpartum diet'],
    stages: ['postpartum'],
  },
  {
    label: 'TTC Meal Plan',
    route: '/meal-plan?stage=ttc',
    direction: 'Go to Meal Plan and select the TTC stage.',
    keywords: ['ttc nutrition', 'fertility food', 'conception diet', 'fertility nutrition', 'trying to conceive food'],
    stages: ['ttc'],
  },

  // ── Wellness / Self-care ──────────────────────────────────────────────────
  {
    label: 'Wellness Hub',
    route: '/wellness',
    direction: 'Open the Wellness page from the bottom navigation.',
    keywords: ['wellness', 'wellbeing', 'self care', 'self-care', 'mental health', 'stress relief', 'calm', 'mindfulness'],
  },
  {
    label: 'Self-Care Tools',
    route: '/wellness/self-care',
    direction: 'Go to Wellness → Self-Care for guided practices and tools.',
    keywords: ['self care', 'self-care tools', 'stress', 'anxiety', 'overwhelm', 'relax', 'unwind', 'mindful'],
  },
  {
    label: 'Wellness Resources (Guides & Planners)',
    route: '/wellness/resources',
    direction: 'Go to Wellness → Resources to browse guides, planners, and workbooks.',
    keywords: ['resource', 'guide', 'planner', 'workbook', 'download', 'momodoro', 'self care system', 'sleep guide', 'emotional load', 'product', 'digital guide'],
  },

  // ── Birth Ball ────────────────────────────────────────────────────────────
  {
    label: 'Birth Ball Guide',
    route: '/birth-ball-guide',
    direction: 'Find the Birth Ball Guide under Wellness or the main menu.',
    keywords: ['birth ball', 'birthing ball', 'peanut ball', 'labor ball', 'bounce ball'],
  },
  {
    label: 'Birth Ball Program',
    route: '/programs/birth-ball',
    direction: 'Open the Birth Ball Program under Programs.',
    keywords: ['birth ball program', 'birth ball exercises', 'birth ball workout'],
    stages: ['pregnant'],
  },

  // ── Dashboard & Tools ─────────────────────────────────────────────────────
  {
    label: 'Dashboard',
    route: '/dashboard',
    direction: 'Your Dashboard is the first screen after logging in.',
    keywords: ['dashboard', 'home screen', 'main page', 'overview', 'my stats'],
  },
  {
    label: 'Kick Counter',
    route: '/dashboard?tool=kick-counter',
    direction: 'Open your Dashboard and tap the Kick Counter tool.',
    keywords: ['kick counter', 'kick count', 'baby kicks', 'fetal movement', 'count kicks'],
    stages: ['pregnant'],
  },
  {
    label: 'Progress Tracker',
    route: '/progress',
    direction: 'Open the Progress page to log and track your wellness journey.',
    keywords: ['progress', 'track', 'log', 'journal', 'history', 'check in', 'how am i doing'],
  },

  // ── Community ─────────────────────────────────────────────────────────────
  {
    label: 'Community',
    route: '/community',
    direction: 'Tap Community in the menu to connect with other moms.',
    keywords: ['community', 'group', 'other moms', 'forum', 'chat', 'support group', 'connect'],
  },

  // ── Courses & Programs ────────────────────────────────────────────────────
  {
    label: 'Courses',
    route: '/courses',
    direction: 'Go to Courses in the menu to see all available programs.',
    keywords: ['course', 'program', 'class', 'series', 'challenge', '30 day', 'glow up'],
  },
  {
    label: 'Postpartum Recovery Program (30 Days Glow Up)',
    route: '/course/266ae389-409f-4847-9a10-e29a2f3eb3f9',
    direction: 'Find the 30 Days Glow Up Challenge under Courses.',
    keywords: ['30 days', 'glow up', 'postpartum recovery program', 'recovery challenge'],
    stages: ['postpartum'],
  },

  // ── Profile & Subscription ────────────────────────────────────────────────
  {
    label: 'Profile & Subscription',
    route: '/profile',
    direction: 'Open Profile (tap your avatar or the Profile icon in the menu).',
    keywords: ['profile', 'account', 'subscription', 'premium', 'upgrade', 'plan', 'billing', 'membership'],
  },

  // ── Blog & Research ───────────────────────────────────────────────────────
  {
    label: 'Blog',
    route: '/blog',
    direction: 'Tap Blog in the menu to read evidence-based articles.',
    keywords: ['blog', 'article', 'post', 'read', 'learn', 'tips', 'advice'],
  },
  {
    label: 'Research',
    route: '/research',
    direction: 'Visit the Research page for expert-backed studies and sources.',
    keywords: ['research', 'study', 'evidence', 'science', 'clinical', 'data'],
  },
  {
    label: 'Expert Hub',
    route: '/experts',
    direction: 'Go to the Experts page to learn about our medical advisory team.',
    keywords: ['expert', 'doctor', 'midwife', 'specialist', 'team', 'provider', 'credentials'],
  },

  // ── Food Calorie Checker ──────────────────────────────────────────────────
  {
    label: 'Food & Calorie Checker',
    route: '/food-calories',
    direction: 'Use the Food & Calorie Checker to look up nutritional info.',
    keywords: ['calorie', 'calorie checker', 'food checker', 'nutrition info', 'how many calories', 'food database'],
  },

  // ── Assessment ────────────────────────────────────────────────────────────
  {
    label: 'Wellness Assessment',
    route: '/questionnaire',
    direction: 'Complete the Wellness Assessment to personalize your experience.',
    keywords: ['assessment', 'questionnaire', 'quiz', 'personalise', 'personalize', 'wellness score', 'setup'],
  },

  // ── All Courses ───────────────────────────────────────────────────────────
  {
    label: 'All Courses & Programs',
    route: '/courses',
    direction: 'Go to the Courses page to see every program available to you.',
    keywords: ['all courses', 'all programs', 'what courses', 'available courses', 'course list', 'what programs do you have'],
  },
  {
    label: 'Glow & Go Prenatal Program',
    route: '/programs/glow-and-go',
    direction: 'Open Glow & Go Prenatal under Programs — trimester-safe video workouts you can do at home.',
    keywords: ['glow and go', 'glow go', 'prenatal program', 'prenatal videos', 'pregnancy workout program', 'trimester workout', 'prenatal fitness program'],
    stages: ['pregnant'],
  },
  {
    label: 'Birth Ball Program',
    route: '/programs/birth-ball',
    direction: 'Open the Birth Ball Program under Programs for guided birth-ball exercises.',
    keywords: ['birth ball program', 'birth ball workout program', 'labor prep program', 'birth ball exercises'],
    stages: ['pregnant'],
  },
  {
    label: '30 Days Glow Up — Postpartum Recovery Challenge',
    route: '/course/266ae389-409f-4847-9a10-e29a2f3eb3f9',
    direction: 'Find the 30 Days Glow Up Challenge under Courses — a structured postpartum recovery program.',
    keywords: ['30 day', '30 days', 'glow up', 'postpartum challenge', 'postpartum recovery program', 'postpartum course'],
    stages: ['postpartum'],
  },
  {
    label: 'Core Restore Foundations',
    route: '/workouts/core-restore-foundations',
    direction: 'Find Core Restore Foundations under Workouts — a guided program for healing your core after birth.',
    keywords: ['core restore', 'core restore foundations', 'core healing', 'ab recovery', 'diastasis program', 'pelvic floor program'],
    stages: ['postpartum'],
  },

  // ── Affiliate / Partner Program ───────────────────────────────────────────
  {
    label: 'Catalyst Mom Partner Program',
    route: '/affiliate',
    direction: 'Go to the Partner Program page to learn how to earn as a Catalyst Mom member.',
    keywords: [
      'affiliate', 'partner program', 'earn', 'referral', 'make money', 'share and earn',
      'passive income', 'recommend', 'how do i earn', 'earn as a member', 'commission',
      'bounty', 'refer a friend', 'how do i make money', 'paid to share',
    ],
  },
  {
    label: 'Partner Dashboard',
    route: '/affiliate/dashboard',
    direction: 'Open your Partner Dashboard to track your referrals and earnings.',
    keywords: ['affiliate dashboard', 'partner dashboard', 'my referrals', 'my earnings', 'check my commissions'],
  },

  // ── Saved & Personal ──────────────────────────────────────────────────────
  {
    label: 'Saved Workout Plans',
    route: '/saved-workout-plans',
    direction: 'Open Saved Workout Plans to access plans you have bookmarked.',
    keywords: ['saved workout', 'my workout plan', 'saved plan', 'bookmarked workout'],
  },
  {
    label: 'Saved Birth Ball Exercises',
    route: '/saved-birth-ball-exercises',
    direction: 'Open Saved Birth Ball Exercises to revisit your favourite moves.',
    keywords: ['saved birth ball', 'saved exercises', 'my saved exercises'],
    stages: ['pregnant'],
  },
];

// ---------------------------------------------------------------------------
// Affiliate / Partner Program — full context the coach can use to answer
// questions naturally. Positioned as "earn as a member" — never as a side-hustle
// pitch that could cheapen the brand.
// ---------------------------------------------------------------------------

export const AFFILIATE_CONTEXT = {
  summary:
    'Catalyst Mom has a Partner Program that lets active members earn $29 for every person they refer who becomes a paying member and stays for at least two months. There is no cap — refer more, earn more.',
  keyFacts: [
    'You must be an active subscriber yourself to participate.',
    'You earn $29 per referral once the person you referred completes their 2nd month of membership.',
    'There is no limit to how many people you can refer.',
    'Earnings are paid via PayPal or direct bank transfer.',
    'Approved partners receive a welcome kit with graphics, Reel ideas, and talking points.',
    'If a referral cancels in their first month, no bounty is paid.',
    'Applications are reviewed and you hear back within 48 hours.',
  ],
  whoItsFor: [
    'Active Catalyst Mom members who genuinely love the community.',
    'Moms who are already sharing their wellness journey online or with friends.',
    'Anyone who wants to turn their authentic recommendations into a small income.',
  ],
  applyRoute: '/affiliate',
  dashboardRoute: '/affiliate/dashboard',
};

/** True if the message is asking about the affiliate/partner/earn topic */
export const isAffiliateQuery = (message: string): boolean =>
  /affiliat|partner program|earn as a member|refer|referral|commission|bounty|make money|passive income|paid to share|how (do|can) i earn|share and earn/.test(
    message.toLowerCase(),
  );

/**
 * Given a user message and their stage, return the best matching app page
 * (or null if nothing matches well enough).
 */
export const findAppPage = (
  message: string,
  stage: MotherhoodStage | null,
): AppPage | null => {
  const lower = message.toLowerCase();
  let best: AppPage | null = null;
  let bestScore = 0;

  for (const page of APP_NAVIGATION_MAP) {
    // Stage filter: skip pages that aren't relevant to this stage
    if (page.stages && page.stages.length > 0 && stage && !page.stages.includes(stage)) {
      continue;
    }
    let score = 0;
    for (const kw of page.keywords) {
      if (lower.includes(kw)) {
        // Longer / more specific keywords score higher
        score += kw.split(' ').length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = page;
    }
  }

  return bestScore > 0 ? best : null;
};

/**
 * True if the message is clearly asking where something IS / how to find it.
 */
export const isNavigationQuery = (message: string): boolean => {
  return /where (is|can|do|are)|how (do|can) i (find|access|get to|open|go to)|take me to|show me|navigate|go to|open the|find the/.test(
    message.toLowerCase(),
  );
};

export interface WellnessIssue {
  keywords: string[];
  category: 'pain' | 'exercise' | 'nutrition' | 'mental_health' | 'sleep' | 'recovery';
  stages: MotherhoodStage[];
  responses: {
    explanation: string;
    recommendations: string[];
    programs?: string[];
    modifications?: string[];
    warning?: string;
  };
}

export const WELLNESS_KNOWLEDGE_BASE: WellnessIssue[] = [
  {
    keywords: ['sciatica', 'sciatic pain', 'lower back pain', 'hip pain'],
    category: 'pain',
    stages: ['pregnant', 'postpartum'],
    responses: {
      explanation: "Sciatica during pregnancy is common due to your growing baby putting pressure on the sciatic nerve. This can cause sharp, shooting pain from your lower back down to your leg.",
      recommendations: [
        "Apply warm or cold compresses to the affected area",
        "Practice gentle prenatal yoga poses that open the hips",
        "Sleep with a pregnancy pillow between your knees",
        "Try gentle stretches like the pigeon pose (modified for pregnancy)",
        "Consider prenatal massage therapy"
      ],
      programs: ["Birth Ball Guide", "Glow and Go Prenatal Workouts"],
      modifications: [
        "Avoid deep squats and lunges if they increase pain",
        "Focus on supported stretches using a wall or chair",
        "Keep movements slow and controlled"
      ],
      warning: "If pain is severe or accompanied by numbness, please consult your healthcare provider immediately."
    }
  },
  {
    keywords: ['core recovery', 'diastasis recti', 'abdominal separation', 'weak core'],
    category: 'recovery',
    stages: ['postpartum'],
    responses: {
      explanation: "Diastasis recti (abdominal separation) affects up to 60% of postpartum women. Your core needs gentle, progressive rehabilitation to heal properly.",
      recommendations: [
        "Start with diaphragmatic breathing exercises",
        "Practice gentle core activation with transverse abdominis",
        "Focus on pelvic floor coordination with breathing",
        "Gradually progress to functional movements",
        "Avoid traditional crunches and sit-ups initially"
      ],
      programs: ["Postpartum Recovery Program"],
      modifications: [
        "Check for diastasis recti before starting any core work",
        "Keep head supported during any lying exercises",
        "Stop if you see doming or coning of the abdomen"
      ],
      warning: "If separation is wider than 2 finger widths or deeper than your finger length, consider seeing a pelvic floor physiotherapist."
    }
  },
  {
    keywords: ['tired after workout', 'exhausted', 'fatigue', 'low energy'],
    category: 'exercise',
    stages: ['pregnant', 'postpartum', 'ttc'],
    responses: {
      explanation: "Feeling more tired than usual after workouts can indicate you need to adjust intensity, ensure proper recovery, or address nutritional needs.",
      recommendations: [
        "Reduce workout intensity by 20-30%",
        "Ensure you're getting adequate protein (aim for 25-30g per meal)",
        "Prioritize 7-9 hours of sleep per night",
        "Stay hydrated before, during, and after workouts",
        "Consider shorter, more frequent workouts instead of long sessions"
      ],
      programs: ["Energy & Strength Building"],
      modifications: [
        "Take longer rest periods between exercises",
        "Choose low-impact activities like walking or swimming",
        "Listen to your body and rest when needed"
      ],
      warning: "Persistent fatigue could indicate underlying issues - consult your healthcare provider if symptoms continue."
    }
  },
  {
    keywords: ['fertility nutrition', 'ttc diet', 'conception diet', 'fertility foods'],
    category: 'nutrition',
    stages: ['ttc'],
    responses: {
      explanation: "Nutrition plays a crucial role in fertility. A balanced diet rich in specific nutrients can support reproductive health and optimize your chances of conception.",
      recommendations: [
        "Take a prenatal vitamin with at least 400-800mcg folate",
        "Include iron-rich foods like lean meats, beans, and spinach",
        "Eat omega-3 rich foods (salmon, walnuts, chia seeds)",
        "Focus on complex carbohydrates over refined sugars",
        "Include antioxidant-rich foods (berries, leafy greens)",
        "Limit caffeine to 200mg per day (about 1 cup of coffee)"
      ],
      programs: ["TTC Nutrition Plan"],
      modifications: [
        "If vegetarian/vegan, pay special attention to B12, iron, and protein",
        "Consider CoQ10 supplementation after consulting your doctor"
      ]
    }
  },
  {
    keywords: ['postpartum depression', 'baby blues', 'anxiety', 'mood changes'],
    category: 'mental_health',
    stages: ['postpartum'],
    responses: {
      explanation: "Postpartum mood changes are very common. Baby blues affect up to 80% of new mothers, while postpartum depression affects 10-20%.",
      recommendations: [
        "Prioritize rest whenever possible",
        "Accept help from family and friends",
        "Try to get outside for fresh air and sunlight daily",
        "Connect with other new mothers",
        "Practice gentle movement when you feel ready",
        "Maintain good nutrition and stay hydrated"
      ],
      programs: ["Postpartum Wellness Program"],
      warning: "If you experience thoughts of harming yourself or your baby, difficulty bonding, or persistent sadness lasting more than 2 weeks, please reach out to your healthcare provider immediately. You're not alone, and help is available."
    }
  },
  {
    keywords: ['joint pain', 'wrist pain', 'knee pain', 'pregnancy aches'],
    category: 'pain',
    stages: ['pregnant'],
    responses: {
      explanation: "Joint pain during pregnancy is common due to hormonal changes (relaxin), weight gain, and postural changes. Your ligaments become more flexible, which can lead to instability.",
      recommendations: [
        "Use supportive braces for wrists or knees if needed",
        "Practice gentle range of motion exercises",
        "Apply ice for acute pain, heat for stiffness",
        "Maintain good posture throughout the day",
        "Wear supportive, comfortable shoes"
      ],
      programs: ["Prenatal Gentle Movement"],
      modifications: [
        "Avoid high-impact activities",
        "Use props and support during exercises",
        "Focus on stability and balance work"
      ]
    }
  }
];

// ---------------------------------------------------------------------------
// Intent Detection Engine
// Classifies what the user actually wants → shapes a response that uses their
// behavioral profile (stage, score, gaps) to feel personal and lead them forward.
// ---------------------------------------------------------------------------

export type CoachIntent =
  | 'greeting'           // "hi", "hello", just opening the chat
  | 'navigation'         // "where is X", "how do I find X"
  | 'wellness_advice'    // specific health / symptom question
  | 'emotional_support'  // overwhelmed, struggling, venting
  | 'discovery'          // "what do you have for X", exploring options
  | 'progress_check'     // "how am I doing", "what should I focus on"
  | 'action_start'       // "I want to start X", "help me begin"
  | 'affiliate';         // earn, refer, partner program

interface IntentResult {
  intent: CoachIntent;
  confidence: 'high' | 'medium' | 'low';
}

export const detectIntent = (message: string): IntentResult => {
  const m = message.toLowerCase().trim();

  if (isAffiliateQuery(message))
    return { intent: 'affiliate', confidence: 'high' };

  if (isNavigationQuery(message))
    return { intent: 'navigation', confidence: 'high' };

  if (/overwhelm|can'?t cope|struggling|breaking down|crying|depressed|anxious|anxiety|scared|afraid|i feel lost|feel alone|nobody understand|hopeless|emotionally exhaust|burned? out|i can'?t do this/.test(m))
    return { intent: 'emotional_support', confidence: 'high' };

  if (/how am i doing|what should i focus|what'?s? next|where am i|my progress|am i on track|check.?in|how'?s? my (journey|progress|score)|weekly check/.test(m))
    return { intent: 'progress_check', confidence: 'high' };

  if (/i want to start|i'?m? ready|let'?s? start|help me start|how do i (begin|start|get started)|where do i start|get started/.test(m))
    return { intent: 'action_start', confidence: 'high' };

  if (/what (do you have|programs|courses|resources|options|can i do)|show me (all|what|your)|what'?s? available|what else (do you|is there)|what (other|more)/.test(m))
    return { intent: 'discovery', confidence: 'high' };

  if (/^(hi|hey|hello|good morning|good afternoon|good evening|howdy|yo|sup)[\s!?.]*$/.test(m) || m.length < 8)
    return { intent: 'greeting', confidence: 'high' };

  return { intent: 'wellness_advice', confidence: 'medium' };
};

// ---------------------------------------------------------------------------
// Behavioral Context
// Pulls from userProfile (stage, score, gaps, name) to personalize every
// response — the coach always knows where the user IS and where to lead them.
// ---------------------------------------------------------------------------

interface BehavioralContext {
  name: string;
  stage: MotherhoodStage | null;
  stageLabel: string;
  primaryGap: string | null;
  score: number | null;
  stateDescription: string;
  suggestedRoute: { label: string; route: string };
}

const toFirstName = (n: string) => n?.trim().split(/\s+/)[0] || 'mama';

const STAGE_LABELS: Record<string, string> = {
  pregnant: 'pregnancy',
  postpartum: 'postpartum recovery',
  ttc: 'TTC journey',
};

const buildBehavioralContext = (
  stage: MotherhoodStage | null,
  userProfile: any,
): BehavioralContext => {
  const name = toFirstName(userProfile?.display_name || userProfile?.name || 'mama');
  const score: number | null = userProfile?.wellnessScore ?? userProfile?.score ?? null;
  const gaps: string[] = userProfile?.gaps ?? [];
  const primaryGap = gaps.length > 0 ? gaps[0] : null;

  let stateDescription = 'on your wellness journey';
  if (score !== null) {
    if (score < 50) stateDescription = 'going through a tough stretch';
    else if (score <= 75) stateDescription = 'building real momentum';
    else stateDescription = 'in a strong rhythm';
  }

  // Best next step based on stage + primary gap
  let suggestedRoute = { label: 'your Dashboard', route: '/dashboard' };
  if (stage === 'pregnant') {
    if (primaryGap === 'fitness') suggestedRoute = { label: 'Prenatal Workouts', route: '/workouts?stage=pregnancy' };
    else if (primaryGap === 'nutrition') suggestedRoute = { label: 'Pregnancy Meal Plan', route: '/meal-plan?stage=pregnancy' };
    else if (primaryGap === 'stress') suggestedRoute = { label: 'Self-Care Tools', route: '/wellness/self-care' };
    else suggestedRoute = { label: 'Glow & Go Prenatal Program', route: '/programs/glow-and-go' };
  } else if (stage === 'postpartum') {
    if (primaryGap === 'recovery') suggestedRoute = { label: '30 Days Glow Up Challenge', route: '/course/266ae389-409f-4847-9a10-e29a2f3eb3f9' };
    else if (primaryGap === 'fitness') suggestedRoute = { label: 'Postpartum Workouts', route: '/workouts?stage=postpartum' };
    else if (primaryGap === 'nutrition') suggestedRoute = { label: 'Postpartum Meal Plan', route: '/meal-plan?stage=postpartum' };
    else if (primaryGap === 'stress') suggestedRoute = { label: 'Self-Care Tools', route: '/wellness/self-care' };
    else suggestedRoute = { label: 'Core Restore Foundations', route: '/workouts/core-restore-foundations' };
  } else if (stage === 'ttc') {
    if (primaryGap === 'nutrition') suggestedRoute = { label: 'TTC Meal Plan', route: '/meal-plan?stage=ttc' };
    else if (primaryGap === 'fitness') suggestedRoute = { label: 'TTC Workouts', route: '/workouts?stage=ttc' };
    else if (primaryGap === 'stress') suggestedRoute = { label: 'Self-Care Tools', route: '/wellness/self-care' };
    else suggestedRoute = { label: 'TTC Meal Plan', route: '/meal-plan?stage=ttc' };
  }

  return {
    name,
    stage,
    stageLabel: stage ? (STAGE_LABELS[stage] ?? stage) : 'wellness journey',
    primaryGap,
    score,
    stateDescription,
    suggestedRoute,
  };
};

// ---------------------------------------------------------------------------
// Wellness issue matching (used by wellness_advice intent)
// ---------------------------------------------------------------------------

const matchWellnessIssues = (message: string, stage: MotherhoodStage | null) =>
  WELLNESS_KNOWLEDGE_BASE.filter(
    issue =>
      issue.keywords.some(kw => message.toLowerCase().includes(kw)) &&
      (!stage || issue.stages.includes(stage)),
  );

// ---------------------------------------------------------------------------
// Stage-aware discovery copy
// ---------------------------------------------------------------------------

const stageDiscovery = (stageLabel: string, stage: MotherhoodStage | null): string => {
  if (stage === 'pregnant') return (
    `• Glow & Go Prenatal Program (video workouts) → /programs/glow-and-go\n` +
    `• Birth Ball Guide (labor prep) → /birth-ball-guide\n` +
    `• Prenatal Workouts → /workouts?stage=pregnancy\n` +
    `• Pregnancy Meal Plan → /meal-plan?stage=pregnancy\n` +
    `• Self-Care Tools → /wellness/self-care\n` +
    `• All Courses & Programs → /courses`
  );
  if (stage === 'postpartum') return (
    `• 30 Days Glow Up Challenge (recovery) → /course/266ae389-409f-4847-9a10-e29a2f3eb3f9\n` +
    `• Core Restore Foundations (core + pelvic floor) → /workouts/core-restore-foundations\n` +
    `• Postpartum Workouts → /workouts?stage=postpartum\n` +
    `• Postpartum Meal Plan → /meal-plan?stage=postpartum\n` +
    `• Wellness Resources (guides & planners) → /wellness/resources\n` +
    `• Self-Care Tools → /wellness/self-care\n` +
    `• All Courses & Programs → /courses`
  );
  if (stage === 'ttc') return (
    `• TTC Workouts → /workouts?stage=ttc\n` +
    `• TTC Meal Plan → /meal-plan?stage=ttc\n` +
    `• Self-Care Tools (stress & mindfulness) → /wellness/self-care\n` +
    `• Wellness Resources (guides & planners) → /wellness/resources\n` +
    `• All Courses & Programs → /courses`
  );
  return (
    `• Workouts → /workouts\n` +
    `• Meal Plans → /meal-plan\n` +
    `• Courses & Programs → /courses\n` +
    `• Wellness Resources → /wellness/resources\n` +
    `• Self-Care Tools → /wellness/self-care`
  );
};

// ---------------------------------------------------------------------------
// Main response generator
// Intent → Behavioral context → Stage filter → Leading response
// ---------------------------------------------------------------------------

export const generateWellnessResponse = (
  message: string,
  stage: MotherhoodStage | null,
  userProfile: any,
): string => {
  const { intent } = detectIntent(message);
  const ctx = buildBehavioralContext(stage, userProfile);

  switch (intent) {

    // ── Partner / Affiliate ─────────────────────────────────────────────────
    case 'affiliate': {
      const af = AFFILIATE_CONTEXT;
      return (
        `${ctx.name}, as an active Catalyst Mom member you can also earn through our Partner Program — ` +
        `it's how we let the community grow together.\n\n` +
        `**Here's how it works:**\n` +
        af.keyFacts.map(f => `• ${f}`).join('\n') +
        `\n\n**Who is it for?**\n` +
        af.whoItsFor.map(w => `• ${w}`).join('\n') +
        `\n\n📍 Apply here → ${af.applyRoute}\n` +
        `📍 Track your earnings → ${af.dashboardRoute}\n\n` +
        `Would you like to know more, or is there something else on your mind?`
      );
    }

    // ── Navigation ──────────────────────────────────────────────────────────
    case 'navigation': {
      const navPage = findAppPage(message, stage);
      if (navPage) {
        return (
          `Here's exactly where to find that, ${ctx.name}. 📍\n\n` +
          `**${navPage.label}**\n${navPage.direction}\n` +
          `→ ${navPage.route}\n\n` +
          `Since you're ${ctx.stateDescription}, you might also want to check out **${ctx.suggestedRoute.label}** → ${ctx.suggestedRoute.route}\n\n` +
          `Anything else I can help you find?`
        );
      }
      return (
        `I can point you right there! Could you give me a little more detail — ` +
        `are you looking for a workout, a meal plan, a guide, or something else? I'll send you the direct link.`
      );
    }

    // ── Greeting ────────────────────────────────────────────────────────────
    case 'greeting': {
      const stageOpen: Record<string, string> = {
        pregnant: `How is your pregnancy going? I'm here to support you through every step.`,
        postpartum: `How are you feeling today? Recovery takes time — I'm here to help you pace it right.`,
        ttc: `How's your TTC journey going this week? Let's keep you balanced and supported.`,
      };
      const open = stageOpen[stage ?? ''] ?? `How are you doing today? I'm here whenever you need support.`;
      const gapLine = ctx.primaryGap
        ? `Based on your profile, I'm keeping an eye on your **${ctx.primaryGap}** — that's where I think you'll get the most impact right now.`
        : `I'm ready to help with whatever you need today.`;
      return (
        `Hi ${ctx.name}! ${open}\n\n${gapLine}\n\n` +
        `Would you like a suggestion based on your profile, or is there something specific on your mind?`
      );
    }

    // ── Emotional Support ───────────────────────────────────────────────────
    case 'emotional_support': {
      const stageSupport: Record<string, string> = {
        pregnant: `Pregnancy can feel overwhelming — you are not failing, you are doing something incredibly hard.`,
        postpartum: `The postpartum period is one of the most demanding seasons a woman goes through. What you're feeling is valid.`,
        ttc: `The TTC journey carries so much emotional weight. It's okay to struggle with this.`,
      };
      const support = stageSupport[stage ?? ''] ?? `What you're feeling is valid. You don't have to push through everything alone.`;
      return (
        `${ctx.name}, I hear you. ${support}\n\n` +
        `Please be gentle with yourself right now. A few things that can help:\n\n` +
        `• Give yourself permission to rest — it's not laziness, it's recovery\n` +
        `• Connect with other mamas who truly get it → /community\n` +
        `• Our Self-Care tools can help you reset in just a few minutes → /wellness/self-care\n\n` +
        `If you're feeling persistently overwhelmed or like you can't cope, please reach out to your healthcare provider — real support is available and asking for help is strength.\n\n` +
        `I'm right here. What do you need most right now?`
      );
    }

    // ── Progress Check ──────────────────────────────────────────────────────
    case 'progress_check': {
      const scoreMsg = ctx.score !== null
        ? `Your wellness score is **${ctx.score}** — you're ${ctx.stateDescription}.`
        : `Let's take a look at where you are.`;
      const gapMsg = ctx.primaryGap
        ? `Your biggest opportunity right now is **${ctx.primaryGap}** — a consistent small win here will have the most impact across your ${ctx.stageLabel}.`
        : `You're covering your bases well.`;
      return (
        `${ctx.name}, here's your check-in. ${scoreMsg}\n\n` +
        `${gapMsg}\n\n` +
        `My recommendation for your ${ctx.stageLabel}: **${ctx.suggestedRoute.label}**\n` +
        `→ ${ctx.suggestedRoute.route}\n\n` +
        `You can also review your full history here → /progress\n\n` +
        `What aspect of your journey would you like to dig into?`
      );
    }

    // ── Action Start ────────────────────────────────────────────────────────
    case 'action_start': {
      const navPage = findAppPage(message, stage);
      const target = navPage ?? ctx.suggestedRoute;
      return (
        `Let's go, ${ctx.name}! Love that energy.\n\n` +
        `Based on your ${ctx.stageLabel}, the best place to start is:\n\n` +
        `**${target.label}**\n→ ${target.route}\n\n` +
        `To get the most out of it:\n` +
        `• Set a consistent time — even 10–15 minutes daily builds real momentum\n` +
        `• Notice how you feel after each session — those small wins compound\n` +
        `• Track everything here → /progress\n\n` +
        `Tap the link above and let's get started. I'm cheering you on.`
      );
    }

    // ── Discovery ───────────────────────────────────────────────────────────
    case 'discovery': {
      return (
        `Here's everything in Catalyst Mom for your ${ctx.stageLabel}, ${ctx.name}:\n\n` +
        `${stageDiscovery(ctx.stageLabel, stage)}\n\n` +
        `Based on your profile, I especially recommend starting with **${ctx.suggestedRoute.label}** → ${ctx.suggestedRoute.route}\n\n` +
        `What sounds most useful to you right now?`
      );
    }

    // ── Wellness Advice (default) ───────────────────────────────────────────
    default:
    case 'wellness_advice': {
      const issues = matchWellnessIssues(message, stage);

      if (issues.length > 0) {
        const issue = issues[0];
        let response = `${issue.responses.explanation}\n\n`;
        response += `Here's what I recommend:\n`;
        issue.responses.recommendations.forEach((rec, i) => { response += `${i + 1}. ${rec}\n`; });

        if (issue.responses.programs?.length) {
          response += `\nPrograms that can help:\n`;
          issue.responses.programs.forEach(p => { response += `• ${p}\n`; });
        }
        if (issue.responses.modifications?.length) {
          response += `\nKey modifications:\n`;
          issue.responses.modifications.forEach(m => { response += `• ${m}\n`; });
        }
        if (issue.responses.warning) {
          response += `\n⚠️ ${issue.responses.warning}`;
        }

        const navPage = findAppPage(message, stage);
        if (navPage) {
          response += `\n\n📍 **In the app:** ${navPage.direction} → ${navPage.route}`;
        } else {
          response += `\n\n📍 **Next step for your ${ctx.stageLabel}:** ${ctx.suggestedRoute.label} → ${ctx.suggestedRoute.route}`;
        }
        response += `\n\nAnything specific about this you'd like me to go deeper on?`;
        return response;
      }

      // No specific match → ask a focused clarifying question
      const m = message.toLowerCase();
      if (/pain|hurt|ache|sore|discomfort/.test(m)) return `I want to help you with that. Can you tell me:\n• Where exactly are you feeling it?\n• Is it constant or does it come and go?\n• When did it start?\n\nThis will help me give you the right guidance for your ${ctx.stageLabel}.`;
      if (/workout|exercise|move|fitness/.test(m)) return `Great — movement is so important for your ${ctx.stageLabel}. Can you share:\n• What you're currently doing?\n• Any concerns or limitations?\n• How much time you have?\n\nI'll point you to exactly the right program.`;
      if (/eat|food|diet|nutrition|meal/.test(m)) return `Nutrition is a big lever in your ${ctx.stageLabel}. A couple of questions:\n• Any symptoms or restrictions I should know about?\n• What's your biggest nutrition challenge right now?\n\nI'll give you targeted advice.`;
      if (/feel|mood|sad|anxious|stress/.test(m)) return `Your mental wellness matters just as much as your physical health. Could you tell me a bit more?\n• How long have you been feeling this way?\n• Is there a specific trigger?\n\nYou're not alone in this.`;
      if (/sleep|tired|fatigue|rest/.test(m)) return `Sleep is so hard, especially during ${ctx.stageLabel}. A few questions:\n• What's making it hard to sleep?\n• How many hours are you getting?\n• Do you have a wind-down routine?\n\nLet's work on this together.`;

      return (
        `I want to make sure I help you with exactly the right thing. Could you give me a bit more detail?\n\n` +
        `Here's what I can help you with for your ${ctx.stageLabel}:\n` +
        `${stageDiscovery(ctx.stageLabel, stage)}\n\n` +
        `What are you most focused on right now?`
      );
    }
  }
};

export const getQuickSuggestions = (stage: MotherhoodStage | null): string[] => {
  if (stage === 'pregnant') {
    return [
      "What programs do you have for pregnancy?",
      "I'm experiencing sciatica pain",
      "Where's my meal plan?",
      "Safe exercises for my trimester?",
      "How am I doing on my wellness journey?",
      "I'm feeling overwhelmed",
    ];
  }
  if (stage === 'postpartum') {
    return [
      "What do you have for postpartum recovery?",
      "How do I start the 30 Days Glow Up?",
      "Where's my meal plan?",
      "Core recovery after birth",
      "I'm feeling overwhelmed",
      "How am I doing?",
    ];
  }
  if (stage === 'ttc') {
    return [
      "What do you have for TTC?",
      "Fertility-supporting nutrition",
      "Where's my meal plan?",
      "I'm stressed about TTC",
      "Best exercises while TTC",
      "How am I doing?",
    ];
  }
  return [
    "What programs do you have?",
    "How am I doing?",
    "I want to get started",
    "Where are my resources?",
    "Help me with sleep",
  ];
};