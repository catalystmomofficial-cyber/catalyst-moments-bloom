import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Copy, Sparkles, Stethoscope } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: 'pattern_report' | 'doctor_prep';
}

export const TTCPatternReport = ({ open, onOpenChange, mode }: Props) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const { data, error } = await supabase.functions.invoke('ttc-pattern-report', { body: { mode } });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setReport((data as any)?.report);
      window.dispatchEvent(new CustomEvent('points-updated'));
    } catch (e: any) {
      setError(e.message || 'Failed to generate');
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    if (!report) return;
    const text = mode === 'doctor_prep'
      ? `${report.summary}\n\nKey observations:\n${(report.key_observations || []).map((s: string) => '• ' + s).join('\n')}\n\nQuestions to ask:\n${(report.suggested_questions || []).map((s: string) => '• ' + s).join('\n')}\n\nFlags:\n${(report.flags || []).map((s: string) => '• ' + s).join('\n')}`
      : JSON.stringify(report, null, 2);
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'pattern_report' ? <><Sparkles className="h-5 w-5 text-primary" /> Your Pattern Report</> : <><Stethoscope className="h-5 w-5 text-primary" /> Doctor Appointment Prep</>}
          </DialogTitle>
          <DialogDescription>
            {mode === 'pattern_report' ? 'AI-analyzed patterns from your check-in and cycle data.' : 'A 1-page summary you can share with your doctor.'}
          </DialogDescription>
        </DialogHeader>

        {!report && !loading && (
          <div className="py-8 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              {mode === 'pattern_report'
                ? 'We will analyze all your check-ins, cycle logs, and bloodwork to find real patterns.'
                : 'We will turn your data into a clear summary for your appointment.'}
            </p>
            <Button onClick={generate} size="lg">Generate {mode === 'pattern_report' ? 'pattern report' : 'doctor prep'}</Button>
          </div>
        )}

        {loading && (
          <div className="py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground mt-3">Analyzing your data…</p>
          </div>
        )}

        {error && (
          <div className="py-6 text-center text-sm text-destructive">
            {error}
            <Button variant="outline" size="sm" className="mt-3 mx-auto block" onClick={generate}>Try again</Button>
          </div>
        )}

        {report && (
          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="space-y-4 pb-2">
              {mode === 'pattern_report' ? (
                <>
                  {report.overall_insight && (
                    <div className="p-3 bg-primary/5 rounded-lg text-sm">{report.overall_insight}</div>
                  )}
                  {(report.patterns || []).map((p: any, i: number) => (
                    <div key={i} className="border rounded-lg p-3 space-y-2 text-sm">
                      <p className="font-semibold">🌀 {p.pattern}</p>
                      <p><span className="font-medium">📊 Evidence:</span> {p.evidence}</p>
                      <p><span className="font-medium">📚 Research:</span> {p.research}</p>
                      <p><span className="font-medium">💡 Try:</span> {p.what_to_try}</p>
                    </div>
                  ))}
                  {report.bloodwork_flags?.length > 0 && (
                    <div className="border rounded-lg p-3 text-sm bg-amber-50 dark:bg-amber-950/20">
                      <p className="font-semibold mb-1">🚩 Bloodwork flags</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {report.bloodwork_flags.map((f: string, i: number) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="p-3 bg-primary/5 rounded-lg text-sm whitespace-pre-wrap">{report.summary}</div>
                  {report.key_observations?.length > 0 && (
                    <div><p className="font-semibold text-sm mb-1">Key observations</p>
                      <ul className="list-disc pl-5 text-sm space-y-1">{report.key_observations.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul></div>
                  )}
                  {report.suggested_questions?.length > 0 && (
                    <div><p className="font-semibold text-sm mb-1">Questions to ask</p>
                      <ul className="list-disc pl-5 text-sm space-y-1">{report.suggested_questions.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul></div>
                  )}
                  {report.flags?.length > 0 && (
                    <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg"><p className="font-semibold text-sm mb-1">🚩 Flags to discuss</p>
                      <ul className="list-disc pl-5 text-sm space-y-1">{report.flags.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul></div>
                  )}
                </>
              )}
              <Button onClick={copyAll} variant="outline" size="sm" className="w-full"><Copy className="h-4 w-4 mr-1" /> Copy all</Button>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};
