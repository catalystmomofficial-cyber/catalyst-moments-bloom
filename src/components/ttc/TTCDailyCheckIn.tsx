import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTTCData, calcCycleDay } from '@/hooks/useTTCData';

export const TTCDailyCheckIn = () => {
  const { user } = useAuth();
  const { todayCheckin, allCheckins, settings, refresh, cycleDay } = useTTCData();
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [energy, setEnergy] = useState(7);
  const [mood, setMood] = useState('');
  const [skin, setSkin] = useState<'clear' | 'okay' | 'breaking_out' | ''>('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Already checked in today → compact view
  if (todayCheckin) {
    return (
      <Card className="border-primary/30">
        <CardContent className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-primary/10 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm">Checked in today</p>
              <p className="text-xs text-muted-foreground">
                {cycleDay ? `Day ${cycleDay} of your cycle` : 'Energy ' + (todayCheckin.energy_score ?? '—') + '/10'}
              </p>
            </div>
          </div>
          {todayCheckin.energy_score && (
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{todayCheckin.energy_score}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Energy</div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  const submit = async () => {
    if (!user) return;
    setSaving(true);
    const todayISO = new Date().toISOString().slice(0, 10);
    const cd = calcCycleDay(settings, todayISO);
    const { error } = await supabase.from('ttc_daily_checkins').insert({
      user_id: user.id,
      checkin_date: todayISO,
      cycle_day: cd,
      energy_score: energy,
      mood: mood.trim() || null,
      skin_status: skin || null,
      symptoms_notes: notes.trim() || null,
    });
    if (error) {
      setSaving(false);
      toast.error('Could not save check-in: ' + error.message);
      return;
    }

    // Award +25 base
    await supabase.rpc('add_user_points', {
      p_user_id: user.id,
      p_points: 25,
      p_source: 'ttc_daily_checkin',
      p_description: 'Daily TTC check-in',
    });

    // Streak bonuses
    const dates = new Set([todayISO, ...allCheckins.map(c => c.checkin_date)]);
    const consecutive = countConsecutive(dates, todayISO);
    if (consecutive === 7) {
      await supabase.rpc('add_user_points', { p_user_id: user.id, p_points: 150, p_source: 'ttc_streak_7', p_description: '7-day check-in streak' });
      toast.success('🔥 7-day streak! +150 bonus');
    } else if (consecutive === 30) {
      await supabase.rpc('add_user_points', { p_user_id: user.id, p_points: 500, p_source: 'ttc_streak_30', p_description: '30-day check-in streak' });
      toast.success('🏆 30-day streak! +500 bonus');
    } else {
      toast.success('Check-in saved ✓ +25 pts');
    }

    window.dispatchEvent(new CustomEvent('points-updated'));
    setSaving(false);
    await refresh();
  };

  return (
    <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-base gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Quick Check-In — 30 seconds
        </CardTitle>
        <CardDescription>Step {step + 1} of 4</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Energy today?</p>
            <Slider value={[energy]} min={1} max={10} step={1} onValueChange={v => setEnergy(v[0])} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span><span className="font-bold text-primary text-base">{energy}/10</span><span>High</span>
            </div>
            <Button className="w-full" onClick={() => setStep(1)}>Next</Button>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Mood in one word?</p>
            <Input value={mood} onChange={e => setMood(e.target.value)} placeholder="e.g. calm, anxious, hopeful" maxLength={30} />
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep(0)}>Back</Button>
              <Button className="flex-1" onClick={() => setStep(2)}>Next</Button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Skin today?</p>
            <div className="grid grid-cols-3 gap-2">
              {(['clear', 'okay', 'breaking_out'] as const).map(s => (
                <Button key={s} variant={skin === s ? 'default' : 'outline'} size="sm" onClick={() => setSkin(s)}>
                  {s === 'breaking_out' ? 'Breaking out' : s.charAt(0).toUpperCase() + s.slice(1)}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1" onClick={() => setStep(3)} disabled={!skin}>Next</Button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Anything else? <span className="text-muted-foreground font-normal">(optional)</span></p>
            <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Cravings, symptoms, weirdness…" maxLength={200} />
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
              <Button className="flex-1" onClick={submit} disabled={saving}>
                {saving ? 'Saving…' : 'Save check-in (+25 pts)'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

function countConsecutive(dateSet: Set<string>, fromISO: string): number {
  let count = 0;
  let cursor = new Date(fromISO + 'T00:00:00Z');
  while (dateSet.has(cursor.toISOString().slice(0, 10))) {
    count++;
    cursor = new Date(cursor.getTime() - 86400000);
  }
  return count;
}
