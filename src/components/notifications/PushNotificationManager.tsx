import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';

export const PushNotificationManager = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      checkSubscription();
    }
  }, [user]);

  const checkSubscription = async () => {
    if (!user || !('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support push notifications.",
        variant: "destructive"
      });
      return;
    }

    const permission = await Notification.requestPermission();
    setPermission(permission);

    if (permission === 'granted') {
      await subscribeToPushNotifications();
    } else {
      toast({
        title: "Permission denied",
        description: "Please enable notifications in your browser settings.",
        variant: "destructive"
      });
    }
  };

  const subscribeToPushNotifications = async () => {
    if (!user) return;

    try {
      // Register service worker
      let registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        registration = await navigator.serviceWorker.register('/sw.js');
      }

      // Create push subscription
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(getVapidPublicKey())
      });

      // Save subscription to database
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: user.id,
          endpoint: subscription.endpoint,
          p256dh_key: arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth_key: arrayBufferToBase64(subscription.getKey('auth')!)
        });

      if (error) throw error;

      setIsSubscribed(true);
      toast({
        title: "Notifications enabled!",
        description: "You'll now receive push notifications about your progress and community activity."
      });
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      toast({
        title: "Subscription failed",
        description: "There was an error setting up notifications.",
        variant: "destructive"
      });
    }
  };

  const unsubscribe = async () => {
    if (!user) return;

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
        }
      }

      // Remove subscription from database
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', user.id);

      setIsSubscribed(false);
      toast({
        title: "Notifications disabled",
        description: "You won't receive push notifications anymore."
      });
    } catch (error) {
      console.error('Error unsubscribing:', error);
      toast({
        title: "Error",
        description: "There was an error disabling notifications.",
        variant: "destructive"
      });
    }
  };

  if (!('Notification' in window)) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {permission === 'granted' ? (
        <Button
          variant={isSubscribed ? "default" : "outline"}
          size="sm"
          onClick={isSubscribed ? unsubscribe : subscribeToPushNotifications}
        >
          {isSubscribed ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          {isSubscribed ? 'Notifications On' : 'Enable Notifications'}
        </Button>
      ) : (
        <Button variant="outline" size="sm" onClick={requestPermission}>
          <Bell className="h-4 w-4 mr-2" />
          Enable Notifications
        </Button>
      )}
    </div>
  );
};

// Helper functions
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function getVapidPublicKey() {
  // This should be your VAPID public key - you'll need to generate one
  return 'BEl62iUYgUivxIkv69yViEuiBIa40HI0DjAseBcCiQa_JLlFJrQCADbQfeCNrQ7gSHV6Q7l6rW0NrQ7gSHV6Q7l6';
}