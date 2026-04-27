import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getMessagingIfSupported, getToken, onMessage, VAPID_KEY } from '@/lib/firebase';

export function usePushNotifications() {
  const { user } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isSupported =
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'Notification' in window &&
    'PushManager' in window;

  useEffect(() => {
    if (!isSupported) return;
    setPermission(Notification.permission);
  }, [isSupported]);

  // Check existing token
  useEffect(() => {
    if (!user || !isSupported || Notification.permission !== 'granted') return;
    (async () => {
      try {
        const { data } = await supabase
          .from('push_subscriptions')
          .select('fcm_token')
          .eq('user_id', user.id)
          .maybeSingle();
        setIsSubscribed(!!data?.fcm_token);
      } catch {
        setIsSubscribed(false);
      }
    })();
  }, [user, isSupported]);

  // Foreground message handler
  useEffect(() => {
    let unsub: (() => void) | undefined;
    (async () => {
      const messaging = await getMessagingIfSupported();
      if (!messaging) return;
      unsub = onMessage(messaging, (payload) => {
        const n = payload.notification || {};
        const data = (payload.data || {}) as Record<string, string>;
        const title = n.title || data.title || 'Catalyst Mom';
        const body = n.body || data.body || '';
        if (Notification.permission === 'granted') {
          try {
            new Notification(title, {
              body,
              icon: n.icon || data.icon || '/catalyst-mom-logo.png',
            });
          } catch {
            // ignore
          }
        }
      });
    })();
    return () => unsub?.();
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported || !user) return false;
    setIsLoading(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== 'granted') return false;

      const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      await navigator.serviceWorker.ready;

      const messaging = await getMessagingIfSupported();
      if (!messaging) throw new Error('FCM not supported in this browser');

      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: swReg,
      });
      if (!token) throw new Error('Failed to obtain FCM token');

      const { error } = await supabase
        .from('push_subscriptions')
        .upsert(
          {
            user_id: user.id,
            fcm_token: token,
            endpoint: `fcm:${token}`,
            auth_key: 'fcm',
            p256dh_key: 'fcm',
          },
          { onConflict: 'user_id' }
        );
      if (error) throw error;

      setIsSubscribed(true);
      return true;
    } catch (err) {
      console.error('FCM subscription failed:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, user]);

  const unsubscribe = useCallback(async () => {
    if (!user) return;
    try {
      await supabase.from('push_subscriptions').delete().eq('user_id', user.id);
      setIsSubscribed(false);
    } catch (err) {
      console.error('Unsubscribe failed:', err);
    }
  }, [user]);

  return { isSupported, permission, isSubscribed, isLoading, requestPermission, unsubscribe };
}
