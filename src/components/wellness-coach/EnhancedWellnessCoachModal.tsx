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
      fetchAssessmentData();
      startPersonalizedConversation();
    }
  }, [isOpen]);

  const fetchAssessmentData = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('lead_responses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setAssessmentData(data);
        console.log('Found assessment data for wellness coach');
      }
    } catch (error) {
      console.error('Error fetching assessment data:', error);
    }
  };

  const startPersonalizedConversation = async () => {
    let greeting = '';
    const displayName = profile?.display_name || 'there';
    
    // Include assessment insights if available
    if (assessmentData && assessmentData.special_notes) {
      const score = assessmentData.special_notes.overall_score;
      const tier = assessmentData.special_notes.tier;
      const topGap = Object.entries(assessmentData.special_notes.category_scores || {})
        .sort(([, a], [, b]) => (a as number) - (b as number))[0];

      greeting = `Hi ${displayName}! 👋 I'm Coach Sarah, and I've reviewed your wellness assessment.

I noticed you scored ${score}/100, with ${topGap ? topGap[0].replace(/_/g, ' ') : 'some areas'} as a key focus area. I'm here to help you improve in exactly these areas!

Your primary goal: ${assessmentData.primary_goal}

I'm ready to support you with:
🥗 Nutrition plans based on your preferences
💡 Expert guidance for your specific needs  
📋 Custom programs that address your priority areas
🎯 Tools that evolve with your progress

What would you like to work on first?`;
    } else if (!profile?.motherhood_stage) {
      greeting = `Hi ${displayName}! 👋 I'm Coach Sarah, your personal wellness guide at Catalyst Mom.

I'm here to provide you with:
✨ Nutrition guidance tailored to your needs
🎯 Expert advice backed by science
📋 Personalized plans that evolve with you
🌱 Tools that grow as you progress

To give you the best support, I'd love to know - where are you in your motherhood journey?
• Trying to conceive?
• Pregnant? (Which trimester?)
• Postpartum?
• Toddler mom?

This helps me create a truly personalized experience for you!`;
    } else {
      const stageGreeting = getStageGreeting(profile.motherhood_stage);
      greeting = `Hi ${displayName}! 👋 I'm Coach Sarah, your wellness companion.

${stageGreeting}

I'm ready to help you with:
🥗 Nutrition guidance for your stage
💡 Expert advice on what matters most
📋 Personalized plans built just for you
🎯 Smart tools that adapt as you grow

What would you like help with today?`;
    }

    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: greeting,
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