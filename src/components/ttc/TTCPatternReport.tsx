import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Copy, RefreshCw, Stethoscope, BarChart3, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { usePoints } from '@/hooks/usePoints';
import { supabase } from '@/integrations/supabase/client';

const DOCTOR_PREP_PROMPT =
  'Generate a 1-page doctor appointment summary for this woman based on her cycle and hormone data. ' +
  'Include: average cycle length, last period date, notable symptoms, BBT trends if available, ' +
  'bloodwork flags if any, and 3-5 suggested questions to ask her doctor. ' +
  'Return ONLY valid JSON: { "summary": "string", "key_observations": ["string"], ' +
  '"suggested_questions": ["string"], "flags": ["string"] }. Never invent data.';

const PATTERN_REPORT_PROMPT =
  'Analyze this woman\'s cycle data and find real patterns. For each pattern include the observation, ' +
  'the evidence from her data with specific dates/numbers, a research finding that supports it, ' +
  'and one thing she can try. ' +
  'Return ONLY valid JSON: { "patterns": [{ "pattern": "string", "evidence": "string", ' +
  '"research": "string", "what_to_try": "string" }], "overall_insight": "string", ' +
  '"bloodwork_flags": ["string"] }. Never invent data.';

interface DoctorPrepResult {
  summary: string;
  key_observations: string[];
  suggested_questions: string[];
  flags: string[];
}

interface PatternReportResult {
  patterns: { pattern: string; evidence: string; research: string; what_to_try: string }[];
  overall_insight: string;
  bloodwork_flags: string[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  mode: 'doctor_prep' | 'pattern_report';
}

export const TTCPatternReport = ({ open, onClose, mode }: Props) => {
  const { user } = useAuth();
  const { awardPoints } = usePoints();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DoctorPrepResult | PatternReportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setResult(null);
    setError(null);
    onClose();
  };

  const fetchUserData = async () => {
    if (!user) return null;

    const [settings, logs, checkins, bloodwork] = await Promise.allSettled([
      (supabase as any).from('ttc_cycle_settings').select('*').eq('user_id', user.id).single(),
      (supabase as any).from('ttc_cycle_logs').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(60),
      (supabase as any).from('ttc_daily_checkins').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(30),
      (supabase as any).from('ttc_bloodwork').select('*').eq('user_id', user.id).order('test_date', { ascending: false }).limit(5),
    ]);

    return {
      cycle_settings: settings.status === 'fulfilled' ? settings.value.data : null,
      cycle_logs: logs.status === 'fulfilled' ? logs.value.data : [],
      daily_checkins: checkins.status === 'fulfilled' ? checkins.value.data : [],
      bloodwork: bloodwork.status === 'fulfilled' ? bloodwork.value.data : [],
    };
  };

  const generate = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const userData = await fetchUserData();
      const dataText = JSON.stringify(userData, null, 2);
      // Encode as base64 text so the existing edge function can forward it to Gemini
      const base64 = btoa(unescape(encodeURIComponent(dataText)));
      const systemPrompt = mode === 'doctor_prep' ? DOCTOR_PREP_PROMPT : PATTERN_REPORT_PROMPT;

      const { data, error: fnError } = await supabase.functions.invoke('analyze-health-data', {
        body: {
          files: [{ base64, mimeType: 'text/plain' }],
          systemPrompt,
        },
      });

      if (fnError || data?.error) throw new Error(data?.error ?? fnError?.message);

      let parsed: any;
      try { parsed = JSON.parse(data.result); } catch {
        throw new Error('Could not parse AI response');
      }

      setResult(parsed);

      const points = mode === 'doctor_prep' ? 100 : 200;
      const source = mode === 'doctor_prep' ? 'doctor_prep' : 'pattern_report';
      const desc = mode === 'doctor_prep' ? 'Generated doctor appointment summary' : 'Generated cycle pattern report';
      await awardPoints(points, source, desc);

      toast({ title: `Report generated ✓ +${points} pts` });
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    if (!result) return;
    const text = mode === 'doctor_prep'
      ? formatDoctorPrepText(result as DoctorPrepResult)
      : formatPatternReportText(result as PatternReportResult);
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard' });
  };

  const formatDoctorPrepText = (r: DoctorPrepResult) => [
    r.summary,
    '',
    'Key Observations:',
    ...(r.key_observations ?? []).map(o => `• ${o}`),
    '',
    'Things to Mention:',
    ...(r.flags ?? []).map(f => `• ${f}`),
    '',
    'Questions to Ask:',
    ...(r.suggested_questions ?? []).map((q, i) => `${i + 1}. ${q}`),
  ].join('\n');

  const formatPatternReportText = (r: PatternReportResult) => [
    r.overall_insight,
    '',
    ...(r.patterns ?? []).flatMap(p => [
      `Pattern: ${p.pattern}`,
      `Evidence: ${p.evidence}`,
      `Research: ${p.research}`,
      `Try: ${p.what_to_try}`,
      '',
    ]),
    'Bloodwork Flags:',
    ...(r.bloodwork_flags ?? []).map(f => `• ${f}`),
  ].join('\n');

  const title = mode === 'doctor_prep' ? 'Prepare for Appointment' : 'Cycle Pattern Report';

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'doctor_prep'
              ? <Stethoscope className="h-5 w-5 text-primary" />
              : <BarChart3 className="h-5 w-5 text-primary" />}
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Initial state */}
          {!result && !loading && !error && (
            <div className="text-center space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                {mode === 'doctor_prep'
                  ? "We'll analyze your cycle data and generate a doctor-ready summary with suggested questions."
                  : "We'll analyze your cycle history and identify real patterns with research-backed insights."}
              </p>
              <Button onClick={generate} className="w-full">
                {mode === 'doctor_prep' ? 'Generate Summary' : 'Analyze My Patterns'}
              </Button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm">AI is analyzing your data…</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="space-y-3 text-center py-4">
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="outline" onClick={generate} className="flex items-center gap-2 mx-auto">
                <RefreshCw className="h-4 w-4" /> Retry
              </Button>
            </div>
          )}

          {/* Doctor prep result */}
          {result && mode === 'doctor_prep' && (() => {
            const r = result as DoctorPrepResult;
            return (
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm leading-relaxed">{r.summary}</p>
                </div>

                {r.key_observations?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Key Observations</h4>
                    <ul className="space-y-1">
                      {r.key_observations.map((obs, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          {obs}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {r.flags?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Things to Mention</h4>
                    <ul className="space-y-1">
                      {r.flags.map((flag, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {r.suggested_questions?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Questions to Ask Your Doctor</h4>
                    <ol className="space-y-2">
                      {r.suggested_questions.map((q, i) => (
                        <li key={i} className="text-sm text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">
                          {i + 1}. {q}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <Button variant="outline" onClick={copyAll} className="w-full flex items-center gap-2">
                  <Copy className="h-4 w-4" /> Copy All
                </Button>
              </div>
            );
          })()}

          {/* Pattern report result */}
          {result && mode === 'pattern_report' && (() => {
            const r = result as PatternReportResult;
            return (
              <div className="space-y-4">
                {r.overall_insight && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-primary mb-1">Overall Insight</p>
                    <p className="text-sm text-muted-foreground">{r.overall_insight}</p>
                  </div>
                )}

                {r.bloodwork_flags?.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Bloodwork Flags</h4>
                    {r.bloodwork_flags.map((flag, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                        {flag}
                      </div>
                    ))}
                  </div>
                )}

                {r.patterns?.map((p, i) => (
                  <div key={i} className="border border-border rounded-lg p-4 space-y-3">
                    <p className="text-sm font-semibold">{p.pattern}</p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div><span className="font-medium text-foreground">Evidence: </span>{p.evidence}</div>
                      <div><span className="font-medium text-foreground">Research: </span>{p.research}</div>
                      <div className="bg-green-50 dark:bg-green-950/30 rounded-md px-3 py-2">
                        <span className="font-medium text-green-700 dark:text-green-400">Try: </span>
                        <span className="text-green-700 dark:text-green-400">{p.what_to_try}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <Button variant="outline" onClick={copyAll} className="w-full flex items-center gap-2">
                  <Copy className="h-4 w-4" /> Copy All
                </Button>
              </div>
            );
          })()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
