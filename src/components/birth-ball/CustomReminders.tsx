import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Clock, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CustomReminder {
  id: string;
  title: string;
  description: string | null;
  reminder_time: string;
  days_of_week: number[] | null;
  exercise_id: string | null;
  goal_type: string | null;
  is_active: boolean;
  frequency: string;
  monthly_day: number | null;
}

const DAYS = [
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
  { value: 7, label: 'Sun' },
];

const GOAL_TYPES = [
  { value: 'weekly_sessions', label: 'Weekly Sessions Goal' },
  { value: 'weekly_minutes', label: 'Weekly Minutes Goal' },
  { value: 'exercise_variety', label: 'Exercise Variety Goal' },
];

export const CustomReminders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reminders, setReminders] = useState<CustomReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reminder_time: '09:00',
    days_of_week: [1, 2, 3, 4, 5, 6, 7],
    goal_type: '',
    frequency: 'weekly' as 'daily' | 'weekly' | 'monthly',
    monthly_day: 1,
  });

  useEffect(() => {
    if (user) {
      loadReminders();
    }
  }, [user]);

  const loadReminders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('custom_reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Error loading reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const createReminder = async () => {
    if (!user || !formData.title) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('custom_reminders')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description || null,
          reminder_time: formData.reminder_time,
          days_of_week: formData.frequency === 'weekly' ? formData.days_of_week : null,
          goal_type: formData.goal_type || null,
          frequency: formData.frequency,
          monthly_day: formData.frequency === 'monthly' ? formData.monthly_day : null,
        });

      if (error) throw error;

      toast({
        title: 'Reminder created',
        description: 'Your custom reminder has been scheduled.',
      });

      setIsOpen(false);
      setFormData({
        title: '',
        description: '',
        reminder_time: '09:00',
        days_of_week: [1, 2, 3, 4, 5, 6, 7],
        goal_type: '',
        frequency: 'weekly',
        monthly_day: 1,
      });
      loadReminders();
    } catch (error) {
      console.error('Error creating reminder:', error);
      toast({
        title: 'Error',
        description: 'Failed to create reminder.',
        variant: 'destructive',
      });
    }
  };

  const toggleReminder = async (id: string, is_active: boolean) => {
    try {
      const { error } = await supabase
        .from('custom_reminders')
        .update({ is_active })
        .eq('id', id);

      if (error) throw error;

      setReminders(prev =>
        prev.map(r => (r.id === id ? { ...r, is_active } : r))
      );

      toast({
        title: is_active ? 'Reminder enabled' : 'Reminder disabled',
      });
    } catch (error) {
      console.error('Error toggling reminder:', error);
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('custom_reminders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setReminders(prev => prev.filter(r => r.id !== id));
      toast({
        title: 'Reminder deleted',
      });
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const toggleDay = (day: number) => {
    setFormData(prev => ({
      ...prev,
      days_of_week: prev.days_of_week.includes(day)
        ? prev.days_of_week.filter(d => d !== day)
        : [...prev.days_of_week, day].sort(),
    }));
  };

  const formatDays = (days: number[] | null) => {
    if (!days || days.length === 0) return 'No days selected';
    if (days.length === 7) return 'Every day';
    return days
      .sort()
      .map(d => DAYS.find(day => day.value === d)?.label)
      .filter(Boolean)
      .join(', ');
  };

  const getFrequencyDisplay = (reminder: CustomReminder) => {
    if (reminder.frequency === 'daily') return 'Daily';
    if (reminder.frequency === 'monthly') return `Monthly (Day ${reminder.monthly_day})`;
    return formatDays(reminder.days_of_week);
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading reminders...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Custom Reminders
            </CardTitle>
            <CardDescription>
              Schedule personalized reminders for exercises and goals
            </CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Reminder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Custom Reminder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Reminder Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Morning stretches"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Additional notes..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.reminder_time}
                    onChange={(e) => setFormData({ ...formData, reminder_time: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Frequency</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value: 'daily' | 'weekly' | 'monthly') =>
                      setFormData({ ...formData, frequency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.frequency === 'weekly' && (
                  <div>
                    <Label>Days of Week</Label>
                    <div className="flex gap-2 mt-2">
                      {DAYS.map(day => (
                        <Button
                          key={day.value}
                          type="button"
                          variant={formData.days_of_week.includes(day.value) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => toggleDay(day.value)}
                          className="flex-1"
                        >
                          {day.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {formData.frequency === 'monthly' && (
                  <div>
                    <Label htmlFor="monthly-day">Day of Month</Label>
                    <Input
                      id="monthly-day"
                      type="number"
                      min="1"
                      max="31"
                      value={formData.monthly_day}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          monthly_day: parseInt(e.target.value) || 1,
                        })
                      }
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="goal-type">Related Goal (Optional)</Label>
                  <Select value={formData.goal_type} onValueChange={(value) => setFormData({ ...formData, goal_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a goal..." />
                    </SelectTrigger>
                    <SelectContent>
                      {GOAL_TYPES.map(goal => (
                        <SelectItem key={goal.value} value={goal.value}>
                          {goal.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={createReminder} className="w-full">
                  Create Reminder
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {reminders.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No custom reminders yet. Create one to get started!
          </p>
        ) : (
          <div className="space-y-3">
            {reminders.map(reminder => (
              <div
                key={reminder.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{reminder.title}</h4>
                  {reminder.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {reminder.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {reminder.reminder_time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {getFrequencyDisplay(reminder)}
                    </span>
                    {reminder.goal_type && (
                      <Badge variant="outline" className="text-xs">
                        {GOAL_TYPES.find(g => g.value === reminder.goal_type)?.label || reminder.goal_type}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={reminder.is_active}
                    onCheckedChange={(checked) => toggleReminder(reminder.id, checked)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteReminder(reminder.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};