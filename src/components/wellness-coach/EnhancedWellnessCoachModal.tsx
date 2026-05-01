import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Send, 
  Image as ImageIcon,
  Video,
  MessageCircle,
  Smile,
  Paperclip,
  X
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: Date;
  type: 'text' | 'voice' | 'image';
  audioUrl?: string;
  imageUrl?: string;
}

interface EnhancedWellnessCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EnhancedWellnessCoachModal = ({ isOpen, onClose }: EnhancedWellnessCoachModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showQuickSuggestions, setShowQuickSuggestions] = useState(true);
  const [assessmentData, setAssessmentData] = useState<any>(null);
  
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Fetch assessment first, then greet using all available data
      (async () => {
        const data = await fetchAssessmentData();
        startPersonalizedConversation(data);
      })();
    }
  }, [isOpen]);

  const fetchAssessmentData = async () => {
    if (!user?.id) return null;

    try {
      // Try the structured lead_responses first (assessment quiz)
      const { data: lead } = await supabase
        .from('lead_responses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Also pull profile.assessment_data as a fallback / supplement
      const { data: prof } = await supabase
        .from('profiles')
        .select('assessment_data')
        .eq('user_id', user.id)
        .maybeSingle();

      const merged = lead || (prof?.assessment_data ? { ...(prof.assessment_data as any), _fromProfile: true } : null);
      if (merged) {
        setAssessmentData(merged);
        console.log('[WellnessCoach] Loaded personalization data');
      }
      return merged;
    } catch (error) {
      console.error('Error fetching assessment data:', error);
      return null;
    }
  };

  // Friendly stage label without asking the user
  const getFriendlyStageLabel = (stage?: string | null): string | null => {
    if (!stage) return null;
    const s = stage.toLowerCase();
    if (s.includes('ttc')) return 'your TTC journey';
    if (s.includes('trimester_1') || s === 'pregnant_1') return 'your first trimester';
    if (s.includes('trimester_2') || s === 'pregnant_2') return 'your second trimester';
    if (s.includes('trimester_3') || s === 'pregnant_3') return 'your third trimester';
    if (s.includes('postpartum_0-6') || s.includes('postpartum_0_6')) return 'your early postpartum recovery';
    if (s.includes('postpartum')) return 'your postpartum journey';
    if (s.includes('toddler')) return 'toddler-mom life';
    if (s.includes('pregnan')) return 'your pregnancy';
    return null;
  };

  const startPersonalizedConversation = (asmt?: any) => {
    const data = asmt ?? assessmentData;
    const displayName = profile?.display_name || user?.email?.split('@')[0] || 'mama';
    const stageLabel = getFriendlyStageLabel(profile?.motherhood_stage);

    // Pull insights from whichever assessment source we have
    const special = data?.special_notes && typeof data.special_notes === 'object' ? data.special_notes : data || {};
    const overallScore = special.overall_score ?? data?.overall_score ?? data?.score;
    const tier = (special.tier ?? data?.tier ?? '').toString().toLowerCase();
    const categoryScores = special.category_scores ?? data?.category_scores ?? {};
    const primaryGoal = (data?.primary_goal ?? special.primary_goal ?? '').toString().toLowerCase();
    const dietary = (data?.dietary_preferences ?? special.dietary_preferences ?? '').toString().toLowerCase();
    const activity = (data?.activity_level ?? special.activity_level ?? '').toString().toLowerCase();
    const equipment = (data?.equipment ?? special.equipment ?? '').toString().toLowerCase();
    const mainConcern = (special.main_concern ?? data?.biggest_obstacle ?? '').toString().toLowerCase();

    const sortedGaps = Object.entries(categoryScores)
      .sort(([, a], [, b]) => (Number(a) || 0) - (Number(b) || 0))
      .slice(0, 2)
      .map(([k]) => k.replace(/_/g, ' ').toLowerCase());

    // ── Paraphrase into a natural insight, not a list ──

    // Tone read from score/tier
    const scoreNum = typeof overallScore === 'number' ? overallScore : Number(overallScore);
    const isHundred = !isNaN(scoreNum) && scoreNum > 10;
    const norm = !isNaN(scoreNum) ? (isHundred ? scoreNum : scoreNum * 10) : null;

    let toneOpener = '';
    if (norm !== null) {
      if (norm >= 75) toneOpener = `you're already in a really strong place`;
      else if (norm >= 55) toneOpener = `you've built a solid foundation with real room to grow`;
      else if (norm >= 35) toneOpener = `you're stretched thin in a few spots, and that's exactly what we'll fix`;
      else toneOpener = `you've been carrying a lot, and it shows — but that also means quick wins are right in front of us`;
    } else if (tier) {
      toneOpener = tier.includes('high') || tier.includes('gold')
        ? `you're already in a strong place`
        : `you're ready for a real reset`;
    } else {
      toneOpener = `there's a clear path forward for you`;
    }

    // Translate raw goal text into a warmer phrase
    const phraseGoal = (g: string): string => {
      if (!g) return '';
      if (/energy|tired|fatigue/.test(g)) return 'feel awake and clear-headed again';
      if (/weight|fat|tone|lean/.test(g)) return 'feel strong and at home in your body';
      if (/strength|muscle|tone/.test(g)) return 'rebuild real strength';
      if (/sleep/.test(g)) return 'sleep deeply again';
      if (/stress|anxi|mood|mental/.test(g)) return 'feel calmer and more like yourself';
      if (/fertil|conceiv|ttc/.test(g)) return 'support your body for conception';
      if (/recover|heal|postpartum/.test(g)) return 'recover fully and feel whole again';
      if (/glow|skin|hair/.test(g)) return 'glow from the inside out';
      return g.replace(/[_-]/g, ' ');
    };

    const phraseConcern = (c: string): string => {
      if (!c) return '';
      if (/time|busy|kids|schedule/.test(c)) return `between everything you're juggling, time is the real enemy`;
      if (/motivat|consist/.test(c)) return `staying consistent on hard days is the part that trips you up`;
      if (/knowledge|know|where to start/.test(c)) return `the missing piece has been knowing where to actually start`;
      if (/equip|gym|space/.test(c)) return `working out at home with what you have is the realistic move`;
      if (/food|cook|meal/.test(c)) return `figuring out what to eat — and actually making it — is the daily struggle`;
      return `the biggest pull-back has been ${c}`;
    };

    const phraseGap = (g: string): string => {
      if (/nutri|food|eat|diet/.test(g)) return 'how you fuel your body';
      if (/sleep/.test(g)) return 'your sleep and recovery';
      if (/stress|mental|mood/.test(g)) return 'your nervous system';
      if (/move|exer|fit|workout|strength/.test(g)) return 'rebuilding strength';
      if (/hydr|water/.test(g)) return 'hydration';
      if (/mind|focus/.test(g)) return 'your headspace';
      if (/social|connect/.test(g)) return 'feeling supported';
      return g;
    };

    const goalPhrase = phraseGoal(primaryGoal);
    const concernPhrase = phraseConcern(mainConcern);
    const gapPhrase = sortedGaps[0] ? phraseGap(sortedGaps[0]) : '';

    // ── Compose 2 short paragraphs ──
    const para1Parts: string[] = [];
    para1Parts.push(`Hi ${displayName} 💚`);
    if (stageLabel) {
      para1Parts.push(`Looking at where you are with ${stageLabel}, ${toneOpener}.`);
    } else {
      para1Parts.push(`From everything you've shared with me, ${toneOpener}.`);
    }
    if (concernPhrase) para1Parts.push(`${concernPhrase.charAt(0).toUpperCase()}${concernPhrase.slice(1)}.`);

    const para2Parts: string[] = [];
    if (goalPhrase && gapPhrase) {
      para2Parts.push(`What you're really after is to ${goalPhrase}, and the door into that is ${gapPhrase}.`);
    } else if (goalPhrase) {
      para2Parts.push(`What you're really after is to ${goalPhrase} — and I know exactly how to get you there.`);
    } else if (gapPhrase) {
      para2Parts.push(`The fastest unlock for you is ${gapPhrase}, so that's where I'll start.`);
    }

    // Subtle nod to context without listing
    const contextNod: string[] = [];
    if (activity) contextNod.push(`I'll keep things ${activity}-friendly`);
    if (equipment && !/none|nothing|no equipment/.test(equipment)) contextNod.push(`built around the ${equipment} you actually have`);
    else if (equipment) contextNod.push(`zero-equipment`);
    if (dietary && !/none|any|no preference/.test(dietary)) contextNod.push(`and aligned with how you eat (${dietary})`);

    if (contextNod.length) {
      para2Parts.push(`${contextNod.join(', ')}.`);
    }

    para2Parts.push(`Tell me what you want first — a meal plan, a workout program, or quick advice — and I'll build it for you right now. 💪`);

    const content = [para1Parts.join(' '), '', para2Parts.join(' ')].filter(Boolean).join('\n');

    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'coach',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages([welcomeMessage]);
  };

  const getStageGreeting = (stage: string): string => {
    if (stage.includes('ttc')) {
      return "I see you're on your TTC journey. I'm here to support you with fertility nutrition, cycle tracking insights, and staying hopeful through it all.";
    }
    if (stage.includes('trimester_1')) {
      return "First trimester - such an exciting and sometimes challenging time! I'm here for energy tips, managing symptoms, and safe movement.";
    }
    if (stage.includes('trimester_2')) {
      return "Second trimester energy! Let's make the most of this time with safe workouts, nutrition for baby's growth, and prep for what's ahead.";
    }
    if (stage.includes('trimester_3')) {
      return "Third trimester - the home stretch! I'm here for birth prep, managing discomfort, and keeping you strong and confident.";
    }
    if (stage.includes('postpartum_0-6')) {
      return "Early postpartum - rest and recovery are your priorities right now. I'm here for gentle guidance, healing nutrition, and emotional support.";
    }
    if (stage.includes('postpartum')) {
      return "Postpartum mama, you're doing amazing! I'm here to help you rebuild strength, find energy, and prioritize your wellness while caring for baby.";
    }
    if (stage.includes('toddler')) {
      return "Toddler mom life is no joke! I'm here for quick workouts, energy-boosting nutrition, and strategies to take care of YOU while chasing little ones.";
    }
    return "I'm here to support your wellness journey with personalized advice, workouts, and nutrition guidance.";
  };

  const getStageSpecificSuggestions = (): string[] => {
    const stage = profile?.motherhood_stage || '';
    
    if (stage.includes('ttc')) {
      return [
        "🥗 Fertility-boosting nutrition plan",
        "📊 Cycle tracking tips",
        "💪 TTC-friendly workouts",
        "🧘 Stress management strategies"
      ];
    }
    
    if (stage.includes('trimester_1')) {
      return [
        "🤢 Managing morning sickness naturally",
        "🍎 First trimester nutrition guide",
        "💪 Safe exercises for first trimester",
        "😴 Combating first trimester fatigue"
      ];
    }
    
    if (stage.includes('trimester_2')) {
      return [
        "🤰 Safe prenatal workouts",
        "🥗 Nutrition for baby's growth",
        "💪 Building strength for labor",
        "🧘 Managing back & hip pain"
      ];
    }
    
    if (stage.includes('trimester_3')) {
      return [
        "🎯 Birth prep exercises",
        "🍎 Third trimester nutrition",
        "💼 Hospital bag checklist",
        "😌 Managing swelling & discomfort"
      ];
    }
    
    if (stage.includes('postpartum_0-6')) {
      return [
        "🌸 Gentle postpartum recovery",
        "🥗 Healing nutrition plan",
        "😴 Sleep strategies for new moms",
        "💚 Emotional wellness support"
      ];
    }
    
    if (stage.includes('postpartum_6-12') || stage.includes('postpartum_3-6m')) {
      return [
        "💪 Core recovery program",
        "🏋️ Rebuilding strength safely",
        "⚡ Energy-boosting meal plan",
        "📅 When to return to exercise"
      ];
    }
    
    if (stage.includes('postpartum')) {
      return [
        "🏋️ Postpartum workout plans",
        "🥗 Breastfeeding nutrition",
        "💆 Self-care routines",
        "⏰ Fitness for busy moms"
      ];
    }
    
    if (stage.includes('toddler')) {
      return [
        "⚡ Quick 10-min workouts",
        "🍎 Healthy meal prep ideas",
        "🧘 Patience & energy tips",
        "💆 Self-care on the go"
      ];
    }
    
    return [
      "🎯 Create my personalized plan",
      "🥗 Nutrition guidance for me",
      "💪 Workout recommendations",
      "💡 Expert advice for my goals"
    ];
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setInputMessage(suggestion);
    setShowQuickSuggestions(false);
    // Auto-send the suggestion
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && selectedImages.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: selectedImages.length > 0 ? 'image' : 'text',
      imageUrl: selectedImages.length > 0 ? selectedImages[0] : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setSelectedImages([]);
    setShowQuickSuggestions(false);
    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke('wellness-coach-chat', {
        body: {
          messages: [
            ...conversationHistory,
            { role: 'user', content: inputMessage }
          ],
          userProfile: { ...profile, user_id: user?.id }
        }
      });

      if (response.error) throw response.error;

      const coachMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.response,
        sender: 'coach',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, coachMessage]);
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: inputMessage },
        { role: 'assistant', content: response.data.response }
      ]);

      // Show success toast if plans were created
      if (response.data.created_plans && response.data.created_plans.length > 0) {
        response.data.created_plans.forEach((plan: any) => {
          toast({
            title: "Plan Created! 🎉",
            description: `${plan.title} has been saved to your account.`,
            duration: 5000,
          });
        });
      }

      // Audio disabled to avoid API quota issues

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processVoiceMessage(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      toast({
        title: "Recording",
        description: "Listening... Tap the mic again to stop.",
      });

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const processVoiceMessage = async (audioBlob: Blob) => {
    try {
      setIsLoading(true);

      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];

        // Transcribe audio
        const transcribeResponse = await supabase.functions.invoke('voice-to-text', {
          body: { audio: base64Audio }
        });

        if (transcribeResponse.error) throw transcribeResponse.error;

        const transcribedText = transcribeResponse.data.text;

        // Create voice message
        const audioUrl = URL.createObjectURL(audioBlob);
        const voiceMessage: Message = {
          id: Date.now().toString(),
          content: transcribedText,
          sender: 'user',
          timestamp: new Date(),
          type: 'voice',
          audioUrl
        };

        setMessages(prev => [...prev, voiceMessage]);

        // Process the transcribed text as a regular message
        const response = await supabase.functions.invoke('wellness-coach-chat', {
          body: {
            messages: [
              ...conversationHistory,
              { role: 'user', content: transcribedText }
            ],
            userProfile: { ...profile, user_id: user?.id }
          }
        });

        if (response.error) throw response.error;

        const coachMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.data.response,
          sender: 'coach',
          timestamp: new Date(),
          type: 'text'
        };

        setMessages(prev => [...prev, coachMessage]);
        setConversationHistory(prev => [
          ...prev,
          { role: 'user', content: transcribedText },
          { role: 'assistant', content: response.data.response }
        ]);

        // Show success toast if plans were created
        if (response.data.created_plans && response.data.created_plans.length > 0) {
          response.data.created_plans.forEach((plan: any) => {
            toast({
              title: "Plan Created! 🎉",
              description: `${plan.title} has been saved to your account.`,
              duration: 5000,
            });
          });
        }

        // Audio disabled to avoid API quota issues
      };

    } catch (error) {
      console.error('Error processing voice message:', error);
      toast({
        title: "Error",
        description: "Failed to process voice message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const playTextAsAudio = async (text: string) => {
    try {
      const response = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice: 'nova' }
      });

      if (response.error) throw response.error;

      const audioData = response.data.audioContent;
      const audioBlob = new Blob([
        Uint8Array.from(atob(audioData), c => c.charCodeAt(0))
      ], { type: 'audio/mp3' });

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      await audio.play();

    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const startCall = async () => {
    setIsInCall(true);
    toast({
      title: "Call Started",
      description: "You're now in a voice call with Dr. Maya!",
    });

    // Greet user in call mode
    const callGreeting = `Hi ${profile?.display_name || 'there'}! I'm Coach Sarah - so glad you called. What's on your mind today?`;
    
    const callMessage: Message = {
      id: Date.now().toString(),
      content: callGreeting,
      sender: 'coach',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, callMessage]);
  };

  const endCall = () => {
    setIsInCall(false);
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    toast({
      title: "Call Ended",
      description: "Thanks for chatting! I'm here whenever you need support.",
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedImages(prev => [...prev, imageUrl]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                  CS
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-lg font-semibold">Coach Sarah</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {isInCall ? '📞 In Call' : profile?.motherhood_stage ? `${profile.motherhood_stage} • Online` : 'General Wellness • Online'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {}}
                className="rounded-full"
              >
                <Video className="h-4 w-4" />
              </Button>
              {!isInCall ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={startCall}
                  className="rounded-full text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <Phone className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={endCall}
                  className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <PhoneOff className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.type === 'voice' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (message.audioUrl) {
                            const audio = new Audio(message.audioUrl);
                            audio.play();
                          }
                        }}
                      >
                        <Mic className="h-4 w-4 mr-1" />
                        Play
                      </Button>
                    </div>
                  )}
                  
                  {message.imageUrl && (
                    <img 
                      src={message.imageUrl} 
                      alt="Shared image" 
                      className="max-w-full h-auto rounded mb-2"
                    />
                  )}
                  
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="p-4 border-t space-y-3">
          {/* Quick Suggestions */}
          {showQuickSuggestions && messages.length <= 2 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {getStageSpecificSuggestions().map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSuggestion(suggestion)}
                    className="text-xs h-8 rounded-full"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {selectedImages.length > 0 && (
            <div className="flex space-x-2">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img 
                    src={image} 
                    alt={`Selected ${index + 1}`} 
                    className="w-16 h-16 object-cover rounded"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            <div className="flex-1">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              className={`rounded-full ${isRecording ? 'text-red-600 bg-red-50' : ''}`}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>

            <Button
              onClick={handleSendMessage}
              disabled={(!inputMessage.trim() && selectedImages.length === 0) || isLoading}
              size="icon"
              className="rounded-full"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedWellnessCoachModal;