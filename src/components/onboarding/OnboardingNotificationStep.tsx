import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Props {
  onComplete: () => void;
  /** When true, render compact (inside an existing dialog). */
  embedded?: boolean;
}

/**
 * Onboarding step that asks the user to enable push notifications
 * and registers their FCM device token in Supabase (push_subscriptions).
 */
export const OnboardingNotificationStep = ({ onComplete, embedded = true }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isSupported, permission, requestPermission, isLoading } = usePushNotifications();
  const [done, setDone] = useState(false);

  const handleEnable = async () => {
    const ok = await requestPermission();
    if (!ok) {
      toast({
        title: 'Notifications not enabled',
        description:
          permission === 'denied'
            ? 'You can enable them later from your browser settings or Profile.'
            : 'You can enable them later from your Profile.',
      });
      onComplete();
      return;
    }

    // Token has been stored by usePushNotifications. Send a welcome push.
    if (user) {
      try {
        await supabase.functions.invoke('send-lifecycle-notifications', {
          body: { type: 'welcome', user_ids: [user.id] },
        });
      } catch (err) {
        console.error('Welcome push failed:', err);
      }
    }

    setDone(true);
    toast({
      title: 'Notifications enabled 🔔',
      description: "We'll send gentle nudges so you never miss a moment.",
    });
    setTimeout(onComplete, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={embedded ? 'space-y-4 py-2' : 'space-y-6 py-6 text-center'}
    >
      <div className="text-center space-y-2">
        <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
          <Bell className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Stay in your flow</h3>
        <p className="text-sm text-muted-foreground">
          Get gentle reminders for workouts, meals, and check-ins. You can change this any time in
          your Profile.
        </p>
      </div>

      {!isSupported ? (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
          <BellOff className="h-4 w-4 mt-0.5" />
          <span>This browser doesn't support push notifications. Try installing the app on your phone for the full experience.</span>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onComplete}
            disabled={isLoading}
          >
            Maybe later
          </Button>
          <Button
            className="flex-1"
            onClick={handleEnable}
            disabled={isLoading || done || permission === 'denied'}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enabling…
              </>
            ) : done ? (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Enabled!
              </>
            ) : (
              <>
                <Bell className="mr-2 h-4 w-4" />
                Enable notifications
              </>
            )}
          </Button>
        </div>
      )}

      {permission === 'denied' && (
        <p className="text-xs text-destructive text-center">
          Notifications are blocked in your browser settings. Allow them and refresh to enable.
        </p>
      )}
    </motion.div>
  );
};

export default OnboardingNotificationStep;
