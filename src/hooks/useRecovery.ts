import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  getBirthDate as localBirthDate,
  setBirthDate as setLocalBirthDate,
  readCheckIns as readLocalCheckIns,
  localDateKey,
  type RecoveryCheckIn,
  type RecoveryMood,
} from '@/lib/recovery';

export interface BirthRecord {
  id: string;
  birth_date: string;
  birth_type: string | null;
  baby_count: number;
  outcome?: string | null;
}

/**
 * Her recovery, from the server.
 *
 * Both the birth date and every check-in used to live in localStorage alone,
 * so a new phone erased how many weeks postpartum she was and reset the
 * safety nudge that watches for a run of hard days. localStorage is kept as a
 * first-paint and offline cache; the database is the record.
 */
export function useRecovery() {
  const { user } = useAuth();
  const [birth, setBirth] = useState<BirthRecord | null>(null);
  const [recoveryId, setRecoveryId] = useState<string | null>(null);
  const [checkIns, setCheckIns] = useState<RecoveryCheckIn[]>(() => readLocalCheckIns());
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) { setLoading(false); return; }

    const [{ data: b }, { data: c }] = await Promise.all([
      // The ACTIVE RECOVERY is the question, not "an unarchived birth". A
      // birth is never archived — it happened — so archived_at lives on the
      // recovery and that is what decides which timeline is current.
      supabase
        .from('recoveries')
        .select('id, started_at, births!inner(id, birth_date, birth_type, baby_count, outcome)')
        .eq('user_id', user.id)
        .is('archived_at', null)
        .limit(1),
      supabase
        .from('recovery_checkins')
        .select('date, mood, created_at')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(120),
    ]);

    const row = b?.[0] as { id: string; births: BirthRecord } | undefined;
    if (row?.births) {
      setBirth(row.births);
      setRecoveryId(row.id);
      // Heal the local cache so an offline first paint is not stale.
      setLocalBirthDate(row.births.birth_date);
    }

    if (c) {
      const remote: RecoveryCheckIn[] = c.map((r) => ({
        date: r.date as string,
        mood: r.mood as RecoveryMood,
        at: r.created_at as string,
      }));
      // Merge by date rather than replacing: a check-in tapped with no signal
      // is only in localStorage and must not vanish when the server responds.
      setCheckIns((local) => {
        const byDate = new Map<string, RecoveryCheckIn>();
        for (const ci of [...remote, ...local]) byDate.set(ci.date, ci);
        return [...byDate.values()].sort((x, y) => y.date.localeCompare(x.date));
      });
    }

    setLoading(false);
  }, [user]);

  useEffect(() => { void load(); }, [load]);

  /**
   * Record or correct a birth date.
   *
   * Correcting must UPDATE the existing row — calling record_birth again would
   * archive the current recovery and start a second one, which is the
   * behaviour reserved for an actual second baby.
   */
  const saveBirth = useCallback(async (
    birthDate: string,
    opts?: { birthType?: string; babyCount?: number; outcome?: string },
  ) => {
    setLocalBirthDate(birthDate);
    if (!user) return { error: null };

    if (birth) {
      const { error } = await supabase
        .from('births')
        .update({
          birth_date: birthDate,
          ...(opts?.birthType ? { birth_type: opts.birthType } : {}),
          ...(opts?.babyCount ? { baby_count: opts.babyCount } : {}),
        })
        .eq('id', birth.id);
      if (!error) await load();
      return { error };
    }

    const { error } = await supabase.rpc('record_birth', {
      p_birth_date: birthDate,
      p_birth_type: opts?.birthType ?? null,
      p_baby_count: opts?.babyCount ?? 1,
      p_outcome: opts?.outcome ?? 'live',
    });
    if (!error) await load();
    return { error };
  }, [user, birth, load]);

  /** One tap a day. Re-tapping the same day updates rather than stacking. */
  const checkIn = useCallback(async (mood: RecoveryMood) => {
    const date = localDateKey(new Date());
    const entry: RecoveryCheckIn = { date, mood, at: new Date().toISOString() };
    setCheckIns((prev) => [entry, ...prev.filter((c) => c.date !== date)]);

    if (!user) return { error: null };
    const { error } = await supabase
      .from('recovery_checkins')
      .upsert(
        { user_id: user.id, birth_id: birth?.id ?? null, recovery_id: recoveryId, date, mood },
        { onConflict: 'user_id,date' },
      );
    return { error };
  }, [user, birth, recoveryId]);

  /**
   * One-time lift of the localStorage era into the database.
   *
   * Runs silently, never blocks the UI, and only clears the local keys after
   * the server has confirmed — a migration that deletes first and fails second
   * would lose exactly the timeline it was meant to rescue.
   */
  useEffect(() => {
    if (loading || !user || birth) return;
    const local = localBirthDate();
    if (!local) return;

    let cancelled = false;
    (async () => {
      const { error } = await supabase.rpc('record_birth', {
        p_birth_date: local,
        p_birth_type: 'unknown',   // she can correct it later
        p_baby_count: 1,
        p_outcome: 'live',
      });
      if (cancelled || error) return;

      // Carry her check-ins across before touching the local copy.
      const localCheckIns = readLocalCheckIns();
      if (localCheckIns.length > 0) {
        await supabase.from('recovery_checkins').upsert(
          localCheckIns.map((c) => ({ user_id: user.id, date: c.date, mood: c.mood })),
          { onConflict: 'user_id,date' },
        );
      }
      await load();
    })();
    return () => { cancelled = true; };
  }, [loading, user, birth, load]);

  return {
    birth,
    recoveryId,
    /** True when a recovery is already running — drives the second-birth confirm. */
    hasActiveRecovery: Boolean(recoveryId),
    /** Falls back to the local cache so an offline first paint still works. */
    birthDate: birth?.birth_date ?? localBirthDate(),
    checkIns,
    loading,
    saveBirth,
    checkIn,
    reload: load,
  };
}
