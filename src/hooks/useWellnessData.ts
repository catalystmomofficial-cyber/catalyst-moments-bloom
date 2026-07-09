import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// App-facing shape (unchanged for every consumer). Trackable metrics are null
// until the user actually logs them so the UI can show "not tracked".
interface WellnessEntry {
  id: string;
  mood_score: number | null;
  energy_level: number | null;
  sleep_hours: number | null;
  stress_level: number | null;
  self_care_completed: boolean;
  hydration_glasses: number;
  created_at: string;
  notes?: string;
}

interface WorkoutSession {
  id: string;
  workout_type: string;
  duration_minutes: number;
  intensity_level: number;
  calories_burned?: number;
  completed_at: string;
}

// Row shape of the Supabase `wellness_entries` table (not yet in generated
// types, so we type it locally and query through an untyped handle).
interface WellnessRow {
  id: string;
  user_id: string;
  entry_date: string;
  mood_rating: number | null;
  sleep_hours: number | string | null;
  energy_level: number | null;
  stress_level: number | null;
  hydration_glasses: number | null;
  self_care_activities: string[] | null;
  notes: string | null;
  created_at: string;
}

const HYDRATION_GOAL = 8;
const wellnessKey = (uid: string) => `wellness_${uid}`;
const workoutsKey = (uid: string) => `workouts_${uid}`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const wellnessTable = () => (supabase as any).from('wellness_entries');

// In-tab pub/sub so every useWellnessData() instance (page cards + trackers)
// refreshes the moment any of them writes — no full page reload needed.
const listeners = new Set<() => void>();
const broadcast = () => listeners.forEach((l) => l());

const localDateStr = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
const isSameLocalDay = (iso: string, ref: Date) =>
  new Date(iso).toDateString() === ref.toDateString();

const rowToEntry = (r: WellnessRow): WellnessEntry => ({
  id: r.id,
  mood_score: r.mood_rating ?? null,
  energy_level: r.energy_level ?? null,
  sleep_hours: r.sleep_hours != null ? Number(r.sleep_hours) : null,
  stress_level: r.stress_level ?? null,
  self_care_completed: Array.isArray(r.self_care_activities) && r.self_care_activities.length > 0,
  hydration_glasses: r.hydration_glasses ?? 0,
  created_at: r.created_at || `${r.entry_date}T12:00:00.000Z`,
  notes: r.notes ?? undefined,
});

// ─── localStorage fallback (used until the migration is run, or if offline) ──
const readLocal = (uid: string): WellnessEntry[] => {
  try {
    const stored = localStorage.getItem(wellnessKey(uid));
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};
const upsertTodayLocal = (uid: string, patch: Partial<WellnessEntry>) => {
  const clean = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined));
  const entries = readLocal(uid);
  const now = new Date();
  const idx = entries.findIndex((e) => isSameLocalDay(e.created_at, now));
  let next: WellnessEntry[];
  if (idx >= 0) {
    next = [{ ...entries[idx], ...clean }, ...entries.slice(0, idx), ...entries.slice(idx + 1)];
  } else {
    next = [{
      id: Date.now().toString(),
      mood_score: null, energy_level: null, sleep_hours: null, stress_level: null,
      self_care_completed: false, hydration_glasses: 0, created_at: now.toISOString(),
      ...clean,
    } as WellnessEntry, ...entries];
  }
  localStorage.setItem(wellnessKey(uid), JSON.stringify(next));
  broadcast();
};

export const useWellnessData = () => {
  const { user } = useAuth();
  const [wellnessEntries, setWellnessEntries] = useState<WellnessEntry[]>([]);
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!user) {
      setWellnessEntries([]);
      setWorkoutSessions([]);
      return;
    }
    // Workouts still live in localStorage (out of scope for this migration).
    try {
      const w = localStorage.getItem(workoutsKey(user.id));
      setWorkoutSessions(w ? JSON.parse(w) : []);
    } catch {
      setWorkoutSessions([]);
    }
    // Wellness: prefer Supabase, fall back to localStorage on any error
    // (e.g. before the migration adds the table constraints).
    try {
      const { data, error } = await wellnessTable()
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false });
      if (error) throw error;
      setWellnessEntries((data as WellnessRow[]).map(rowToEntry));
    } catch {
      setWellnessEntries(readLocal(user.id));
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      await reload();
      if (!cancelled) setLoading(false);
    })();

    listeners.add(reload);
    const onStorage = (e: StorageEvent) => {
      if (e.key === wellnessKey(user.id) || e.key === workoutsKey(user.id)) reload();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      cancelled = true;
      listeners.delete(reload);
      window.removeEventListener('storage', onStorage);
    };
  }, [user, reload]);

  // Merge a patch into today's row (Supabase upsert on user_id+entry_date),
  // falling back to localStorage if the server write fails.
  const upsertToday = async (patch: Record<string, unknown>, localPatch: Partial<WellnessEntry>) => {
    if (!user) return;
    const clean = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined));
    try {
      const { error } = await wellnessTable().upsert(
        { user_id: user.id, entry_date: localDateStr(new Date()), ...clean },
        { onConflict: 'user_id,entry_date' }
      );
      if (error) throw error;
      await reload();
      broadcast();
    } catch {
      upsertTodayLocal(user.id, localPatch);
    }
  };

  const addMoodEntry = async (m: { mood_score: number; energy_level: number; stress_level: number; notes?: string }) =>
    upsertToday(
      { mood_rating: m.mood_score, energy_level: m.energy_level, stress_level: m.stress_level, notes: m.notes },
      { mood_score: m.mood_score, energy_level: m.energy_level, stress_level: m.stress_level, notes: m.notes }
    );

  const addSleepEntry = async (s: { sleep_hours: number; notes?: string }) =>
    upsertToday({ sleep_hours: s.sleep_hours, notes: s.notes }, { sleep_hours: s.sleep_hours, notes: s.notes });

  const addSelfCareEntry = async (notes?: string) =>
    upsertToday(
      { self_care_activities: [notes || 'completed'], notes },
      { self_care_completed: true, notes: notes ?? 'Completed self-care activities' }
    );

  const todayEntry = () => wellnessEntries.find((e) => isSameLocalDay(e.created_at, new Date()));

  const addHydrationGlass = async () => {
    const current = todayEntry()?.hydration_glasses ?? 0;
    const next = Math.min(current + 1, 20);
    return upsertToday({ hydration_glasses: next }, { hydration_glasses: next });
  };

  const setHydrationGlasses = async (glasses: number) => {
    const next = Math.max(0, Math.min(glasses, 20));
    return upsertToday({ hydration_glasses: next }, { hydration_glasses: next });
  };

  const logWorkout = async (workoutData: {
    workout_type: string;
    duration_minutes: number;
    intensity_level: number;
    calories_burned?: number;
  }) => {
    if (!user) return;
    const newWorkout: WorkoutSession = {
      id: Date.now().toString(),
      ...workoutData,
      completed_at: new Date().toISOString(),
    };
    const current = [...workoutSessions, newWorkout];
    localStorage.setItem(workoutsKey(user.id), JSON.stringify(current));
    setWorkoutSessions(current);
    return newWorkout;
  };

  const weeklyWorkoutGoal = 5;
  const weeklyWorkoutProgress = Math.min((workoutSessions.length / weeklyWorkoutGoal) * 100, 100);

  const calcScore = (entry: WellnessEntry): number | null => {
    if (entry.mood_score == null || entry.energy_level == null || entry.stress_level == null) return null;
    return Math.round(((entry.mood_score + entry.energy_level + (10 - entry.stress_level)) / 3) * 10);
  };

  const scorable = wellnessEntries.filter((e) => calcScore(e) != null);
  const wellnessScore = scorable[0] ? calcScore(scorable[0])! : 0;
  const previousWellnessScore = scorable[1] ? calcScore(scorable[1]) : null;
  const wellnessTrend: 'up' | 'down' | 'flat' | null =
    previousWellnessScore == null
      ? null
      : wellnessScore > previousWellnessScore
        ? 'up'
        : wellnessScore < previousWellnessScore
          ? 'down'
          : 'flat';

  return {
    wellnessEntries,
    workoutSessions,
    loading,
    addMoodEntry,
    addSleepEntry,
    addSelfCareEntry,
    addHydrationGlass,
    setHydrationGlasses,
    logWorkout,
    weeklyWorkoutProgress,
    weeklyWorkoutGoal,
    hydrationGoal: HYDRATION_GOAL,
    wellnessScore,
    previousWellnessScore,
    wellnessTrend,
    refreshData: reload,
  };
};
