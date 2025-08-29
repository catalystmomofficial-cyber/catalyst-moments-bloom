import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, PhoneCall, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWellnessData } from '@/hooks/useWellnessData';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VoiceCallInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceCallInterface = ({ isOpen, onClose }: VoiceCallInterfaceProps) => {
  const { user, profile } = useAuth();
  const { wellnessEntries } = useWellnessData();
  const { toast } = useToast();
  
  const [callState, setCallState] = useState<'idle' | 'connecting' | 'connected' | 'ended'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isCoachSpeaking, setIsCoachSpeaking] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
          handleUserSpeech(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startVoiceCall = async () => {
    try {
      setCallState('connecting');
      
      // Check for microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setCallState('connected');
      setCallDuration(0);
      
      // Start with a personalized greeting
      const displayName = profile?.display_name || user?.email?.split('@')[0] || 'there';
      const stage = profile?.motherhood_stage || 'general';
      
      let greeting = `Hi ${displayName}! I'm Dr. Maya, your wellness coach. `;
      
      if (stage === 'pregnant') {
        greeting += "How are you feeling with your pregnancy today?";
      } else if (stage.includes('postpartum')) {
        greeting += "How are you adjusting to life with your little one?";
      } else if (stage === 'ttc') {
        greeting += "How are you feeling about your TTC journey today?";
      } else {
        greeting += "How can I support your wellness today?";
      }
      
      // Start listening for speech
      setTimeout(() => {
        speakMessage(greeting);
        startListening();
      }, 1000);
      
      toast({
        title: "Voice Call Started",
        description: "Dr. Maya is ready to talk with you!",
      });
    } catch (error) {
      console.error('Error starting voice call:', error);
      setCallState('idle');
      toast({
        title: "Call Failed",
        description: "Please allow microphone access to start the call.",
        variant: "destructive",
      });
    }
  };

  const handleUserSpeech = async (speechText: string) => {
    if (!speechText.trim()) return;
    
    setTranscript('');
    stopListening();
    
    try {
      // Generate AI response
      const userContext = {
        display_name: profile?.display_name || user?.email?.split('@')[0],
        motherhood_stage: profile?.motherhood_stage,
        wellnessEntries: wellnessEntries?.slice(0, 5)
      };

      const { data, error } = await supabase.functions.invoke('ai-wellness-chat', {
        body: {
          message: speechText,
          userContext,
          conversationHistory: []
        }
      });

      if (error) throw error;
      
      // Speak the AI response
      speakMessage(data.response);
      
    } catch (error) {
      console.error('Error generating response:', error);
      speakMessage("I'm sorry, I didn't catch that. Could you please try again?");
    }
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsCoachSpeaking(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      
      // Try to use a female voice
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Samantha') ||
        voice.name.includes('Victoria') ||
        voice.name.includes('Karen')
      );
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.onend = () => {
        setIsCoachSpeaking(false);
        // Resume listening after coach finishes speaking
        setTimeout(() => {
          if (callState === 'connected') {
            startListening();
          }
        }, 500);
      };

      speechSynthesis.speak(utterance);
      synthRef.current = utterance;
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening && !isCoachSpeaking) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const endVoiceCall = () => {
    // Stop all speech and recognition
    stopListening();
    if (synthRef.current) {
      speechSynthesis.cancel();
    }
    
    setCallState('ended');
    setIsCoachSpeaking(false);
    setTranscript('');
    
    setTimeout(() => {
      setCallState('idle');
      setCallDuration(0);
      onClose();
    }, 2000);
    
    toast({
      title: "Call Ended",
      description: "Thank you for talking with Dr. Maya!",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="p-6">
          <div className="text-center space-y-6">
            {/* Avatar and Coach Info */}
            <div className="space-y-3">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-3xl">
                👩🏻‍⚕️
              </div>
              <div>
                <h3 className="text-xl font-semibold">Dr. Maya</h3>
                <p className="text-sm text-muted-foreground">Your Wellness Coach</p>
              </div>
            </div>

            {/* Call Status */}
            <div className="space-y-2">
              {callState === 'idle' && (
                <p className="text-sm text-muted-foreground">
                  Ready to start your wellness conversation
                </p>
              )}
              
              {callState === 'connecting' && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Connecting...</p>
                  <div className="flex justify-center">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              
              {callState === 'connected' && (
                <div className="space-y-2">
                  <p className="text-sm text-green-600 font-medium">Connected</p>
                  <p className="text-lg font-mono">{formatDuration(callDuration)}</p>
                  <div className="flex justify-center items-center gap-2">
                    {isCoachSpeaking ? (
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-4 bg-blue-500 rounded-full animate-pulse" />
                        <div className="w-1 h-6 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                        <div className="w-1 h-5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <span className="text-xs text-blue-600 ml-2">Dr. Maya speaking...</span>
                      </div>
                    ) : isListening ? (
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs text-red-600">Listening...</span>
                      </div>
                    ) : (
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    )}
                  </div>
                  {transcript && (
                    <div className="text-xs text-muted-foreground italic">
                      "{transcript}"
                    </div>
                  )}
                </div>
              )}
              
              {callState === 'ended' && (
                <p className="text-sm text-muted-foreground">Call ended</p>
              )}
            </div>

            {/* Call Controls */}
            <div className="flex justify-center gap-4">
              {callState === 'idle' && (
                <>
                  <Button
                    size="lg"
                    onClick={startVoiceCall}
                    className="rounded-full w-16 h-16 bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Phone className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={onClose}
                    className="rounded-full w-16 h-16"
                  >
                    <PhoneCall className="h-6 w-6" />
                  </Button>
                </>
              )}

              {(callState === 'connecting' || callState === 'connected') && (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      if (isListening) {
                        stopListening();
                      } else {
                        startListening();
                      }
                      setIsMuted(!isMuted);
                    }}
                    className={`rounded-full w-12 h-12 ${isListening ? 'bg-red-100 border-red-300' : ''}`}
                  >
                    {isListening ? <Mic className="h-5 w-5 text-red-600" /> : <MicOff className="h-5 w-5" />}
                  </Button>
                  
                  <Button
                    size="lg"
                    onClick={endVoiceCall}
                    className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600 text-white"
                  >
                    <PhoneCall className="h-6 w-6" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full w-12 h-12"
                  >
                    <Volume2 className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>

            {/* Tips */}
            {callState === 'idle' && (
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Dr. Maya knows about your wellness journey</p>
                <p>• Ask about nutrition, fitness, or emotional support</p>
                <p>• Conversation is private and personalized</p>
              </div>
            )}

            {callState === 'connected' && (
              <div className="text-xs text-muted-foreground space-y-1">
                {isCoachSpeaking ? (
                  <p>Dr. Maya is speaking... Please listen.</p>
                ) : isListening ? (
                  <p>Dr. Maya is listening. Speak naturally!</p>
                ) : (
                  <p>Tap the microphone to speak with Dr. Maya</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceCallInterface;