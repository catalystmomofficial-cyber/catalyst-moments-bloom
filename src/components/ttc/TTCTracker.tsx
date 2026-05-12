import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Thermometer, Heart, Settings, FlaskConical, Stethoscope, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useAssessmentData } from '@/hooks/useAssessmentData';
import { CycleCalendar } from './CycleCalendar';
import { TTCPersonalizedAdvice } from './TTCPersonalizedAdvice';
import { TTCPredictiveAnalytics } from './TTCPredictiveAnalytics';
import { TTCCycleSettingsModal } from './TTCCycleSettingsModal';
import { TTCBloodworkModal } from './TTCBloodworkModal';
import { TTCPatternReport } from './TTCPatternReport';
import { useTTCData, phaseLabel, hormoneContext, fertilityTipsForGap } from '@/hooks/useTTCData';

const phaseColor = (p: string | null): string => {
  switch (p) {
    case 'menstrual': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'follicular': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'ovulation': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'early_luteal': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'late_luteal': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    default: return 'bg-muted text-muted-foreground';
  }
};

const resolveTopGap = (a: any): string | null => {
  if (!a) return null;
  if (Array.isArray(a.gaps) && a.gaps.length > 0) return a.gaps[0];
  const text = [a.biggest_obstacle, a.primary_goal].filter(Boolean).join(' ').toLowerCase();
  if (/sleep|tired|fatigue/.test(text)) return 'sleep';
  if (/stress|anxi|overwhelm/.test(text)) return 'stress';
  if (/nutri|diet|food/.test(text)) return 'nutrition';
  if (/fit|exercise|workout|movement/.test(text)) return 'fitness';
  return null;
};

export const TTCTracker = () => {
  const { user } = useAuth();
  const { settings, allCheckins, cycleDay, phase, hasSettings, refresh } = useTTCData();
  const { assessmentData } = useAssessmentData();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bloodworkOpen, setBloodworkOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [doctorOpen, setDoctorOpen] = useState(false);
  const [tempLoggedToday, setTempLoggedToday] = useState(false);

  const topGap = useMemo(() => resolveTopGap(assessmentData), [assessmentData]);
  const tips = useMemo(() => fertilityTipsForGap(topGap, phase), [topGap, phase]);
  const todayISO = new Date().toISOString().slice(0, 10);
  const checkinDays = allCheckins.length;
  const reportProgress = Math.min((checkinDays / 42) * 100, 100);
  const reportReady = checkinDays >= 42;

  const logCycleData = async (type: 'temperature' | 'symptoms') => {
    if (!user) return;
    if (!hasSettings) { setSettingsOpen(true); return; }

    const baseRow = {
      user_id: user.id,
      log_date: todayISO,
      cycle_day: cycleDay,
    };

    if (type === 'temperature') {
      if (tempLoggedToday) { toast.error('Temperature already logged today'); return; }
      const valStr = window.prompt('Enter basal body temperature (°F or °C, e.g. 97.8)');
      if (!valStr) return;
      const val = parseFloat(valStr);
      if (isNaN(val)) { toast.error('Invalid number'); return; }
      const { error } = await supabase.from('ttc_cycle_logs').insert({ ...baseRow, basal_body_temp: val });
      if (error) { toast.error(error.message); return; }
      setTempLoggedToday(true);
      await supabase.rpc('add_user_points', { p_user_id: user.id, p_points: 15, p_source: 'ttc_cycle_log', p_description: 'Logged BBT' });
      window.dispatchEvent(new CustomEvent('points-updated'));
      toast.success('Temperature logged ✓ +15 pts');
    } else {
      const sym = window.prompt('Symptoms today (comma-separated, e.g. cramping, bloating)');
      if (!sym) return;
      const symptoms = sym.split(',').map(s => s.trim()).filter(Boolean);
      const { error } = await supabase.from('ttc_cycle_logs').insert({ ...baseRow, symptoms });
      if (error) { toast.error(error.message); return; }
      await supabase.rpc('add_user_points', { p_user_id: user.id, p_points: 15, p_source: 'ttc_cycle_log', p_description: 'Logged symptoms' });
      window.dispatchEvent(new CustomEvent('points-updated'));
      toast.success('Symptoms logged ✓ +15 pts');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center"><Target className="mr-2 h-5 w-5" /> TTC Cycle Tracker</div>
          <Button variant="ghost" size="sm" onClick={() => setSettingsOpen(true)}>
            <Settings className="h-4 w-4" />
          </Button>
        </CardTitle>
        <CardDescription>Real cycle data powered by your check-ins.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              {hasSettings && cycleDay ? (
                <>
                  <div className="text-2xl font-bold mb-1">Day {cycleDay}</div>
                  <Badge className={phaseColor(phase)}>{phaseLabel(phase)}</Badge>
                  <p className="text-sm text-muted-foreground mt-2">{hormoneContext(phase)}</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-3">Set your last period date to see your real cycle day.</p>
                  <Button size="sm" onClick={() => setSettingsOpen(true)}>Set cycle baseline</Button>
                </>
              )}
            </div>

            {/* Pattern progress */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {reportReady ? 'Pattern report ready' : `Day ${checkinDays} of 42 — keep logging to unlock your pattern report`}
                </span>
                {reportReady && (
                  <Button size="sm" variant="link" className="h-auto p-0" onClick={() => setReportOpen(true)}>
                    <Sparkles className="h-3 w-3 mr-1" /> Generate
                  </Button>
                )}
              </div>
              <Progress value={reportProgress} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={() => logCycleData('temperature')} disabled={tempLoggedToday}>
                <Thermometer className="h-4 w-4 mr-1" /> {tempLoggedToday ? 'Logged' : 'Log Temp'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => logCycleData('symptoms')}>
                <Heart className="h-4 w-4 mr-1" /> Log Symptoms
              </Button>
              <Button variant="outline" size="sm" onClick={() => setBloodworkOpen(true)}>
                <FlaskConical className="h-4 w-4 mr-1" /> Bloodwork
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">
                Today's Fertility Tips {topGap && <span className="text-xs text-muted-foreground font-normal">— focused on your top gap: {topGap}</span>}
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {tips.map((t, i) => <li key={i}>• {t}</li>)}
              </ul>
            </div>

            <Button variant="default" className="w-full" onClick={() => setDoctorOpen(true)}>
              <Stethoscope className="h-4 w-4 mr-2" /> Prepare for Appointment
            </Button>

            <CycleCalendar />
          </TabsContent>

          <TabsContent value="insights">
            <TTCPersonalizedAdvice
              cycleDay={cycleDay ?? 1}
              cyclePhase={(phase === 'ovulation' ? 'fertile' : phase === 'early_luteal' || phase === 'late_luteal' ? 'luteal' : phase ?? 'follicular') as any}
              moodScore={7}
              stressLevel={4}
              energyLevel={6}
            />
          </TabsContent>

          <TabsContent value="predictions">
            <TTCPredictiveAnalytics />
          </TabsContent>
        </Tabs>
      </CardContent>

      <TTCCycleSettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} initial={settings} onSaved={refresh} />
      <TTCBloodworkModal open={bloodworkOpen} onOpenChange={setBloodworkOpen} settings={settings} onSaved={refresh} />
      <TTCPatternReport open={reportOpen} onOpenChange={setReportOpen} mode="pattern_report" />
      <TTCPatternReport open={doctorOpen} onOpenChange={setDoctorOpen} mode="doctor_prep" />
    </Card>
  );
};
