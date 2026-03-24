import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, X } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { toast } from 'sonner';

const DISMISS_KEY = 'catalyst-push-prompt-dismissed';

export const PushNotificationPrompt = () => {
  const { isSupported, permission, isSubscribed, isLoading, requestPermission } = usePushNotifications();
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === 'true');

  if (!isSupported || isSubscribed || permission === 'denied' || dismissed) return null;

  const handleEnable = async () => {
    const success = await requestPermission();
    if (success) {
      toast.success('Push notifications enabled! 🔔');
    } else {
      toast.error('Could not enable notifications. Please check your browser settings.');
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(DISMISS_KEY, 'true');
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Bell className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">Stay on track with push notifications</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Get reminders for workouts, wellness check-ins, and community updates.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" onClick={handleEnable} disabled={isLoading}>
            {isLoading ? 'Enabling…' : 'Enable'}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PushNotificationPrompt;
