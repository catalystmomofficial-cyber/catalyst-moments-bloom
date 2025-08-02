import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, SkipForward, Check, Clock, Target, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Exercise {
  id: string;
  name: string;
  duration: number; // in seconds
  reps?: string;
  description: string;
  instructions: string[];
  completed: boolean;
}

interface WorkoutPlayerProps {
  week: number;
  day: number;
  onComplete: () => void;
  onBack: () => void;
}

// Sample workout data for the 30-day challenge
const getWorkoutData = (week: number, day: number): Exercise[] => {
  const workouts: Record<string, Exercise[]> = {
    "1-1": [
      {
        id: "warm-up",
        name: "Gentle Warm-up",
        duration: 300, // 5 minutes
        description: "Start your journey with gentle movements",
        instructions: [
          "Begin with deep breathing exercises",
          "Gentle neck and shoulder rolls",
          "Light arm circles",
          "Pelvic tilts"
        ],
        completed: false
      },
      {
        id: "core-activation",
        name: "Core Activation",
        duration: 600, // 10 minutes
        reps: "3 sets of 10",
        description: "Gentle core awakening exercises",
        instructions: [
          "Lie on your back with knees bent",
          "Place hands on lower ribs",
          "Breathe in, feel ribs expand",
          "Breathe out, gently draw belly button to spine"
        ],
        completed: false
      },
      {
        id: "relaxation",
        name: "Relaxation & Stretching",
        duration: 300, // 5 minutes
        description: "End with calming stretches",
        instructions: [
          "Child's pose for 1 minute",
          "Gentle spinal twists",
          "Deep breathing exercises",
          "Set intention for your journey"
        ],
        completed: false
      }
    ],
    "1-2": [
      {
        id: "movement-prep",
        name: "Movement Preparation",
        duration: 360, // 6 minutes
        description: "Prepare your body for gentle movement",
        instructions: [
          "Cat-cow stretches",
          "Modified sun salutations",
          "Hip circles",
          "Ankle pumps"
        ],
        completed: false
      },
      {
        id: "strength-intro",
        name: "Introduction to Strength",
        duration: 480, // 8 minutes
        reps: "2 sets of 8",
        description: "Basic strength building exercises",
        instructions: [
          "Wall push-ups",
          "Supported squats using chair",
          "Standing marches",
          "Modified planks on knees"
        ],
        completed: false
      },
      {
        id: "mindfulness",
        name: "Mindfulness Moment",
        duration: 240, // 4 minutes
        description: "Connect with your body and goals",
        instructions: [
          "Seated meditation",
          "Body scan relaxation",
          "Gratitude practice",
          "Visualize your goals"
        ],
        completed: false
      }
    ]
    // Add more days as needed...
  };

  const key = `${week}-${day}`;
  return workouts[key] || [
    {
      id: "placeholder",
      name: `Week ${week} Day ${day} Workout`,
      duration: 1200, // 20 minutes
      description: "Your personalized workout for today",
      instructions: [
        "Follow along with today's exercises",
        "Listen to your body",
        "Take breaks as needed",
        "Focus on proper form"
      ],
      completed: false
    }
  ];
};

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

  if (!currentExercise) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your workout...</p>
        </div>
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
          {/* Timer */}
          <div className="text-center">
            <div className="text-6xl font-bold text-primary mb-2">
              {formatTime(timeRemaining)}
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {formatTime(currentExercise.duration)} total
                {currentExercise.reps && ` • ${currentExercise.reps}`}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={startPauseExercise}
              size="lg"
              className="px-8"
              disabled={currentExercise.completed || timeRemaining === 0}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-5 w-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Start
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={skipToNext}
              disabled={currentExerciseIndex === exercises.length - 1}
            >
              <SkipForward className="h-4 w-4 mr-2" />
              Next
            </Button>
          </div>

          {/* Instructions */}
          <div className="space-y-3">
            <h4 className="font-medium">Instructions:</h4>
            <ul className="space-y-2">
              {currentExercise.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mt-0.5">
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
                    ? 'border-green-200 bg-green-50'
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
                  onClick={() => {
                    setCurrentExerciseIndex(index);
                    setTimeRemaining(exercise.duration);
                    setIsPlaying(false);
                  }}
                  disabled={exercise.completed}
                >
                  {index === currentExerciseIndex ? 'Current' : 'Start'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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