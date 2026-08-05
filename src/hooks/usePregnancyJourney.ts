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

interface Snapshot {
  state: PregnancyState;
  journey: JourneyRecord | null;
  loading: boolean;
}

// ── Shared store ────────────────────────────────────────────────────────────
// This hook is used in more than one place at once (the dashboard decides
// which hero to render, HoldingCard and PregnancyOutcomeSettings act on it).
// With per-component state, recording an outcome or leaving holding updated
// only the component that called it — the dashboard kept its stale copy and
// the screen did not change until a manual refresh.
//
// One module-level snapshot with subscribers keeps every caller in step, which
// matters more here than usual: the whole point of this state is that the app
// stops showing pregnancy surfaces the moment she says so. A stale copy is a
// pregnancy tracker still on screen after a loss.
let snapshot: Snapshot = { state: 'none', journey: null, loading: true };
const listeners = new Set<(s: Snapshot) => void>();

const publish = (next: Partial<Snapshot>) => {
  snapshot = { ...snapshot, ...next };
  listeners.forEach((l) => l(snapshot));
};

export function usePregnancyJourney() {
  const { user } = useAuth();
  const [local, setLocal] = useState<Snapshot>(snapshot);

  useEffect(() => {
    listeners.add(setLocal);
    return () => { listeners.delete(setLocal); };
  }, []);

  const load = useCallback(async () => {
    if (!user) { publish({ loading: false }); return; }

    const [{ data: prof }, { data: rows }] = await Promise.all([
      supabase.from('profiles').select('pregnancy_state').eq('user_id', user.id).maybeSingle(),
      supabase
        .from('pregnancy_journeys')
        .select('id, outcome, outcome_at, frozen_week, frozen_day, data_choice, prompt_after')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(1),
    ]);

    publish({
      state: (prof?.pregnancy_state as PregnancyState) ?? 'none',
      journey: (rows?.[0] as JourneyRecord) ?? null,
      loading: false,
    });
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
    if (error) return { error };

    // Publish immediately so the dashboard swaps in the same tick, then
    // reconcile against the server. Waiting only on the round trip left her
    // looking at a pregnancy tracker she had just closed.
    publish({ state: outcome === 'loss' ? 'holding' : 'none' });
    await load();
    return { error: null };
  }, [load]);

  /** Only ever called from a control she pressed. Never on a timer. */
  const leaveHolding = useCallback(async () => {
    const { error } = await supabase.rpc('leave_pregnancy_holding');
    if (error) return { error };

    publish({ state: 'none' });
    await load();
    return { error: null };
  }, [load]);

  return {
    state: local.state,
    journey: local.journey,
    loading: local.loading,
    isHolding: local.state === 'holding',
    recordOutcome,
    leaveHolding,
    reload: load,
  };
}
