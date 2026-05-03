import { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Timer, RotateCcw, TrendingUp, AlertTriangle, Sparkles, Sun, Moon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface KickSession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  startedAt: number;
  kickCount: number;
  duration: number; // minutes
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
  const [isTracking, setIsTracking] = useState(false);
  const [kickCount, setKickCount] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [sessions, setSessions] = useState<KickSession[]>([]);
  const [ripples, setRipples] = useState<number[]>([]);
  const [affirmation, setAffirmation] = useState(AFFIRMATIONS[0]);
  const [lastKickAt, setLastKickAt] = useState<number | null>(null);
  const [milestoneShown, setMilestoneShown] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);

  // Load sessions
  useEffect(() => {
    const saved = localStorage.getItem('kickCounterSessions');
    if (saved) try { setSessions(JSON.parse(saved)); } catch {}
  }, []);

  useEffect(() => {
    if (sessions.length) localStorage.setItem('kickCounterSessions', JSON.stringify(sessions));
  }, [sessions]);

  // Live timer (1s)
  useEffect(() => {
    if (!isTracking || !startTime) return;
    const i = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startTime.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(i);
  }, [isTracking, startTime]);

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
    const dur = Math.max(1, Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60));
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
    toast({ title: 'Session saved', description: `${kickCount} movements in ${dur} min.` });
  };

  const resetSession = () => { setIsTracking(false); setKickCount(0); setStartTime(null); setElapsedSec(0); };

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

        {/* Live affirmation + status */}
        {isTracking && (
          <div className="text-center space-y-2 animate-fade-in">
            <p className="text-sm font-medium text-catalyst-brown flex items-center justify-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />{affirmation}
            </p>
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

        {/* Action row */}
        {isTracking ? (
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={stopTracking} variant="outline">Finish session</Button>
            <Button onClick={resetSession} variant="ghost"><RotateCcw className="h-4 w-4 mr-1" />Reset</Button>
          </div>
        ) : (
          <Button onClick={startTracking} className="w-full" size="lg">Start Kick Counting</Button>
        )}

        {/* Pattern + active window */}
        {(pattern || activeWindow) && (
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
            <div className="flex gap-1 items-end h-16">
              {sessions.slice(0, 14).reverse().map(s => (
                <div key={s.id} className="flex-1 flex flex-col items-center gap-1" title={`${s.kickCount} kicks · ${s.duration}m`}>
                  <div
                    className={`w-full rounded-t-md transition-all ${s.kickCount >= 10 ? 'bg-catalyst-copper' : s.kickCount >= 6 ? 'bg-catalyst-gold' : 'bg-muted-foreground/40'}`}
                    style={{ height: `${Math.min(100, (s.kickCount / 12) * 100)}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
