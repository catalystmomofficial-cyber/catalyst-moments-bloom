import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const ProfilePushToggle = () => {
  const { user } = useAuth();
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    requestPermission,
    unsubscribe,
  } = usePushNotifications();

  const handleToggle = async (enabled: boolean) => {
    if (enabled) {
      const ok = await requestPermission();
      if (!ok) {
        toast.error(
          permission === 'denied'
            ? 'Permission blocked. Enable notifications in your browser settings.'
            : 'Could not enable push notifications.'
        );
        return;
      }
      toast.success('Push notifications enabled');

      // Fire welcome push immediately for first opt-in
      if (user) {
        try {
          await supabase.functions.invoke('send-lifecycle-notifications', {
            body: { type: 'welcome', user_ids: [user.id] },
          });
        } catch (e) {
          console.error('Welcome push failed:', e);
        }
      }
    } else {
      await unsubscribe();
      toast.success('Push notifications disabled');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isSubscribed ? (
            <Bell className="h-5 w-5 text-primary" />
          ) : (
            <BellOff className="h-5 w-5 text-muted-foreground" />
          )}
          Push Notifications
        </CardTitle>
        <CardDescription>
          Get reminders for workouts, meals & gentle nudges to keep your momentum.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {!isSupported ? (
          <p className="text-sm text-muted-foreground">
            Your browser doesn't support push notifications. Try installing the app on your phone.
          </p>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-toggle" className="text-sm">
                Enable push notifications
              </Label>
              <div className="flex items-center gap-2">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                <Switch
                  id="push-toggle"
                  checked={isSubscribed && permission === 'granted'}
                  disabled={isLoading || permission === 'denied'}
                  onCheckedChange={handleToggle}
                />
              </div>
            </div>
            {permission === 'denied' && (
              <p className="text-xs text-destructive">
                Notifications are blocked. Open your browser's site settings to allow them.
              </p>
            )}
            {isSubscribed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggle(false)}
                className="text-xs"
              >
                Unsubscribe this device
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfilePushToggle;
