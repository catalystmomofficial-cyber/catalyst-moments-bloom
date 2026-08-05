import { describe, it, expect } from 'vitest';
import { analyzeLabor, type ContractionInput } from '../labor';

// These cases ARE the specification. The thresholds in analyzeLabor and in
// supabase/functions/analyze-contractions must both satisfy them; if you change
// one, change the other and re-run this file.
//
// This is the kind of logic that is easy to get right in code and wrong in
// reality, and it cannot be validated by using the app — nobody on the team is
// going to be in labour. Synthetic patterns are the only honest check.

/** Build a run of contractions from explicit gaps, oldest first. */
const fromGaps = (gapsSec: number[], durationSec: number | number[]): ContractionInput[] => {
  let t = 0;
  return gapsSec.map((g, i) => {
    t += g * 1000;
    return {
      startTime: t,
      duration: Array.isArray(durationSec) ? durationSec[i % durationSec.length] : durationSec,
    };
  });
};

describe('analyzeLabor — 5-1-1 classification', () => {
  it('fires READY for established active labour (4 min apart, 70s long)', () => {
    const r = analyzeLabor(fromGaps([240, 240, 250, 235, 245, 240, 250], 70));
    expect(r.state).toBe('READY');
  });

  it('fires READY at exactly 5 minutes with a 65s duration', () => {
    const r = analyzeLabor(fromGaps([300, 295, 305, 300, 290, 310, 300], 65));
    expect(r.state).toBe('READY');
  });

  it('does NOT fire READY for early labour (7 min apart, 45s long)', () => {
    const r = analyzeLabor(fromGaps([420, 400, 450, 380, 430, 410, 440], 45));
    expect(r.state).not.toBe('READY');
  });

  it('does NOT fire READY on interval alone when contractions are short', () => {
    // Every 4 minutes but only 25 seconds long. This is the omission that
    // gets a woman sent home from triage: the duration floor is what catches it.
    const r = analyzeLabor(fromGaps([240, 240, 240, 240, 240, 240], 25));
    expect(r.state).not.toBe('READY');
  });

  it('does NOT fire READY for an irregular pattern that averages 5 minutes', () => {
    // Alternating 2 and 8 minutes averages exactly 300s and the contractions
    // are long enough — only the regularity check can reject this, so it is
    // the case that proves the check earns its place.
    const r = analyzeLabor(fromGaps([120, 480, 120, 480, 120, 480, 120], 70));
    expect(r.avgIntervalSec).toBeCloseTo(300, 0);
    expect(r.state).not.toBe('READY');
  });

  it('still fires READY when intervals drift the way real labour does', () => {
    // 4 to 6 minutes and back. Regularity must not be so tight that normal
    // variation reads as irregular — a false negative keeps her home too long.
    const r = analyzeLabor(fromGaps([240, 270, 300, 330, 300, 270, 240], 70));
    expect(r.state).toBe('READY');
  });

  it('measures interval start-to-start, not end-to-start', () => {
    const r = analyzeLabor(fromGaps([300, 300, 300, 300], 90));
    // If this were measuring the rest gap it would report 210s, not 300s.
    expect(r.avgIntervalSec).toBeCloseTo(300, 0);
  });

  it('returns EARLY below three contractions rather than guessing', () => {
    expect(analyzeLabor(fromGaps([300, 300], 70)).state).toBe('EARLY');
    expect(analyzeLabor([]).state).toBe('EARLY');
  });

  it('is order-independent', () => {
    const asc = fromGaps([240, 240, 250, 235, 245, 240, 250], 70);
    const desc = [...asc].reverse();
    expect(analyzeLabor(desc).state).toBe(analyzeLabor(asc).state);
    expect(analyzeLabor(desc).avgIntervalSec).toBeCloseTo(analyzeLabor(asc).avgIntervalSec, 5);
  });
});
