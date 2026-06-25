import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, ArrowRight, UserRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWellnessData } from '@/hooks/useWellnessData';
import { useCoachHistory } from '@/hooks/useCoachHistory';
import { useAssessmentData } from '@/hooks/useAssessmentData';
import {
  generateCoachOutput,
  type CoachStage,
  type CoachGap,
} from '@/lib/wellnessCoachEngine';

const stageMap = (s: string | null | undefined): CoachStage => {
  if (s === 'pregnant' || s === 'pregnancy') return 'pregnancy';
  if (s === 'postpartum') return 'postpartum';
  return 'TTC';
};

// Map assessment text fields → CoachGap array
const resolveGaps = (a: Record<string, any> | null, fallbackScore: number): CoachGap[] => {
  if (!a) return deriveGaps(fallbackScore);
  // If the assessment stored an explicit gaps array, use it directly
  if (Array.isArray(a.gaps) && a.gaps.length > 0) return a.gaps as CoachGap[];
  // Otherwise derive from obstacle + goal text
  const text = [a.biggest_obstacle, a.primary_goal].filter(Boolean).join(' ').toLowerCase();
  const mapped: CoachGap[] = [];
  if (/sleep|tired|fatigue|exhaust/.test(text)) mapped.push('sleep');
  if (/stress|anxi|overwhelm|mental|mood/.test(text)) mapped.push('stress');
  if (/nutri|diet|food|eat|nourish/.test(text)) mapped.push('nutrition');
  if (/fit|exercise|workout|movement|active/.test(text)) mapped.push('fitness');
  if (/recover|heal|postpartum/.test(text)) mapped.push('recovery');
  return mapped.length > 0 ? mapped : deriveGaps(fallbackScore);
};

interface Props {
  /** Optional override — falls back to assessment then live wellness data */
  score?: number;
  gaps?: CoachGap[];
}

export const PersonalizedCoachCard = ({ score, gaps }: Props) => {
  const { user, profile, subscribed } = useAuth();
  const { wellnessScore } = useWellnessData();
  const { assessmentData, scoreNumber: assessmentScore } = useAssessmentData();
  const navigate = useNavigate();
  const { logMessage } = useCoachHistory(1);

  // Priority: prop → assessment score → logged wellness score → default 60
  const effectiveScore = score ?? assessmentScore ?? wellnessScore ?? 60;
  // Priority: assessment stage → profile stage
  const stage = stageMap(assessmentData?.stage ?? profile?.motherhood_stage);
  // Priority: prop gaps → assessment gaps/text → score-derived fallback
  const effectiveGaps = useMemo(
    () => gaps ?? resolveGaps(assessmentData, effectiveScore),
    [gaps, assessmentData, effectiveScore]
  );

  const output = useMemo(() => {
    return generateCoachOutput({
      name: assessmentData?.name || profile?.display_name || user?.email?.split('@')[0] || 'friend',
      stage,
      score: effectiveScore,
      gaps: effectiveGaps,
      subscriptionStatus: subscribed ? 'active' : 'inactive',
    });
  }, [user, profile, assessmentData, subscribed, effectiveScore, effectiveGaps, stage]);

  // Persist this rendered message to the user's coach history (deduped inside hook)
  useEffect(() => {
    if (user) logMessage(output, stage, effectiveScore);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [output.coachMessage, user?.id]);

  const urgencyTone = {
    low: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    medium: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    high: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
  }[output.urgencyLevel];

  return (
    <Card className="overflow-hidden border-catalyst-copper/20 bg-gradient-to-br from-background to-catalyst-copper/5">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-[#394a4a]">CM</span>
            <div className="rounded-full bg-[#d3e6e6] w-10 h-10 flex items-center justify-center">
              <UserRound className="h-5 w-5 text-[#394a4a]" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Wellness Coach
              </p>
              <p className="text-sm font-medium capitalize">
                {output.meta.timeOfDay} · {output.meta.state.replace('_', ' ')}
              </p>
            </div>
          </div>
          <Badge variant="outline" className={urgencyTone}>
            {output.urgencyLevel}
          </Badge>
        </div>

        <p className="text-sm leading-relaxed text-foreground">
          {output.coachMessage}
        </p>

        <Button
          onClick={() => navigate(output.suggestedAction.to)}
          className="w-full justify-between"
          variant="default"
        >
          <span className="flex items-center gap-2">
            {output.suggestedAction.locked && !output.meta.isSubscribed && (
              <Lock className="h-3.5 w-3.5" />
            )}
            {output.suggestedAction.label}
          </span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

// Derive a simple priority list from the wellness score.
// Lower score → more gaps surface. This is a safe default;
// callers can override with explicit `gaps`.
function deriveGaps(score: number | undefined): CoachGap[] {
  const s = score ?? 60;
  if (s < 50) return ['stress', 'fitness', 'nutrition', 'sleep'];
  if (s <= 75) return ['fitness', 'nutrition', 'stress'];
  return ['nutrition', 'fitness'];
}

export default PersonalizedCoachCard;
