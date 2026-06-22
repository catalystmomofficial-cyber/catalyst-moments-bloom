import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { TTCCycleLog, CycleLogInput } from '@/hooks/useTTCData';

const SYMPTOM_OPTIONS = [
  'Cramping', 'Fatigue', 'Bloating', 'Headache', 'Tender breasts',
  'Nausea', 'Spotting', 'Clear CM', 'Mood swings', 'Backache',
];

interface DayLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dateISO: string;
  existing?: TTCCycleLog | null;
  onSave: (dateISO: string, fields: CycleLogInput) => Promise<{ error: unknown }>;
  onSaved?: () => void;
}

const prettyDate = (iso: string) => {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' });
};

export const DayLogModal = ({ open, onOpenChange, dateISO, existing, onSave, onSaved }: DayLogModalProps) => {
  const [temp, setTemp] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Prefill from the existing log whenever the modal opens for a date.
  useEffect(() => {
    if (!open) return;
    setTemp(existing?.basal_body_temp != null ? String(existing.basal_body_temp) : '');
    setSymptoms(existing?.symptoms ?? []);
    setNotes(existing?.notes ?? '');
  }, [open, dateISO, existing]);

  const toggleSymptom = (s: string) =>
    setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const handleSave = async () => {
    setSaving(true);
    const parsedTemp = temp.trim() === '' ? null : Number(temp);
    if (parsedTemp !== null && (Number.isNaN(parsedTemp) || parsedTemp < 90 || parsedTemp > 110)) {
      toast.error('Enter a basal temperature between 90 and 110 °F');
      setSaving(false);
      return;
    }
    const { error } = await onSave(dateISO, {
      basal_body_temp: parsedTemp,
      symptoms,
      notes: notes.trim() === '' ? null : notes.trim(),
    });
    setSaving(false);
    if (error) {
      toast.error('Could not save — please try again');
      return;
    }
    toast.success('Day logged ✓');
    onSaved?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log your day</DialogTitle>
          <DialogDescription>{prettyDate(dateISO)}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="bbt">Basal body temperature (°F)</Label>
            <Input
              id="bbt"
              type="number"
              inputMode="decimal"
              step="0.1"
              placeholder="e.g. 97.8"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Symptoms</Label>
            <div className="flex flex-wrap gap-2">
              {SYMPTOM_OPTIONS.map((s) => {
                const active = symptoms.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSymptom(s)}
                    className={`rounded-full px-3 py-1 text-sm border transition-colors ${
                      active
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Anything else worth noting today…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…</> : 'Save day'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DayLogModal;
