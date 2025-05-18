
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

// Mock coaching data
const quickWorkouts = [
  { id: '1', title: 'Gentle Postpartum Core', duration: '10 min', focus: 'Core' },
  { id: '2', title: 'Energy Boost Routine', duration: '15 min', focus: 'Full Body' },
  { id: '3', title: 'Pelvic Floor Strength', duration: '8 min', focus: 'Recovery' }
];

const mealIdeas = [
  { id: '1', meal: 'Breakfast', suggestion: 'Greek yogurt with berries and granola (350 cal)', benefits: 'Protein, calcium' },
  { id: '2', meal: 'Lunch', suggestion: 'Avocado toast with eggs (450 cal)', benefits: 'Healthy fats, protein' },
  { id: '3', meal: 'Dinner', suggestion: 'Sheet pan salmon with roasted vegetables (500 cal)', benefits: 'Omega-3s, vitamins' },
];

const WellnessCoachModal = ({ isOpen, onClose }: WellnessCoachModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userProfile, setUserProfile] = useState<{
    name?: string;
    weeksPostpartum?: number;
    energyLevel?: 'low' | 'medium' | 'high';
    goals?: string[];
    onboarded: boolean;
  }>({ onboarded: false });
  
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
        addCoachMessage(
          "Hi there! I'm your postpartum wellness coach. I'm here to support you on your wellness journey. How are you feeling today?",
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
            }
          ]
        );
      }, 500);
    }
  }, [isOpen]);

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
      if (feeling === "good") {
        addCoachMessage(
          "That's wonderful to hear! Would you like to build on this positive energy with a quick workout or some healthy meal ideas?",
          [
            { id: 'good-workout', text: 'Show me workouts', action: suggestWorkouts },
            { id: 'good-meal', text: 'Show me meal ideas', action: suggestMeals }
          ]
        );
      } else if (feeling === "tired") {
        addCoachMessage(
          "I understand. Being a mom is demanding work. Would you like some gentle energy-boosting exercises or nutrition tips to help with fatigue?",
          [
            { id: 'tired-workout', text: 'Energy-boosting exercises', action: suggestLowEnergyWorkouts },
            { id: 'tired-meal', text: 'Energy-boosting foods', action: suggestEnergyMeals }
          ]
        );
      } else if (feeling === "overwhelmed") {
        addCoachMessage(
          "I'm sorry you're feeling overwhelmed. That's completely normal as a new mom. Would you like me to suggest some quick stress-relief techniques or simple self-care ideas?",
          [
            { id: 'overwhelmed-breathe', text: 'Stress-relief techniques', action: suggestBreathingExercise },
            { id: 'overwhelmed-selfcare', text: 'Simple self-care ideas', action: suggestSelfCare }
          ]
        );
      }
    }, 1000);
  };

  const suggestWorkouts = () => {
    addCoachMessage(
      "Here are some postpartum-friendly workouts you might enjoy. These are all designed to be safe and effective for your recovery journey:",
      []
    );
    
    setTimeout(() => {
      addCoachMessage(
        `<div class="space-y-3">
          ${quickWorkouts.map(workout => (
            `<div class="p-3 bg-primary/5 rounded-lg">
              <div class="font-medium">${workout.title}</div>
              <div class="text-sm text-muted-foreground flex justify-between">
                <span>${workout.duration}</span>
                <span>Focus: ${workout.focus}</span>
              </div>
            </div>`
          )).join('')}
        </div>`,
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
        `<div class="space-y-3">
          <div class="p-3 bg-primary/5 rounded-lg">
            <div class="font-medium">Gentle Stretching Sequence</div>
            <div class="text-sm text-muted-foreground flex justify-between">
              <span>5 min</span>
              <span>Focus: Flexibility</span>
            </div>
          </div>
          <div class="p-3 bg-primary/5 rounded-lg">
            <div class="font-medium">Energy-Boosting Breathing</div>
            <div class="text-sm text-muted-foreground flex justify-between">
              <span>3 min</span>
              <span>Focus: Energy</span>
            </div>
          </div>
          <div class="p-3 bg-primary/5 rounded-lg">
            <div class="font-medium">Seated Arm Movements</div>
            <div class="text-sm text-muted-foreground flex justify-between">
              <span>5 min</span>
              <span>Focus: Circulation</span>
            </div>
          </div>
        </div>`,
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
        `<div class="space-y-3">
          <div class="p-3 bg-primary/5 rounded-lg">
            <div class="font-medium">10-Minute Power Nap</div>
            <div class="text-sm text-muted-foreground">When baby sleeps, set a timer and close your eyes</div>
          </div>
          <div class="p-3 bg-primary/5 rounded-lg">
            <div class="font-medium">Legs Up The Wall</div>
            <div class="text-sm text-muted-foreground">A restorative yoga pose - just 5 minutes helps circulation</div>
          </div>
          <div class="p-3 bg-primary/5 rounded-lg">
            <div class="font-medium">Guided Relaxation</div>
            <div class="text-sm text-muted-foreground">Try a 5-minute meditation focused on rest</div>
          </div>
        </div>`,
        [
          { id: 'rest-thanks', text: 'Thank you, this helps', action: () => addCoachMessage("You're welcome! Remember, resting when you need it is a form of self-care, not laziness. Your body is still recovering.") }
        ]
      );
    }, 1000);
  };

  const suggestMeals = () => {
    addCoachMessage(
      "Here are some nutritious meal ideas that are quick to prepare and support postpartum recovery:",
      []
    );
    
    setTimeout(() => {
      addCoachMessage(
        `<div class="space-y-3">
          ${mealIdeas.map(meal => (
            `<div class="p-3 bg-primary/5 rounded-lg">
              <div class="font-medium">${meal.meal}: ${meal.suggestion}</div>
              <div class="text-sm text-muted-foreground">Benefits: ${meal.benefits}</div>
            </div>`
          )).join('')}
        </div>`,
        [
          { id: 'meal-more', text: 'More meal ideas', action: () => window.location.href = '/recipes' },
          { id: 'meal-thanks', text: 'This is helpful!', action: () => addCoachMessage("I'm glad! Proper nutrition is so important during postpartum recovery. If you have any dietary restrictions or preferences, just let me know.") }
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
        `<div class="space-y-3">
          <div class="p-3 bg-primary/5 rounded-lg">
            <div class="font-medium">Banana with almond butter (200 cal)</div>
            <div class="text-sm text-muted-foreground">Quick energy + sustained protein</div>
          </div>
          <div class="p-3 bg-primary/5 rounded-lg">
            <div class="font-medium">Trail mix with nuts and dark chocolate (250 cal)</div>
            <div class="text-sm text-muted-foreground">Healthy fats, protein, and a bit of caffeine</div>
          </div>
          <div class="p-3 bg-primary/5 rounded-lg">
            <div class="font-medium">Oatmeal with berries and seeds (300 cal)</div>
            <div class="text-sm text-muted-foreground">Sustained energy release + antioxidants</div>
          </div>
        </div>`,
        [
          { id: 'energy-meal-more', text: 'More energy foods', action: () => window.location.href = '/recipes' },
          { id: 'energy-meal-hydration', text: 'What about hydration?', action: suggestHydrationTips }
        ]
      );
    }, 1000);
  };

  const suggestHydrationTips = () => {
    addCoachMessage(
      "Great question! Hydration is extremely important for energy levels, milk production, and overall recovery. Here are some hydration tips:",
      []
    );
    
    setTimeout(() => {
      addCoachMessage(
        `<div class="space-y-3">
          <div class="p-3 bg-primary/5 rounded-lg">
            <div class="font-medium">Drink when you breastfeed</div>
            <div class="text-sm text-muted-foreground">Keep a water bottle at your feeding station</div>
          </div>
          <div class="p-3 bg-primary/5 rounded-lg">
            <div class="font-medium">Infused water options</div>
            <div class="text-sm text-muted-foreground">Try cucumber + mint or strawberry + basil for flavor</div>
          </div>
          <div class="p-3 bg-primary/5 rounded-lg">
            <div class="font-medium">Hydrating foods</div>
            <div class="text-sm text-muted-foreground">Watermelon, cucumber, oranges, and soup all contribute to hydration</div>
          </div>
        </div>`,
        [
          { id: 'hydration-thanks', text: 'Thank you!', action: () => addCoachMessage("You're welcome! Aim for about 3 liters of total fluids daily while breastfeeding. Your urine should be light yellow - that's a good indicator of proper hydration.") }
        ]
      );
    }, 1000);
  };

  const provideSupportiveResponse = () => {
    addCoachMessage(
      "It's completely normal to feel overwhelmed as a new mom. Your feelings are valid, and you're doing better than you think.",
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
        `<div class="p-4 bg-primary/5 rounded-lg space-y-3">
          <div class="font-medium">60-Second Box Breathing</div>
          <ol class="list-decimal list-inside space-y-2 text-sm">
            <li>Breathe in slowly for 4 counts</li>
            <li>Hold your breath for 4 counts</li>
            <li>Exhale slowly for 4 counts</li>
            <li>Hold for 4 counts before breathing in again</li>
            <li>Repeat 3-5 times</li>
          </ol>
        </div>`,
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
        `<div class="space-y-3">
          <div class="p-3 bg-primary/5 rounded-lg">
            <div class="font-medium">5-4-3-2-1 Grounding</div>
            <div class="text-sm text-muted-foreground">Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste</div>
          </div>
          <div class="p-3 bg-primary/5 rounded-lg">
            <div class="font-medium">Progressive Muscle Relaxation</div>
            <div class="text-sm text-muted-foreground">Tense and release each muscle group for 5 seconds, starting from your toes</div>
          </div>
          <div class="p-3 bg-primary/5 rounded-lg">
            <div class="font-medium">Hand on Heart</div>
            <div class="text-sm text-muted-foreground">Place your hand on your heart, breathe deeply, and think of someone you love</div>
          </div>
        </div>`,
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
        `<div class="space-y-3">
          <div class="p-3 bg-primary/5 rounded-lg">
            <div class="font-medium">2-Minute Face Refresh</div>
            <div class="text-sm text-muted-foreground">Splash cool water, apply moisturizer, take 3 deep breaths</div>
          </div>
          <div class="p-3 bg-primary/5 rounded-lg">
            <div class="font-medium">One Song Dance Party</div>
            <div class="text-sm text-muted-foreground">Play a favorite upbeat song and move freely - with or without baby</div>
          </div>
          <div class="p-3 bg-primary/5 rounded-lg">
            <div class="font-medium">Sensory Reset</div>
            <div class="text-sm text-muted-foreground">Apply a nice-smelling lotion, drink a warm beverage slowly, or step outside for fresh air</div>
          </div>
        </div>`,
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
                  <div 
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: message.content }}
                  />
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
