import { useEffect, useState } from 'react';
import { RECOVERY_PHASES, recoveryCount, type RecoveryPhase } from '@/lib/recovery';

interface RecoveryRingProps {
  /** Whole days postpartum, or null when she hasn't set a date yet. */
  dayPostpartum: number | null;
  phase: RecoveryPhase;
}

const SIZE = 208;
const STROKE = 13;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// The ring is deliberately OPEN — a 280° arc with a gap at the bottom, not a
// closed circle. A cycle loops; a recovery doesn't. The gap is the point: there
// is no lap to finish, and nothing here should imply she's behind on one.
const SWEEP = 0.78; // 280° of the circle
const GAP_ROTATION = 90 + (1 - SWEEP) * 180; // centre the gap at the bottom

/**
 * "Your Recovery" ring. Shows where she is inside her current recovery phase,
 * with the full phase sequence as pips beneath — movement she can see without
 * a percentage telling her how "done" healing is supposed to be.
 */
export const RecoveryRing = ({ dayPostpartum, phase }: RecoveryRingProps) => {
  const hasDate = dayPostpartum != null;
  const count = hasDate ? recoveryCount(dayPostpartum) : null;

  // Position inside the CURRENT phase (not the whole year) so the arc always
  // shows honest, visible movement instead of a demoralising sliver at week 2.
  const span = phase.toDay === Infinity ? 365 : phase.toDay - phase.fromDay;
  const within = hasDate ? Math.min(Math.max(dayPostpartum - phase.fromDay, 0), span) : 0;
  const fraction = hasDate ? within / span : 0;

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setProgress(fraction));
    return () => cancelAnimationFrame(id);
  }, [fraction]);

  const arcLength = CIRCUMFERENCE * SWEEP;
  const dashOffset = CIRCUMFERENCE - arcLength * progress;

  // Leading point, tracked along the visible arc.
  const angle = (GAP_ROTATION + progress * SWEEP * 360) * (Math.PI / 180);
  const cx = SIZE / 2 + RADIUS * Math.cos(angle);
  const cy = SIZE / 2 + RADIUS * Math.sin(angle);

  const phaseIndex = RECOVERY_PHASES.findIndex((p) => p.id === phase.id);

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative flex items-center justify-center"
        style={{ width: SIZE, height: SIZE }}
        role="img"
        aria-label={
          hasDate && count
            ? `${count.value} ${count.unit} postpartum, ${phase.label}`
            : `${phase.label} — birth date not set`
        }
      >
        {/* Slow breathing glow — calm, never a monitor */}
        <div
          className="absolute rounded-full animate-breathe motion-reduce:animate-none"
          style={{
            inset: 18,
            background:
              'radial-gradient(circle, hsl(var(--recovery) / 0.30) 0%, transparent 70%)',
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
            {/* Copper → violet: the brand walking into the recovery accent */}
            <linearGradient id="recovery-arc" x1="0%" y1="100%" x2="80%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="38%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--recovery))" />
            </linearGradient>
          </defs>

          {/* Track — the open arc she's travelling */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${CIRCUMFERENCE}`}
            transform={`rotate(${GAP_ROTATION} ${SIZE / 2} ${SIZE / 2})`}
          />
          {/* Progress within this phase */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="url(#recovery-arc)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform={`rotate(${GAP_ROTATION} ${SIZE / 2} ${SIZE / 2})`}
            style={{ transition: 'stroke-dashoffset 1.9s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
          {hasDate && (
            <circle
              cx={cx}
              cy={cy}
              r={5.5}
              fill="hsl(var(--recovery))"
              style={{
                filter: 'drop-shadow(0 0 7px hsl(var(--recovery)))',
                transition:
                  'cx 1.9s cubic-bezier(0.4, 0, 0.2, 1), cy 1.9s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          )}
        </svg>

        {/* Centre readout */}
        <div className="relative z-10 flex flex-col items-center px-8 text-center">
          {hasDate && count ? (
            <>
              <span className="text-5xl font-bold leading-none text-foreground">
                {count.value}
              </span>
              <span className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {count.unit} postpartum
              </span>
            </>
          ) : (
            <span className="text-sm font-medium leading-snug text-muted-foreground">
              {phase.label}
            </span>
          )}
        </div>
      </div>

      {/* Phase sequence — where this stretch sits in the whole journey */}
      <div className="mt-5 flex items-center gap-1.5" aria-hidden>
        {RECOVERY_PHASES.map((p, i) => (
          <span
            key={p.id}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: i === phaseIndex ? 26 : 10,
              background:
                i <= phaseIndex ? 'hsl(var(--primary))' : 'hsl(var(--border))',
              opacity: i === phaseIndex ? 1 : i < phaseIndex ? 0.45 : 1,
            }}
          />
        ))}
      </div>

      <p className="mt-3 text-center text-sm font-medium text-foreground">{phase.label}</p>
    </div>
  );
};

export default RecoveryRing;
