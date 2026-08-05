import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePregnancyJourney } from '@/hooks/usePregnancyJourney';

const DISMISS_KEY = 'cm_holding_next_dismissed';

/**
 * Holding — where she is after a loss.
 *
 * Not a stage. Stages progress; this does not. The ring is frozen at the last
 * week it drew, the glow is soft, and every number that measured the pregnancy
 * is gone — no week counter, no trimester, no days remaining. Nothing here
 * counts, celebrates, or asks anything of her.
 *
 * There is no default duration. Two days or two years. The app never suggests
 * she leave, and there is deliberately no "it's been six weeks, are you ready
 * to try again?" anywhere in this file or anything that calls it. That prompt
 * is the thing that gets apps deleted and talked about.
 */
export const HoldingCard = () => {
  const { journey, leaveHolding } = usePregnancyJourney();
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(DISMISS_KEY) === '1'; } catch { return false; }
  });
  const [showOptions, setShowOptions] = useState(false);

  const week = journey?.frozen_week ?? null;

  // The frozen ring. Rendered here rather than by GrowthRing because this one
  // must never animate, never advance, and never show a leading point — a
  // travelling dot implies something still in motion.
  const fraction = week != null ? Math.min(week / 40, 1) : 0.35;
  const SIZE = 176, STROKE = 11, R = (SIZE - STROKE) / 2;
  const C = 2 * Math.PI * R;

  const dismissForever = () => {
    setDismissed(true);
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch { /* private mode */ }
  };

  return (
    <Card>
      <CardContent className="flex flex-col items-center py-8">
        <div
          className="relative flex items-center justify-center"
          style={{ width: SIZE, height: SIZE }}
          role="img"
          aria-label="Your journey, held"
        >
          {/* Softened glow. No breathing animation — stillness is the point. */}
          <div
            className="absolute rounded-full"
            style={{
              inset: 14,
              background:
                'radial-gradient(circle, hsl(var(--gestation) / 0.12) 0%, transparent 70%)',
            }}
            aria-hidden
          />
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden>
            <circle
              cx={SIZE / 2} cy={SIZE / 2} r={R}
              fill="none" stroke="hsl(var(--border))" strokeWidth={STROKE}
            />
            <circle
              cx={SIZE / 2} cy={SIZE / 2} r={R}
              fill="none"
              stroke="hsl(var(--gestation) / 0.45)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - fraction)}
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            />
            {/* The plant, held at its last state. Muted, not greyed out —
                this was real and it is not being erased. */}
            <g opacity="0.5" transform={`translate(${SIZE / 2 - 50} ${SIZE / 2 - 46})`}>
              <path
                d="M50 86 L50 40"
                stroke="hsl(var(--gestation))" strokeWidth="2.4"
                strokeLinecap="round" fill="none"
              />
              <path d="M50 72 C36 71 30 63 31 54 C43 55 50 62 50 72 Z" fill="hsl(var(--gestation))" opacity=".5" />
              <path d="M50 72 C64 71 70 63 69 54 C57 55 50 62 50 72 Z" fill="hsl(var(--gestation))" opacity=".7" />
              {fraction > 0.34 && (
                <>
                  <path d="M50 58 C38 57 33 50 34 42 C44 43 50 49 50 58 Z" fill="hsl(var(--gestation))" opacity=".5" />
                  <path d="M50 58 C62 57 67 50 66 42 C56 43 50 49 50 58 Z" fill="hsl(var(--gestation))" opacity=".7" />
                </>
              )}
            </g>
          </svg>
        </div>

        {/* No week. No trimester. No countdown. The numbers that measured the
            pregnancy stop measuring. */}
        <p className="mt-6 text-center text-sm text-muted-foreground max-w-xs">
          Your journey is held here, exactly as it was.
        </p>

        {/* The coach, present rather than pushing. PersonalizedCoachCard is
            suppressed in holding because it is a nudge engine — its own copy
            says "Gentle nudge" and rates her support level. This replaces it
            with the one thing that belongs: a door she opens, that never
            opens itself. No score, no streak, no suggested action. */}
        <Link
          to="/wellness?coach=1"
          className="mt-6 w-full max-w-sm rounded-lg border p-4 text-center transition-colors hover:bg-muted/40"
        >
          <span className="text-sm font-medium">Your coach is here</span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Whenever you want to talk. No agenda.
          </span>
        </Link>

        {!dismissed && !showOptions && (
          <div className="mt-6 w-full max-w-sm rounded-lg border p-3 flex items-center gap-2">
            <button
              className="flex-1 text-left text-sm hover:underline"
              onClick={() => setShowOptions(true)}
            >
              When you're ready, here's what's next.
            </button>
            <Button
              variant="ghost" size="icon"
              aria-label="Dismiss"
              onClick={dismissForever}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {showOptions && (
          <div className="mt-6 w-full max-w-sm space-y-2">
            <Button
              variant="outline" className="w-full"
              onClick={() => { void leaveHolding(); }}
            >
              I'd like to try again
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => setShowOptions(false)}>
              I'm not ready
            </Button>
            <p className="pt-1 text-center text-xs text-muted-foreground">
              There's no rush, and we won't ask again.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HoldingCard;
