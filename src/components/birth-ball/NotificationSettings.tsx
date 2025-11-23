import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Bell, Clock, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const NotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    daily_reminders_enabled: true,
    weekly_summary_enabled: true,
    achievement_alerts_enabled: true,
    reminder_time: '09:00',
  });

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading preferences:', error);
        return;
      }

      if (data) {
        setPreferences({
          daily_reminders_enabled: data.daily_reminders_enabled,
          weekly_summary_enabled: data.weekly_summary_enabled,
          achievement_alerts_enabled: data.achievement_alerts_enabled,
          reminder_time: data.reminder_time.substring(0, 5),
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          daily_reminders_enabled: preferences.daily_reminders_enabled,
          weekly_summary_enabled: preferences.weekly_summary_enabled,
          achievement_alerts_enabled: preferences.achievement_alerts_enabled,
          reminder_time: preferences.reminder_time,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: 'Settings saved',
        description: 'Your notification preferences have been updated.',
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notification preferences.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = (key: string, value: boolean | string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <CardTitle>Notification Settings</CardTitle>
        </div>
        <CardDescription>
          Manage how you receive reminders and updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label htmlFor="daily-reminders">Daily Practice Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get reminded to do your birth ball exercises
                </p>
              </div>
            </div>
            <Switch
              id="daily-reminders"
              checked={preferences.daily_reminders_enabled}
              onCheckedChange={(checked) => updatePreference('daily_reminders_enabled', checked)}
            />
          </div>

          {preferences.daily_reminders_enabled && (
            <div className="ml-7 space-y-2">
              <Label htmlFor="reminder-time">Reminder Time</Label>
              <input
                id="reminder-time"
                type="time"
                value={preferences.reminder_time}
                onChange={(e) => updatePreference('reminder_time', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label htmlFor="weekly-summary">Weekly Progress Summary</Label>
                <p className="text-sm text-muted-foreground">
                  Receive a weekly recap of your progress
                </p>
              </div>
            </div>
            <Switch
              id="weekly-summary"
              checked={preferences.weekly_summary_enabled}
              onCheckedChange={(checked) => updatePreference('weekly_summary_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-4 h-4 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label htmlFor="achievement-alerts">Achievement Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when you earn new badges
                </p>
              </div>
            </div>
            <Switch
              id="achievement-alerts"
              checked={preferences.achievement_alerts_enabled}
              onCheckedChange={(checked) => updatePreference('achievement_alerts_enabled', checked)}
            />
          </div>
        </div>

        <Button 
          onClick={savePreferences} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardContent>
    </Card>
  );
};
