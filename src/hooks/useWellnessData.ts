import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface WellnessEntry {
  id: string;
  // Trackable metrics are null until the user actually logs them, so the UI
  // can distinguish "not tracked yet" from a real value.
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

const HYDRATION_GOAL = 8;

const wellnessKey = (uid: string) => `wellness_${uid}`;
const workoutsKey = (uid: string) => `workouts_${uid}`;

// In-tab pub/sub so every useWellnessData() instance (page cards + trackers)
// stays in sync the moment any of them writes — without a full page reload.
const listeners = new Set<() => void>();
const broadcast = () => listeners.forEach((l) => l());

const readEntries = (uid: string): WellnessEntry[] => {
  try {
    const stored = localStorage.getItem(wellnessKey(uid));
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const writeEntries = (uid: string, entries: WellnessEntry[]) => {
  localStorage.setItem(wellnessKey(uid), JSON.stringify(entries));
  broadcast();
};

const isSameLocalDay = (iso: string, ref: Date) =>
  new Date(iso).toDateString() === ref.toDateString();

// Merge a patch into today's entry (creating it if needed) and keep the list
// newest-first, one entry per day. Strips undefined keys so we never clobber
// an existing value (e.g. logging sleep must not wipe today's mood/notes).
const upsertToday = (uid: string, patch: Partial<WellnessEntry>): WellnessEntry => {
  const clean = Object.fromEntries(
    Object.entries(patch).filter(([, v]) => v !== undefined)
  ) as Partial<WellnessEntry>;

  const entries = readEntries(uid);
  const now = new Date();
  const idx = entries.findIndex((e) => isSameLocalDay(e.created_at, now));

  let next: WellnessEntry[];
  if (idx >= 0) {
    const merged = { ...entries[idx], ...clean };
    next = [merged, ...entries.slice(0, idx), ...entries.slice(idx + 1)];
  } else {
    const fresh: WellnessEntry = {
      id: Date.now().toString(),
      mood_score: null,
      energy_level: null,
      sleep_hours: null,
      stress_level: null,
      self_care_completed: false,
      hydration_glasses: 0,
      created_at: now.toISOString(),
      ...clean,
    };
    next = [fresh, ...entries];
  }

  writeEntries(uid, next);
  return next[0];
};

export const useWellnessData = () => {
  const { user } = useAuth();
  const [wellnessEntries, setWellnessEntries] = useState<WellnessEntry[]>([]);
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    if (!user) {
      setWellnessEntries([]);
      setWorkoutSessions([]);
      return;
    }
    setWellnessEntries(readEntries(user.id));
    try {
      const w = localStorage.getItem(workoutsKey(user.id));
      setWorkoutSessions(w ? JSON.parse(w) : []);
    } catch {
      setWorkoutSessions([]);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    reload();
    setLoading(false);

    // Refresh this instance whenever any other instance writes (same tab),
    // or when another tab updates localStorage.
    listeners.add(reload);
    const onStorage = (e: StorageEvent) => {
      if (e.key === wellnessKey(user.id) || e.key === workoutsKey(user.id)) reload();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(reload);
      window.removeEventListener('storage', onStorage);
    };
  }, [user, reload]);

  const addMoodEntry = async (moodData: {
    mood_score: number;
    energy_level: number;
    stress_level: number;
    notes?: string;
  }) => {
    if (!user) return;
    return upsertToday(user.id, {
      mood_score: moodData.mood_score,
      energy_level: moodData.energy_level,
      stress_level: moodData.stress_level,
      notes: moodData.notes,
    });
  };

  const addSleepEntry = async (sleepData: { sleep_hours: number; notes?: string }) => {
    if (!user) return;
    return upsertToday(user.id, {
      sleep_hours: sleepData.sleep_hours,
      notes: sleepData.notes,
    });
  };

  const addSelfCareEntry = async (notes?: string) => {
    if (!user) return;
    return upsertToday(user.id, {
      self_care_completed: true,
      notes: notes ?? 'Completed self-care activities',
    });
  };

  // Add one glass of water to today's total (capped generously above the goal).
  const addHydrationGlass = async () => {
    if (!user) return;
    const today = readEntries(user.id).find((e) => isSameLocalDay(e.created_at, new Date()));
    const current = today?.hydration_glasses ?? 0;
    return upsertToday(user.id, { hydration_glasses: Math.min(current + 1, 20) });
  };

  const setHydrationGlasses = async (glasses: number) => {
    if (!user) return;
    return upsertToday(user.id, { hydration_glasses: Math.max(0, Math.min(glasses, 20)) });
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

  // Weekly workout progress
  const weeklyWorkoutGoal = 5;
  const weeklyWorkoutProgress = Math.min((workoutSessions.length / weeklyWorkoutGoal) * 100, 100);

  // Wellness score from the most recent entry that has a full mood check-in.
  const calcScore = (entry: WellnessEntry): number | null => {
    if (entry.mood_score == null || entry.energy_level == null || entry.stress_level == null) {
      return null;
    }
    return Math.round(((entry.mood_score + entry.energy_level + (10 - entry.stress_level)) / 3) * 10);
  };

  const latestScorable = wellnessEntries.find((e) => calcScore(e) != null);
  const wellnessScore = latestScorable ? calcScore(latestScorable)! : 0;

  const previousScorable = wellnessEntries.filter((e) => calcScore(e) != null)[1];
  const previousWellnessScore = previousScorable ? calcScore(previousScorable) : null;
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
