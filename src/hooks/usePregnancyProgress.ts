import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { pregnancyProgress, type PregnancyProgress } from '@/lib/pregnancy';

const LOCAL_KEY = 'cm_due_date';

/**
 * Her real gestational progress, from her real due date.
 *
 * profiles.delivery_date already existed in the schema and was never read or
 * written by anything. It is the source of truth here; localStorage is only a
 * first-paint cache so the week number does not flash empty on load. That
 * ordering matters — the postpartum side keeps its birth date in localStorage
 * alone, which means it is wrong on every other device she signs in from.
 */
export function usePregnancyProgress() {
  const { user } = useAuth();

  const [dueDate, setDueDateState] = useState<string | null>(() => {
    try { return localStorage.getItem(LOCAL_KEY); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('delivery_date')
        .eq('user_id', user.id)
        .maybeSingle();

      if (cancelled) return;
      if (!error && data?.delivery_date) {
        setDueDateState(data.delivery_date);
        try { localStorage.setItem(LOCAL_KEY, data.delivery_date); } catch { /* private mode */ }
      }
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [user]);

  const saveDueDate = useCallback(async (isoDate: string) => {
    setDueDateState(isoDate);
    try { localStorage.setItem(LOCAL_KEY, isoDate); } catch { /* private mode */ }

    if (!user) return { error: null };
    const { error } = await supabase
      .from('profiles')
      .update({ delivery_date: isoDate })
      .eq('user_id', user.id);

    if (error) console.error('Failed to save due date:', error);
    return { error };
  }, [user]);

  // Recomputed per render from the date, never stored as state — a week number
  // held in state is a week number that goes stale at midnight.
  const progress: PregnancyProgress | null = useMemo(
    () => pregnancyProgress(dueDate),
    [dueDate],
  );

  return {
    dueDate,
    progress,
    loading,
    saveDueDate,
    /** True when we have a date but it could not be read as a plausible pregnancy. */
    needsDate: !loading && !progress,
  };
}
