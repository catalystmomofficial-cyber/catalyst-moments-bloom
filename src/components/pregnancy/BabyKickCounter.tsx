import { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Timer, RotateCcw, TrendingUp, AlertTriangle, Sparkles, Sun, Moon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { usePregnancyProgress } from '@/hooks/usePregnancyProgress';

interface KickSession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  startedAt: number;
  kickCount: number;
  duration: number; // minutes
}

/** "Today, 2:15 PM" / "Yesterday, 9:04 PM" / "Sat 2 Aug, 7:30 AM". */
function relativeDay(ts: number): string {
  const d = new Date(ts);
  const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const midnight = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.round((midnight(new Date()) - midnight(d)) / 86400000);
  if (days === 0) return `Today, ${time}`;
  if (days === 1) return `Yesterday, ${time}`;
  if (days < 7) return `${days} days ago, ${time}`;
  return `${d.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}, ${time}`;
}

const AFFIRMATIONS = [
  "You and baby are connected 💛",
  "Every flutter is a hello",
  "You're doing beautifully",
  "Trust your body, trust baby",
  "Breathe. Feel. Notice.",
];

export const BabyKickCounter = () => {
  const { toast } = useToast();
  const { vibrate } = useHapticFeedback();
  const { user } = useAuth();
  // Named to avoid colliding with the local `progress` bar value below.
  const { progress: gestation } = usePregnancyProgress();
  const [isTracking, setIsTracking] = useState(false);
  const [kickCount, setKickCount] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  /** Seconds banked from finished run segments. */
  const [activeSec, setActiveSec] = useState(0);
  /** When the current run segment began, or null while paused. */
  const [runStartedAt, setRunStartedAt] = useState<number | null>(null);
  const [pausedAt, setPausedAt] = useState<number | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [sessions, setSessions] = useState<KickSession[]>([]);
  const [ripples, setRipples] = useState<number[]>([]);
  const [affirmation, setAffirmation] = useState(AFFIRMATIONS[0]);
  const [lastKickAt, setLastKickAt] = useState<number | null>(null);
  const [milestoneShown, setMilestoneShown] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);

  // Load sessions. localStorage paints first so the history is there instantly
  // and still works offline, then the server copy replaces it. The server is
  // the source of truth: the pattern check below is a safety net, and a safety
  // net that only exists on one browser is not one.
  useEffect(() => {
    const saved = localStorage.getItem('kickCounterSessions');
    if (saved) try { setSessions(JSON.parse(saved)); } catch { /* corrupt cache */ }
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from('kick_sessions')
        .select('id, started_at, ended_at, kick_count, duration_min')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(30);

      if (cancelled || error || !data) return;

      const remote: KickSession[] = data.map((r) => {
        const start = new Date(r.started_at);
        return {
          id: r.id,
          date: start.toDateString(),
          startTime: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          endTime: new Date(r.ended_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          startedAt: start.getTime(),
          kickCount: r.kick_count,
          duration: r.duration_min,
        };
      });

      // Merge rather than overwrite: a session logged offline is still only in
      // localStorage and must not vanish when the server list arrives.
      setSessions((local) => {
        const byStart = new Map<number, KickSession>();
        for (const s of [...remote, ...local]) byStart.set(s.startedAt, s);
        return [...byStart.values()].sort((a, b) => b.startedAt - a.startedAt).slice(0, 30);
      });
    })();

    return () => { cancelled = true; };
  }, [user]);

  useEffect(() => {
    if (sessions.length) localStorage.setItem('kickCounterSessions', JSON.stringify(sessions));
  }, [sessions]);

  // Live timer (1s). Counts ACTIVE seconds only.
  //
  // It used to read `now - startTime`, which meant time spent away from the
  // app counted against her two-hour window: answer a text at count 2 / 0:54,
  // come back 45 minutes later, and the timer said 46:54. The session looked
  // failed when she had simply put the phone down.
  useEffect(() => {
    if (!isTracking || runStartedAt === null) return;
    const tick = () => setElapsedSec(activeSec + Math.floor((Date.now() - runStartedAt) / 1000));
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [isTracking, runStartedAt, activeSec]);

  // Pause when she leaves the app; never auto-resume when she returns.
  // Auto-resuming would silently start the clock again while she is reading a
  // message, which is the same bug in a smaller window. She chooses.
  useEffect(() => {
    if (!isTracking) return;
    const onHide = () => {
      if (document.visibilityState === 'visible' || runStartedAt === null) return;
      setActiveSec((a) => a + Math.floor((Date.now() - runStartedAt) / 1000));
      setRunStartedAt(null);
      setPausedAt(Date.now());
    };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', onHide);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', onHide);
    };
  }, [isTracking, runStartedAt]);

  // Rotate affirmations during a session
  useEffect(() => {
    if (!isTracking) return;
    const i = setInterval(() => {
      setAffirmation(prev => {
        const next = AFFIRMATIONS[(AFFIRMATIONS.indexOf(prev) + 1) % AFFIRMATIONS.length];
        return next;
      });
    }, 9000);
    return () => clearInterval(i);
  }, [isTracking]);

  const playChime = () => {
    try {
      if (!audioRef.current) audioRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioRef.current;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = 880;
      g.gain.value = 0.05;
      o.connect(g); g.connect(ctx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      o.stop(ctx.currentTime + 0.26);
    } catch {}
  };

  const startTracking = () => {
    const now = new Date();
    setIsTracking(true);
    setStartTime(now);
    setKickCount(0);
    setElapsedSec(0);
    setActiveSec(0);
    setRunStartedAt(Date.now());
    setPausedAt(null);
    setMilestoneShown(false);
    setLastKickAt(null);
    toast({ title: 'Counting started 💛', description: 'Tap the heart with each movement.' });
  };

  const recordKick = () => {
    if (!isTracking) return;
    vibrate('light');
    const id = Date.now();
    setRipples(r => [...r, id]);
    setTimeout(() => setRipples(r => r.filter(x => x !== id)), 700);
    setLastKickAt(Date.now());
    setKickCount(prev => {
      const next = prev + 1;
      if (next === 10 && !milestoneShown) {
        setMilestoneShown(true);
        playChime();
        vibrate('success');
        toast({ title: '🎉 10 movements!', description: `Beautiful — in just ${Math.max(1, Math.floor(elapsedSec/60))} minute(s).` });
      }
      return next;
    });
  };

  const stopTracking = () => {
    if (!startTime) return;
    const endTime = new Date();
    // Active minutes, not wall clock — a paused hour is not counting time.
    const totalActive = activeSec + (runStartedAt ? Math.floor((Date.now() - runStartedAt) / 1000) : 0);
    const dur = Math.max(1, Math.round(totalActive / 60));
    const session: KickSession = {
      id: String(Date.now()),
      date: startTime.toDateString(),
      startTime: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      startedAt: startTime.getTime(),
      kickCount,
      duration: dur,
    };
    setSessions(prev => [session, ...prev].slice(0, 30));
    setIsTracking(false);
    setStartTime(null);
    setElapsedSec(0);
    setActiveSec(0);
    setRunStartedAt(null);
    setPausedAt(null);
    // An incomplete session is real data, not a failure. Saying so out loud
    // matters — she stopped at 6 because life happened, not because she lost.
    toast({
      title: 'Session saved',
      description: kickCount >= 10
        ? `${kickCount} movements in ${dur} min.`
        : `${kickCount} movements in ${dur} min. Saved as-is.`,
    });

    // Persist to the server so the pattern check survives a new phone. Fire
    // and forget: the local copy is already saved above, so a failure here
    // never costs her the session or blocks the confirmation.
    if (user) {
      void (async () => {
        const { error } = await supabase.from('kick_sessions').insert({
          user_id: user.id,
          started_at: startTime.toISOString(),
          ended_at: endTime.toISOString(),
          kick_count: kickCount,
          duration_min: dur,
          week: gestation?.week ?? null,
        });
        // 23505 = the same session already stored (double tap, or a second
        // device syncing). That is the unique index working, not a failure.
        if (error && error.code !== '23505') {
          console.error('Failed to save kick session:', error);
        }
      })();
    }
  };

  const pauseSession = () => {
    if (runStartedAt === null) return;
    setActiveSec((a) => a + Math.floor((Date.now() - runStartedAt) / 1000));
    setRunStartedAt(null);
    setPausedAt(Date.now());
  };

  const resumeSession = () => {
    setRunStartedAt(Date.now());
    setPausedAt(null);
  };

  // Discards everything. Confirmed, never one tap: losing a count of 8 after
  // ninety minutes to a misplaced thumb is unrecoverable.
  const resetSession = () => {
    setIsTracking(false);
    setKickCount(0);
    setStartTime(null);
    setElapsedSec(0);
    setActiveSec(0);
    setRunStartedAt(null);
    setPausedAt(null);
    setConfirmReset(false);
  };

  // Live status
  const sinceLast = lastKickAt ? Math.floor((Date.now() - lastKickAt) / 1000) : null;
  const liveStatus = useMemo(() => {
    if (!isTracking) return null;
    if (kickCount === 0) return { tone: 'calm', text: 'Get cozy. Breathe slowly. Wait for the first hello.' };
    if (kickCount >= 10) return { tone: 'great', text: `Goal reached. Baby is wonderfully active.` };
    if (sinceLast !== null && sinceLast > 600) return { tone: 'gentle', text: 'Quiet stretch. Sip cold water, lie on your left side.' };
    if (kickCount >= 6) return { tone: 'good', text: 'Strong rhythm — almost there.' };
    return { tone: 'flow', text: 'Beautiful. Keep noticing each movement.' };
  }, [isTracking, kickCount, sinceLast]);

  // Pattern detection on history
  const pattern = useMemo(() => {
    // A pattern claim needs enough spread to be honest. Four sessions in one
    // afternoon is not a pattern, and "Movement is in a normal range" shown on
    // that basis is a reassurance the data cannot support.
    const distinctDays = new Set(sessions.map((s) => new Date(s.startedAt).toDateString())).size;
    if (sessions.length < 5 || distinctDays < 5) return null;

    const last3 = sessions.slice(0, 3);
    if (last3.length < 2) return null;
    const low = last3.filter(s => s.kickCount < 10).length;
    if (low >= 2) return { kind: 'concern' as const, msg: 'Recent sessions are lower than usual. If this continues, contact your provider.' };
    if (last3.every(s => s.kickCount >= 10)) return { kind: 'great' as const, msg: 'Consistently strong movement. Beautiful pattern.' };
    return { kind: 'normal' as const, msg: 'Movement is in a normal range.' };
  }, [sessions]);

  // Most active time-of-day
  const activeWindow = useMemo(() => {
    if (sessions.length < 3) return null;
    const buckets = { morning: 0, afternoon: 0, evening: 0, night: 0 };
    sessions.forEach(s => {
      const h = new Date(s.startedAt).getHours();
      const k = h < 12 ? 'morning' : h < 17 ? 'afternoon' : h < 21 ? 'evening' : 'night';
      (buckets as any)[k] += s.kickCount;
    });
    const top = Object.entries(buckets).sort((a,b)=>b[1]-a[1])[0];
    return top[1] > 0 ? top[0] : null;
  }, [sessions]);

  const isPaused = isTracking && runStartedAt === null;
  const pausedFor = (() => {
    if (!pausedAt) return null;
    const m = Math.floor((Date.now() - pausedAt) / 60000);
    if (m < 1) return null;
    return m < 60 ? `${m} min` : `${Math.floor(m / 60)} hr`;
  })();

  const progress = Math.min(100, (kickCount / 10) * 100);
  const mins = Math.floor(elapsedSec / 60);
  const secs = (elapsedSec % 60).toString().padStart(2, '0');

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center"><Heart className="mr-2 h-5 w-5 text-catalyst-copper" />Baby Kick Counter</div>
          {isTracking && (
            <Badge variant="outline" className="border-catalyst-copper/40 text-catalyst-brown">
              <Timer className="mr-1 h-3 w-3" />{mins}:{secs}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Aim for 10 movements within 2 hours. Get quiet, lie on your side, and listen.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Conic progress ring with pulsing heart */}
        <div className="flex justify-center">
          <button
            onClick={isTracking ? recordKick : startTracking}
            className="relative h-52 w-52 rounded-full flex items-center justify-center transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-catalyst-copper/30"
            style={{ background: `conic-gradient(hsl(var(--primary)) ${progress}%, hsl(var(--muted)) 0%)` }}
            aria-label={isTracking ? 'Log a kick' : 'Start counting'}
          >
            <div className="absolute inset-3 rounded-full bg-card shadow-inner flex flex-col items-center justify-center">
              <div className={`text-5xl font-bold text-catalyst-brown ${isTracking ? 'animate-pulse' : ''}`}>{kickCount}</div>
              <div className="text-xs text-muted-foreground mt-1">{isTracking ? 'tap for each move' : 'tap to begin'}</div>
            </div>
            {ripples.map(r => (
              <span key={r} className="absolute inset-0 rounded-full border-2 border-catalyst-copper/60 animate-ping" />
            ))}
          </button>
        </div>

        {/* Paused. Never auto-resumes — she is reading a message, and the
            clock restarting behind her is the bug in miniature. */}
        {isTracking && isPaused && (
          <div className="rounded-lg border border-dashed p-3 text-center space-y-2">
            <p className="text-sm font-medium">Paused{pausedFor ? ` ${pausedFor} ago` : ''}</p>
            <p className="text-xs text-muted-foreground">
              Time away doesn't count. Your {kickCount} {kickCount === 1 ? 'movement is' : 'movements are'} still here.
            </p>
            <Button size="sm" onClick={resumeSession}>Resume counting</Button>
          </div>
        )}

        {/* Live status. The UI quiets down as the session progresses — she is
            trying to feel her body, and every word on screen competes with
            that. Encouragement only at the very start; after that the number,
            the timer, and anything actually actionable. */}
        {isTracking && !isPaused && (
          <div className="text-center space-y-2 animate-fade-in">
            {kickCount <= 1 && (
              <p className="text-sm font-medium text-catalyst-brown flex items-center justify-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />{affirmation}
              </p>
            )}
            {liveStatus && (
              <p className={`text-xs ${liveStatus.tone === 'gentle' ? 'text-amber-700' : liveStatus.tone === 'great' ? 'text-emerald-700' : 'text-muted-foreground'}`}>
                {liveStatus.text}
              </p>
            )}
            {sinceLast !== null && kickCount > 0 && (
              <p className="text-[11px] text-muted-foreground">last movement {sinceLast < 60 ? `${sinceLast}s` : `${Math.floor(sinceLast/60)}m`} ago</p>
            )}
          </div>
        )}

        {/* Action row. Finish is primary and saves whatever she has; Reset is
            demoted to a small text control behind a confirmation, because
            losing a count of 8 after ninety minutes to a stray thumb cannot be
            undone. */}
        {isTracking ? (
          <div className="space-y-2">
            <Button onClick={stopTracking} className="w-full" size="lg">Finish session</Button>
            <div className="flex justify-center gap-4">
              {!isPaused && (
                <button onClick={pauseSession} className="text-xs text-muted-foreground hover:text-foreground">
                  Pause
                </button>
              )}
              <button
                onClick={() => setConfirmReset(true)}
                className="text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />Reset
              </button>
            </div>
          </div>
        ) : (
          <Button onClick={startTracking} className="w-full" size="lg">Start Kick Counting</Button>
        )}

        <AlertDialog open={confirmReset} onOpenChange={setConfirmReset}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset session?</AlertDialogTitle>
              <AlertDialogDescription>
                This clears your count of {kickCount} and starts over. It can't be undone.
                To keep what you have, choose Finish session instead.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep counting</AlertDialogCancel>
              <AlertDialogAction onClick={resetSession}>Reset</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Context for the rest state, not the counting state. During a
            session these are noise competing with the thing she is trying to
            feel. */}
        {!isTracking && (pattern || activeWindow) && (
          <div className="grid sm:grid-cols-2 gap-2">
            {pattern && (
              <div className={`p-3 rounded-lg text-sm border ${
                pattern.kind === 'concern' ? 'bg-destructive/5 border-destructive/30 text-destructive' :
                pattern.kind === 'great' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                'bg-muted/40 border-border text-foreground/80'
              }`}>
                <div className="flex items-center gap-2 font-medium mb-0.5">
                  {pattern.kind === 'concern' ? <AlertTriangle className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                  Pattern
                </div>
                <p className="text-xs">{pattern.msg}</p>
              </div>
            )}
            {activeWindow && (
              <div className="p-3 rounded-lg text-sm bg-catalyst-cream border border-catalyst-tan">
                <div className="flex items-center gap-2 font-medium mb-0.5 text-catalyst-brown">
                  {activeWindow === 'night' || activeWindow === 'evening' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  Most active in the {activeWindow}
                </div>
                <p className="text-xs text-muted-foreground">Try counting then for the strongest signal.</p>
              </div>
            )}
          </div>
        )}

        {/* Recent strip */}
        {sessions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Recent sessions</h4>
              <span className="text-xs text-muted-foreground">{sessions.length} logged</span>
            </div>
            {/* A list, not a chart.
                A bar collapsed the one thing that matters — how many — into a
                colour, so 9 and 0 looked identical. It carried no dates, so a
                run of sessions from three weeks ago read as reassuring even if
                nothing had been felt since; and gaps are precisely the signal
                kick counting exists to surface. Bars also imply comparison
                between categories, but these are discrete events in a
                sequence. The category advice about colour-coded charts was for
                continuous data — periods, mood, weight — not for this. */}
            <ul className="divide-y rounded-lg border">
              {sessions.slice(0, 10).map((s) => {
                const complete = s.kickCount >= 10;
                return (
                  <li key={s.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="text-sm">{relativeDay(s.startedAt)}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.kickCount} {s.kickCount === 1 ? 'movement' : 'movements'} · {s.duration} min
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        complete
                          ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-muted text-muted-foreground'
                      }`}
                      title={complete ? '10 or more movements' : 'Fewer than 10 — saved as it was'}
                    >
                      {complete ? 'Reached 10' : 'Incomplete'}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
