import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { ExerciseListProps } from './types';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function ExerciseList({ 
  exercises, 
  currentExerciseIndex, 
  onExerciseSelect 
}: ExerciseListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Workout</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {exercises.map((exercise, index) => (
            <div
              key={exercise.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                index === currentExerciseIndex
                  ? 'border-primary bg-primary/5'
                  : exercise.completed
                  ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/40'
                  : 'border-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium ${
                  exercise.completed
                    ? 'bg-green-600 text-white'
                    : index === currentExerciseIndex
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {exercise.completed ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <div>
                  <h4 className="font-medium">{exercise.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatTime(exercise.duration)}
                    {exercise.reps && ` • ${exercise.reps}`}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onExerciseSelect(index)}
                disabled={exercise.completed}
              >
                {index === currentExerciseIndex ? 'Current' : 'Start'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}