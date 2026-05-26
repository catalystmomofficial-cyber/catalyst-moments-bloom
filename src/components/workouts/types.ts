export interface Exercise {
  id: string;
  name: string;
  duration: number; // in seconds
  reps?: string;
  description: string;
  instructions: string[];
  videoUrl?: string;
  completed: boolean;
}

export interface WorkoutPlayerProps {
  week: number;
  day: number;
  onComplete: () => void;
  onBack: () => void;
}

export interface VideoPlayerProps {
  videoUrl?: string;
  title: string;
  thumbnail?: string;
  remoteMeta?: {
    program?: string;
    exerciseIndex?: number;
    totalExercises?: number;
    exerciseName?: string;
  };
  onRemoteAction?: (action: { type: 'next' | 'prev' | 'mark-complete' | 'chapter'; value?: number }) => void;
}

export interface ExerciseTimerProps {
  duration: number;
  timeRemaining: number;
  isPlaying: boolean;
  isCompleted: boolean;
  onStartPause: () => void;
  onSkip: () => void;
  canSkip: boolean;
}

export interface ExerciseListProps {
  exercises: Exercise[];
  currentExerciseIndex: number;
  onExerciseSelect: (index: number) => void;
}