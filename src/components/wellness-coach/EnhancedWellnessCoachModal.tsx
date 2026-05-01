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
    const tier = special.tier ?? data?.tier;
    const categoryScores = special.category_scores ?? data?.category_scores ?? {};
    const primaryGoal = data?.primary_goal ?? special.primary_goal;
    const dietary = data?.dietary_preferences ?? special.dietary_preferences;
    const activity = data?.activity_level ?? special.activity_level;
    const equipment = data?.equipment ?? special.equipment;
    const mainConcern = special.main_concern ?? data?.biggest_obstacle;

    const sortedGaps = Object.entries(categoryScores)
      .sort(([, a], [, b]) => (Number(a) || 0) - (Number(b) || 0))
      .slice(0, 2)
      .map(([k]) => k.replace(/_/g, ' '));

    const lines: string[] = [];
    lines.push(`Hi ${displayName} 💚 I'm Coach Sarah — and I already have everything I need to support you.`);
    lines.push('');

    // Build a single warm "what I see about you" paragraph from real data
    const insightBits: string[] = [];
    if (stageLabel) insightBits.push(`I see you're navigating ${stageLabel}`);
    if (overallScore !== undefined && overallScore !== null) {
      insightBits.push(`your wellness score is ${overallScore}${typeof overallScore === 'number' && overallScore <= 10 ? '/10' : '/100'}${tier ? ` (${tier} tier)` : ''}`);
    }
    if (primaryGoal) insightBits.push(`your top goal is ${String(primaryGoal).toLowerCase()}`);
    if (mainConcern) insightBits.push(`your biggest hurdle right now is ${String(mainConcern).toLowerCase()}`);
    if (sortedGaps.length) insightBits.push(`the areas that need the most love are ${sortedGaps.join(' and ')}`);
    if (activity) insightBits.push(`you're at a ${String(activity).toLowerCase()} activity level`);
    if (dietary) insightBits.push(`your eating style is ${String(dietary).toLowerCase()}`);
    if (equipment) insightBits.push(`you have ${String(equipment).toLowerCase()} to work with`);

    if (insightBits.length) {
      lines.push(`Here's what I'm working with: ${insightBits.join(', ')}.`);
      lines.push('');
    }

    // Concrete first move — never a question
    if (sortedGaps[0]) {
      lines.push(`Based on this, I'm starting you on ${sortedGaps[0]} first — that's where you'll feel the biggest shift fastest.`);
    } else if (primaryGoal) {
      lines.push(`Based on this, I'm building everything around your goal: ${primaryGoal}.`);
    } else if (stageLabel) {
      lines.push(`I'll tailor everything to ${stageLabel} from here on out.`);
    } else {
      lines.push(`I'll personalize every plan to you as we go.`);
    }

    lines.push('');
    lines.push(`Just tell me what you want first — a meal plan, a workout program, or quick advice — and I'll create it for you right now. 💪`);

    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: lines.join('\n'),
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