import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface WellnessEntry {
  id: string;
  mood_score: number;
  energy_level: number;
  sleep_hours: number;
  stress_level: number;
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

export const useWellnessData = () => {
  const { user } = useAuth();
  const [wellnessEntries, setWellnessEntries] = useState<WellnessEntry[]>([]);
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWellnessData = async () => {
    if (!user) return;

    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Load from localStorage for now (until database types are updated)
      const storedWellness = localStorage.getItem(`wellness_${user.id}`);
      const storedWorkouts = localStorage.getItem(`workouts_${user.id}`);
      
      // New accounts start empty — only show real, user-logged data
      const wellness = storedWellness ? JSON.parse(storedWellness) : [];
      const workouts = storedWorkouts ? JSON.parse(storedWorkouts) : [];

      setWellnessEntries(wellness);
      setWorkoutSessions(workouts);
    } catch (error) {
      console.error('Error fetching wellness data:', error);
      setWellnessEntries([]);
      setWorkoutSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const addMoodEntry = async (moodData: {
    mood_score: number;
    energy_level: number;
    stress_level: number;
    notes?: string;
  }) => {
    if (!user) return;

    try {
      const newEntry: WellnessEntry = {
        id: Date.now().toString(),
        mood_score: moodData.mood_score,
        energy_level: moodData.energy_level,
        stress_level: moodData.stress_level,
        notes: moodData.notes,
        sleep_hours: 8,
        self_care_completed: false,
        hydration_glasses: 0,
        created_at: new Date().toISOString(),
      };
      
      const currentEntries = [...wellnessEntries, newEntry];
      setWellnessEntries(currentEntries);
      localStorage.setItem(`wellness_${user.id}`, JSON.stringify(currentEntries));
      
      return newEntry;
    } catch (error) {
      console.error('Error adding mood entry:', error);
      throw error;
    }
  };

  const addSleepEntry = async (sleepData: {
    sleep_hours: number;
    notes?: string;
  }) => {
    if (!user) return;
    const stored = localStorage.getItem(`wellness_${user.id}`);
    const entries: WellnessEntry[] = stored ? JSON.parse(stored) : [];
    const today = new Date().toDateString();
    const idx = entries.findIndex(e => new Date(e.created_at).toDateString() === today);
    if (idx >= 0) {
      entries[idx] = { ...entries[idx], sleep_hours: sleepData.sleep_hours, notes: sleepData.notes || entries[idx].notes };
    } else {
      entries.unshift({
        id: Date.now().toString(),
        mood_score: 7,
        energy_level: 7,
        stress_level: 3,
        sleep_hours: sleepData.sleep_hours,
        self_care_completed: false,
        hydration_glasses: 0,
        created_at: new Date().toISOString(),
        notes: sleepData.notes,
      });
    }
    localStorage.setItem(`wellness_${user.id}`, JSON.stringify(entries));
    setWellnessEntries(entries);
  };

  const addSelfCareEntry = async (notes?: string) => {
    if (!user) return;
    const stored = localStorage.getItem(`wellness_${user.id}`);
    const entries: WellnessEntry[] = stored ? JSON.parse(stored) : [];
    const today = new Date().toDateString();
    const idx = entries.findIndex(e => new Date(e.created_at).toDateString() === today);
    if (idx >= 0) {
      entries[idx] = { ...entries[idx], self_care_completed: true, notes: notes || entries[idx].notes };
    } else {
      entries.unshift({
        id: Date.now().toString(),
        mood_score: 7,
        energy_level: 7,
        stress_level: 3,
        sleep_hours: 8,
        self_care_completed: true,
        hydration_glasses: 0,
        created_at: new Date().toISOString(),
        notes: notes || 'Completed self-care activities',
      });
    }
    localStorage.setItem(`wellness_${user.id}`, JSON.stringify(entries));
    setWellnessEntries(entries);
  };

  const logWorkout = async (workoutData: {
    workout_type: string;
    duration_minutes: number;
    intensity_level: number;
    calories_burned?: number;
  }) => {
    if (!user) return;

    try {
      const newWorkout: WorkoutSession = {
        id: Date.now().toString(),
        workout_type: workoutData.workout_type,
        duration_minutes: workoutData.duration_minutes,
        intensity_level: workoutData.intensity_level,
        calories_burned: workoutData.calories_burned,
        completed_at: new Date().toISOString(),
      };
      
      const currentWorkouts = [...workoutSessions, newWorkout];
      setWorkoutSessions(currentWorkouts);
      localStorage.setItem(`workouts_${user.id}`, JSON.stringify(currentWorkouts));
      
      return newWorkout;
    } catch (error) {
      console.error('Error logging workout:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchWellnessData();
    }
  }, [user]);

  // Calculate weekly workout progress
  const weeklyWorkoutGoal = 5; // Default goal
  const weeklyWorkoutProgress = Math.min((workoutSessions.length / weeklyWorkoutGoal) * 100, 100);

  // Calculate wellness score
  const calcScore = (entry: any) =>
    Math.round(((entry.mood_score + entry.energy_level + (10 - entry.stress_level)) / 3) * 10);

  const latestWellness = wellnessEntries[0];
  const wellnessScore = latestWellness ? calcScore(latestWellness) : 0;

  // Compare to previous entry for trend
  const previousWellness = wellnessEntries[1];
  const previousWellnessScore = previousWellness ? calcScore(previousWellness) : null;
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
    logWorkout,
    weeklyWorkoutProgress,
    weeklyWorkoutGoal,
    wellnessScore,
    previousWellnessScore,
    wellnessTrend,
    refreshData: fetchWellnessData,
  };
};
