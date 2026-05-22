import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Activity, Flame, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';

type ProgramSummary = {
  name: string;
  href: string;
  completed: number;
  total: number;
  unit: string; // e.g. "days", "videos"
  lastActivity: number; // epoch ms
  streak?: number;
  isComplete?: boolean;
  ctaLabel: string;
};

const readCoreRestore = (): ProgramSummary | null => {
  try {
    const raw = localStorage.getItem('core-restore-foundations-progress');
    if (!raw) return null;
    const p = JSON.parse(raw);
    const unlocked = Number(p.unlocked_day) || 1;
    const completedDays = Math.max(0, unlocked - 1);
    const lastDate = p.last_completed_date || p.started_at;
    const lastActivity = lastDate ? new Date(lastDate).getTime() : 0;
    return {
      name: 'Core Restore Foundations',
      href: '/workouts/core-restore-foundations',
      completed: p.completed_at ? 28 : completedDays,
      total: 28,
      unit: 'days',
      lastActivity,
      streak: Number(p.streak) || 0,
      isComplete: !!p.completed_at,
      ctaLabel: p.completed_at ? 'Review Program' : 'Continue Program',
    };
  } catch {
    return null;
  }
};

const readGlowAndGo = (): ProgramSummary | null => {
  try {
    const raw = localStorage.getItem('glowAndGoWatched');
    if (!raw) return null;
    const watched = JSON.parse(raw) as Record<string, boolean>;
    const completed = Object.values(watched).filter(Boolean).length;
    if (completed === 0) return null;
    // No timestamp stored; use a moderately recent fallback so it ranks below
    // programs that do track timestamps unless it's the only one available.
    return {
      name: 'Glow & Go Prenatal',
      href: '/glow-and-go',
      completed,
      total: Math.max(completed, 12),
      unit: 'videos',
      lastActivity: Date.now() - 1000 * 60 * 60 * 24, // ~1 day ago fallback
      ctaLabel: 'Continue Watching',
    };
  } catch {
    return null;
  }
};

const pickActiveProgram = (): ProgramSummary | null => {
  const programs = [readCoreRestore(), readGlowAndGo()].filter(
    (p): p is ProgramSummary => !!p,
  );
  if (programs.length === 0) return null;
  return programs.sort((a, b) => b.lastActivity - a.lastActivity)[0];
};

export const WeeklyProgress = () => {
  const [program, setProgram] = useState<ProgramSummary | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgram(pickActiveProgram());
    setReady(true);
    const onFocus = () => setProgram(pickActiveProgram());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  if (!ready) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-8 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!program) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Program Progress
          </CardTitle>
          <CardDescription>Start a program to begin tracking your journey</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" asChild>
            <Link to="/workouts">Browse Programs</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const pct = Math.min(100, Math.round((program.completed / program.total) * 100));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Program Progress
        </CardTitle>
        <CardDescription>{program.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium capitalize">{program.unit} completed</span>
            <span className="text-lg font-bold">
              {program.completed}/{program.total}
            </span>
          </div>
          <Progress value={pct} className="h-3" />
          <p className="text-xs text-muted-foreground">{pct}% complete</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Flame className="h-4 w-4 text-orange-500" />
            </div>
            <div className="text-lg font-bold">{program.streak ?? 0}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <CalendarDays className="h-4 w-4 text-primary" />
            </div>
            <div className="text-lg font-bold">{program.total - program.completed}</div>
            <div className="text-xs text-muted-foreground">Remaining</div>
          </div>
        </div>

        <Button
          variant={program.isComplete ? 'outline' : 'default'}
          className="w-full"
          asChild
        >
          <Link to={program.href}>
            {program.isComplete ? 'Program Complete 🎉' : program.ctaLabel}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
