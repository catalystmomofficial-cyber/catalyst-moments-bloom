import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Smile, Paperclip, Mic, Video, Phone, Camera } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useWellnessData } from "@/hooks/useWellnessData";
import { generateWellnessResponse, getQuickSuggestions } from './WellnessCoachIntelligence';

interface WellnessCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'coach' | 'user';
  timestamp: Date;
  type?: 'text' | 'audio' | 'image';
}

interface Coach {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  isOnline: boolean;
}

const AVAILABLE_COACHES: Coach[] = [
  { id: '1', name: 'Coach Nina', avatar: '👩🏻‍⚕️', specialty: 'Pregnancy & Prenatal', isOnline: true },
  { id: '2', name: 'Coach Bella', avatar: '👩🏽‍⚕️', specialty: 'Postpartum Recovery', isOnline: true },
  { id: '3', name: 'Coach Tia', avatar: '👩🏾‍⚕️', specialty: 'TTC & Fertility', isOnline: true },
  { id: '4', name: 'Coach Sarah', avatar: '👩🏼‍⚕️', specialty: 'General Wellness', isOnline: true },
];

const WellnessCoachModal = ({ isOpen, onClose }: WellnessCoachModalProps) => {
  const { user, profile } = useAuth();
  const { wellnessEntries } = useWellnessData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentCoach, setCurrentCoach] = useState<Coach | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Initialize coach and conversation when modal opens
  useEffect(() => {
    if (isOpen && !currentCoach) {
      setIsConnecting(true);
      setMessages([]);
      
      // Simulate finding an available coach
      setTimeout(() => {
        const availableCoaches = AVAILABLE_COACHES.filter(coach => coach.isOnline);
        const selectedCoach = availableCoaches[Math.floor(Math.random() * availableCoaches.length)];
        setCurrentCoach(selectedCoach);
        setIsConnecting(false);
        
        // Start personalized conversation after coach is selected
        setTimeout(() => {
          startPersonalizedConversation(selectedCoach);
        }, 1000);
      }, 2000);
    } else if (!isOpen) {
      // Reset when modal closes
      setCurrentCoach(null);
      setMessages([]);
      setIsConnecting(false);
    }
  }, [isOpen]);

  const startPersonalizedConversation = (coach: Coach) => {
    const stage = profile?.motherhood_stage || 'general';
    const displayName = profile?.display_name || user?.email?.split('@')[0] || 'there';
    const latestEntry = wellnessEntries?.[0];
    
    let personalizedGreeting = `Hi ${displayName}! I'm ${coach.name}, your wellness coach.`;
    
    if (latestEntry) {
      personalizedGreeting += ` I see you just completed your weekly check-in. Based on what you logged, how are you feeling today?`;
    } else {
      personalizedGreeting += ` Let's start by checking in - how are you feeling today?`;
    }
    
    // Add stage-specific context
    if (stage === 'pregnant') {
      personalizedGreeting += " I'm here to support you and your growing baby throughout this journey.";
    } else if (stage === 'postpartum') {
      personalizedGreeting += " I'm here to support your recovery and adjustment to motherhood.";
    } else if (stage === 'ttc') {
      personalizedGreeting += " I'm here to support you on your TTC journey with wellness guidance.";
    }

    addCoachMessage(personalizedGreeting);
  };

  const addCoachMessage = (content: string) => {
    setMessages(prev => [
      ...prev, 
      {
        id: Date.now().toString(),
        content,
        sender: 'coach',
        timestamp: new Date()
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
    if (inputMessage.trim() === '' || !currentCoach) return;
    
    const userMsg = inputMessage.trim();
    addUserMessage(userMsg);
    setInputMessage('');
    setIsLoading(true);
    
    // Simulate intelligent response based on user's stage and recent check-in data
    setTimeout(() => {
      generateSmartResponse(userMsg);
      setIsLoading(false);
    }, 1500);
  };

  const generateSmartResponse = (userMessage: string) => {
    const response = generateWellnessResponse(userMessage, profile?.motherhood_stage as any || null, profile);
    addCoachMessage(response);
  };

  const handleWorkoutRequest = (stage: string) => {
    const responses = {
      pregnant: "Great! Let's find you some safe pregnancy workouts. Based on your trimester, I recommend gentle movements that support your changing body.",
      postpartum: "Perfect! Movement is so important for recovery. Let's start with gentle core work and gradually build your strength back.",
      ttc: "Wonderful! Regular movement can help reduce stress and support fertility. Let's find some stress-relieving workouts for you.",
      general: "Great choice! Let's find the perfect workout to match your energy level today."
    };
    
    addCoachMessage(responses[stage as keyof typeof responses] || responses.general);
  };

  const handleNutritionRequest = (stage: string) => {
    const responses = {
      pregnant: "Nutrition is so important during pregnancy! Let's make sure you're getting all the nutrients you and baby need.",
      postpartum: "Fueling your body well is crucial for recovery and energy, especially if you're breastfeeding. What are you in the mood for?",
      ttc: "Great question! Proper nutrition can support your fertility journey. Let's focus on nutrient-rich foods.",
      general: "Love that you're thinking about nutrition! What kind of meals are you looking for today?"
    };
    
    addCoachMessage(responses[stage as keyof typeof responses] || responses.general);
  };

  const handleTirednessResponse = (stage: string) => {
    const responses = {
      pregnant: "Fatigue is so common during pregnancy, especially in the first and third trimesters. Your body is doing incredible work!",
      postpartum: "I totally understand - sleep deprivation is real! Let's talk about gentle ways to boost your energy when you can.",
      ttc: "TTC can be emotionally and physically draining. It's important to listen to your body and rest when you need it.",
      general: "Being tired as a mom is completely normal. Let's find some gentle ways to support your energy levels."
    };
    
    addCoachMessage(responses[stage as keyof typeof responses] || responses.general);
  };

  const handleBloatingResponse = (stage: string) => {
    if (stage === 'postpartum') {
      addCoachMessage("Postpartum bloating is so common! Let's look at your recent meals - what did you eat yesterday? Sometimes it's about gentle foods that support digestion during recovery.");
    } else if (stage === 'pregnant') {
      addCoachMessage("Bloating during pregnancy is very normal due to hormonal changes and your growing baby. Let's talk about foods that might help you feel more comfortable.");
    } else {
      addCoachMessage("Bloating can be uncomfortable. Let's look at what might be causing it and find some relief strategies.");
    }
  };

  const handleSleepResponse = (stage: string) => {
    const responses = {
      pregnant: "Sleep can be challenging during pregnancy, especially as your belly grows. Let's talk about comfortable positions and sleep hygiene.",
      postpartum: "Sleep is precious with a little one! Let's maximize the quality of rest you can get, even if it's not as much as before.",
      ttc: "Good sleep is important for hormone regulation and stress management during TTC. How has your sleep been lately?",
      general: "Quality sleep is so important for your overall wellness. What's been keeping you up?"
    };
    
    addCoachMessage(responses[stage as keyof typeof responses] || responses.general);
  };

  const handleStressResponse = (stage: string) => {
    const responses = {
      pregnant: "Pregnancy can bring so many emotions and concerns. It's completely normal to feel overwhelmed sometimes.",
      postpartum: "The postpartum period can be emotionally intense. You're not alone in feeling this way.",
      ttc: "The TTC journey can be incredibly stressful. It's important to acknowledge these feelings and find healthy coping strategies.",
      general: "Stress is a normal part of motherhood, but let's find some ways to help you manage it better."
    };
    
    addCoachMessage(responses[stage as keyof typeof responses] || responses.general);
  };

  const handleGeneralResponse = (stage: string, latestEntry: any) => {
    if (latestEntry && stage === 'pregnant') {
      addCoachMessage("I see from your recent check-in that you're doing great! How are you feeling about your pregnancy journey today?");
    } else if (latestEntry && stage === 'postpartum') {
      addCoachMessage("Thanks for keeping up with your check-ins! Recovery looks different for everyone - how are you feeling about your progress?");
    } else {
      addCoachMessage("I'm here to support you in whatever way you need today. What's on your mind?");
    }
  };

  const QUICK_SUGGESTIONS = getQuickSuggestions(profile?.motherhood_stage as any || null);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md h-[80vh] flex flex-col p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-4 pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isConnecting ? (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Searching for an available coach...</span>
                </div>
              ) : currentCoach ? (
                <>
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {currentCoach.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{currentCoach.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs px-2 py-0">
                        {currentCoach.specialty}
                      </Badge>
                      <span className="text-xs text-green-600 font-medium">Online</span>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isConnecting ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-1">
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <p className="text-sm text-muted-foreground">Finding the perfect coach for you...</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    message.sender === 'user' ? "ml-auto" : "mr-auto"
                  )}
                >
                  {message.sender === 'coach' && currentCoach && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {currentCoach.avatar}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2 max-w-full",
                      message.sender === 'user'
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted/50 text-foreground rounded-bl-md"
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {message.sender === 'user' && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        {profile?.display_name?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 max-w-[85%] mr-auto">
                  {currentCoach && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {currentCoach.avatar}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="bg-muted/50 rounded-2xl rounded-bl-md px-4 py-2">
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-1.5 w-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="h-1.5 w-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Quick Suggestions */}
        {currentCoach && messages.length === 1 && (
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {QUICK_SUGGESTIONS.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 rounded-full bg-background/50 border-border/50 hover:bg-muted/50"
                  onClick={() => {
                    setInputMessage(suggestion);
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={currentCoach ? "Type your message..." : "Connecting..."}
                disabled={!currentCoach || isLoading}
                className="pr-12 rounded-full bg-background/50 border-border/50 focus:border-primary/50"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <Camera className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || !currentCoach || isLoading}
              size="icon"
              className="h-9 w-9 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="h-4 w-4 text-primary-foreground" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WellnessCoachModal;