import { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timer, AlertTriangle, Baby, Heart, Wind } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLaborContacts } from '@/hooks/useLaborContacts';
import * as queue from '@/lib/contractionQueue';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type LaborState = 'EARLY' | 'BUILDING' | 'PREPARE' | 'READY';

const STATE_MESSAGES: Record<LaborState, { title: string; message: string; tone: string }> = {
  EARLY:    { title: 'Early Labor',              message: 'Contractions are irregular. Stay relaxed 💛',         tone: 'muted' },
  BUILDING: { title: 'Labor Progressing',        message: 'Your contractions are becoming more consistent.',     tone: 'info' },
  PREPARE:  { title: 'Time to Prepare',          message: 'Consider preparing your hospital bag.',               tone: 'warning' },
  READY:    { title: 'Strong Pattern Detected',  message: 'It may be time to contact your provider.',            tone: 'destructive' },
};

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
  const [serverState, setServerState] = useState<LaborState | null>(null);
  const lastServerStateRef = useRef<LaborState | null>(null);
  const { user } = useAuth();
  /** Row id of the contraction currently running, so it can be closed. */
  const [openId, setOpenId] = useState<string | null>(null);
  const [online, setOnline] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<Contraction | null>(null);
  const { contacts, hasTriageLine } = useLaborContacts();
  /** Client-side id for the running contraction, used to match queued writes. */
  const [localId, setLocalId] = useState<string | null>(null);

  // localStorage paints first and keeps the log readable with no signal, but
  // the database is the record. This used to be the ONLY store, so a refresh
  // or a flat battery at 3am erased the whole labour.
  useEffect(() => {
    const saved = localStorage.getItem('contractionLog');
    if (saved) try { setContractions(JSON.parse(saved)); } catch { /* corrupt */ }
  }, []);
  useEffect(() => { localStorage.setItem('contractionLog', JSON.stringify(contractions)); }, [contractions]);

  const loadFromServer = useRef<() => Promise<void>>(async () => {});
  loadFromServer.current = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('contractions')
      .select('id, started_at, ended_at, duration_seconds, intensity')
      .eq('user_id', user.id)
      .is('archived_at', null)
      .order('started_at', { ascending: false })
      .limit(200);
    if (error || !data) return;

    // A row with no ended_at is a contraction that was running when she left.
    // Restoring it is what makes the tool survive a refresh mid-labour.
    const open = data.find((r) => !r.ended_at);
    if (open) {
      setOpenId(open.id);
      setActiveStart(new Date(open.started_at).getTime());
      setIntensity(open.intensity ?? 5);
    }

    const closed: Contraction[] = data
      .filter((r) => r.ended_at)
      .map((r) => ({
        id: r.id,
        startTime: new Date(r.started_at).getTime(),
        endTime: new Date(r.ended_at as string).getTime(),
        duration: r.duration_seconds ?? 0,
        intensity: r.intensity ?? 5,
      }));

    // Merge, newest first. No cap: a long labour can run to hundreds of
    // contractions, and the earliest ones answer the first question triage
    // asks — when did they start.
    setContractions((local) => {
      const byStart = new Map<number, Contraction>();
      for (const c of [...closed, ...local]) byStart.set(c.startTime, c);
      return [...byStart.values()].sort((a, b) => b.startTime - a.startTime);
    });
  };

  useEffect(() => { void loadFromServer.current(); }, [user]);

  useEffect(() => {
    const on = () => { setOnline(true); void drainQueue(); };
    const off = () => setOnline(false);
    setOnline(navigator.onLine);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

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

  const start = async () => {
    const startedAt = Date.now();
    setActiveStart(startedAt);
    setIntensity(5);
    vibrate('medium');
    toast({ title: 'Wave starting', description: 'Soften. Breathe. Sway if you need to.' });

    // Write one: open the row now, not at the end. If her phone dies mid
    // contraction, this row is what tells us it happened and when.
    //
    // Queued first, so a start with no signal is still durable — the UI has
    // already responded, and the row lands when connectivity returns.
    const lid = `${startedAt}`;
    setLocalId(lid);
    queue.enqueue({ kind: 'start', localId: lid, startedAt });
    void drainQueue();
  };

  /**
   * Push queued writes to the server, in order.
   *
   * A unique-constraint failure means a row is already open — a retry after a
   * timeout, or a second device. Recover that row's id and carry on. It is not
   * an error, and during labour an error toast is the last thing she needs.
   */
  const drainQueue = async () => {
    if (!user || !navigator.onLine) return;
    await queue.drain({
      start: async (w) => {
        const { data, error } = await supabase
          .from('contractions')
          .insert({ user_id: user.id, started_at: new Date(w.startedAt).toISOString() })
          .select('id')
          .single();
        if (!error && data) { setOpenId(data.id); return data.id; }
        if (error?.code === '23505') {
          const { data: open } = await supabase
            .from('contractions')
            .select('id')
            .eq('user_id', user.id)
            .is('ended_at', null)
            .limit(1)
            .maybeSingle();
          if (open?.id) { setOpenId(open.id); return open.id; }
        }
        return null; // stays queued
      },
      end: async (w) => {
        if (!w.serverId) return false;
        const { error } = await supabase.rpc('end_contraction', {
          p_id: w.serverId, p_intensity: w.intensity,
        });
        return !error;
      },
    });
    void loadFromServer.current();
  };

  const end = async () => {
    if (!activeStart) return;
    const endAt = Date.now();
    const dur = Math.max(1, Math.floor((endAt - activeStart) / 1000));
    // No slice cap. It existed for localStorage size, and it dropped the
    // OLDEST contractions — the ones that answer "when did they start".
    const c: Contraction = { id: openId ?? String(endAt), startTime: activeStart, endTime: endAt, duration: dur, intensity };
    setContractions(prev => [c, ...prev]);
    setActiveStart(null);
    vibrate('success');
    toast({ title: 'Wave complete', description: `${fmt(dur)} · intensity ${intensity}/10` });

    // Write two: close the row. Queued for the same reason as the start —
    // ending a contraction in a car park must not lose it.
    queue.enqueue({
      kind: 'end',
      localId: localId ?? String(activeStart),
      serverId: openId,
      endedAt: endAt,
      intensity,
    });
    setOpenId(null);
    setLocalId(null);
    void drainQueue();
  };

  const remove = async (id: string) => {
    setContractions(prev => prev.filter(c => c.id !== id));
    setPendingDelete(null);
    if (!user) return;
    await supabase.from('contractions').delete().eq('id', id).eq('user_id', user.id);
    // Removing one contraction invalidates the interval of the one after it,
    // so the recalculation happens server-side and stays consistent with the
    // stored record rather than only with this screen.
    await supabase.rpc('recompute_contraction_intervals');
    void loadFromServer.current();
  };

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

  // The local engine no longer raises its own alert.
  //
  // Two engines each firing their own toast meant she could be told "Active
  // Labor — call your provider" by one and "Labor Progressing" by the other,
  // minutes apart, about the same contractions. During labour that is not
  // noise, it is contradictory triage advice.
  //
  // The server is the single voice: its thresholds can be corrected without a
  // client release, which matters when the rule itself is subtle. The local
  // computation stays, but only to drive the on-screen label when the server
  // is unreachable — and only ever upward. See `displayPhase` below.
  const lastPhaseRef = useRef<string>('');
  useEffect(() => { lastPhaseRef.current = phase.key; }, [phase.key]);

  // Server-side labor analysis
  useEffect(() => {
    if (contractions.length < 2) { setServerState(null); return; }
    const payload = contractions.slice(0, 10).map(c => ({
      startTime: c.startTime, endTime: c.endTime, duration: c.duration,
    })).reverse();
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke('analyze-contractions', {
          body: { contractions: payload, lastNotifiedState: lastServerStateRef.current },
        });
        if (cancelled || error || !data?.state) return;
        const next = data.state as LaborState;
        setServerState(next);
        if (next !== lastServerStateRef.current && (next === 'PREPARE' || next === 'READY')) {
          vibrate(next === 'READY' ? 'error' : 'medium');
          toast({
            title: STATE_MESSAGES[next].title,
            description: STATE_MESSAGES[next].message,
            variant: next === 'READY' ? 'destructive' : 'default',
          });
        }
        lastServerStateRef.current = next;
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [contractions]);

  // ── Reconciling the two engines ───────────────────────────────────────────
  // The server is the source of truth: its thresholds can be corrected without
  // a client release, which matters because 5-1-1 is subtler than it looks.
  // But labour is exactly when connectivity fails, so the local computation
  // stays as a fallback — and the two are combined by taking the HIGHER of the
  // two, never the lower.
  //
  // The asymmetry is deliberate. A false escalation sends her to her provider
  // early; a false de-escalation keeps her at home too long. Those are not
  // equally bad, so the display never steps down because a response disagreed.
  const SEVERITY: Record<LaborState, number> = { EARLY: 0, BUILDING: 1, PREPARE: 2, READY: 3 };
  const LOCAL_AS_STATE: Record<string, LaborState> = {
    tracking: 'EARLY', irregular: 'EARLY', early: 'BUILDING',
    'early-active': 'PREPARE', active: 'READY', transition: 'READY',
  };

  // Cached, so a server outage mid-labour does not silently drop her back to
  // whatever local thinks — she keeps the assessment she has been reading.
  const effectiveServer = serverState ?? lastServerStateRef.current;
  const localState = LOCAL_AS_STATE[phase.key] ?? 'EARLY';
  const displayState: LaborState =
    effectiveServer && SEVERITY[effectiveServer] >= SEVERITY[localState]
      ? effectiveServer
      : localState;
  const usingLocalOnly = !effectiveServer || !online;

  // How long since anything was logged. Nothing here archives on its own —
  // she might be in the car, in triage, or genuinely finished, and the app
  // cannot tell which.
  const lastLoggedAt = contractions[0]?.startTime ?? null;
  const staleMin = !activeStart && lastLoggedAt
    ? Math.floor((now - lastLoggedAt) / 60000)
    : 0;

  const archiveSession = async () => {
    setContractions([]);
    setOpenId(null);
    setLocalId(null);
    setActiveStart(null);
    try { localStorage.removeItem('contractionLog'); } catch { /* private mode */ }
    queue.clear();
    if (user) await supabase.rpc('archive_contractions');
    void loadFromServer.current();
    toast({ title: 'Session archived', description: 'Everything you logged is saved. Start again whenever you need to.' });
  };

  // Written for a midwife reading it on a partner's phone, not for us.
  const shareSummary = (() => {
    if (contractions.length === 0) return '';
    const first = contractions[contractions.length - 1];
    const since = Math.round((Date.now() - first.startTime) / 60000);
    const hrs = Math.floor(since / 60), mins = since % 60;
    const elapsed = hrs > 0 ? `${hrs} hr ${mins} min` : `${mins} min`;
    const startedAt = new Date(first.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const avgIntMin = stats ? Math.round(stats.avgInt) : null;
    const avgDurSec = stats ? Math.round(stats.avgDur) : null;
    return [
      avgIntMin !== null
        ? `Contractions every ${avgIntMin} min, about ${avgDurSec} sec long.`
        : `${contractions.length} contractions logged.`,
      `Started ${elapsed} ago at ${startedAt}.`,
      `${contractions.length} logged in total.`,
    ].join(' ');
  })();

  const intensityColor = (n: number) =>
    n <= 3 ? 'bg-emerald-500' : n <= 6 ? 'bg-catalyst-gold' : n <= 8 ? 'bg-orange-500' : 'bg-destructive';

  const phaseStyles: Record<string, string> = {
    destructive: 'bg-destructive/10 border-destructive/40 text-destructive',
    warning: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300',
    info: 'bg-catalyst-cream border-catalyst-tan text-catalyst-brown',
    muted: 'bg-muted/40 border-border text-foreground/80',
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center"><Timer className="mr-2 h-5 w-5 text-catalyst-copper" />Contraction Tracker</div>
          <Badge variant="outline" className="border-catalyst-copper/40 text-catalyst-brown">{STATE_MESSAGES[displayState].title}</Badge>
        </CardTitle>
        <CardDescription>Tap to time waves. We'll watch for the 5-1-1 pattern with you.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Stale. Two thresholds, both offering the same two choices — and
            "archive" rather than "end", because "end" would be telling her
            her labour ended. */}
        {staleMin >= 30 && (
          <div className="rounded-lg border border-dashed p-3 space-y-2">
            <p className="text-sm">
              {staleMin >= 120
                ? `No contractions logged for ${Math.floor(staleMin / 60)} hours.`
                : `Your last contraction was ${staleMin} minutes ago.`}
            </p>
            <p className="text-xs text-muted-foreground">
              {staleMin >= 120
                ? 'Archive this session if things have moved on, or carry on timing.'
                : 'Tap start when the next one comes, or archive if you are done for now.'}
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => { void archiveSession(); }}>
                Archive session
              </Button>
              <Button size="sm" variant="ghost" onClick={start}>Keep timing</Button>
            </div>
          </div>
        )}

        {/* What the reconciled assessment currently is, in one place. */}
        <div className={`p-3 rounded-lg border text-sm ${phaseStyles[STATE_MESSAGES[displayState].tone] ?? phaseStyles.muted}`}>
          <p className="font-medium">{STATE_MESSAGES[displayState].title}</p>
          <p className="text-xs mt-0.5">{STATE_MESSAGES[displayState].message}</p>
          {usingLocalOnly && (
            // She deserves to know which engine is driving her triage view.
            <p className="mt-1.5 text-[11px] opacity-80">
              Offline — using on-device thresholds.
            </p>
          )}
        </div>

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

        {/* Server-analyzed labor state */}
        {serverState && (
          <div className={`p-3 rounded-lg border ${phaseStyles[STATE_MESSAGES[serverState].tone]}`}>
            <div className="flex items-center justify-between mb-0.5">
              <div className="font-semibold text-sm">{STATE_MESSAGES[serverState].title}</div>
              <Badge variant="outline" className="text-[10px]">Live analysis</Badge>
            </div>
            <p className="text-xs">{STATE_MESSAGES[serverState].message}</p>
          </div>
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
                      <button
                        onClick={() => setPendingDelete(c)}
                        aria-label="Delete this contraction"
                        className="text-muted-foreground hover:text-destructive px-1"
                      >×</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <AlertDialog open={pendingDelete !== null} onOpenChange={(o) => !o && setPendingDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete the contraction logged at{' '}
                {pendingDelete && new Date(pendingDelete.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This recalculates the time between every contraction after it, which
                changes the pattern you're being shown. It can't be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep it</AlertDialogCancel>
              <AlertDialogAction onClick={() => pendingDelete && remove(pendingDelete.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* The call path. The button ALWAYS renders — a missing call button
            during active labour is worse than one that prompts setup. With no
            number it links to settings instead of dialling. */}
        <div className="grid gap-2 sm:grid-cols-2">
          {hasTriageLine ? (
            <Button asChild variant={displayState === 'READY' ? 'destructive' : 'outline'}>
              <a href={`tel:${contacts.provider_triage_phone?.replace(/[^\d+]/g, '')}`}>
                <Phone className="h-4 w-4 mr-1.5" />
                Call {contacts.provider_name || 'your provider'}
              </a>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link to="/profile#labor-contacts">
                <Phone className="h-4 w-4 mr-1.5" />Add labor contact
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" disabled={contractions.length === 0}>
            {/* Her partner sends this. It has to read to someone who did not
                build the app and is not looking at the screen. */}
            <a href={`sms:${contacts.backup_contact_phone ?? ''}?&body=${encodeURIComponent(shareSummary)}`}>
              Share log
            </a>
          </Button>
        </div>

        {/* Persistent until set. It comes back next session rather than being
            dismissed forever — a number added after labour starts is a number
            added too late. */}
        {!hasTriageLine && (
          <p className="text-xs text-muted-foreground text-center">
            Add your provider's labor line so the call button works when you need it.
          </p>
        )}

        <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-xs text-orange-900">
          <p className="font-semibold mb-1">Call your provider if:</p>
          <ul className="space-y-0.5">
            <li>• Waves are 5 minutes apart, lasting 1 minute, for 1 hour (5-1-1)</li>
            <li>• Water breaks or any bleeding</li>
            <li>• Severe pain or reduced baby movement</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
