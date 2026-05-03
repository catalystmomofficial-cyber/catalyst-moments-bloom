import { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timer, AlertTriangle, Baby, Heart, Wind } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface Contraction {
  id: string;
  startTime: number;
  endTime: number;
  duration: number; // sec
  intensity: number; // 1-10
}

const AFFIRMATIONS = [
  "Breathe in calm. Breathe out tension.",
  "Each wave brings you closer to baby.",
  "Your body knows exactly what to do.",
  "Soft jaw. Soft shoulders. Open hands.",
  "You are safe. You are strong.",
];

const fmt = (s: number) => {
  const m = Math.floor(s / 60); const r = s % 60;
  return `${m.toString().padStart(2,'0')}:${r.toString().padStart(2,'0')}`;
};

export const ContractionTracker = () => {
  const { toast } = useToast();
  const { vibrate } = useHapticFeedback();
  const [contractions, setContractions] = useState<Contraction[]>([]);
  const [activeStart, setActiveStart] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [intensity, setIntensity] = useState(5);
  const [affirmIdx, setAffirmIdx] = useState(0);
  const breathRef = useRef<HTMLDivElement>(null);

  // Restore
  useEffect(() => {
    const saved = localStorage.getItem('contractionLog');
    if (saved) try { setContractions(JSON.parse(saved)); } catch {}
  }, []);
  useEffect(() => { localStorage.setItem('contractionLog', JSON.stringify(contractions)); }, [contractions]);

  // Tick
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(i);
  }, []);

  // Rotate affirmations during contraction
  useEffect(() => {
    if (!activeStart) return;
    const i = setInterval(() => setAffirmIdx(x => (x + 1) % AFFIRMATIONS.length), 5000);
    return () => clearInterval(i);
  }, [activeStart]);

  const start = () => {
    setActiveStart(Date.now());
    setIntensity(5);
    vibrate('medium');
    toast({ title: 'Wave starting', description: 'Soften. Breathe. Sway if you need to.' });
  };

  const end = () => {
    if (!activeStart) return;
    const endAt = Date.now();
    const dur = Math.max(1, Math.floor((endAt - activeStart) / 1000));
    const c: Contraction = { id: String(endAt), startTime: activeStart, endTime: endAt, duration: dur, intensity };
    setContractions(prev => [c, ...prev].slice(0, 50));
    setActiveStart(null);
    vibrate('success');
    toast({ title: 'Wave complete', description: `${fmt(dur)} · intensity ${intensity}/10` });
  };

  const remove = (id: string) => setContractions(prev => prev.filter(c => c.id !== id));

  const liveSec = activeStart ? Math.floor((now - activeStart) / 1000) : 0;

  // Stats from last 5
  const stats = useMemo(() => {
    if (contractions.length < 2) return null;
    const recent = contractions.slice(0, 5);
    const intervals: number[] = [];
    for (let i = 0; i < recent.length - 1; i++) {
      intervals.push((recent[i].startTime - recent[i + 1].startTime) / 1000 / 60);
    }
    const avgInt = intervals.reduce((a,b)=>a+b,0) / intervals.length;
    const avgDur = recent.reduce((a,c)=>a+c.duration,0) / recent.length;
    const avgIntensity = recent.reduce((a,c)=>a+c.intensity,0) / recent.length;
    return { avgInt, avgDur, avgIntensity };
  }, [contractions]);

  const phase = useMemo(() => {
    if (!stats) return { key: 'tracking', label: 'Tracking', tone: 'muted', message: 'Keep logging — patterns will appear after a few waves.' };
    const { avgInt, avgDur, avgIntensity } = stats;
    if (avgInt <= 3 && avgDur >= 60) return { key: 'transition', label: 'Transition', tone: 'destructive', message: '3-1-1 pattern. Go to your birth place. Trust your body.' };
    if (avgInt <= 5 && avgDur >= 60 && avgIntensity >= 7) return { key: 'active', label: 'Active Labor', tone: 'destructive', message: '5-1-1 pattern reached. Time to call your provider.' };
    if (avgInt <= 10 && avgDur >= 45) return { key: 'early-active', label: 'Early Labor', tone: 'warning', message: 'Things are picking up. Stay hydrated, change positions.' };
    if (avgInt <= 20) return { key: 'early', label: 'Pre-Labor', tone: 'info', message: 'Early waves. Rest, eat lightly, conserve energy.' };
    return { key: 'irregular', label: 'Irregular', tone: 'muted', message: 'Contractions are still irregular. Stay calm 💛' };
  }, [stats]);

  // Trigger urgent toast once when transition / active
  const lastPhaseRef = useRef<string>('');
  useEffect(() => {
    if (phase.key !== lastPhaseRef.current && (phase.key === 'active' || phase.key === 'transition')) {
      vibrate('error');
      toast({ title: phase.label, description: phase.message, variant: 'destructive' });
    }
    lastPhaseRef.current = phase.key;
  }, [phase.key]);

  const intensityColor = (n: number) =>
    n <= 3 ? 'bg-emerald-500' : n <= 6 ? 'bg-catalyst-gold' : n <= 8 ? 'bg-orange-500' : 'bg-destructive';

  const phaseStyles: Record<string, string> = {
    destructive: 'bg-destructive/10 border-destructive/40 text-destructive',
    warning: 'bg-orange-50 border-orange-200 text-orange-800',
    info: 'bg-catalyst-cream border-catalyst-tan text-catalyst-brown',
    muted: 'bg-muted/40 border-border text-foreground/80',
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center"><Timer className="mr-2 h-5 w-5 text-catalyst-copper" />Contraction Tracker</div>
          <Badge variant="outline" className="border-catalyst-copper/40 text-catalyst-brown">{phase.label}</Badge>
        </CardTitle>
        <CardDescription>Tap to time waves. We'll watch for the 5-1-1 pattern with you.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Active wave panel */}
        {activeStart ? (
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-catalyst-cream to-catalyst-peach border border-catalyst-tan space-y-4">
            <div ref={breathRef} className="mx-auto h-32 w-32 rounded-full bg-catalyst-copper/20 flex items-center justify-center animate-pulse">
              <div className="h-24 w-24 rounded-full bg-catalyst-copper/40 flex items-center justify-center">
                <Wind className="h-8 w-8 text-catalyst-brown" />
              </div>
            </div>
            <div className="text-5xl font-bold text-catalyst-brown tabular-nums">{fmt(liveSec)}</div>
            <p className="text-sm text-catalyst-brown/80 animate-fade-in" key={affirmIdx}>{AFFIRMATIONS[affirmIdx]}</p>

            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Intensity right now</p>
              <input
                type="range" min={1} max={10} value={intensity}
                onChange={e => setIntensity(parseInt(e.target.value))}
                className="w-full accent-catalyst-copper"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1"><span>soft</span><span>{intensity}/10</span><span>strong</span></div>
            </div>

            <Button size="lg" className="w-full bg-catalyst-copper hover:bg-catalyst-copper/90" onClick={end}>
              Tap when wave ends
            </Button>
          </div>
        ) : (
          <Button size="lg" className="w-full" onClick={start}>
            Start a contraction
          </Button>
        )}

        {/* Phase guidance */}
        <div className={`p-3 rounded-lg border text-sm ${phaseStyles[phase.tone]}`}>
          <div className="flex items-center gap-2 font-medium mb-0.5">
            {phase.key === 'active' || phase.key === 'transition' ? <AlertTriangle className="h-4 w-4" /> :
             phase.key === 'early-active' ? <Baby className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
            {phase.label}
          </div>
          <p className="text-xs">{phase.message}</p>
        </div>

        {/* Live stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-3 rounded-lg bg-muted/40">
              <div className="font-semibold text-catalyst-brown">{Math.round(stats.avgInt)}m</div>
              <p className="text-[11px] text-muted-foreground">Avg interval</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/40">
              <div className="font-semibold text-catalyst-brown">{fmt(Math.round(stats.avgDur))}</div>
              <p className="text-[11px] text-muted-foreground">Avg duration</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/40">
              <div className="font-semibold text-catalyst-brown">{stats.avgIntensity.toFixed(1)}/10</div>
              <p className="text-[11px] text-muted-foreground">Avg strength</p>
            </div>
          </div>
        )}

        {/* Pattern strip */}
        {contractions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent waves</h4>
            <div className="flex gap-1 items-end h-16">
              {contractions.slice(0, 16).reverse().map(c => (
                <div key={c.id} className="flex-1" title={`${fmt(c.duration)} · ${c.intensity}/10`}>
                  <div
                    className={`w-full rounded-t-md ${intensityColor(c.intensity)}`}
                    style={{ height: `${Math.min(100, (c.duration / 90) * 100)}%`, minHeight: '6px' }}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {contractions.slice(0, 6).map((c, i) => {
                const next = contractions[i + 1];
                const interval = next ? Math.round((c.startTime - next.startTime) / 1000 / 60) : null;
                return (
                  <div key={c.id} className="flex justify-between items-center px-2 py-1.5 bg-muted/30 rounded text-xs">
                    <div className="flex items-center gap-2">
                      <span>{new Date(c.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>·</span>
                      <span>{fmt(c.duration)}</span>
                      <span className={`inline-block h-2 w-2 rounded-full ${intensityColor(c.intensity)}`} />
                      <span>{c.intensity}/10</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {interval !== null && <span className="text-muted-foreground">{interval}m apart</span>}
                      <button onClick={() => remove(c.id)} className="text-muted-foreground hover:text-destructive">×</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 text-xs text-orange-900">
          <p className="font-semibold mb-1">Call your provider if:</p>
          <ul className="space-y-0.5">
            <li>• Waves are 5 minutes apart for 1 hour (5-1-1)</li>
            <li>• Water breaks or any bleeding</li>
            <li>• Severe pain or reduced baby movement</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
