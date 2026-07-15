import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Activity, CircleDot, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// The two prenatal programs, framed as one plan used together:
//   Glow & Go   = the weekly workout (strength/energy)
//   Birth Ball  = the daily comfort + birth-prep ritual
const trimesterLabel = (stage?: string | null) => {
  if (!stage) return 'This trimester';
  if (stage.includes('trimester_1')) return '1st Trimester';
  if (stage.includes('trimester_2')) return '2nd Trimester';
  if (stage.includes('trimester_3')) return '3rd Trimester';
  return 'This trimester';
};

export const PrenatalPlanCard = () => {
  const { profile } = useAuth();
  const tri = trimesterLabel(profile?.motherhood_stage);

  return (
    <Card className="p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-primary mb-1">
        Your prenatal plan · this week
      </p>
      <p className="text-xs text-muted-foreground mb-3">
        Two tracks, used together — matched to your pregnancy.
      </p>

      <Link
        to="/programs/glow-and-go"
        className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3 transition-colors hover:bg-primary/10"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Activity className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">Glow &amp; Go — {tri} workout</p>
          <p className="text-xs text-muted-foreground">Your weekly workout · 10–20 min</p>
        </div>
        <ArrowRight className="h-4 w-4 text-primary shrink-0" />
      </Link>

      <Link
        to="/programs/birth-ball"
        className="mt-2 flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/50"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <CircleDot className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">Birth Ball — daily ritual</p>
          <p className="text-xs text-muted-foreground">Comfort &amp; birth prep · 10 min · anytime</p>
        </div>
        <ArrowRight className="h-4 w-4 text-primary shrink-0" />
      </Link>
    </Card>
  );
};

export default PrenatalPlanCard;
