import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type PregnancyState = 'none' | 'active' | 'holding';

export interface JourneyRecord {
  id: string;
  outcome: 'birth' | 'loss' | null;
  outcome_at: string | null;
  frozen_week: number | null;
  frozen_day: number | null;
  data_choice: 'keep' | 'export' | 'delete' | null;
  prompt_after: string | null;
}

/**
 * Where she is, and how a pregnancy ended if it did.
 *
 * Holding is the state after a loss. It is not a stage — stages progress and
 * this one does not. Nothing in the app may move her out of it: no timer, no
 * "it's been six weeks, are you ready?", no default. Only she leaves, and only
 * when she says so.
 */
export function usePregnancyJourney() {
  const { user } = useAuth();
  const [state, setState] = useState<PregnancyState>('none');
  const [journey, setJourney] = useState<JourneyRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) { setLoading(false); return; }

    const [{ data: prof }, { data: rows }] = await Promise.all([
      supabase.from('profiles').select('pregnancy_state').eq('user_id', user.id).maybeSingle(),
      supabase
        .from('pregnancy_journeys')
        .select('id, outcome, outcome_at, frozen_week, frozen_day, data_choice, prompt_after')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(1),
    ]);

    setState(((prof?.pregnancy_state as PregnancyState) ?? 'none'));
    setJourney((rows?.[0] as JourneyRecord) ?? null);
    setLoading(false);
  }, [user]);

  useEffect(() => { void load(); }, [load]);

  /**
   * Close the current journey. One RPC, not three client writes: a journey
   * closed while profiles.pregnancy_state still said 'active' is exactly the
   * state that sends a week-by-week push after a loss.
   */
  const recordOutcome = useCallback(async (
    outcome: 'birth' | 'loss',
    frozen?: { week: number; day: number },
  ) => {
    const { error } = await supabase.rpc('record_pregnancy_outcome', {
      p_outcome: outcome,
      p_week: frozen?.week ?? undefined,
      p_day: frozen?.day ?? undefined,
    });
    if (!error) await load();
    return { error };
  }, [load]);

  /** Only ever called from a control she pressed. Never on a timer. */
  const leaveHolding = useCallback(async () => {
    const { error } = await supabase.rpc('leave_pregnancy_holding');
    if (!error) await load();
    return { error };
  }, [load]);

  return {
    state,
    journey,
    loading,
    isHolding: state === 'holding',
    recordOutcome,
    leaveHolding,
    reload: load,
  };
}
