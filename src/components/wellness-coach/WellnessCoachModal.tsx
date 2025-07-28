
import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Send, Heart } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WellnessCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define message types
interface Message {
  id: string;
  content: string;
  sender: 'coach' | 'user';
  timestamp: Date;
  options?: CoachOption[];
}

interface CoachOption {
  id: string;
  text: string;
  action: () => void;
}

// Mock coaching data by stage
const getWorkoutsByStage = (stage: string) => {
  switch (stage) {
    case 'ttc':
      return [
        { id: '1', title: 'Fertility-Supporting Yoga', duration: '15 min', focus: 'Reproductive Health' },
        { id: '2', title: 'Stress-Relief Movement', duration: '12 min', focus: 'Mental Wellness' },
        { id: '3', title: 'Core Strength for TTC', duration: '10 min', focus: 'Core Stability' }
      ];
    case 'pregnant':
      return [
        { id: '1', title: 'Prenatal Safe Cardio', duration: '15 min', focus: 'Cardiovascular Health' },
        { id: '2', title: 'Pregnancy Core & Pelvic Floor', duration: '12 min', focus: 'Core Support' },
        { id: '3', title: 'Gentle Prenatal Yoga', duration: '20 min', focus: 'Flexibility & Relaxation' }
      ];
    case 'postpartum':
      return [
        { id: '1', title: 'Gentle Postpartum Core', duration: '10 min', focus: 'Core Recovery' },
        { id: '2', title: 'Energy Boost Routine', duration: '15 min', focus: 'Full Body' },
        { id: '3', title: 'Pelvic Floor Strength', duration: '8 min', focus: 'Recovery' }
      ];
    default:
      return [
        { id: '1', title: 'Gentle Movement Flow', duration: '12 min', focus: 'Full Body' },
        { id: '2', title: 'Stress-Relief Workout', duration: '10 min', focus: 'Mental Wellness' },
        { id: '3', title: 'Energy Building Routine', duration: '15 min', focus: 'Strength' }
      ];
  }
};

const getMealIdeasByStage = (stage: string) => {
  switch (stage) {
    case 'ttc':
      return [
        { id: '1', meal: 'Breakfast', suggestion: 'Spinach and feta omelet with whole grain toast (400 cal)', benefits: 'Folate, protein for fertility' },
        { id: '2', meal: 'Lunch', suggestion: 'Quinoa bowl with avocado and seeds (450 cal)', benefits: 'Omega-3s, antioxidants' },
        { id: '3', meal: 'Dinner', suggestion: 'Wild salmon with sweet potato (500 cal)', benefits: 'Omega-3s, vitamin D' },
      ];
    case 'pregnant':
      return [
        { id: '1', meal: 'Breakfast', suggestion: 'Fortified cereal with milk and berries (350 cal)', benefits: 'Folate, calcium for baby' },
        { id: '2', meal: 'Lunch', suggestion: 'Lentil soup with whole grain bread (400 cal)', benefits: 'Iron, fiber, protein' },
        { id: '3', meal: 'Dinner', suggestion: 'Lean beef with steamed broccoli and rice (550 cal)', benefits: 'Iron, vitamin C, B vitamins' },
      ];
    case 'postpartum':
      return [
        { id: '1', meal: 'Breakfast', suggestion: 'Greek yogurt with berries and granola (350 cal)', benefits: 'Protein, calcium for nursing' },
        { id: '2', meal: 'Lunch', suggestion: 'Avocado toast with eggs (450 cal)', benefits: 'Healthy fats, protein for energy' },
        { id: '3', meal: 'Dinner', suggestion: 'Sheet pan salmon with roasted vegetables (500 cal)', benefits: 'Omega-3s, vitamins for recovery' },
      ];
    default:
      return [
        { id: '1', meal: 'Breakfast', suggestion: 'Overnight oats with nuts and fruit (380 cal)', benefits: 'Sustained energy, fiber' },
        { id: '2', meal: 'Lunch', suggestion: 'Mediterranean salad with chickpeas (420 cal)', benefits: 'Antioxidants, plant protein' },
        { id: '3', meal: 'Dinner', suggestion: 'Grilled chicken with quinoa and vegetables (480 cal)', benefits: 'Complete protein, nutrients' },
      ];
  }
};

const WellnessCoachModal = ({ isOpen, onClose }: WellnessCoachModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userProfile, setUserProfile] = useState<{
    name?: string;
    weeksPostpartum?: number;
    energyLevel?: 'low' | 'medium' | 'high';
    goals?: string[];
    onboarded: boolean;
    motherhoodStage?: 'ttc' | 'pregnant' | 'postpartum' | 'general';
  }>({ onboarded: false, motherhoodStage: 'postpartum' });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Initial welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        const stage = userProfile.motherhoodStage || 'postpartum';
        const welcomeMessage = getWelcomeMessage(stage);
        
        addCoachMessage(
          welcomeMessage,
          [
            { 
              id: 'feeling-good', 
              text: "I'm feeling good today", 
              action: () => handleFeelingResponse("good") 
            },
            { 
              id: 'feeling-tired', 
              text: "I'm feeling tired", 
              action: () => handleFeelingResponse("tired") 
            },
            { 
              id: 'feeling-overwhelmed', 
              text: "I'm feeling overwhelmed", 
              action: () => handleFeelingResponse("overwhelmed") 
            },
            { 
              id: 'feeling-excited', 
              text: "I'm feeling excited", 
              action: () => handleFeelingResponse("excited") 
            }
          ]
        );
      }, 500);
    }
  }, [isOpen]);

  const getWelcomeMessage = (stage: string) => {
    switch (stage) {
      case 'ttc':
        return "Hi there! I'm your fertility wellness coach. I'm here to support you on your TTC journey with workouts, nutrition, and stress management. How are you feeling today?";
      case 'pregnant':
        return "Hi there! I'm your pregnancy wellness coach. I'm here to support you and your growing baby with safe workouts and nutrition. How are you feeling today?";
      case 'postpartum':
        return "Hi there! I'm your postpartum wellness coach. I'm here to support you on your recovery and wellness journey. How are you feeling today?";
      default:
        return "Hi there! I'm your wellness coach. I'm here to support you on your motherhood wellness journey. How are you feeling today?";
    }
  };

  const addCoachMessage = (content: string, options: CoachOption[] = []) => {
    setMessages(prev => [
      ...prev, 
      {
        id: Date.now().toString(),
        content,
        sender: 'coach',
        timestamp: new Date(),
        options
      }
    ]);
  };

  const addUserMessage = (content: string) => {
    setMessages(prev => [
      ...prev, 
      {
        id: Date.now().toString(),
        content,
        sender: 'user',
        timestamp: new Date()
      }
    ]);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;
    
    addUserMessage(inputMessage);
    setInputMessage('');
    
    // Simple response logic
    setTimeout(() => {
      if (inputMessage.toLowerCase().includes('workout') || inputMessage.toLowerCase().includes('exercise')) {
        suggestWorkouts();
      } else if (inputMessage.toLowerCase().includes('eat') || inputMessage.toLowerCase().includes('food') || inputMessage.toLowerCase().includes('meal')) {
        suggestMeals();
      } else if (inputMessage.toLowerCase().includes('stress') || inputMessage.toLowerCase().includes('anxiety') || inputMessage.toLowerCase().includes('overwhelm')) {
        provideSupportiveResponse();
      } else {
        // General response
        addCoachMessage(
          "Thanks for sharing! How can I help you today?", 
          [
            { id: 'help-workout', text: 'Find a quick workout', action: suggestWorkouts },
            { id: 'help-meal', text: 'Get meal ideas', action: suggestMeals },
            { id: 'help-support', text: 'I need support', action: provideSupportiveResponse }
          ]
        );
      }
    }, 1000);
  };

  const handleFeelingResponse = (feeling: string) => {
    addUserMessage(`I'm feeling ${feeling} today`);
    
    setTimeout(() => {
      const stage = userProfile.motherhoodStage || 'postpartum';
      
      if (feeling === "good") {
        const message = stage === 'ttc' 
          ? "That's wonderful to hear! Positive energy is great for fertility. Would you like to build on this with some fertility-supporting workouts or nutrition tips?"
          : stage === 'pregnant'
          ? "That's wonderful to hear! Let's keep this positive energy going with some safe pregnancy workouts or nutrition ideas for you and baby."
          : "That's wonderful to hear! Would you like to build on this positive energy with a quick workout or some healthy meal ideas?";
        
        addCoachMessage(message, [
          { id: 'good-workout', text: 'Show me workouts', action: suggestWorkouts },
          { id: 'good-meal', text: 'Show me meal ideas', action: suggestMeals }
        ]);
      } else if (feeling === "tired") {
        const message = stage === 'ttc' 
          ? "I understand. TTC can be emotionally and physically draining. Would you like some gentle energy-boosting exercises or fertility-supporting nutrition tips?"
          : stage === 'pregnant'
          ? "Fatigue is so common during pregnancy! Would you like some gentle energy-boosting exercises safe for pregnancy or nutrition tips to help combat tiredness?"
          : "I understand. Being a mom is demanding work. Would you like some gentle energy-boosting exercises or nutrition tips to help with fatigue?";
        
        addCoachMessage(message, [
          { id: 'tired-workout', text: 'Energy-boosting exercises', action: suggestLowEnergyWorkouts },
          { id: 'tired-meal', text: 'Energy-boosting foods', action: suggestEnergyMeals }
        ]);
      } else if (feeling === "overwhelmed") {
        const message = stage === 'ttc' 
          ? "I'm sorry you're feeling overwhelmed. The TTC journey can be emotionally challenging. Would you like some stress-relief techniques to support fertility or calming self-care ideas?"
          : stage === 'pregnant'
          ? "I'm sorry you're feeling overwhelmed. Pregnancy can bring many emotions. Would you like some safe stress-relief techniques or self-care ideas for expectant moms?"
          : "I'm sorry you're feeling overwhelmed. That's completely normal as a new mom. Would you like me to suggest some quick stress-relief techniques or simple self-care ideas?";
        
        addCoachMessage(message, [
          { id: 'overwhelmed-breathe', text: 'Stress-relief techniques', action: suggestBreathingExercise },
          { id: 'overwhelmed-selfcare', text: 'Simple self-care ideas', action: suggestSelfCare }
        ]);
      } else if (feeling === "excited") {
        const message = stage === 'ttc' 
          ? "That's amazing! Excitement and positive emotions can be beneficial for fertility. How can I help channel this energy today?"
          : stage === 'pregnant'
          ? "That's wonderful! Pregnancy excitement is beautiful. How can I help you make the most of this positive energy today?"
          : "That's amazing! I love seeing moms excited about their wellness journey. How can I help you make the most of this energy today?";
        
        addCoachMessage(message, [
          { id: 'excited-workout', text: 'I want to move my body!', action: suggestWorkouts },
            { id: 'excited-plan', text: 'Help me plan my day', action: () => addCoachMessage("Let me create a daily plan for you! Check out the Plan Creator for a personalized schedule.") },
            { id: 'excited-learn', text: 'Teach me something new', action: () => addCoachMessage("Great! Visit our Video Library for expert courses on motherhood wellness.") }
        ]);
      }
    }, 1000);
  };

  const suggestWorkouts = () => {
    const stage = userProfile.motherhoodStage || 'postpartum';
    const workouts = getWorkoutsByStage(stage);
    
    const stageMessages = {
      ttc: "Here are some fertility-supporting workouts designed to reduce stress and support reproductive health:",
      pregnant: "Here are some safe pregnancy workouts designed for you and your growing baby:",
      postpartum: "Here are some postpartum-friendly workouts designed to support your recovery journey:",
      general: "Here are some wellness-focused workouts designed to support your motherhood journey:"
    };
    
    addCoachMessage(
      stageMessages[stage as keyof typeof stageMessages] || stageMessages.general,
      []
    );
    
    setTimeout(() => {
      const workoutList = workouts.map(workout => 
        `${workout.title} (${workout.duration}) - Focus: ${workout.focus}`
      ).join('\n');
      
      addCoachMessage(
        `Here are some great workout options:\n\n${workoutList}`,
        [
          { id: 'workout-more', text: 'Show me more workouts', action: () => window.location.href = '/workouts' },
          { id: 'workout-thanks', text: 'Thank you!', action: () => addCoachMessage("You're welcome! Let me know if you try any of these or need more suggestions.") }
        ]
      );
    }, 1000);
  };

  const suggestLowEnergyWorkouts = () => {
    addCoachMessage(
      "When you're tired, gentle movement can actually help boost your energy. Here are some very light exercises that won't deplete you further:",
      []
    );
    
    setTimeout(() => {
      addCoachMessage(
        `Here are some gentle low-energy exercises:

• Gentle Stretching Sequence (5 min) - Focus: Flexibility
• Energy-Boosting Breathing (3 min) - Focus: Energy  
• Seated Arm Movements (5 min) - Focus: Circulation`,
        [
          { id: 'energy-more', text: 'Show me more', action: () => window.location.href = '/workouts' },
          { id: 'energy-rest', text: 'I think I need rest instead', action: suggestRestIdeas }
        ]
      );
    }, 1000);
  };

  const suggestRestIdeas = () => {
    addCoachMessage(
      "You're absolutely right to listen to your body. Rest is crucial for recovery. Here are some restful self-care ideas that might help you recharge:",
      []
    );
    
    setTimeout(() => {
      addCoachMessage(
        `Here are some restful self-care ideas:

• 10-Minute Power Nap - When baby sleeps, set a timer and close your eyes
• Legs Up The Wall - A restorative yoga pose - just 5 minutes helps circulation  
• Guided Relaxation - Try a 5-minute meditation focused on rest`,
        [
          { id: 'rest-thanks', text: 'Thank you, this helps', action: () => addCoachMessage("You're welcome! Remember, resting when you need it is a form of self-care, not laziness. Your body is still recovering.") }
        ]
      );
    }, 1000);
  };

  const suggestMeals = () => {
    const stage = userProfile.motherhoodStage || 'postpartum';
    const meals = getMealIdeasByStage(stage);
    
    const stageMessages = {
      ttc: "Here are some fertility-supporting meal ideas with nutrients that promote reproductive health:",
      pregnant: "Here are some pregnancy-safe meal ideas that support you and your baby's development:",
      postpartum: "Here are some nutritious meal ideas that are quick to prepare and support postpartum recovery:",
      general: "Here are some nutritious meal ideas to support your wellness journey:"
    };
    
    addCoachMessage(
      stageMessages[stage as keyof typeof stageMessages] || stageMessages.general,
      []
    );
    
    setTimeout(() => {
      const mealList = meals.map(meal => 
        `${meal.meal}: ${meal.suggestion} - Benefits: ${meal.benefits}`
      ).join('\n\n');
      
      const stageSpecificThanks = {
        ttc: "I'm glad! Proper nutrition is crucial for fertility and overall health. If you have any dietary restrictions or specific fertility nutrition questions, just let me know.",
        pregnant: "I'm glad! Proper nutrition is so important for you and your baby's health. If you have any dietary restrictions or pregnancy-specific nutrition questions, just let me know.",
        postpartum: "I'm glad! Proper nutrition is so important during postpartum recovery. If you have any dietary restrictions or preferences, just let me know.",
        general: "I'm glad! Proper nutrition supports your overall wellness journey. If you have any dietary restrictions or preferences, just let me know."
      };
      
      addCoachMessage(
        `Here are some nutritious meal ideas:\n\n${mealList}`,
        [
          { id: 'meal-more', text: 'More meal ideas', action: () => window.location.href = '/recipes' },
          { id: 'meal-thanks', text: 'This is helpful!', action: () => addCoachMessage(stageSpecificThanks[stage as keyof typeof stageSpecificThanks] || stageSpecificThanks.general) }
        ]
      );
    }, 1000);
  };

  const suggestEnergyMeals = () => {
    addCoachMessage(
      "When your energy is low, the right foods can help. Here are some quick energy-boosting snacks and meals:",
      []
    );
    
    setTimeout(() => {
      addCoachMessage(
        `Here are some quick energy-boosting options:

• Banana with almond butter (200 cal) - Quick energy + sustained protein
• Trail mix with nuts and dark chocolate (250 cal) - Healthy fats, protein, and a bit of caffeine
• Oatmeal with berries and seeds (300 cal) - Sustained energy release + antioxidants`,
        [
          { id: 'energy-meal-more', text: 'More energy foods', action: () => window.location.href = '/recipes' },
          { id: 'energy-meal-hydration', text: 'What about hydration?', action: suggestHydrationTips }
        ]
      );
    }, 1000);
  };

  const suggestHydrationTips = () => {
    const stage = userProfile.motherhoodStage || 'postpartum';
    
    const stageMessages = {
      ttc: "Great question! Hydration is crucial for fertility, hormone balance, and overall health. Here are some hydration tips:",
      pregnant: "Great question! Hydration is extra important during pregnancy for you and your baby's development. Here are some hydration tips:",
      postpartum: "Great question! Hydration is extremely important for energy levels, milk production, and overall recovery. Here are some hydration tips:",
      general: "Great question! Hydration is crucial for energy, health, and overall wellness. Here are some hydration tips:"
    };
    
    const stageSpecificTips = {
      ttc: `Here are some hydration tips:

• Start your day with water - Add lemon for vitamin C and digestive support
• Infused water options - Try cucumber + mint or berry blends for antioxidants
• Hydrating foods - Watermelon, cucumber, oranges help with overall fluid intake`,
      pregnant: `Here are some hydration tips:

• Sip throughout the day - Don't wait until you're thirsty during pregnancy
• Coconut water - Natural electrolytes can help with pregnancy fatigue
• Herbal teas - Ginger tea for nausea, raspberry leaf tea in third trimester`,
      postpartum: `Here are some hydration tips:

• Drink when you breastfeed - Keep a water bottle at your feeding station
• Infused water options - Try cucumber + mint or strawberry + basil for flavor
• Hydrating foods - Watermelon, cucumber, oranges, and soup all contribute to hydration`,
      general: `Here are some hydration tips:

• Morning hydration ritual - Start with a glass of water upon waking
• Flavor naturally - Add fruits, herbs, or cucumber for variety
• Hydrating snacks - Choose water-rich foods like melons, soups, and smoothies`
    };
    
    const stageSpecificAdvice = {
      ttc: "Aim for 8-10 glasses of water daily. Proper hydration supports hormone production and overall fertility health.",
      pregnant: "Aim for 10-12 glasses of water daily during pregnancy. Your body needs extra fluids to support your growing baby.",
      postpartum: "Aim for about 3 liters of total fluids daily while breastfeeding. Your urine should be light yellow - that's a good indicator of proper hydration.",
      general: "Aim for 8-10 glasses of water daily. Listen to your body and drink more during exercise or hot weather."
    };
    
    addCoachMessage(
      stageMessages[stage as keyof typeof stageMessages] || stageMessages.general,
      []
    );
    
    setTimeout(() => {
      addCoachMessage(
        stageSpecificTips[stage as keyof typeof stageSpecificTips] || stageSpecificTips.general,
        [
          { id: 'hydration-thanks', text: 'Thank you!', action: () => addCoachMessage(stageSpecificAdvice[stage as keyof typeof stageSpecificAdvice] || stageSpecificAdvice.general) }
        ]
      );
    }, 1000);
  };

  const provideSupportiveResponse = () => {
    const stage = userProfile.motherhoodStage || 'postpartum';
    
    const stageMessages = {
      ttc: "It's completely normal to feel overwhelmed during your TTC journey. The emotional ups and downs are valid, and you're stronger than you know.",
      pregnant: "It's completely normal to feel overwhelmed during pregnancy. Your body and emotions are going through so much - your feelings are valid.",
      postpartum: "It's completely normal to feel overwhelmed as a new mom. Your feelings are valid, and you're doing better than you think.",
      general: "It's completely normal to feel overwhelmed in motherhood. Your feelings are valid, and you're doing an amazing job."
    };
    
    addCoachMessage(
      stageMessages[stage as keyof typeof stageMessages] || stageMessages.general,
      []
    );
    
    setTimeout(() => {
      addCoachMessage(
        "Would you like some quick calming techniques or supportive resources?",
        [
          { id: 'support-breathe', text: 'Calming techniques', action: suggestBreathingExercise },
          { id: 'support-talk', text: 'I just need to talk', action: offerSupportiveEar }
        ]
      );
    }, 1000);
  };

  const suggestBreathingExercise = () => {
    addCoachMessage(
      "Let's try a simple breathing exercise together. This takes just 60 seconds and can help reduce stress immediately:",
      []
    );
    
    setTimeout(() => {
      addCoachMessage(
        `60-Second Box Breathing:

1. Breathe in slowly for 4 counts
2. Hold your breath for 4 counts
3. Exhale slowly for 4 counts
4. Hold for 4 counts before breathing in again
5. Repeat 3-5 times`,
        [
          { id: 'breathing-done', text: 'I did it', action: () => addCoachMessage("Wonderful! How do you feel now? Remember you can use this technique anytime you feel stressed or overwhelmed. Even just one minute can make a difference.") },
          { id: 'breathing-more', text: 'Show me more techniques', action: suggestMoreCalming }
        ]
      );
    }, 1000);
  };

  const suggestMoreCalming = () => {
    addCoachMessage(
      "Here are more quick calming techniques you can try throughout your day:",
      []
    );
    
    setTimeout(() => {
      addCoachMessage(
        `Here are more calming techniques:

• 5-4-3-2-1 Grounding - Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste
• Progressive Muscle Relaxation - Tense and release each muscle group for 5 seconds, starting from your toes
• Hand on Heart - Place your hand on your heart, breathe deeply, and think of someone you love`,
        [
          { id: 'calming-wellness', text: 'Go to Wellness resources', action: () => window.location.href = '/wellness' },
          { id: 'calming-thanks', text: 'Thank you', action: () => addCoachMessage("You're welcome! These techniques are always available to you, even during the busiest moments. Your mental health matters.") }
        ]
      );
    }, 1000);
  };

  const offerSupportiveEar = () => {
    addCoachMessage(
      "I'm here to listen. Sometimes just expressing what you're going through can help lighten the mental load. What's been most challenging for you lately?",
      []
    );
    
    setTimeout(() => {
      addCoachMessage(
        "Remember, whatever you're experiencing is a normal part of the motherhood journey. You're not alone in these feelings.",
        [
          { id: 'talk-community', text: 'Connect with other moms', action: () => window.location.href = '/community' },
          { id: 'talk-thanks', text: 'This helps, thank you', action: () => addCoachMessage("I'm glad I could help, even if just by listening. Remember to be as kind to yourself as you would be to a friend going through the same thing.") }
        ]
      );
    }, 2000);
  };

  const suggestSelfCare = () => {
    addCoachMessage(
      "Self-care doesn't have to be time-consuming. Here are some very simple ideas you can fit into your day:",
      []
    );
    
    setTimeout(() => {
      addCoachMessage(
        `Here are simple self-care ideas:

• 2-Minute Face Refresh - Splash cool water, apply moisturizer, take 3 deep breaths
• One Song Dance Party - Play a favorite upbeat song and move freely - with or without baby
• Sensory Reset - Apply a nice-smelling lotion, drink a warm beverage slowly, or step outside for fresh air`,
        [
          { id: 'selfcare-wellness', text: 'More wellness ideas', action: () => window.location.href = '/wellness' },
          { id: 'selfcare-thanks', text: "I'll try these", action: () => addCoachMessage("Wonderful! Even these small moments of self-care add up. Remember that caring for yourself is part of caring for your family.") }
        ]
      );
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" alt="Wellness Coach" />
                <AvatarFallback className="bg-catalyst-copper text-white">WC</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-lg">Wellness Coach</DialogTitle>
                <p className="text-xs text-muted-foreground">Your postpartum support partner</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              <div className="flex items-start gap-3">
                {message.sender === 'coach' && (
                  <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                    <AvatarImage src="/placeholder.svg" alt="Wellness Coach" />
                    <AvatarFallback className="bg-catalyst-copper text-white">WC</AvatarFallback>
                  </Avatar>
                )}
                <Card className={cn(
                  "p-3 max-w-[85%]",
                  message.sender === 'coach' 
                    ? "bg-muted border-none" 
                    : "bg-primary text-primary-foreground ml-auto"
                )}>
                  <div className="text-sm whitespace-pre-line">
                    {message.content}
                  </div>
                </Card>
              </div>
              {message.options && message.options.length > 0 && (
                <div className="ml-11 mt-2 flex flex-wrap gap-2">
                  {message.options.map(option => (
                    <Button 
                      key={option.id}
                      variant="outline"
                      size="sm"
                      onClick={option.action}
                      className="text-xs"
                    >
                      {option.text}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t flex-shrink-0">
          <div className="flex items-center gap-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="min-h-[44px] max-h-[120px]"
              rows={1}
            />
            <Button 
              size="icon" 
              onClick={handleSendMessage}
              className="bg-primary h-[44px] w-[44px] rounded-full flex-shrink-0"
              disabled={inputMessage.trim() === ''}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WellnessCoachModal;
