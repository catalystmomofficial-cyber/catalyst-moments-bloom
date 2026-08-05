// Labour pattern analysis — the on-device fallback.
//
// The SERVER is the source of truth (supabase/functions/analyze-contractions).
// This exists only for when it is unreachable, which during labour is a real
// possibility: cars, car parks, hospital basements. The two must stay in step,
// and labor.test.ts is the contract that says what "in step" means — if you
// change a threshold here, change it there and re-run the tests.
//
// Not a medical device. This describes a pattern; her provider decides.

export type LaborState = 'EARLY' | 'BUILDING' | 'PREPARE' | 'READY';

export interface ContractionInput {
  /** Epoch ms when the contraction began. */
  startTime: number;
  /** Seconds. */
  duration: number;
}

const average = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
const variance = (a: number[]) => {
  const m = average(a);
  return average(a.map((x) => (x - m) ** 2));
};

/** Severity order, for escalate-only reconciliation against the server. */
export const SEVERITY: Record<LaborState, number> = {
  EARLY: 0, BUILDING: 1, PREPARE: 2, READY: 3,
};

export interface LaborAnalysis {
  state: LaborState;
  /** Seconds, START of one contraction to START of the next. */
  avgIntervalSec: number;
  /** Seconds. */
  avgDurationSec: number;
  /** Standard deviation of intervals, in seconds. */
  intervalSdSec: number;
}

export function analyzeLabor(contractions: ContractionInput[]): LaborAnalysis {
  const empty = { state: 'EARLY' as LaborState, avgIntervalSec: 0, avgDurationSec: 0, intervalSdSec: 0 };
  if (contractions.length < 3) return empty;

  // Oldest first, so intervals come out positive regardless of how the caller
  // ordered them.
  const sorted = [...contractions].sort((a, b) => a.startTime - b.startTime);

  // START to START. This is what the "5" in 5-1-1 means. Measuring the gap
  // between the END of one and the START of the next gives a smaller number
  // and silently over-escalates.
  const intervals: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    intervals.push((sorted[i].startTime - sorted[i - 1].startTime) / 1000);
  }
  if (intervals.length === 0) return empty;

  const avgIntervalSec = average(intervals);
  const avgDurationSec = average(sorted.map((c) => c.duration));
  const intervalSdSec = Math.sqrt(variance(intervals));

  // All three parts of 5-1-1: five minutes apart, a minute long, holding
  // steady. The duration floor is the part most timers omit — contractions
  // every five minutes lasting twenty seconds are early labour, and sending
  // her in on interval alone gets her sent home.
  //
  // The 90-second regularity allowance is deliberately loose. Validated
  // against synthetic patterns: steady labour runs at a standard deviation
  // around 6-30s, genuinely irregular pre-labour at 120-180s. 90 sits in a
  // wide gap, so the classification does not hinge on the exact figure.
  let state: LaborState = 'EARLY';
  if (avgIntervalSec <= 300 && avgDurationSec >= 60 && intervalSdSec <= 90) state = 'READY';
  else if (avgIntervalSec <= 360 && avgDurationSec >= 50) state = 'PREPARE';
  else if (avgIntervalSec <= 480) state = 'BUILDING';

  return { state, avgIntervalSec, avgDurationSec, intervalSdSec };
}
