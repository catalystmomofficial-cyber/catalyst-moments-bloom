import React, { useState, useEffect } from 'react';
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
  const [callId, setCallId] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);

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

  const startVoiceCall = async () => {
    try {
      setCallState('connecting');
      
      // Gather user context for personalized conversation
      const userContext = {
        display_name: profile?.display_name || user?.email?.split('@')[0],
        motherhood_stage: profile?.motherhood_stage,
        latestMoodScore: wellnessEntries?.[0]?.mood_score,
        latestEnergyLevel: wellnessEntries?.[0]?.energy_level,
        sleepQuality: wellnessEntries?.[0]?.mood_score, // Using mood_score as fallback
        stressLevel: wellnessEntries?.[0]?.stress_level
      };

      const { data, error } = await supabase.functions.invoke('bland-voice-agent', {
        body: {
          action: 'start_call',
          userProfile: userContext,
          wellnessData: {
            latestMoodScore: wellnessEntries?.[0]?.mood_score,
            latestEnergyLevel: wellnessEntries?.[0]?.energy_level,
            recentEntries: wellnessEntries?.slice(0, 3)
          }
        }
      });

      if (error) throw error;

      setCallId(data.call_id);
      setCallState('connected');
      setCallDuration(0);
      
      toast({
        title: "Voice Call Started",
        description: "Dr. Maya is ready to talk with you!",
      });
    } catch (error) {
      console.error('Error starting voice call:', error);
      setCallState('idle');
      toast({
        title: "Call Failed",
        description: "Unable to start voice call. Please try again.",
        variant: "destructive",
      });
    }
  };

  const endVoiceCall = async () => {
    try {
      if (callId) {
        await supabase.functions.invoke('bland-voice-agent', {
          body: {
            action: 'end_call',
            callId
          }
        });
      }
      
      setCallState('ended');
      setTimeout(() => {
        setCallState('idle');
        setCallId(null);
        setCallDuration(0);
        onClose();
      }, 2000);
      
      toast({
        title: "Call Ended",
        description: "Thank you for talking with Dr. Maya!",
      });
    } catch (error) {
      console.error('Error ending call:', error);
      setCallState('idle');
      setCallId(null);
      onClose();
    }
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
                  <div className="flex justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  </div>
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
                    onClick={() => setIsMuted(!isMuted)}
                    className="rounded-full w-12 h-12"
                  >
                    {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
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
              <div className="text-xs text-muted-foreground">
                <p>Dr. Maya can hear you clearly. Speak naturally!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceCallInterface;