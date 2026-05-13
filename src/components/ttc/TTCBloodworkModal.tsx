import { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Loader2, AlertCircle, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const BLOODWORK_SYSTEM_PROMPT =
  'You are a medical data extraction assistant. Extract hormone and blood marker values from this lab report PDF. ' +
  'Return ONLY valid JSON with this structure: { "test_date": "YYYY-MM-DD or null", "fsh": "number or null", ' +
  '"lh": "number or null", "estradiol": "number or null", "progesterone": "number or null", "amh": "number or null", ' +
  '"prolactin": "number or null", "tsh": "number or null", "vitamin_d": "number or null", "ferritin": "number or null", ' +
  '"b12": "number or null", "cortisol": "number or null", "testosterone": "number or null" }. ' +
  'Use null for any value not found. Never invent values.';

interface BloodworkFields {
  test_date: string;
  fsh: string;
  lh: string;
  estradiol: string;
  progesterone: string;
  amh: string;
  prolactin: string;
  tsh: string;
  vitamin_d: string;
  ferritin: string;
  b12: string;
  cortisol: string;
  testosterone: string;
}

const EMPTY_FIELDS: BloodworkFields = {
  test_date: '', fsh: '', lh: '', estradiol: '', progesterone: '',
  amh: '', prolactin: '', tsh: '', vitamin_d: '', ferritin: '',
  b12: '', cortisol: '', testosterone: '',
};

const FIELD_LABELS: { key: keyof BloodworkFields; label: string; unit?: string }[] = [
  { key: 'test_date', label: 'Test Date' },
  { key: 'fsh',          label: 'FSH',          unit: 'mIU/mL' },
  { key: 'lh',           label: 'LH',           unit: 'mIU/mL' },
  { key: 'estradiol',    label: 'Estradiol',    unit: 'pg/mL'  },
  { key: 'progesterone', label: 'Progesterone', unit: 'ng/mL'  },
  { key: 'amh',          label: 'AMH',          unit: 'ng/mL'  },
  { key: 'prolactin',    label: 'Prolactin',    unit: 'ng/mL'  },
  { key: 'tsh',          label: 'TSH',          unit: 'mIU/L'  },
  { key: 'vitamin_d',    label: 'Vitamin D',    unit: 'ng/mL'  },
  { key: 'ferritin',     label: 'Ferritin',     unit: 'ng/mL'  },
  { key: 'b12',          label: 'B12',          unit: 'pg/mL'  },
  { key: 'cortisol',     label: 'Cortisol',     unit: 'µg/dL'  },
  { key: 'testosterone', label: 'Testosterone', unit: 'ng/dL'  },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onSave?: (fields: BloodworkFields) => void;
}

export const TTCBloodworkModal = ({ open, onClose, onSave }: Props) => {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [fields, setFields] = useState<BloodworkFields>(EMPTY_FIELDS);
  const [pdfExtracted, setPdfExtracted] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    setFields(EMPTY_FIELDS);
    setPdfExtracted(false);
    onClose();
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast({ title: 'Please upload a PDF file', variant: 'destructive' });
      return;
    }

    setExtracting(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const { data, error } = await supabase.functions.invoke('analyze-health-data', {
        body: { files: [{ base64, mimeType: 'application/pdf' }], systemPrompt: BLOODWORK_SYSTEM_PROMPT },
      });

      if (error || data?.error) throw new Error(data?.error ?? error?.message);

      let parsed: any;
      try { parsed = JSON.parse(data.result); } catch {
        throw new Error('Could not parse AI response');
      }

      // Populate form fields with extracted values (stringify numbers, keep null as '')
      const updated: BloodworkFields = { ...EMPTY_FIELDS };
      for (const { key } of FIELD_LABELS) {
        const val = parsed[key];
        if (val != null) updated[key] = String(val);
      }
      setFields(updated);
      setPdfExtracted(true);
    } catch {
      toast({
        title: 'Could not extract data from that PDF — please fill in manually',
        variant: 'destructive',
      });
    } finally {
      setExtracting(false);
      // Reset file input so same file can be re-uploaded if needed
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      onSave?.(fields);
      toast({ title: 'Bloodwork saved ✓' });
      handleClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Log Bloodwork Results
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* PDF upload button */}
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => fileRef.current?.click()}
              disabled={extracting}
            >
              {extracting
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Extracting from PDF…</>
                : <><FileText className="h-4 w-4" /> Upload PDF instead</>}
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handlePdfUpload}
            />
            <p className="text-xs text-muted-foreground text-center">
              Upload your lab results PDF and we'll fill in the fields for you
            </p>
          </div>

          {/* Extraction banner */}
          {pdfExtracted && (
            <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-3">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                We extracted these values from your PDF — please review before saving
              </p>
            </div>
          )}

          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground mb-4">Or enter values manually:</p>
            <div className="grid grid-cols-2 gap-3">
              {FIELD_LABELS.map(({ key, label, unit }) => (
                <div key={key} className={key === 'test_date' ? 'col-span-2' : ''}>
                  <Label className="text-xs mb-1 block">
                    {label}{unit ? <span className="text-muted-foreground ml-1">({unit})</span> : null}
                  </Label>
                  <Input
                    type={key === 'test_date' ? 'date' : 'number'}
                    step="0.01"
                    placeholder={key === 'test_date' ? 'YYYY-MM-DD' : '—'}
                    value={fields[key]}
                    onChange={(e) => setFields((f) => ({ ...f, [key]: e.target.value }))}
                    className="h-8 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…</> : 'Save Bloodwork'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
