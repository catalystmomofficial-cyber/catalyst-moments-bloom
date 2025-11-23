import { Exercise } from '@/data/birthBallGuideData';
import { Tables } from '@/integrations/supabase/types';

type ExerciseLog = Tables<'birth_ball_exercise_logs'>;

interface RecommendationAnalysis {
  completedExercises: Set<string>;
  exerciseFrequency: Map<string, number>;
  lastCompletedDate: Date | null;
  totalSessions: number;
  preferredDuration: number;
  recentExercises: string[];
}

export interface ScheduleRecommendation {
  exercise: Exercise;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export function analyzeUserActivity(logs: ExerciseLog[]): RecommendationAnalysis {
  const completedExercises = new Set<string>();
  const exerciseFrequency = new Map<string, number>();
  const recentExercises: string[] = [];
  let totalDuration = 0;
  let lastCompletedDate: Date | null = null;

  // Sort logs by date
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
  );

  sortedLogs.forEach((log, index) => {
    completedExercises.add(log.exercise_id);
    exerciseFrequency.set(log.exercise_id, (exerciseFrequency.get(log.exercise_id) || 0) + 1);
    
    if (log.duration_seconds) {
      totalDuration += log.duration_seconds;
    }

    // Track recent exercises (last 7 days)
    if (index < 10) {
      recentExercises.push(log.exercise_id);
    }

    if (!lastCompletedDate && log.completed_at) {
      lastCompletedDate = new Date(log.completed_at);
    }
  });

  const avgDuration = logs.length > 0 ? totalDuration / logs.length : 600; // Default 10 min

  return {
    completedExercises,
    exerciseFrequency,
    lastCompletedDate,
    totalSessions: new Set(sortedLogs.map(l => l.session_id)).size,
    preferredDuration: avgDuration,
    recentExercises
  };
}

export function generatePersonalizedSchedule(
  allExercises: Exercise[],
  userTrimester: number | null,
  logs: ExerciseLog[],
  dayOfWeek: number = new Date().getDay()
): ScheduleRecommendation[] {
  const analysis = analyzeUserActivity(logs);
  const recommendations: ScheduleRecommendation[] = [];

  // Filter exercises by trimester
  const trimesterExercises = allExercises.filter(ex => 
    ex.trimester === userTrimester || ex.trimester === null
  );

  // 1. NEW EXERCISE: Try something new (high priority)
  const unexplored = trimesterExercises.filter(ex => 
    !analysis.completedExercises.has(ex.id)
  );
  if (unexplored.length > 0) {
    const newExercise = unexplored[Math.floor(Math.random() * unexplored.length)];
    recommendations.push({
      exercise: newExercise,
      reason: "New exercise to expand your routine",
      priority: 'high'
    });
  }

  // 2. UNDERUTILIZED: Exercises completed but rarely (medium priority)
  const underutilized = trimesterExercises.filter(ex => {
    const freq = analysis.exerciseFrequency.get(ex.id) || 0;
    return freq > 0 && freq < 3;
  });
  if (underutilized.length > 0) {
    const exercise = underutilized[Math.floor(Math.random() * underutilized.length)];
    recommendations.push({
      exercise,
      reason: "Build consistency with this exercise",
      priority: 'medium'
    });
  }

  // 3. FAVORITE: Exercise they do often (for confidence)
  let favoriteExercise: Exercise | undefined;
  let maxFreq = 0;
  analysis.exerciseFrequency.forEach((freq, id) => {
    if (freq > maxFreq && !analysis.recentExercises.includes(id)) {
      const exercise = trimesterExercises.find(ex => ex.id === id);
      if (exercise) {
        favoriteExercise = exercise;
        maxFreq = freq;
      }
    }
  });
  if (favoriteExercise) {
    recommendations.push({
      exercise: favoriteExercise,
      reason: "One of your favorites - great for building confidence",
      priority: 'medium'
    });
  }

  // 4. VARIETY: Add another exercise they haven't done recently
  const notRecent = trimesterExercises.filter(ex => 
    !analysis.recentExercises.includes(ex.id) &&
    !recommendations.find(r => r.exercise.id === ex.id)
  );
  if (notRecent.length > 0) {
    const variety = notRecent[Math.floor(Math.random() * Math.min(2, notRecent.length))];
    recommendations.push({
      exercise: variety,
      reason: "Add variety to your practice",
      priority: 'low'
    });
  }

  // 5. FOUNDATIONAL: If user is beginner, always include foundational exercises
  if (analysis.totalSessions < 5) {
    const foundational = trimesterExercises.filter(ex => 
      ex.category === 'foundation' || ex.name.toLowerCase().includes('breathing') ||
      !recommendations.find(r => r.exercise.id === ex.id)
    );
    if (foundational.length > 0) {
      recommendations.push({
        exercise: foundational[0],
        reason: "Essential foundation exercise",
        priority: 'high'
      });
    }
  }

  // Limit to 4-5 exercises and sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return recommendations
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    .slice(0, 5);
}

export function getMotivationalMessage(logs: ExerciseLog[]): string {
  const analysis = analyzeUserActivity(logs);
  
  if (logs.length === 0) {
    return "Welcome! Let's start your birth ball journey today.";
  }

  if (analysis.totalSessions === 1) {
    return "Great start! Let's keep the momentum going.";
  }

  const daysSinceLastPractice = analysis.lastCompletedDate 
    ? Math.floor((Date.now() - analysis.lastCompletedDate.getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  if (daysSinceLastPractice === 0) {
    return "Amazing! You've already practiced today. Keep it up!";
  }

  if (daysSinceLastPractice === 1) {
    return "You practiced yesterday - let's continue the streak!";
  }

  if (daysSinceLastPractice > 7) {
    return "Welcome back! Let's ease into your practice today.";
  }

  if (analysis.totalSessions >= 10) {
    return "You're doing fantastic! Your consistency is inspiring.";
  }

  return "Ready for today's practice? Let's do this!";
}
