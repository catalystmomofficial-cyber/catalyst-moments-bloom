import { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Heart, Thermometer, Droplets, Moon, Target, Eye, EyeOff, Upload, X, Loader2, FlaskConical, Stethoscope, BarChart3, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { usePoints } from '@/hooks/usePoints';
import { supabase } from '@/integrations/supabase/client';
import {
  useTTCData, daysUntilNextPeriod, mapPhaseForDay,
  type MapPhase,
} from '@/hooks/useTTCData';
import { BloomRing } from './BloomRing';
import { CycleCalendar } from './CycleCalendar';
import { DayLogModal } from './DayLogModal';
import { TTCBloodworkModal } from './TTCBloodworkModal';
import { TTCCycleSettingsModal } from './TTCCycleSettingsModal';
import { TTCPatternReport } from './TTCPatternReport';
import { TTCPersonalizedAdvice } from './TTCPersonalizedAdvice';
import { TTCPredictiveAnalytics } from './TTCPredictiveAnalytics';

const CYCLE_IMPORT_SYSTEM_PROMPT =
  'You are a data extraction assistant. Extract cycle and health data from these app screenshots. ' +
  'Return ONLY valid JSON with this structure: { "last_period_start": "YYYY-MM-DD or null", ' +
  '"average_cycle_length": "number or null", "period_length": "number or null", ' +
  '"sleep_entries": [{ "date": "YYYY-MM-DD", "hours": "number", "hrv": "number or null" }], ' +
  '"cycle_logs": [{ "date": "YYYY-MM-DD", "cycle_day": "number or null", "symptoms": [] }] }. ' +
  'If you cannot find a value, use null. Never invent data.';

// ─── Import Cycle Data Modal ──────────────────────────────────────────────────
const ImportCycleDataModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { user } = useAuth();
  const { awardPoints } = usePoints();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<{ name: string; base64: string; mimeType: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 3);
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
    if (!user || previews.length === 0) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-health-data', {
        body: { files: previews.map(({ base64, mimeType }) => ({ base64, mimeType })), systemPrompt: CYCLE_IMPORT_SYSTEM_PROMPT },
      });

      if (error || data?.error) throw new Error(data?.error ?? error?.message);

      let parsed: any;
      try { parsed = JSON.parse(data.result); } catch {
        throw new Error('Could not parse AI response');
      }

      // Upsert cycle settings
      if (parsed.last_period_start || parsed.average_cycle_length || parsed.period_length) {
        await (supabase as any).from('ttc_cycle_settings').upsert({
          user_id: user.id,
          ...(parsed.last_period_start ? { last_period_start: parsed.last_period_start } : {}),
          ...(parsed.average_cycle_length ? { average_cycle_length: parsed.average_cycle_length } : {}),
          ...(parsed.period_length ? { period_length: parsed.period_length } : {}),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
      }

      // Insert cycle logs
      if (Array.isArray(parsed.cycle_logs) && parsed.cycle_logs.length > 0) {
        const rows = parsed.cycle_logs.map((log: any) => ({
          user_id: user.id,
          log_date: log.date,
          cycle_day: log.cycle_day ?? null,
          symptoms: log.symptoms ?? [],
        }));
        await (supabase as any).from('ttc_cycle_logs').upsert(rows, { onConflict: 'user_id,log_date', ignoreDuplicates: false });
      }

      await awardPoints(50, 'cycle_import', 'Imported cycle data from app screenshot');

      toast({ title: 'Cycle data imported ✓ +50 pts' });
      setPreviews([]);
      onClose();
    } catch (err: any) {
      toast({
        title: 'Could not read that screenshot — try a clearer image',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Import from Flo, Clue, or Oura
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload 1–3 screenshots from any cycle or sleep tracking app. We'll extract your data automatically.
          </p>

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 hover:bg-muted/30 transition-colors"
            disabled={loading || previews.length >= 3}
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {previews.length >= 3 ? 'Max 3 images' : 'Click to select screenshots (JPG or PNG)'}
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

          <Button
            onClick={handleImport}
            disabled={loading || previews.length === 0}
            className="w-full"
          >
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Extracting data…</> : 'Import Data'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Phase colours for the 28-day cycle map (brand palette).
const MAP_PHASE_COLOR: Record<MapPhase, string> = {
  menstrual: '#D9B08C',   // deep peach
  follicular: '#F4C5A0',  // peach
  ovulation: '#B5651D',   // copper
  luteal: '#FAE0CC',      // peach light
};

const todayISODate = () => new Date().toISOString().slice(0, 10);

// ─── TTCTracker ───────────────────────────────────────────────────────────────
export const TTCTracker = () => {
  const { toast } = useToast();
  const {
    settings, refresh, cycleDay, phase, cycleLength, periodLength, logByDate, logs, saveCycleLog, hasSettings,
  } = useTTCData();
  const [dayLogOpen, setDayLogOpen] = useState(false);

  const ttcPhaseToLocal = (p: string | null): 'menstrual' | 'follicular' | 'fertile' | 'luteal' => {
    if (p === 'menstrual') return 'menstrual';
    if (p === 'follicular') return 'follicular';
    if (p === 'ovulation') return 'fertile';
    if (p === 'early_luteal' || p === 'late_luteal') return 'luteal';
    return 'fertile';
  };

  const currentCycle = {
    day: cycleDay ?? 1,
    phase: ttcPhaseToLocal(phase),
  };

  const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('simple');
  const [importOpen, setImportOpen] = useState(false);
  const [bloodworkOpen, setBloodworkOpen] = useState(false);
  const [reportMode, setReportMode] = useState<'doctor_prep' | 'pattern_report' | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const today = todayISODate();
  const todayLog = logByDate[today] ?? null;
  const todayTemperature = todayLog?.basal_body_temp ?? null;

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'menstrual': return 'bg-red-100 text-red-800';
      case 'follicular': return 'bg-blue-100 text-blue-800';
      case 'fertile': return 'bg-green-100 text-green-800';
      case 'luteal': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <ImportCycleDataModal open={importOpen} onClose={() => setImportOpen(false)} />
      <DayLogModal
        open={dayLogOpen}
        onOpenChange={setDayLogOpen}
        dateISO={today}
        existing={todayLog}
        onSave={saveCycleLog}
      />
      <TTCBloodworkModal open={bloodworkOpen} onClose={() => setBloodworkOpen(false)} />
      <TTCCycleSettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} initial={settings} onSaved={refresh} />
      {reportMode && (
        <TTCPatternReport
          open={true}
          onOpenChange={(v) => { if (!v) setReportMode(null); }}
          mode={reportMode}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              TTC Cycle Tracker
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'simple' ? 'detailed' : 'simple')}
                className="flex items-center gap-2"
              >
                {viewMode === 'simple' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {viewMode === 'simple' ? 'Detailed View' : 'Simple View'}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSettingsOpen(true)}
                className="h-8 w-8"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Track your cycle and fertility signs with {viewMode} tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Cycle ring */}
              <div className="flex flex-col items-center p-6 bg-card rounded-2xl border">
                <BloomRing
                  cycleDay={cycleDay}
                  cycleLength={cycleLength}
                  phase={phase}
                  subnote={
                    daysUntilNextPeriod(cycleDay, cycleLength) != null
                      ? `${daysUntilNextPeriod(cycleDay, cycleLength)} days until next period`
                      : null
                  }
                />
                {todayTemperature != null && (
                  <p className="text-sm mt-1">
                    <span className="font-medium">Today's BBT: </span>
                    <span className="text-primary">{todayTemperature}°F</span>
                  </p>
                )}
              </div>

              {/* 28-day cycle map */}
              <div className="p-4 bg-card rounded-2xl border">
                <p className="text-[11px] font-medium tracking-[0.07em] uppercase text-muted-foreground mb-3">
                  {cycleLength}-day cycle map
                </p>
                <div className="flex items-end gap-1 h-10">
                  {Array.from({ length: cycleLength }, (_, i) => {
                    const day = i + 1;
                    const p = mapPhaseForDay(day, cycleLength, periodLength);
                    const isToday = cycleDay === day;
                    // Bar height reflects fertility relevance, not decoration: the
                    // fertile window is the tallest, period/luteal are shortest.
                    const heightPct = p === 'ovulation' ? 100 : p === 'follicular' ? 70 : 60;
                    return (
                      <div
                        key={day}
                        title={`Day ${day} · ${p}`}
                        className="flex-1 rounded-full transition-[height] duration-300"
                        style={{
                          height: `${isToday ? Math.min(heightPct + 15, 100) : heightPct}%`,
                          background: MAP_PHASE_COLOR[p],
                          boxShadow: isToday ? '0 0 0 2px #2C2218, 0 0 8px rgba(181,101,29,0.5)' : undefined,
                        }}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between mt-2 text-[9.5px] text-muted-foreground">
                  <span>Period</span><span>Follicular</span><span>Ovulation</span><span>Luteal</span>
                </div>
              </div>

              {viewMode === 'simple' ? (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDayLogOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Thermometer className="h-4 w-4" />
                    Log Temp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDayLogOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Heart className="h-4 w-4" />
                    Log Symptoms
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBloodworkOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <FlaskConical className="h-4 w-4" />
                    Bloodwork
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setImportOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Import App
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReportMode('doctor_prep')}
                    className="col-span-2 flex items-center gap-2"
                  >
                    <Stethoscope className="h-4 w-4" />
                    Prepare for Appointment
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReportMode('pattern_report')}
                    className="col-span-2 flex items-center gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Generate Pattern Report
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDayLogOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Thermometer className="h-4 w-4" />
                    Log Temp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDayLogOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Droplets className="h-4 w-4" />
                    Log CM
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDayLogOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Heart className="h-4 w-4" />
                    Log Mood
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDayLogOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Moon className="h-4 w-4" />
                    Log Sleep
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBloodworkOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <FlaskConical className="h-4 w-4" />
                    Bloodwork
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setImportOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Import App
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReportMode('doctor_prep')}
                    className="col-span-2 flex items-center gap-2"
                  >
                    <Stethoscope className="h-4 w-4" />
                    Prepare for Appointment
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReportMode('pattern_report')}
                    className="col-span-2 flex items-center gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Generate Pattern Report
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Today's Fertility Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {currentCycle.phase === 'fertile' ? (
                    <>
                      <li>• Optimal time for conception - every other day</li>
                      <li>• Stay relaxed and avoid excessive stress</li>
                      <li>• Consider fertility-friendly lubricant if needed</li>
                    </>
                  ) : currentCycle.phase === 'follicular' ? (
                    <>
                      <li>• Focus on iron-rich foods and hydration</li>
                      <li>• Light to moderate exercise is beneficial</li>
                      <li>• Track cervical mucus changes</li>
                    </>
                  ) : (
                    <>
                      <li>• Stay hydrated and maintain a balanced diet</li>
                      <li>• Consider prenatal vitamins with folic acid</li>
                      <li>• Practice stress-reduction techniques</li>
                    </>
                  )}
                </ul>
              </div>

              <CycleCalendar />
            </TabsContent>

            <TabsContent value="insights">
              <TTCPersonalizedAdvice
                cycleDay={currentCycle.day}
                cyclePhase={currentCycle.phase}
                moodScore={7}
                stressLevel={4}
                energyLevel={6}
              />
            </TabsContent>

            <TabsContent value="predictions">
              <TTCPredictiveAnalytics
                hasSettings={hasSettings}
                cycleDay={cycleDay}
                cycleLength={cycleLength}
                logs={logs}
                onViewDetailedAnalytics={() => setReportMode('pattern_report')}
                onOpenSettings={() => setSettingsOpen(true)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
};
