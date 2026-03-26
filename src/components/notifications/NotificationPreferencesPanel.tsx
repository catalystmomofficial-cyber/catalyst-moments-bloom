import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';

export const NotificationPreferencesPanel = () => {
  const { prefs, isLoading, updatePrefs } = useNotificationPreferences();

  if (isLoading) {
    return <div className="p-4 text-xs text-muted-foreground">Loading preferences…</div>;
  }

  return (
    <div className="p-4 space-y-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Preferences</p>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="daily-reminders" className="text-xs">Daily reminders</Label>
        <Switch
          id="daily-reminders"
          checked={prefs.daily_reminders_enabled}
          onCheckedChange={(checked) => updatePrefs({ daily_reminders_enabled: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="achievement-alerts" className="text-xs">Achievement alerts</Label>
        <Switch
          id="achievement-alerts"
          checked={prefs.achievement_alerts_enabled}
          onCheckedChange={(checked) => updatePrefs({ achievement_alerts_enabled: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="weekly-summary" className="text-xs">Weekly summary</Label>
        <Switch
          id="weekly-summary"
          checked={prefs.weekly_summary_enabled}
          onCheckedChange={(checked) => updatePrefs({ weekly_summary_enabled: checked })}
        />
      </div>
    </div>
  );
};

export default NotificationPreferencesPanel;
