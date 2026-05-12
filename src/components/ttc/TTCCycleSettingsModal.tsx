import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { TTCCycleSettings } from '@/hooks/useTTCData';

const CONDITIONS = ['pcos', 'endometriosis', 'thyroid', 'fibroids', 'low_amh', 'none'];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: TTCCycleSettings | null;
  onSaved: () => void;
}

export const TTCCycleSettingsModal = ({ open, onOpenChange, initial, onSaved }: Props) => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [lastPeriod, setLastPeriod] = useState(initial?.last_period_start ?? '');
  const [cycleLen, setCycleLen] = useState(initial?.average_cycle_length ?? 28);
  const [periodLen, setPeriodLen] = useState(initial?.average_period_length ?? 5);
  const [ttcStart, setTtcStart] = useState(initial?.ttc_start_date ?? '');
  const [monthsTrying, setMonthsTrying] = useState(initial?.months_trying ?? 0);
  const [conditions, setConditions] = useState<string[]>(initial?.known_conditions ?? []);

  const toggleCondition = (c: string) => {
    setConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const handleSave = async () => {
    if (!user) return;
    if (!lastPeriod) { toast.error('Last period start date is required'); return; }
    setSaving(true);
    const { error } = await supabase.from('ttc_cycle_settings').upsert({
      user_id: user.id,
      last_period_start: lastPeriod,
      average_cycle_length: Number(cycleLen) || 28,
      average_period_length: Number(periodLen) || 5,
      ttc_start_date: ttcStart || null,
      months_trying: Number(monthsTrying) || 0,
      known_conditions: conditions,
    }, { onConflict: 'user_id' });
    setSaving(false);
    if (error) { toast.error('Could not save: ' + error.message); return; }
    toast.success('Cycle settings saved');
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cycle Settings</DialogTitle>
          <DialogDescription>Set your baseline so we can calculate your cycle day accurately.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="lp">Last period start date *</Label>
            <Input id="lp" type="date" value={lastPeriod} onChange={e => setLastPeriod(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="cl">Avg cycle length (days)</Label>
              <Input id="cl" type="number" min={20} max={45} value={cycleLen} onChange={e => setCycleLen(Number(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="pl">Avg period length</Label>
              <Input id="pl" type="number" min={1} max={10} value={periodLen} onChange={e => setPeriodLen(Number(e.target.value))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="ttc">TTC start date</Label>
              <Input id="ttc" type="date" value={ttcStart} onChange={e => setTtcStart(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="mt">Months trying</Label>
              <Input id="mt" type="number" min={0} value={monthsTrying} onChange={e => setMonthsTrying(Number(e.target.value))} />
            </div>
          </div>
          <div>
            <Label>Known conditions</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {CONDITIONS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCondition(c)}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${conditions.includes(c) ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground border-border'}`}
                >{c.replace('_', ' ')}</button>
              ))}
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Save cycle settings'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
