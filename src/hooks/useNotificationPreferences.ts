import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface NotificationPrefs {
  daily_reminders_enabled: boolean;
  achievement_alerts_enabled: boolean;
  weekly_summary_enabled: boolean;
  reminder_time: string;
}

const defaultPrefs: NotificationPrefs = {
  daily_reminders_enabled: true,
  achievement_alerts_enabled: true,
  weekly_summary_enabled: true,
  reminder_time: '09:00:00',
};

export function useNotificationPreferences() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<NotificationPrefs>(defaultPrefs);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetch = async () => {
      const { data } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setPrefs({
          daily_reminders_enabled: data.daily_reminders_enabled,
          achievement_alerts_enabled: data.achievement_alerts_enabled,
          weekly_summary_enabled: data.weekly_summary_enabled,
          reminder_time: data.reminder_time,
        });
      }
      setIsLoading(false);
    };

    fetch();
  }, [user]);

  const updatePrefs = useCallback(
    async (updates: Partial<NotificationPrefs>) => {
      if (!user) return;
      const newPrefs = { ...prefs, ...updates };
      setPrefs(newPrefs);

      await supabase
        .from('notification_preferences')
        .upsert({ user_id: user.id, ...newPrefs }, { onConflict: 'user_id' });
    },
    [user, prefs]
  );

  return { prefs, isLoading, updatePrefs };
}
