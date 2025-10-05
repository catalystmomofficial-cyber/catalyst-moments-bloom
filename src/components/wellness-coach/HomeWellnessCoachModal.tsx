import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import coachPortrait from '@/assets/wellness-coach-portrait.jpg';

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

type ConversationState = 'initial' | 'awaiting_stage' | 'offering_resources' | 'general';

const HomeWellnessCoachModal = ({ isOpen, onClose }: HomeWellnessCoachModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>('initial');
  const [userStage, setUserStage] = useState<string>('');
  const [userWeeks, setUserWeeks] = useState<string>('');
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
          "Hey girl! 💕\n\n" +
          "It's like 2am and we're just chatting, no pressure! I'm here to help you figure out what you need.\n\n" +
          "First things first - where are you at in your journey?\n\n" +
          "Are you:\n" +
          "• Trying to conceive (TTC)?\n" +
          "• Pregnant?\n" +
          "• Postpartum/new mom?\n" +
          "• Already chasing a toddler around?\n\n" +
          "Just tell me what stage you're in!"
        );
        setConversationState('awaiting_stage');
      }, 500);
    } else if (!isOpen) {
      setMessages([]);
      setConversationState('initial');
      setUserStage('');
      setUserWeeks('');
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

  const getStageResponse = (stage: string, weeks: string) => {
    const lowerStage = stage.toLowerCase();
    
    if (lowerStage.includes('ttc') || lowerStage.includes('trying') || lowerStage.includes('conceive')) {
      return "Okay sis, TTC can be such a rollercoaster! 💕\n\n" +
        "Here's what you might be dealing with:\n" +
        "• The anxiety of timing everything perfectly\n" +
        "• Wondering if you're doing enough for your fertility\n" +
        "• That emotional TWW (two week wait)\n" +
        "• Wanting to optimize your health but not sure where to start\n\n" +
        "**Good news!** We have some FREE resources perfect for you:\n\n" +
        "✨ Cycle tracking tools\n" +
        "✨ Fertility-friendly recipes\n" +
        "✨ TTC workout videos\n" +
        "✨ Supportive community of women TTC\n\n" +
        "Want to check these out? You'll need to sign up (it's FREE!) to access them inside the app! 💚";
    }
    
    if (lowerStage.includes('pregn')) {
      let trimesterInfo = '';
      const weeksNum = parseInt(weeks);
      
      if (weeksNum > 0 && weeksNum <= 13) {
        trimesterInfo = "\n\nFirst trimester! Girl, I know - the nausea, the fatigue, trying to keep it secret... it's A LOT.\n\n" +
          "**Your challenges right now:**\n" +
          "• Morning sickness that's really all-day sickness\n" +
          "• Exhaustion like you've never felt\n" +
          "• Anxiety about the first scan\n" +
          "• Not knowing what's safe to eat or do";
      } else if (weeksNum > 13 && weeksNum <= 27) {
        trimesterInfo = "\n\nSecond trimester - the 'honeymoon phase' they say! But you're probably dealing with:\n\n" +
          "**Your challenges:**\n" +
          "• Growing bump and changing body\n" +
          "• Wondering about safe exercises\n" +
          "• Starting to think about birth (maybe getting nervous?)\n" +
          "• Sciatica or back pain kicking in";
      } else if (weeksNum > 27) {
        trimesterInfo = "\n\nThird trimester! Almost there mama! But these last weeks are HARD:\n\n" +
          "**What you're dealing with:**\n" +
          "• Can't sleep, can't breathe, can't see your feet\n" +
          "• Birth anxiety getting real\n" +
          "• Wanting to prepare but feeling overwhelmed\n" +
          "• Physical discomfort everywhere";
      }
      
      return `Pregnancy! Beautiful journey, but real talk - it's not always easy. ${trimesterInfo}\n\n` +
        "**We've got FREE resources for you:**\n\n" +
        "✨ Safe pregnancy workouts (all trimesters)\n" +
        "✨ Our unique Birth Ball Guide\n" +
        "✨ Pregnancy nutrition plans\n" +
        "✨ Community of pregnant mamas\n" +
        "✨ Symptom management tips\n\n" +
        "These are all waiting for you in the app! Just need to sign up (FREE!) to access them 💚";
    }
    
    if (lowerStage.includes('postpart') || lowerStage.includes('new mom') || lowerStage.includes('after birth')) {
      let timeInfo = '';
      const monthsNum = parseInt(weeks);
      
      if (monthsNum > 0 && monthsNum <= 3) {
        timeInfo = "\n\nThose first few months postpartum are NO JOKE:\n\n" +
          "**What you're going through:**\n" +
          "• Sleep deprivation like a zombie\n" +
          "• Body recovery and wondering when you'll feel 'normal'\n" +
          "• Maybe struggling with breastfeeding\n" +
          "• Emotional ups and downs\n" +
          "• Not knowing what exercise is safe yet";
      } else if (monthsNum > 3) {
        timeInfo = "\n\nA few months in and you're probably:\n\n" +
          "**Your challenges:**\n" +
          "• Wanting your body back but feeling guilty\n" +
          "• Dealing with core/pelvic floor issues\n" +
          "• Trying to find time for yourself (what's that?)\n" +
          "• Wanting to workout but not sure what's safe";
      }
      
      return `Postpartum mama! First - you're doing amazing! ${timeInfo}\n\n` +
        "**FREE resources we have for you:**\n\n" +
        "✨ Safe postpartum recovery workouts\n" +
        "✨ Core & pelvic floor rehab guides\n" +
        "✨ Nutrition for healing & energy\n" +
        "✨ Community of postpartum moms who GET IT\n" +
        "✨ Self-care strategies (yes, you deserve it!)\n\n" +
        "Sign up FREE to access everything in the app! 💚";
    }
    
    if (lowerStage.includes('toddler') || lowerStage.includes('mom')) {
      return "Toddler mom life! Chasing them around all day is a WORKOUT! 😅\n\n" +
        "**What you're probably dealing with:**\n" +
        "• No time for yourself\n" +
        "• Wanting to get back in shape\n" +
        "• Trying to eat healthy while feeding picky eaters\n" +
        "• Feeling touched out and overwhelmed\n\n" +
        "**FREE resources for you:**\n\n" +
        "✨ Quick workouts for busy moms\n" +
        "✨ Family-friendly healthy recipes\n" +
        "✨ Community of moms in the same boat\n" +
        "✨ Self-care tips you can actually do\n\n" +
        "Access it all FREE in the app - just sign up! 💚";
    }
    
    return "Thanks for sharing where you're at! 💕\n\n" +
      "We have resources for every stage of motherhood:\n" +
      "• Video courses from professionals\n" +
      "• Stage-specific workouts\n" +
      "• Nutrition plans & recipes\n" +
      "• Supportive community\n\n" +
      "Sign up FREE to explore what we have for you! 💚";
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const userMsg = inputMessage.trim();
    addUserMessage(userMsg);
    setInputMessage('');

    setTimeout(() => {
      if (conversationState === 'awaiting_stage') {
        setUserStage(userMsg);
        
        const numberMatch = userMsg.match(/\d+/);
        if (numberMatch) {
          setUserWeeks(numberMatch[0]);
          const response = getStageResponse(userMsg, numberMatch[0]);
          addCoachMessage(response);
          setConversationState('offering_resources');
        } else {
          const lowerMsg = userMsg.toLowerCase();
          if (lowerMsg.includes('pregn')) {
            addCoachMessage("Perfect! How many weeks pregnant are you? 🤰");
          } else if (lowerMsg.includes('postpart') || lowerMsg.includes('new mom')) {
            addCoachMessage("Got it! How many months postpartum are you? 💕");
          } else {
            const response = getStageResponse(userMsg, '0');
            addCoachMessage(response);
            setConversationState('offering_resources');
          }
        }
      } else if (conversationState === 'initial' && userStage === '' && userMsg.match(/\d+/)) {
        setUserWeeks(userMsg);
        addCoachMessage("Thanks! And which stage are you in? (TTC, pregnant, postpartum, or toddler mom?)");
      } else if (userStage !== '' && userWeeks === '' && userMsg.match(/\d+/)) {
        setUserWeeks(userMsg);
        const response = getStageResponse(userStage, userMsg);
        addCoachMessage(response);
        setConversationState('offering_resources');
      } else {
        const lowerMsg = userMsg.toLowerCase();
        
        if (lowerMsg.includes('sign up') || lowerMsg.includes('register') || lowerMsg.includes('join') || lowerMsg.includes('access')) {
          if (!user) {
            addCoachMessage(
              "Perfect! Click the button below to create your account.\n\n" +
              "Once you're in, you'll have immediate access to:\n" +
              "✓ Free workouts\n" +
              "✓ Free recipes\n" +
              "✓ Community access\n" +
              "✓ Basic tracking tools\n\n" +
              "And if you want the FULL experience with personalized plans, all courses, and AI coaching - you can upgrade to Premium for $29/month anytime! 💎"
            );
          } else {
            addCoachMessage(
              "You're already signed up! 🎉\n\n" +
              "Want the full Catalyst Mom experience?\n\n" +
              "**Premium gives you:**\n" +
              "• All video courses\n" +
              "• Personalized meal & workout plans\n" +
              "• AI wellness coaching\n" +
              "• Advanced tracking\n" +
              "• Expert consultations\n\n" +
              "Only $29/month - click below to upgrade!"
            );
          }
        } else if (lowerMsg.includes('premium') || lowerMsg.includes('upgrade') || lowerMsg.includes('price') || lowerMsg.includes('cost')) {
          addCoachMessage(
            "Great question! Here's the breakdown:\n\n" +
            "**FREE Forever:**\n" +
            "✓ Community access\n" +
            "✓ Basic workout videos\n" +
            "✓ Recipe library\n" +
            "✓ Wellness tracking\n\n" +
            "**Premium - $29/month:**\n" +
            "✓ ALL video courses\n" +
            "✓ Personalized plans\n" +
            "✓ AI coaching\n" +
            "✓ Advanced features\n" +
            "✓ Expert access\n\n" +
            "Most moms start FREE and upgrade when they're ready! 💚"
          );
        } else {
          addCoachMessage(
            "I'm here to help you understand what Catalyst Mom can do for you! 💕\n\n" +
            "Want to tell me where you're at in your motherhood journey so I can show you what we have for your specific stage?"
          );
        }
        setConversationState('general');
      }
    }, 500);
  };

  const handleViewResources = () => {
    if (!user) {
      toast({
        title: "Sign up to access resources",
        description: "Create your free account to view our resources!",
      });
      setTimeout(() => {
        onClose();
        navigate('/auth/register');
      }, 1000);
    } else {
      navigate('/dashboard');
      onClose();
    }
  };

  const handleUpgradeToPremium = () => {
    navigate('/dashboard');
    onClose();
    toast({
      title: "Ready to upgrade?",
      description: "Check out Premium features on your dashboard!",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={coachPortrait} alt="Wellness Coach" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                    CM
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
              </div>
              <div>
                <DialogTitle className="font-semibold text-foreground">Your Big Sis Coach</DialogTitle>
                <Badge variant="secondary" className="text-xs px-2 py-0">
                  Here to help 💕
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
                  <AvatarImage src={coachPortrait} alt="Coach" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-sm">
                    CM
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
                <AvatarImage src={coachPortrait} alt="Coach" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-sm">
                  CM
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

        {conversationState === 'offering_resources' && (
          <div className="px-4 pb-2">
            <Button
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              onClick={handleViewResources}
            >
              {user ? 'View Free Resources' : 'Sign Up Free to Access'}
            </Button>
          </div>
        )}

        {user && messages.length > 3 && (
          <div className="px-4 pb-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleUpgradeToPremium}
            >
              Unlock Full Access - $29/month
            </Button>
          </div>
        )}

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button size="icon" onClick={handleSendMessage} disabled={!inputMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {!user ? "Free resources waiting for you!" : "Upgrade for full AI coaching"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HomeWellnessCoachModal;
