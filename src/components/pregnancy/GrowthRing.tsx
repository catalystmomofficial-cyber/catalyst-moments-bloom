import { useEffect, useState } from 'react';
import type { PregnancyProgress } from '@/lib/pregnancy';

interface GrowthRingProps {
  progress: PregnancyProgress | null;
}

const SIZE = 208;
const STROKE = 13;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Unlike RecoveryRing, this ring CLOSES. Recovery has no lap to finish, so its
// arc is deliberately open — but a pregnancy does end, on a date she knows, and
// watching the circle complete is the whole emotional point.

const TRIMESTERS = [
  { label: 'First',  toWeek: 13 },
  { label: 'Second', toWeek: 27 },
  { label: 'Third',  toWeek: 41 },
];

/**
 * Growth mark: a seed that opens into a bloom across 40 weeks.
 *
 * Every competitor draws the baby — fruit comparisons, 3D renders. This draws
 * growth instead, which keeps the weekly moment she expects from Flo and Ovia
 * without borrowing their imagery, and stays inside the brand's own botanical
 * language rather than going pink.
 *
 * Stages are keyed off gestational progress so the drawing is never ahead of or
 * behind the number beside it.
 */
export const GrowthRing = ({ progress }: GrowthRingProps) => {
  const target = progress?.fraction ?? 0;

  // Animate open on mount and whenever the week ticks over.
  const [p, setP] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setP(target));
    return () => cancelAnimationFrame(id);
  }, [target]);

  const dashOffset = CIRCUMFERENCE * (1 - p);

  // Leading point rides the arc at today's position.
  const angle = p * 2 * Math.PI - Math.PI / 2;
  const cx = SIZE / 2 + RADIUS * Math.cos(angle);
  const cy = SIZE / 2 + RADIUS * Math.sin(angle);

  const week = progress?.week ?? 0;
  const triIndex = progress ? TRIMESTERS.findIndex((t) => week < t.toWeek) : -1;
  const activeTri = triIndex === -1 ? 2 : triIndex;

  // Growth staging. Each element eases in over its own window so the plant
  // opens continuously rather than snapping between four fixed pictures.
  const stage = (from: number, to: number) =>
    Math.min(Math.max((p - from) / (to - from), 0), 1);

  const stem = stage(0.04, 0.55);          // rises first
  const leafLow = stage(0.14, 0.38);       // week ~6 onward
  const leafMid = stage(0.34, 0.58);       // week ~14
  const leafHigh = stage(0.52, 0.76);      // week ~21
  const bud = stage(0.68, 0.88);           // week ~27, third trimester
  const bloom = stage(0.84, 1);            // week ~34 to term

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative flex items-center justify-center"
        style={{ width: SIZE, height: SIZE }}
        role="img"
        aria-label={
          progress
            ? `${progress.label}, ${TRIMESTERS[activeTri].label.toLowerCase()} trimester`
            : 'Due date not set yet'
        }
      >
        {/* Calm breathing glow, same language as the other two rings */}
        <div
          className="absolute rounded-full animate-breathe motion-reduce:animate-none"
          style={{
            inset: 16,
            background:
              'radial-gradient(circle, hsl(var(--gestation) / 0.28) 0%, transparent 70%)',
          }}
          aria-hidden
        />

        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="absolute inset-0"
          aria-hidden
        >
          <defs>
            <linearGradient id="growth-arc" x1="0%" y1="100%" x2="70%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--gestation))" />
              <stop offset="62%" stopColor="hsl(var(--gestation))" />
              <stop offset="100%" stopColor="hsl(var(--primary))" />
            </linearGradient>
          </defs>

          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
            fill="none" stroke="hsl(var(--border))" strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
            fill="none"
            stroke="url(#growth-arc)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            style={{ transition: 'stroke-dashoffset 1.9s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
          {progress && (
            <circle
              cx={cx} cy={cy} r={5.5}
              fill="hsl(var(--gestation))"
              style={{
                filter: 'drop-shadow(0 0 7px hsl(var(--gestation)))',
                transition:
                  'cx 1.9s cubic-bezier(0.4, 0, 0.2, 1), cy 1.9s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          )}
        </svg>

        {/* The plant */}
        <svg
          width={104} height={104} viewBox="0 0 100 100"
          className="relative z-10 -mt-4 motion-safe:transition-all"
          aria-hidden
        >
          <g style={{ transition: 'opacity 1.2s ease' }}>
            {/* Seed — always present, the starting point she can see */}
            <ellipse
              cx="50" cy={86 - stem * 2} rx="5.5" ry="4"
              fill="hsl(var(--primary))"
              opacity={0.35 + (1 - stem) * 0.5}
            />

            {/* Stem, drawn upward as the weeks pass */}
            <path
              d="M50 86 L50 30"
              stroke="hsl(var(--gestation))"
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
              strokeDasharray="56"
              strokeDashoffset={56 * (1 - stem)}
              style={{ transition: 'stroke-dashoffset 1.9s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />

            {/* Leaf pairs unfurl one trimester at a time */}
            <g style={{ transition: 'transform 1.6s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 1.2s ease' }}
               transform={`translate(50 72) scale(${leafLow}) translate(-50 -72)`}
               opacity={leafLow}>
              <path d="M50 72 C36 71 30 63 31 54 C43 55 50 62 50 72 Z" fill="hsl(var(--gestation))" opacity="0.55" />
              <path d="M50 72 C64 71 70 63 69 54 C57 55 50 62 50 72 Z" fill="hsl(var(--gestation))" opacity="0.75" />
            </g>

            <g style={{ transition: 'transform 1.6s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 1.2s ease' }}
               transform={`translate(50 58) scale(${leafMid}) translate(-50 -58)`}
               opacity={leafMid}>
              <path d="M50 58 C38 57 33 50 34 42 C44 43 50 49 50 58 Z" fill="hsl(var(--gestation))" opacity="0.6" />
              <path d="M50 58 C62 57 67 50 66 42 C56 43 50 49 50 58 Z" fill="hsl(var(--gestation))" opacity="0.8" />
            </g>

            <g style={{ transition: 'transform 1.6s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 1.2s ease' }}
               transform={`translate(50 46) scale(${leafHigh}) translate(-50 -46)`}
               opacity={leafHigh}>
              <path d="M50 46 C40 45 36 39 37 32 C45 33 50 38 50 46 Z" fill="hsl(var(--gestation))" opacity="0.7" />
              <path d="M50 46 C60 45 64 39 63 32 C55 33 50 38 50 46 Z" fill="hsl(var(--gestation))" opacity="0.9" />
            </g>

            {/* Bud, then the bloom opening around it */}
            <g style={{ transition: 'transform 1.8s cubic-bezier(0.34, 1.25, 0.64, 1), opacity 1.2s ease' }}
               transform={`translate(50 28) scale(${bud}) translate(-50 -28)`}
               opacity={bud}>
              <ellipse cx="50" cy="28" rx="6" ry="9" fill="hsl(var(--primary))" opacity="0.85" />
            </g>

            <g style={{ transition: 'transform 2s cubic-bezier(0.34, 1.25, 0.64, 1), opacity 1.4s ease' }}
               transform={`translate(50 26) scale(${bloom}) translate(-50 -26)`}
               opacity={bloom}>
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <ellipse
                  key={deg}
                  cx="50" cy="17" rx="5" ry="9.5"
                  fill="hsl(var(--primary))"
                  opacity="0.72"
                  transform={`rotate(${deg} 50 26)`}
                />
              ))}
              <circle cx="50" cy="26" r="4.6" fill="hsl(var(--gestation))" />
            </g>
          </g>
        </svg>

        {/* Week readout, sat under the plant inside the ring */}
        <div className="absolute bottom-[30px] left-0 right-0 flex flex-col items-center">
          {progress ? (
            <>
              <span className="text-[26px] font-bold leading-none text-foreground tabular-nums">
                {progress.week}
                <span className="text-sm font-semibold text-muted-foreground">
                  +{progress.dayOfWeek}
                </span>
              </span>
              <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                weeks
              </span>
            </>
          ) : (
            <span className="px-8 text-center text-xs font-medium leading-snug text-muted-foreground">
              Add your due date
            </span>
          )}
        </div>
      </div>

      {/* Trimester sequence — same pip language as RecoveryRing's phases */}
      <div className="mt-5 flex items-center gap-1.5" aria-hidden>
        {TRIMESTERS.map((t, i) => (
          <span
            key={t.label}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: i === activeTri && progress ? 30 : 12,
              background: progress && i <= activeTri
                ? 'hsl(var(--gestation))'
                : 'hsl(var(--border))',
              opacity: i === activeTri ? 1 : i < activeTri ? 0.45 : 1,
            }}
          />
        ))}
      </div>

      {progress && (
        <p className="mt-3 text-center text-sm font-medium text-foreground">
          {TRIMESTERS[activeTri].label} trimester
          {!progress.isOverdue && (
            <span className="text-muted-foreground font-normal">
              {' · '}{progress.daysRemaining} days to go
            </span>
          )}
        </p>
      )}
    </div>
  );
};

export default GrowthRing;
