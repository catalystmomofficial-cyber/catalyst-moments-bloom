import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface HomeWellnessCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'coach' | 'user';
  timestamp: Date;
}

const HomeWellnessCoachModal = ({ isOpen, onClose }: HomeWellnessCoachModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addCoachMessage(
          "Hi there! 👋 I'm your Catalyst Mom wellness coach. I'm here to help you understand how we can support your wellness journey!\n\n" +
          "We specialize in:\n" +
          "• Personalized fitness programs for every stage of motherhood\n" +
          "• Custom nutrition plans and healthy recipes\n" +
          "• Mental wellness and self-care strategies\n" +
          "• Community support from moms just like you\n\n" +
          "What would you like to know more about?"
        );
      }, 500);
    } else if (!isOpen) {
      setMessages([]);
    }
  }, [isOpen]);

  const addCoachMessage = (content: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          content,
          sender: 'coach',
          timestamp: new Date()
        }
      ]);
      setIsLoading(false);
    }, 800);
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

  const generateResponse = (userMessage: string) => {
    const lowerMsg = userMessage.toLowerCase();

    // Fitness/Workout related
    if (lowerMsg.includes('workout') || lowerMsg.includes('fitness') || lowerMsg.includes('exercise')) {
      return "Great question about fitness! We offer personalized workout programs for:\n\n" +
        "• Pregnancy-safe exercises (all trimesters)\n" +
        "• Postpartum recovery programs\n" +
        "• TTC wellness routines\n" +
        "• General mom fitness\n\n" +
        "💎 Want to try some FREE workouts? Sign up to access our beginner-friendly programs!\n\n" +
        "You can explore our workout library in the app. Would you like me to guide you through signing up?";
    }

    // Nutrition/Meal related
    if (lowerMsg.includes('nutrition') || lowerMsg.includes('meal') || lowerMsg.includes('food') || lowerMsg.includes('recipe')) {
      return "Nutrition is so important! We provide:\n\n" +
        "• Custom meal plans for your journey\n" +
        "• Healthy recipes with calorie tracking\n" +
        "• Pregnancy-safe food guides\n" +
        "• Postpartum nutrition support\n\n" +
        "🍎 Access FREE recipes and meal planning tools when you create an account!\n\n" +
        "Ready to start eating better? I can help you sign up!";
    }

    // Community/Support related
    if (lowerMsg.includes('community') || lowerMsg.includes('support') || lowerMsg.includes('connect') || lowerMsg.includes('group')) {
      return "Our community is amazing! Connect with thousands of moms:\n\n" +
        "• Join groups based on your motherhood stage\n" +
        "• Share experiences and get support\n" +
        "• Participate in challenges and events\n" +
        "• Make lasting friendships\n\n" +
        "👥 The community is FREE to join! Sign up to start connecting with other moms today!\n\n" +
        "Would you like to explore the community?";
    }

    // Pricing/Premium features
    if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('premium') || lowerMsg.includes('subscription') || lowerMsg.includes('pay')) {
      if (!user) {
        return "Here's what we offer:\n\n" +
          "**FREE Features:**\n" +
          "✓ Community access\n" +
          "✓ Basic workouts\n" +
          "✓ Recipe library\n" +
          "✓ Wellness tracking\n\n" +
          "**Premium Features:**\n" +
          "✓ Personalized meal & workout plans\n" +
          "✓ AI wellness coach (full features)\n" +
          "✓ Expert Q&A sessions\n" +
          "✓ Advanced tracking & analytics\n\n" +
          "🎯 Create a free account first to explore! Then you can upgrade to Premium when you're ready.\n\n" +
          "Shall I help you get started with a free account?";
      } else {
        return "As a member, you can upgrade to Premium anytime!\n\n" +
          "**Premium includes:**\n" +
          "• Fully personalized AI coaching\n" +
          "• Custom meal & workout plans\n" +
          "• Expert access\n" +
          "• Advanced features\n\n" +
          "Visit your dashboard to see pricing and upgrade options!";
      }
    }

    // Getting started/sign up
    if (lowerMsg.includes('sign up') || lowerMsg.includes('start') || lowerMsg.includes('join') || lowerMsg.includes('account')) {
      if (!user) {
        return "Awesome! Here's how to get started:\n\n" +
          "1️⃣ Click 'Get Started' to create your free account\n" +
          "2️⃣ Tell us about your motherhood journey\n" +
          "3️⃣ Start exploring workouts, recipes, and community\n" +
          "4️⃣ Upgrade to Premium anytime for full features\n\n" +
          "Ready? I'll guide you to sign up now! 🎉";
      } else {
        return "You're already signed in! 🎉\n\n" +
          "Head to your dashboard to:\n" +
          "• Complete your personalized wellness plan\n" +
          "• Join the community\n" +
          "• Access workouts and recipes\n" +
          "• Upgrade to Premium for full AI coaching\n\n" +
          "Would you like me to take you to your dashboard?";
      }
    }

    // General/Default response
    return "I'd love to help you learn more about Catalyst Mom!\n\n" +
      "Here are some things I can tell you about:\n" +
      "💪 Fitness & workout programs\n" +
      "🥗 Nutrition & meal planning\n" +
      "👥 Community & support groups\n" +
      "💎 Premium features & pricing\n" +
      "🚀 How to get started\n\n" +
      "What interests you most?";
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const userMsg = inputMessage.trim();
    addUserMessage(userMsg);
    setInputMessage('');

    setTimeout(() => {
      const response = generateResponse(userMsg);
      addCoachMessage(response);

      // If message mentions sign up and user is not logged in, show CTA after response
      if (!user && (userMsg.toLowerCase().includes('sign up') || userMsg.toLowerCase().includes('join') || userMsg.toLowerCase().includes('start'))) {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    }, 500);
  };

  const handleSignUp = () => {
    onClose();
    navigate('/auth/register');
    toast({
      title: "Let's get started!",
      description: "Create your free account to access all features.",
    });
  };

  const handleGoToDashboard = () => {
    onClose();
    navigate('/dashboard');
  };

  const QUICK_SUGGESTIONS = [
    "Tell me about your workout programs",
    "What nutrition support do you offer?",
    "How does the community work?",
    "What's included for free?",
    "How do I get started?"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-lg">
                    💚
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
              </div>
              <div>
                <DialogTitle className="font-semibold text-foreground">Catalyst Mom Coach</DialogTitle>
                <Badge variant="secondary" className="text-xs px-2 py-0">
                  Wellness Advisor
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 max-w-[85%]",
                message.sender === 'user' ? "ml-auto" : "mr-auto"
              )}
            >
              {message.sender === 'coach' && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-sm">
                    💚
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
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-sm">
                  💚
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted/50 rounded-2xl rounded-bl-md px-4 py-2">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {messages.length === 0 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_SUGGESTIONS.slice(0, 3).map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-1.5 px-3"
                  onClick={() => {
                    setInputMessage(suggestion);
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {!user && messages.length > 2 && (
          <div className="px-4 pb-2">
            <Button
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              onClick={handleSignUp}
            >
              Get Started Free
            </Button>
          </div>
        )}

        {user && messages.length > 2 && (
          <div className="px-4 pb-2">
            <Button
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              onClick={handleGoToDashboard}
            >
              Go to Dashboard
            </Button>
          </div>
        )}

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything..."
              className="flex-1"
            />
            <Button size="icon" onClick={handleSendMessage} disabled={!inputMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {!user ? "Sign up for free to unlock full features!" : "Upgrade to Premium for AI-powered coaching"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HomeWellnessCoachModal;
