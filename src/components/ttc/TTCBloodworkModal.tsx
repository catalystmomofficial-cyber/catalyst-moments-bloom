import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { calcCycleDay } from '@/hooks/useTTCData';

const MARKERS: Array<{ key: string; label: string; unit: string }> = [
  { key: 'fsh', label: 'FSH', unit: 'mIU/mL' },
  { key: 'lh', label: 'LH', unit: 'mIU/mL' },
  { key: 'estradiol', label: 'Estradiol', unit: 'pg/mL' },
  { key: 'progesterone', label: 'Progesterone', unit: 'ng/mL' },
  { key: 'amh', label: 'AMH', unit: 'ng/mL' },
  { key: 'prolactin', label: 'Prolactin', unit: 'ng/mL' },
  { key: 'tsh', label: 'TSH', unit: 'mIU/L' },
  { key: 'vitamin_d', label: 'Vitamin D', unit: 'ng/mL' },
  { key: 'ferritin', label: 'Ferritin', unit: 'ng/mL' },
];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  settings: { last_period_start: string | null; average_cycle_length: number } | null;
  onSaved: () => void;
}

export const TTCBloodworkModal = ({ open, onOpenChange, settings, onSaved }: Props) => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const [testDate, setTestDate] = useState(today);
  const [labSource, setLabSource] = useState('doctor');
  const [notes, setNotes] = useState('');
  const [values, setValues] = useState<Record<string, string>>({});

  const setVal = (k: string, v: string) => setValues(prev => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const cd = settings ? calcCycleDay(settings, testDate) : null;
    const row: Record<string, unknown> = {
      user_id: user.id,
      test_date: testDate,
      cycle_day: cd,
      lab_source: labSource,
      notes: notes.trim() || null,
    };
    MARKERS.forEach(m => {
      const v = values[m.key];
      if (v && !isNaN(Number(v))) row[m.key] = Number(v);
    });
    const { error } = await supabase.from('ttc_bloodwork').insert(row);
    if (error) { setSaving(false); toast.error('Could not save: ' + error.message); return; }
    await supabase.rpc('add_user_points', {
      p_user_id: user.id, p_points: 100, p_source: 'ttc_bloodwork', p_description: 'Logged bloodwork',
    });
    window.dispatchEvent(new CustomEvent('points-updated'));
    setSaving(false);
    toast.success('Bloodwork saved ✓ +100 pts');
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Bloodwork</DialogTitle>
          <DialogDescription>Enter only the markers you have. Leave others blank.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="td">Test date</Label>
              <Input id="td" type="date" value={testDate} onChange={e => setTestDate(e.target.value)} />
            </div>
            <div>
              <Label>Lab source</Label>
              <Select value={labSource} onValueChange={setLabSource}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="modern_fertility">Modern Fertility</SelectItem>
                  <SelectItem value="mira">Mira</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {MARKERS.map(m => (
              <div key={m.key}>
                <Label htmlFor={m.key} className="text-xs">{m.label} <span className="text-muted-foreground">({m.unit})</span></Label>
                <Input id={m.key} type="number" step="0.001" value={values[m.key] ?? ''} onChange={e => setVal(m.key, e.target.value)} />
              </div>
            ))}
          </div>
          <div>
            <Label htmlFor="bn">Notes</Label>
            <Textarea id="bn" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any context from your provider…" />
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Saving…' : 'Save bloodwork (+100 pts)'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
