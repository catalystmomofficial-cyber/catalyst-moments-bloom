import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Check, Target, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePoints } from '@/hooks/usePoints';
import { WorkoutPlayerProps, Exercise } from './types';
import { getWorkoutData } from './WorkoutData';
import VideoPlayer from './VideoPlayer';
import ExerciseTimer from './ExerciseTimer';
import ExerciseList from './ExerciseList';

export default function WorkoutPlayer({ week, day, onComplete, onBack }: WorkoutPlayerProps) {
  const { toast } = useToast();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalWorkoutTime, setTotalWorkoutTime] = useState(0);

  // Debug logging
  console.log('WorkoutPlayer props:', { week, day });
  console.log('WorkoutPlayer state:', { exercises, currentExerciseIndex, isPlaying, timeRemaining });

  useEffect(() => {
    const workoutData = getWorkoutData(week, day);
    console.log('Setting workout data:', workoutData);
    setExercises(workoutData);
    setTimeRemaining(workoutData[0]?.duration || 0);
    setTotalWorkoutTime(workoutData.reduce((total, ex) => total + ex.duration, 0));
  }, [week, day]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            markExerciseComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining]);

  const markExerciseComplete = () => {
    setExercises(prev => prev.map((ex, index) => 
      index === currentExerciseIndex ? { ...ex, completed: true } : ex
    ));

    toast({
      title: "Exercise Complete!",
      description: `Great job on ${exercises[currentExerciseIndex]?.name}`,
    });

    // Auto-advance to next exercise
    if (currentExerciseIndex < exercises.length - 1) {
      setTimeout(() => {
        setCurrentExerciseIndex(prev => prev + 1);
        setTimeRemaining(exercises[currentExerciseIndex + 1]?.duration || 0);
      }, 2000);
    }
  };

  const startPauseExercise = () => {
    setIsPlaying(!isPlaying);
  };

  const skipToNext = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setTimeRemaining(exercises[currentExerciseIndex + 1]?.duration || 0);
      setIsPlaying(false);
    }
  };

  const handleExerciseSelect = (index: number) => {
    setCurrentExerciseIndex(index);
    setTimeRemaining(exercises[index]?.duration || 0);
    setIsPlaying(false);
  };

  const completeWorkout = () => {
    toast({
      title: "Workout Complete! 🎉",
      description: `Amazing work on Week ${week}, Day ${day}!`,
    });
    onComplete();
  };

  const currentExercise = exercises[currentExerciseIndex];
  const completedExercises = exercises.filter(ex => ex.completed).length;
  const workoutProgress = (completedExercises / exercises.length) * 100;
  const allExercisesComplete = completedExercises === exercises.length;

  console.log('Current exercise:', currentExercise);
  console.log('Current exercise videoUrl:', currentExercise?.videoUrl);
  console.log('Exercises array:', exercises);

  if (!currentExercise || exercises.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Button>
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            Week {week} • Day {day}
          </Badge>
        </div>
        
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your workout...</p>
              <p className="text-xs text-muted-foreground mt-2">Week {week}, Day {day}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Course
        </Button>
        <Badge variant="outline" className="bg-purple-50 text-purple-700">
          Week {week} • Day {day}
        </Badge>
      </div>

      {/* Workout Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Today's Progress</h3>
              <span className="text-sm text-muted-foreground">
                {completedExercises}/{exercises.length} exercises
              </span>
            </div>
            <Progress value={workoutProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Current Exercise */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{currentExercise.name}</CardTitle>
            {currentExercise.completed && (
              <Check className="h-5 w-5 text-green-600" />
            )}
          </div>
          <p className="text-muted-foreground">{currentExercise.description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Video Player */}
          <VideoPlayer 
            videoUrl={currentExercise.videoUrl} 
            title={currentExercise.name} 
          />

          {/* Timer */}
          <ExerciseTimer
            duration={currentExercise.duration}
            timeRemaining={timeRemaining}
            isPlaying={isPlaying}
            isCompleted={currentExercise.completed}
            onStartPause={startPauseExercise}
            onSkip={skipToNext}
            canSkip={currentExerciseIndex < exercises.length - 1}
          />

          {/* Instructions */}
          <div className="space-y-3">
            <h4 className="font-medium">Instructions:</h4>
            <ul className="space-y-2">
              {currentExercise.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Complete Exercise Button */}
          {(timeRemaining === 0 || currentExercise.completed) && (
            <Button
              onClick={markExerciseComplete}
              className="w-full"
              disabled={currentExercise.completed}
            >
              <Check className="h-4 w-4 mr-2" />
              {currentExercise.completed ? 'Exercise Complete' : 'Mark Complete'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Exercise List */}
      <ExerciseList
        exercises={exercises}
        currentExerciseIndex={currentExerciseIndex}
        onExerciseSelect={handleExerciseSelect}
      />

      {/* Complete Workout */}
      {allExercisesComplete && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="text-center py-8">
            <div className="space-y-4">
              <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-800">Workout Complete!</h3>
                <p className="text-green-700">
                  Great job finishing Week {week}, Day {day}! You're one step closer to your glow up.
                </p>
              </div>
              <Button onClick={completeWorkout} className="bg-green-600 hover:bg-green-700">
                <Target className="h-4 w-4 mr-2" />
                Mark Day Complete
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}