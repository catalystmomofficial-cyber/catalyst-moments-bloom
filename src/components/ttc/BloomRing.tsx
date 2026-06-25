import { useEffect, useState } from 'react';
import { windowLabel, phaseDescription, type CyclePhase } from '@/hooks/useTTCData';

interface BloomRingProps {
  cycleDay: number | null;
  cycleLength: number;
  phase: CyclePhase | null;
  /** Optional line under the ring, e.g. "12 days until next period". */
  subnote?: string | null;
}

const SIZE = 200;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// On-brand arc colour per phase — fertile window glows the brightest copper.
const PHASE_RING: Record<CyclePhase, string> = {
  menstrual: '#C17F45',     // copper
  follicular: '#D4A76A',    // gold
  ovulation: '#B5651D',     // deep copper — peak fertility
  early_luteal: '#CC9A66',
  late_luteal: '#BE8A5C',
};

const FALLBACK_COLOR = '#C17F45';

/**
 * Animated "Bloom Ring" cycle visualisation. A pulsing glow, a slowly rotating
 * dashed orbit, a progress arc that blooms open on mount, and a leading-edge
 * glow point that sits at the current cycle day. Wired to the real cycle math
 * in useTTCData; falls back to an empty ring with guidance when no cycle is set.
 */
export const BloomRing = ({ cycleDay, cycleLength, phase, subnote }: BloomRingProps) => {
  const hasCycle = cycleDay != null && cycleLength > 0;
  const fraction = hasCycle ? Math.min(cycleDay, cycleLength) / cycleLength : 0;
  const color = phase ? PHASE_RING[phase] : FALLBACK_COLOR;

  // Animate the arc open on mount (and whenever the fraction changes).
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setProgress(fraction));
    return () => cancelAnimationFrame(id);
  }, [fraction]);

  const dashOffset = CIRCUMFERENCE * (1 - progress);

  // Leading-edge glow point: angle around the circle, starting at 12 o'clock.
  const angle = progress * 2 * Math.PI - Math.PI / 2;
  const cx = SIZE / 2 + RADIUS * Math.cos(angle);
  const cy = SIZE / 2 + RADIUS * Math.sin(angle);

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative flex items-center justify-center"
        style={{ width: SIZE, height: SIZE }}
        role="img"
        aria-label={
          hasCycle
            ? `Cycle day ${cycleDay} of ${cycleLength}, ${windowLabel(phase)}`
            : 'Cycle not set yet'
        }
      >
        {/* Pulsing glow */}
        <div
          className="absolute inset-0 rounded-full animate-pulse-intense motion-reduce:animate-none"
          style={{ background: color, opacity: 0.4 }}
          aria-hidden
        />
        {/* Rotating dashed orbit */}
        <div
          className="absolute rounded-full border-4 border-dashed animate-spin-slow motion-reduce:animate-none"
          style={{ inset: 12, borderColor: `${color}4D` }}
          aria-hidden
        />

        {/* Track + progress arc */}
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="absolute inset-0"
          aria-hidden
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#E8E4E1"
            strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
          {/* Leading-edge glow point */}
          {hasCycle && (
            <circle
              cx={cx}
              cy={cy}
              r={6}
              fill={color}
              style={{
                filter: `drop-shadow(0 0 6px ${color})`,
                transition: 'cx 1.8s cubic-bezier(0.4, 0, 0.2, 1), cy 1.8s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          )}
        </svg>

        {/* Centre readout */}
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-1">
            Cycle Day
          </span>
          <span className="text-5xl font-bold leading-none text-foreground">
            {hasCycle ? cycleDay : '—'}
          </span>
          {hasCycle && (
            <div
              className="mt-3 rounded-full border px-3 py-1"
              style={{ background: `${color}1A`, borderColor: `${color}33` }}
            >
              <span className="text-xs font-bold" style={{ color }}>
                {windowLabel(phase)}
              </span>
            </div>
          )}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground text-center">
        {phaseDescription(phase)}
        {subnote ? <> · {subnote}</> : null}
      </p>
    </div>
  );
};
