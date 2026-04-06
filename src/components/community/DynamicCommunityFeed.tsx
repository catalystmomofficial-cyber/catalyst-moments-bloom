import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface DynamicCommunityFeedProps {
  groupSlug?: string;
  isTTC?: boolean;
}

export const DynamicCommunityFeed = ({ groupSlug, isTTC = false }: DynamicCommunityFeedProps) => {
  const { user, subscribed, setShowCheckoutModal } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to post', variant: 'destructive' });
      return;
    }
    if (!subscribed) {
      setShowCheckoutModal(true);
      return;
    }
    if (!message.trim()) return;
    toast({ title: 'Coming soon', description: 'Community posting will be available soon!' });
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full min-h-[400px]">
      {/* Empty state */}
      <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <MessageCircle className="h-8 w-8 text-muted-foreground/60" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No messages yet</h3>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Be the first to start a conversation! Share your journey, ask questions, or offer support.
        </p>
      </div>

      {/* WhatsApp-style message input */}
      <div className="sticky bottom-0 bg-background border-t p-3">
        <div className="flex items-center gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full bg-muted border-0 px-4 h-10 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button
            size="icon"
            className="rounded-full h-10 w-10 shrink-0"
            onClick={handleSend}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
