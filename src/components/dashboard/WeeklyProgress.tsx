import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Activity, Flame, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getLastActiveProgram,
  subscribeLastActiveProgram,
  type LastActiveProgram,
} from '@/lib/lastActiveProgram';

type ProgramSummary = {
  name: string;
  href: string;
  completed: number;
  total: number;
  unit: string;
  lastActivity: number;
  streak?: number;
  isComplete?: boolean;
  ctaLabel: string;
};

// Enrich the lightweight last-active record with any richer per-program state
// that lives in localStorage (so progress/streak stay live).
const enrich = (p: LastActiveProgram): ProgramSummary => {
  let completed = p.completed ?? 0;
  let total = p.total ?? 1;
  let streak = p.streak ?? 0;
  let isComplete = p.isComplete ?? false;

  try {
    if (p.id === 'core-restore-foundations') {
      const raw = localStorage.getItem('core-restore-foundations-progress');
      if (raw) {
        const cr = JSON.parse(raw);
        const unlocked = Number(cr.unlocked_day) || 1;
        total = 28;
        completed = cr.completed_at ? 28 : Math.max(0, unlocked - 1);
        streak = Number(cr.streak) || 0;
        isComplete = !!cr.completed_at;
      }
    } else if (p.id === 'glow-and-go') {
      const raw = localStorage.getItem('glowAndGoWatched');
      if (raw) {
        const watched = JSON.parse(raw) as Record<string, boolean>;
        completed = Object.values(watched).filter(Boolean).length;
        total = Math.max(total, completed, 1);
      }
    }
  } catch {
    /* noop */
  }

  return {
    name: p.name,
    href: p.href,
    completed,
    total: Math.max(total, 1),
    unit: p.unit ?? 'sessions',
    lastActivity: p.lastActivity,
    streak,
    isComplete,
    ctaLabel: p.ctaLabel ?? (isComplete ? 'Review Program' : 'Continue Program'),
  };
};

const pickActiveProgram = (): ProgramSummary | null => {
  const last = getLastActiveProgram();
  return last ? enrich(last) : null;
};

export const WeeklyProgress = () => {
  const [program, setProgram] = useState<ProgramSummary | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgram(pickActiveProgram());
    setReady(true);
    const unsub = subscribeLastActiveProgram(() => setProgram(pickActiveProgram()));
    return unsub;
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
