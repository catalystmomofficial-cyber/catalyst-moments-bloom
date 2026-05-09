import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Lock, ArrowRight } from 'lucide-react';
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

// Map free-text assessment fields to structured CoachGap values.
const textToGaps = (texts: (string | undefined)[]): CoachGap[] => {
  const joined = texts.filter(Boolean).join(' ').toLowerCase();
  const gaps: CoachGap[] = [];
  if (/sleep|tired|fatigue|exhaust/.test(joined)) gaps.push('sleep');
  if (/stress|anxi|overwhelm|mental|mood/.test(joined)) gaps.push('stress');
  if (/nutri|diet|food|eat|nourish/.test(joined)) gaps.push('nutrition');
  if (/fit|exercise|workout|movement|active/.test(joined)) gaps.push('fitness');
  if (/recover|heal|postpartum/.test(joined)) gaps.push('recovery');
  return gaps;
};

interface Props {
  /** Optional override — falls back to assessment / live wellness data */
  score?: number;
  gaps?: CoachGap[];
}

export const PersonalizedCoachCard = ({ score, gaps }: Props) => {
  const { user, profile, subscribed } = useAuth();
  const { wellnessScore } = useWellnessData();
  const { assessmentData, scoreNumber: assessmentScore } = useAssessmentData();
  const navigate = useNavigate();
  const { logMessage } = useCoachHistory(1);

  // Prefer explicit prop → assessment score → live wellness score → default
  const effectiveScore = score ?? assessmentScore ?? wellnessScore ?? 60;

  // Prefer assessment stage → profile motherhood_stage
  const stage = stageMap(assessmentData?.stage ?? profile?.motherhood_stage);

  // Prefer explicit prop → gaps derived from assessment text → score-based fallback
  const effectiveGaps: CoachGap[] = useMemo(() => {
    if (gaps && gaps.length > 0) return gaps;
    const fromAssessment = textToGaps([
      assessmentData?.biggest_obstacle,
      assessmentData?.primary_goal,
    ]);
    return fromAssessment.length > 0 ? fromAssessment : deriveGaps(effectiveScore);
  }, [gaps, assessmentData, effectiveScore]);

  const output = useMemo(() => {
    return generateCoachOutput({
      name: assessmentData?.name || profile?.display_name || user?.email?.split('@')[0] || 'friend',
      stage,
      score: effectiveScore,
      gaps: effectiveGaps,
      subscriptionStatus: subscribed ? 'active' : 'inactive',
    });
  }, [user, profile, assessmentData, subscribed, effectiveScore, effectiveGaps, stage]);

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
            <div className="rounded-full bg-catalyst-copper/10 p-2">
              <Sparkles className="h-4 w-4 text-catalyst-copper" />
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
