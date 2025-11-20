import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Target, Check, Heart, AlertTriangle, CheckCircle } from 'lucide-react';
import { trimesterPrograms, Exercise } from '@/data/birthBallGuideData';
import { toast } from 'sonner';

const BirthBallTrimester = () => {
  const { trimester } = useParams<{ trimester: string }>();
  const navigate = useNavigate();
  const trimesterNum = parseInt(trimester?.replace('trimester-', '') || '1');
  
  const program = trimesterPrograms.find(p => p.trimester === trimesterNum);
  
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [savedExercises, setSavedExercises] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('birthBallProgress');
    if (saved) {
      const data = JSON.parse(saved);
      setCompletedExercises(data.completed || []);
      setSavedExercises(data.saved || []);
    }
  }, []);

  const saveProgress = (completed: string[], saved: string[]) => {
    localStorage.setItem('birthBallProgress', JSON.stringify({ completed, saved }));
  };

  const toggleSaved = (exerciseId: string) => {
    const newSaved = savedExercises.includes(exerciseId)
      ? savedExercises.filter(id => id !== exerciseId)
      : [...savedExercises, exerciseId];
    setSavedExercises(newSaved);
    saveProgress(completedExercises, newSaved);
    toast.success(
      savedExercises.includes(exerciseId) ? 'Removed from favorites' : 'Added to favorites'
    );
  };

  if (!program) {
    return (
      <PageLayout>
        <div className="container px-4 mx-auto py-8">
          <p>Program not found</p>
          <Button asChild>
            <Link to="/birth-ball-guide">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Guide
            </Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  const completedCount = program.exercises.filter(ex => completedExercises.includes(ex.id)).length;
  const progress = (completedCount / program.exercises.length) * 100;

  return (
    <PageLayout>
      <div className="container px-4 mx-auto py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          asChild
          className="mb-6"
        >
          <Link to="/birth-ball-guide">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Guide
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">{program.weeks}</Badge>
            <Badge variant="outline">{program.exercises.length} exercises</Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4">{program.title}</h1>
          <p className="text-xl text-muted-foreground mb-4">{program.subtitle}</p>
          
          {/* Goal Card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold mb-1">Program Goal</p>
                  <p className="text-muted-foreground">{program.goal}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        {completedCount > 0 && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Your Progress</span>
                <span className="text-sm text-muted-foreground">
                  {completedCount} of {program.exercises.length} completed
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                What to Do
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {program.whatToDo.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                What NOT to Do
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {program.whatNotToDo.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-destructive mt-1 flex-shrink-0">✕</span>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Exercises */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Exercises</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{program.routineTime}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {program.exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                isCompleted={completedExercises.includes(exercise.id)}
                isSaved={savedExercises.includes(exercise.id)}
                onToggleSave={() => toggleSaved(exercise.id)}
                onViewDetails={() => navigate(`/birth-ball-guide/exercise/${exercise.id}`)}
              />
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

interface ExerciseCardProps {
  exercise: Exercise;
  isCompleted: boolean;
  isSaved: boolean;
  onToggleSave: () => void;
  onViewDetails: () => void;
}

const ExerciseCard = ({ exercise, isCompleted, isSaved, onToggleSave, onViewDetails }: ExerciseCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow relative">
      <button
        onClick={onToggleSave}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
        aria-label={isSaved ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart className={`h-4 w-4 ${isSaved ? 'fill-current text-primary' : 'text-muted-foreground'}`} />
      </button>

      <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative">
        {isCompleted && (
          <div className="absolute top-2 left-2">
            <Badge variant="default" className="bg-green-600">
              <Check className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          </div>
        )}
        <div className="text-center p-4">
          <Clock className="h-12 w-12 text-primary mx-auto mb-2" />
          <p className="text-sm font-medium text-muted-foreground">{exercise.duration}</p>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-lg">{exercise.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {exercise.benefits[0]}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              {exercise.category}
            </Badge>
          </div>
          <Button onClick={onViewDetails} className="w-full">
            View Exercise
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BirthBallTrimester;
