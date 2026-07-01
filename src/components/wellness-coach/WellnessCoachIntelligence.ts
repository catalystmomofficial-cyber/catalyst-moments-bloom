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
];

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

const analyzeUserMessage = (message: string, stage: MotherhoodStage | null) => {
  const lowerMessage = message.toLowerCase();
  
  // Check for specific issues first
  const matchingIssues = WELLNESS_KNOWLEDGE_BASE.filter(issue => 
    issue.keywords.some(keyword => lowerMessage.includes(keyword)) &&
    (!stage || issue.stages.includes(stage))
  );
  
  // Detect question types
  const isQuestionAboutPain = /pain|hurt|ache|sore|discomfort/.test(lowerMessage);
  const isQuestionAboutExercise = /workout|exercise|move|activity|fitness/.test(lowerMessage);
  const isQuestionAboutNutrition = /eat|food|diet|nutrition|meal|vitamin/.test(lowerMessage);
  const isQuestionAboutMood = /feel|mood|sad|happy|anxious|depressed|stress/.test(lowerMessage);
  const isQuestionAboutSleep = /sleep|tired|fatigue|rest|energy/.test(lowerMessage);
  
  return {
    matchingIssues,
    categories: {
      pain: isQuestionAboutPain,
      exercise: isQuestionAboutExercise,
      nutrition: isQuestionAboutNutrition,
      mood: isQuestionAboutMood,
      sleep: isQuestionAboutSleep
    },
    isVague: message.trim().length < 10 || 
             /^(hi|hello|hey|help|what|how|can you)/.test(lowerMessage.trim())
  };
};

const askClarifyingQuestions = (message: string, stage: MotherhoodStage | null) => {
  const analysis = analyzeUserMessage(message, stage);
  
  if (analysis.isVague) {
    const stageSpecificQuestions = getStageSpecificQuestions(stage);
    return `I'd love to help you! To give you the best advice, could you tell me more about what you're experiencing? Here are some areas I can help with:\n\n${stageSpecificQuestions.join('\n')}\n\nWhat would you like to focus on today?`;
  }
  
  if (analysis.categories.pain) {
    return `I understand you're experiencing some discomfort. To help you better, could you tell me:\n\n• Where exactly are you feeling pain?\n• When did it start?\n• What makes it better or worse?\n• How would you rate the pain (1-10)?\n\nThis will help me give you more targeted advice.`;
  }
  
  if (analysis.categories.exercise) {
    return `Great question about exercise! To give you the best recommendations, could you share:\n\n• What type of activities are you currently doing?\n• Are you experiencing any limitations or concerns?\n• What are your fitness goals right now?\n• How much time do you have for workouts?\n\nThis will help me suggest the perfect program for you.`;
  }
  
  if (analysis.categories.nutrition) {
    return `Nutrition is so important! To provide the most helpful guidance, could you tell me:\n\n• Are you dealing with any specific symptoms (nausea, cravings, etc.)?\n• Do you have any dietary restrictions or preferences?\n• What's your biggest nutrition challenge right now?\n• Are you taking any supplements?\n\nThis will help me give you personalized nutrition advice.`;
  }
  
  if (analysis.categories.mood) {
    return `Thank you for sharing how you're feeling. Your mental wellness is just as important as your physical health. To better support you, could you tell me:\n\n• How long have you been feeling this way?\n• Are there specific triggers or times when you feel worse?\n• What usually helps you feel better?\n• Do you have support from family/friends?\n\nRemember, it's completely normal to have ups and downs during this journey.`;
  }
  
  if (analysis.categories.sleep) {
    return `Sleep challenges are so common! To help you get better rest, could you share:\n\n• What's making it hard to sleep?\n• How many hours are you currently getting?\n• Do you have a bedtime routine?\n• Are you comfortable physically when trying to sleep?\n\nLet's work together to improve your sleep quality.`;
  }
  
  return `I want to make sure I understand your concern correctly. Could you tell me a bit more about what you're experiencing? The more details you can share, the better I can help you find the right solution.`;
};

const getStageSpecificQuestions = (stage: MotherhoodStage | null): string[] => {
  if (stage === 'pregnant') {
    return [
      '• Physical discomfort or pain management',
      '• Safe exercise and movement modifications', 
      '• Pregnancy nutrition and supplements',
      '• Managing pregnancy symptoms',
      '• Preparing your body for birth'
    ];
  } else if (stage === 'postpartum') {
    return [
      '• Postpartum recovery and healing',
      '• Core and pelvic floor rehabilitation',
      '• Managing postpartum mood changes',
      '• Returning to exercise safely',
      '• Breastfeeding and nutrition support'
    ];
  } else if (stage === 'ttc') {
    return [
      '• Fertility-supporting nutrition',
      '• Exercise recommendations while TTC',
      '• Managing TTC stress and emotions',
      '• Cycle tracking and optimization',
      '• Preparing your body for pregnancy'
    ];
  }
  
  return [
    '• Exercise and movement guidance',
    '• Nutrition and meal planning',
    '• Managing physical discomfort',
    '• Sleep and energy optimization',
    '• Mental wellness support'
  ];
};

export const generateWellnessResponse = (
  message: string,
  stage: MotherhoodStage | null,
  userProfile: any
): string => {
  const analysis = analyzeUserMessage(message, stage);

  // ── Navigation / "where is X" queries ──────────────────────────────────
  // Check first so "where are the workouts" gets a direct link, not a clarifying
  // question loop.
  const navPage = findAppPage(message, stage);
  const navQuery = isNavigationQuery(message);

  if (navPage && (navQuery || analysis.isVague)) {
    return (
      `Here's where you can find that! 📍\n\n` +
      `**${navPage.label}**\n${navPage.direction}\n\n` +
      `You can also tap this link to go there directly: ${navPage.route}\n\n` +
      `Is there anything else I can help you find?`
    );
  }

  // ── Specific wellness issue match ─────────────────────────────────────
  if (analysis.matchingIssues.length > 0) {
    const issue = analysis.matchingIssues[0];
    let response = `${issue.responses.explanation}\n\n`;

    response += "Here's what I recommend:\n";
    issue.responses.recommendations.forEach((rec, index) => {
      response += `${index + 1}. ${rec}\n`;
    });

    if (issue.responses.programs) {
      response += `\nPrograms that might help you:\n`;
      issue.responses.programs.forEach(program => {
        response += `• ${program}\n`;
      });
    }

    if (issue.responses.modifications) {
      response += `\nImportant modifications:\n`;
      issue.responses.modifications.forEach(mod => {
        response += `• ${mod}\n`;
      });
    }

    if (issue.responses.warning) {
      response += `\n⚠️ Important: ${issue.responses.warning}`;
    }

    // If we also matched an app page, append a deep-link suggestion
    if (navPage) {
      response += `\n\n📍 **Find it in the app:** ${navPage.direction} → ${navPage.route}`;
    }

    response += `\n\nIs there anything specific about this you'd like me to explain further?`;
    return response;
  }

  // ── Vague / category-only → clarifying questions ──────────────────────
  if (analysis.isVague || !Object.values(analysis.categories).some(Boolean)) {
    return askClarifyingQuestions(message, stage);
  }

  return askClarifyingQuestions(message, stage);
};

export const getQuickSuggestions = (stage: MotherhoodStage | null): string[] => {
  const baseQuestions = [
    "I'm feeling tired after workouts, what should I do?",
    "Can you recommend some gentle stretches?",
    "I have questions about nutrition",
    "Help me with sleep strategies"
  ];
  
  if (stage === 'pregnant') {
    return [
      "I'm experiencing sciatica pain",
      "Safe exercises for my trimester?",
      "Pregnancy nutrition guidance",
      "Managing pregnancy fatigue",
      ...baseQuestions.slice(0, 2)
    ];
  } else if (stage === 'postpartum') {
    return [
      "Core recovery after birth",
      "Dealing with postpartum mood changes",
      "When can I start exercising again?",
      "Breastfeeding and exercise",
      ...baseQuestions.slice(0, 2)
    ];
  } else if (stage === 'ttc') {
    return [
      "Fertility-supporting nutrition",
      "Best exercises while TTC",
      "Managing TTC stress",
      "Cycle tracking and exercise",
      ...baseQuestions.slice(0, 2)
    ];
  }
  
  return baseQuestions;
};