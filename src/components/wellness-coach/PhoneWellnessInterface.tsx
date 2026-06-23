import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, PhoneCall, PhoneOff, MessageCircle, Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PhoneWellnessInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const PhoneWellnessInterface = ({ isOpen, onClose }: PhoneWellnessInterfaceProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callId, setCallId] = useState<string | null>(null);
  const [callStatus, setCallStatus] = useState<'idle' | 'dialing' | 'connected' | 'ended'>('idle');
  const [messages, setMessages] = useState<Array<{id: string, content: string, sender: 'user' | 'coach', timestamp: Date}>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (callId && callStatus === 'dialing') {
      const checkStatus = setInterval(async () => {
        try {
          const { data, error } = await supabase.functions.invoke('bland-voice-agent', {
            body: { action: 'get_call_status', callId }
          });

          if (error) throw error;

          if (data.status === 'completed' || data.status === 'no-answer') {
            setCallStatus('ended');
            clearInterval(checkStatus);
          } else if (data.status === 'live') {
            setCallStatus('connected');
            clearInterval(checkStatus);
          }
        } catch (error) {
          console.error('Error checking call status:', error);
        }
      }, 2000);

      return () => clearInterval(checkStatus);
    }
  }, [callId, callStatus]);

  const startCall = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number to start the call.",
        variant: "destructive"
      });
      return;
    }

    try {
      setCallStatus('dialing');
      
      const { data, error } = await supabase.functions.invoke('bland-voice-agent', {
        body: { 
          action: 'start_call', 
          phone_number: phoneNumber.replace(/\D/g, '') // Remove non-digits
        }
      });

      if (error) throw error;

      setCallId(data.call_id);
      toast({
        title: "Call Started",
        description: "Dr. Maya will call you shortly at " + phoneNumber,
      });

    } catch (error) {
      console.error('Error starting call:', error);
      setCallStatus('idle');
      toast({
        title: "Call Failed",
        description: "Failed to start the call. Please try again.",
        variant: "destructive"
      });
    }
  };

  const endCall = async () => {
    if (callId) {
      try {
        await supabase.functions.invoke('bland-voice-agent', {
          body: { action: 'end_call', callId }
        });
      } catch (error) {
        console.error('Error ending call:', error);
      }
    }
    setCallStatus('ended');
    setCallId(null);
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'user' as const,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');

    try {
      const { data, error } = await supabase.functions.invoke('ai-wellness-chat', {
        body: {
          message: currentMessage,
          userProfile: user,
          conversationHistory: messages.slice(-5)
        }
      });

      if (error) throw error;

      const coachMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'coach' as const,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, coachMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Message Failed",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-background to-muted border-0 shadow-2xl">
        <div className="flex flex-col h-[600px]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Dr. Maya</h3>
                <p className="text-sm text-muted-foreground">Wellness Coach</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {callStatus === 'connected' && (
                <div className="flex items-center gap-1 text-green-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs">Live</span>
                </div>
              )}
            </div>
          </div>

          {/* Phone Call Section */}
          <div className="p-4 border-b border-border/10">
            {callStatus === 'idle' && (
              <div className="space-y-3">
                <Input
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  maxLength={14}
                  className="text-center text-lg"
                />
                <Button 
                  onClick={startCall}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  size="lg"
                >
                  <PhoneCall className="h-5 w-5 mr-2" />
                  Call Dr. Maya
                </Button>
              </div>
            )}

            {callStatus === 'dialing' && (
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
                  <PhoneCall className="h-8 w-8 text-white" />
                </div>
                <p className="text-lg font-medium">Calling {phoneNumber}...</p>
                <Button onClick={endCall} variant="destructive" size="sm">
                  <PhoneOff className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}

            {callStatus === 'connected' && (
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <PhoneCall className="h-8 w-8 text-white" />
                </div>
                <p className="text-lg font-medium text-green-600 dark:text-green-400">Connected with Dr. Maya</p>
                <p className="text-sm text-muted-foreground">Enjoy your wellness coaching session!</p>
                <Button onClick={endCall} variant="destructive" size="sm">
                  <PhoneOff className="h-4 w-4 mr-2" />
                  End Call
                </Button>
              </div>
            )}

            {callStatus === 'ended' && (
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-gray-400 flex items-center justify-center">
                  <PhoneOff className="h-8 w-8 text-white" />
                </div>
                <p className="text-lg font-medium">Call Ended</p>
                <Button 
                  onClick={() => {
                    setCallStatus('idle');
                    setCallId(null);
                  }}
                  variant="outline"
                  size="sm"
                >
                  Start New Call
                </Button>
              </div>
            )}
          </div>

          {/* Chat Section */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-2 p-3 border-b border-border/10">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Chat with Dr. Maya</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Start a conversation with Dr. Maya</p>
                  <p className="text-xs mt-1">She's here to help with your wellness journey</p>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-3 border-t border-border/10">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button 
                  onClick={sendMessage}
                  disabled={!currentMessage.trim()}
                  size="sm"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhoneWellnessInterface;