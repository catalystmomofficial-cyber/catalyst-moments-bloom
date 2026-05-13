import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { MoonStar, Clock, Upload, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWellnessData } from '@/hooks/useWellnessData';
import { usePoints } from '@/hooks/usePoints';
import { supabase } from '@/integrations/supabase/client';

const SLEEP_IMPORT_SYSTEM_PROMPT =
  'Extract sleep data from this health app screenshot. Return ONLY valid JSON: ' +
  '{ "entries": [{ "date": "YYYY-MM-DD", "hours_slept": "number or null", ' +
  '"sleep_quality": "number between 1-10 or null", "hrv": "number or null" }] }. ' +
  'Use null for missing values. Never invent data.';

interface SleepTrackerProps {
  trigger?: React.ReactNode;
}

// ─── Import Sleep Modal ───────────────────────────────────────────────────────
const ImportSleepModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { toast } = useToast();
  const { addSleepEntry } = useWellnessData();
  const { awardPoints } = usePoints();
  const fileRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<{ name: string; base64: string; mimeType: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 2);
    const readers = files.map(
      (file) =>
        new Promise<{ name: string; base64: string; mimeType: string }>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve({ name: file.name, base64: result.split(',')[1], mimeType: file.type });
          };
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then(setPreviews);
  };

  const removeFile = (i: number) => setPreviews((p) => p.filter((_, idx) => idx !== i));

  const handleImport = async () => {
    if (previews.length === 0) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-health-data', {
        body: { files: previews.map(({ base64, mimeType }) => ({ base64, mimeType })), systemPrompt: SLEEP_IMPORT_SYSTEM_PROMPT },
      });

      if (error || data?.error) throw new Error(data?.error ?? error?.message);

      let parsed: any;
      try { parsed = JSON.parse(data.result); } catch {
        throw new Error('Could not parse AI response');
      }

      const entries: any[] = Array.isArray(parsed.entries) ? parsed.entries : [];
      if (entries.length === 0) throw new Error('No sleep entries found');

      let imported = 0;
      for (const entry of entries) {
        if (!entry.hours_slept) continue;
        await addSleepEntry({ sleep_hours: entry.hours_slept, notes: entry.hrv ? `HRV: ${entry.hrv}` : undefined });
        imported++;
      }

      const pointsEarned = imported * 15;
      if (imported > 0) await awardPoints(pointsEarned, 'sleep_import', `Imported ${imported} sleep entries`);

      toast({ title: `Sleep data imported ✓ +${pointsEarned} pts` });
      setPreviews([]);
      onClose();
    } catch {
      toast({ title: 'Could not read that screenshot — try a clearer image', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-500" />
            Import from Oura / Apple Watch
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload 1–2 screenshots from your sleep tracker and we'll import your data automatically.
          </p>

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 hover:bg-muted/30 transition-colors"
            disabled={loading || previews.length >= 2}
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {previews.length >= 2 ? 'Max 2 images' : 'Click to select screenshots (JPG or PNG)'}
            </p>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleFiles}
          />

          {previews.length > 0 && (
            <ul className="space-y-2">
              {previews.map((f, i) => (
                <li key={i} className="flex items-center justify-between text-sm bg-muted/40 rounded-lg px-3 py-2">
                  <span className="truncate flex-1">{f.name}</span>
                  <button onClick={() => removeFile(i)} className="ml-2 shrink-0 text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <Button onClick={handleImport} disabled={loading || previews.length === 0} className="w-full">
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Importing…</> : 'Import Sleep Data'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─── SleepTracker ─────────────────────────────────────────────────────────────
export const SleepTracker = ({ trigger }: SleepTrackerProps) => {
  const [open, setOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [sleepHours, setSleepHours] = useState([7]);
  const [sleepQuality, setSleepQuality] = useState([7]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const { addSleepEntry } = useWellnessData();
  const { awardPoints } = usePoints();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await addSleepEntry({ sleep_hours: sleepHours[0], notes: notes.trim() || undefined });
      await awardPoints(5, 'sleep_log', 'Sleep logged');
      toast({
        title: "Sleep logged! +5 points ✨",
        description: `Recorded ${sleepHours[0]} hours of sleep.`,
      });
      setOpen(false);
      setNotes('');
    } catch (error) {
      toast({
        title: "Error logging sleep",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <ImportSleepModal open={importOpen} onClose={() => setImportOpen(false)} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button>
              <MoonStar className="mr-2 h-4 w-4" />
              Log Last Night's Sleep
            </Button>
          )}
        </DialogTrigger>

        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MoonStar className="h-5 w-5 text-blue-500" />
              Sleep Tracker
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                Hours of Sleep: {sleepHours[0]} hours
              </Label>
              <Slider
                value={sleepHours}
                onValueChange={setSleepHours}
                max={12}
                min={1}
                step={0.5}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <MoonStar className="h-4 w-4 text-blue-500" />
                Sleep Quality: {sleepQuality[0]}/10
              </Label>
              <Slider
                value={sleepQuality}
                onValueChange={setSleepQuality}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Sleep Notes (Optional)</Label>
              <Textarea
                placeholder="How did you sleep? Any disturbances or observations?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Saving..." : "Log Sleep"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        variant="outline"
        size="sm"
        className="w-full flex items-center gap-2 text-muted-foreground"
        onClick={() => setImportOpen(true)}
      >
        <Upload className="h-4 w-4" />
        Import from Oura / Apple Watch
      </Button>
    </div>
  );
};
