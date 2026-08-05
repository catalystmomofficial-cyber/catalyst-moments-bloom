import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useDiastasis, formatMeasurement, type DiastasisUnit } from '@/hooks/useDiastasis';

const FINGER_STEPS = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5];

interface Props {
  recoveryId: string | null;
}

/**
 * Logging her diastasis measurement.
 *
 * Deliberately not a daily thing. Separation changes over weeks and months,
 * not overnight, and a daily prompt would turn a slow, non-linear process into
 * something she feels behind on. Once a fortnight is plenty; the UI never
 * chases her for it.
 *
 * Finger-widths first because that is how the self-check is taught. Anyone
 * whose physio measured in centimetres can switch, and the unit is stored
 * rather than converted so her number reads back the way she took it.
 */
export const DiastasisLogger = ({ recoveryId }: Props) => {
  const { toast } = useToast();
  const { latest, history, record } = useDiastasis(recoveryId);
  const [open, setOpen] = useState(false);
  const [unit, setUnit] = useState<DiastasisUnit>('fingers');
  const [cmValue, setCmValue] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async (value: number) => {
    setSaving(true);
    const { error } = await record(value, unit);
    setSaving(false);
    if (error) {
      toast({ title: "That didn't save", description: 'Please try again in a moment.' });
      return;
    }
    setOpen(false);
    setCmValue('');
    toast({ title: 'Measurement saved' });
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-lg border border-dashed p-3 text-center transition-colors hover:bg-muted/40"
      >
        <span className="text-sm font-medium">
          {latest ? 'Update your measurement' : 'Add your first measurement'}
        </span>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          {latest
            ? `Last taken ${new Date(latest.measured_on).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}`
            : 'Track how your abdominal separation changes over time'}
        </span>
      </button>
    );
  }

  return (
    <div className="rounded-lg border p-4 space-y-4">
      <div>
        <p className="text-sm font-semibold">How wide is the gap today?</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Lie on your back, knees bent. Lift your head slightly and feel above your
          navel with your fingers flat across the midline.
        </p>
      </div>

      <div className="flex gap-1 text-xs">
        {(['fingers', 'cm'] as DiastasisUnit[]).map((u) => (
          <button
            key={u}
            onClick={() => setUnit(u)}
            className={`rounded-full px-3 py-1 border transition-colors ${
              unit === u ? 'bg-primary text-primary-foreground border-transparent' : 'text-muted-foreground'
            }`}
          >
            {u === 'fingers' ? 'Finger widths' : 'Centimetres'}
          </button>
        ))}
      </div>

      {unit === 'fingers' ? (
        <div className="flex flex-wrap gap-1.5">
          {FINGER_STEPS.map((n) => (
            <Button
              key={n}
              size="sm"
              variant="outline"
              disabled={saving}
              onClick={() => void save(n)}
            >
              {n}
            </Button>
          ))}
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="number" inputMode="decimal" step="0.1" min="0" max="30"
            value={cmValue}
            onChange={(e) => setCmValue(e.target.value)}
            placeholder="2.1"
            className="w-24 rounded-md border bg-background px-3 py-2 text-sm"
          />
          <Button
            size="sm"
            disabled={saving || !cmValue}
            onClick={() => void save(Number(cmValue))}
          >
            Save
          </Button>
        </div>
      )}

      {/* No target, no range, no "good" or "concerning". Separation varies
          hugely and does not close on a schedule; the app records, her
          provider interprets. */}
      <p className="text-[11px] text-muted-foreground">
        We record what you measure and never score it. Your provider or pelvic floor
        physio is who reads it.
      </p>

      {history.length > 1 && (
        <div className="border-t pt-3">
          <p className="text-xs font-medium text-muted-foreground mb-1.5">Your measurements</p>
          <ul className="space-y-1">
            {history.slice(0, 5).map((m) => (
              <li key={m.id} className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  {new Date(m.measured_on).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                </span>
                <span className="tabular-nums">{formatMeasurement(m)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button variant="ghost" size="sm" className="w-full" onClick={() => setOpen(false)}>
        Close
      </Button>
    </div>
  );
};

export default DiastasisLogger;
