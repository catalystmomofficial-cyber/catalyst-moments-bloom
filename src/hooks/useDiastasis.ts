import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type DiastasisUnit = 'fingers' | 'cm';

export interface Measurement {
  id: string;
  measured_on: string;
  value: number;
  unit: DiastasisUnit;
}

export interface DiastasisState {
  latest: Measurement | null;
  first: Measurement | null;
  history: Measurement[];
  /**
   * Change from her first measurement to her latest, in her own unit. Negative
   * means the gap narrowed. Null when there is nothing to compare against —
   * one measurement is a starting point, not a trend.
   */
  changeFromStart: number | null;
}

const EMPTY: DiastasisState = { latest: null, first: null, history: [], changeFromStart: null };

/**
 * Her diastasis measurements.
 *
 * Records what she measured. It does not judge it: no target, no "normal
 * range", no celebration of a smaller number and no alarm at a larger one.
 * Separation varies enormously between women and does not close on a
 * schedule, so a product that scores it would make a quiet week feel like
 * failure. Her provider or pelvic floor physio does the interpreting.
 */
export function useDiastasis(recoveryId: string | null) {
  const { user } = useAuth();
  const [state, setState] = useState<DiastasisState>(EMPTY);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) { setLoading(false); return; }

    let q = supabase
      .from('diastasis_measurements')
      .select('id, measured_on, value, unit')
      .eq('user_id', user.id)
      .order('measured_on', { ascending: false })
      .limit(60);

    // Scoped to the current recovery so a second baby starts a fresh series
    // rather than continuing a line drawn from her first.
    if (recoveryId) q = q.eq('recovery_id', recoveryId);

    const { data, error } = await q;
    if (error || !data) { setLoading(false); return; }

    const history = data as Measurement[];
    const latest = history[0] ?? null;
    const first = history[history.length - 1] ?? null;

    // Only comparable when both were measured the same way. Mixing fingers and
    // centimetres would produce a number that looks like progress and is not.
    const changeFromStart =
      latest && first && latest.id !== first.id && latest.unit === first.unit
        ? Number((latest.value - first.value).toFixed(1))
        : null;

    setState({ latest, first, history, changeFromStart });
    setLoading(false);
  }, [user, recoveryId]);

  useEffect(() => { void load(); }, [load]);

  const record = useCallback(async (value: number, unit: DiastasisUnit) => {
    if (!user) return { error: null };
    const { error } = await supabase
      .from('diastasis_measurements')
      .upsert(
        {
          user_id: user.id,
          recovery_id: recoveryId,
          measured_on: new Date().toISOString().slice(0, 10),
          value,
          unit,
        },
        // Re-measuring today corrects rather than adding a second point — a
        // wobbly self-check repeated twice is not a change.
        { onConflict: 'user_id,measured_on' },
      );
    if (!error) await load();
    return { error };
  }, [user, recoveryId, load]);

  return { ...state, loading, record, reload: load };
}

/** "2.1 cm" / "2 fingers" / "1.5 fingers" */
export const formatMeasurement = (m: Measurement | null): string | null => {
  if (!m) return null;
  if (m.unit === 'cm') return `${m.value} cm`;
  return `${m.value} ${m.value === 1 ? 'finger' : 'fingers'}`;
};
