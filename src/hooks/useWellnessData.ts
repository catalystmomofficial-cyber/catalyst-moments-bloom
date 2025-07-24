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
      
      const wellness = storedWellness ? JSON.parse(storedWellness) : [];
      const workouts = storedWorkouts ? JSON.parse(storedWorkouts) : [
        // Default sample data to show functionality
        {
          id: '1',
          workout_type: 'Postpartum Core',
          duration_minutes: 15,
          intensity_level: 6,
          calories_burned: 45,
          completed_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          workout_type: 'Prenatal Yoga',
          duration_minutes: 20,
          intensity_level: 4,
          calories_burned: 35,
          completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          workout_type: 'Energy Boost',
          duration_minutes: 10,
          intensity_level: 7,
          calories_burned: 25,
          completed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

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
  const latestWellness = wellnessEntries[0];
  const wellnessScore = latestWellness 
    ? Math.round(
        (latestWellness.mood_score + 
         latestWellness.energy_level + 
         (10 - latestWellness.stress_level)) / 3 * 10
      )
    : 0;

  return {
    wellnessEntries,
    workoutSessions,
    loading,
    addMoodEntry,
    logWorkout,
    weeklyWorkoutProgress,
    weeklyWorkoutGoal,
    wellnessScore,
    refreshData: fetchWellnessData,
  };
};