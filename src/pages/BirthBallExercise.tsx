import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Heart, CheckCircle, Wind, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { birthBallExercises } from '@/data/birthBallGuideData';
import { exerciseEnhancements } from '@/data/birthBallModificationsData';
import { toast } from 'sonner';
import VideoPlayer from '@/components/workouts/VideoPlayer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const BirthBallExercise = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const exercise = birthBallExercises.find(ex => ex.id === exerciseId);
  const enhancements = exerciseId ? exerciseEnhancements[exerciseId] : undefined;
  
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [modificationsOpen, setModificationsOpen] = useState(false);
  const [breathingOpen, setBreathingOpen] = useState(false);

  useEffect(() => {
    if (!exercise) return;
    const saved = localStorage.getItem('birthBallProgress');
    if (saved) {
      const data = JSON.parse(saved);
      setIsCompleted(data.completed?.includes(exercise.id) || false);
      setIsSaved(data.saved?.includes(exercise.id) || false);
    }
    // Start timer when page loads
    setStartTime(new Date());
  }, [exercise]);

  const toggleComplete = async () => {
    if (!exercise) return;
    const saved = localStorage.getItem('birthBallProgress');
    const data = saved ? JSON.parse(saved) : { completed: [], saved: [] };
    
    const newCompleted = isCompleted
      ? data.completed.filter((id: string) => id !== exercise.id)
      : [...data.completed, exercise.id];
    
    localStorage.setItem('birthBallProgress', JSON.stringify({
      completed: newCompleted,
      saved: data.saved
    }));
    
    setIsCompleted(!isCompleted);

    // Log to database if completing exercise and user is logged in
    if (!isCompleted && user && startTime) {
      const durationSeconds = Math.round((new Date().getTime() - startTime.getTime()) / 1000);
      const sessionId = crypto.randomUUID();

      try {
        await supabase.from('birth_ball_exercise_logs').insert({
          user_id: user.id,
          exercise_id: exercise.id,
          exercise_name: exercise.name,
          trimester: exercise.trimester,
          duration_seconds: durationSeconds,
          session_id: sessionId,
        });
      } catch (error) {
        console.error('Error logging exercise:', error);
      }
    }
    
    toast.success(isCompleted ? 'Marked as incomplete' : 'Exercise completed! 🎉');
  };

  const toggleSaved = () => {
    if (!exercise) return;
    const saved = localStorage.getItem('birthBallProgress');
    const data = saved ? JSON.parse(saved) : { completed: [], saved: [] };
    
    const newSaved = isSaved
      ? data.saved.filter((id: string) => id !== exercise.id)
      : [...data.saved, exercise.id];
    
    localStorage.setItem('birthBallProgress', JSON.stringify({
      completed: data.completed,
      saved: newSaved
    }));
    
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Removed from favorites' : 'Added to favorites');
  };

  if (!exercise) {
    return (
      <PageLayout>
        <div className="container px-4 mx-auto py-8">
          <p>Exercise not found</p>
          <Button asChild>
            <Link to="/birth-ball-guide">Back to Guide</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container px-4 mx-auto py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to={`/birth-ball-guide/trimester-${exercise.trimester}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trimester {exercise.trimester}
          </Link>
        </Button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">Trimester {exercise.trimester}</Badge>
            <Badge variant="outline">{exercise.category}</Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4">{exercise.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{exercise.duration}</span>
          </div>
        </div>

        {/* Visual Guide - Prominent Image Display */}
        {exercise.imageUrl && (
          <Card className="mb-8 overflow-hidden">
            <div className="relative">
              <img 
                src={exercise.imageUrl} 
                alt={`${exercise.name} demonstration`}
                className="w-full h-auto object-cover"
              />
              <div className="absolute top-4 right-4 bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                {exercise.duration}
              </div>
            </div>
          </Card>
        )}

        <div className="flex gap-3 mb-8">
          <Button onClick={toggleComplete} className="flex-1">
            <CheckCircle className="mr-2 h-4 w-4" />
            {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
          </Button>
          <Button onClick={toggleSaved} variant="outline" size="icon">
            <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Modifications Section */}
        {enhancements?.modifications && (
          <Collapsible
            open={modificationsOpen}
            onOpenChange={setModificationsOpen}
            className="mb-6"
          >
            <Card className="border-purple-200 dark:border-purple-800">
              <CollapsibleTrigger className="w-full">
                <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <CardTitle>Exercise Modifications</CardTitle>
                      <Badge variant="outline" className="ml-2">
                        {enhancements.modifications.length} options
                      </Badge>
                    </div>
                    {modificationsOpen ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4 pt-2">
                  {enhancements.modifications.map((mod, index) => (
                    <Card key={index} className="border-purple-100 dark:border-purple-900">
                      <CardHeader>
                        <div className="space-y-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            {mod.title}
                            <Badge variant="secondary" className="text-xs">
                              {mod.title.includes('Chair') && 'Chair'}
                              {mod.title.includes('Wall') && 'Supported'}
                              {mod.title.includes('Bed') && 'Low Impact'}
                              {mod.title.includes('Standing') && 'Standing'}
                              {mod.title.includes('Partner') && 'Partner'}
                              {mod.title.includes('Reduced') && 'Gentle'}
                              {mod.title.includes('Shallow') && 'Modified'}
                            </Badge>
                          </CardTitle>
                          <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                            When to use: {mod.whenToUse}
                          </p>
                          <p className="text-sm text-muted-foreground">{mod.description}</p>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ol className="space-y-2">
                          {mod.instructions.map((instruction, idx) => (
                            <li key={idx} className="flex gap-3 text-sm">
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs font-medium">
                                {idx + 1}
                              </span>
                              <span className="text-muted-foreground">{instruction}</span>
                            </li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )}

        {/* Breathing Coordination Section */}
        {enhancements?.breathingPattern && (
          <Collapsible
            open={breathingOpen}
            onOpenChange={setBreathingOpen}
            className="mb-6"
          >
            <Card className="border-cyan-200 dark:border-cyan-800">
              <CollapsibleTrigger className="w-full">
                <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wind className="h-5 w-5 text-cyan-600" />
                      <CardTitle>Breathing Coordination</CardTitle>
                    </div>
                    {breathingOpen ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4 pt-2">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">{enhancements.breathingPattern.name}</h4>
                    <p className="text-muted-foreground mb-4">{enhancements.breathingPattern.description}</p>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">Breathing Pattern</h5>
                    <ol className="space-y-3">
                      {enhancements.breathingPattern.pattern.map((step, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="bg-cyan-50 dark:bg-cyan-950 p-4 rounded-lg">
                    <p className="text-sm font-medium text-cyan-900 dark:text-cyan-100 mb-1">Timing</p>
                    <p className="text-sm text-cyan-700 dark:text-cyan-300">{enhancements.breathingPattern.timing}</p>
                  </div>

                  <div>
                    <h5 className="font-medium mb-3">Benefits</h5>
                    <ul className="space-y-2">
                      {enhancements.breathingPattern.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-cyan-600 mt-1 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button asChild variant="outline" className="w-full">
                    <Link to="/birth-ball-guide/breathing-practice">
                      <Wind className="mr-2 h-4 w-4" />
                      Practice This Breathing Technique
                    </Link>
                  </Button>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {exercise.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground">{instruction}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {exercise.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default BirthBallExercise;
