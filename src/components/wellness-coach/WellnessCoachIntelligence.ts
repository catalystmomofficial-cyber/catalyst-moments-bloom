import { MotherhoodStage } from '@/contexts/AuthContext';

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
  
  // If we have specific matches, provide targeted advice
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
    
    response += `\n\nIs there anything specific about this you'd like me to explain further?`;
    return response;
  }
  
  // If message is unclear or too vague, ask clarifying questions
  if (analysis.isVague || (!Object.values(analysis.categories).some(Boolean))) {
    return askClarifyingQuestions(message, stage);
  }
  
  // Provide category-specific guidance with follow-up questions
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