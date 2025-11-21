import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft, Clock } from 'lucide-react';
import { birthBallExercises } from '@/data/birthBallGuideData';
import SEO from '@/components/seo/SEO';

const SavedBirthBallExercises = () => {
  const [savedExerciseIds, setSavedExerciseIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('birthBallProgress');
    if (saved) {
      const data = JSON.parse(saved);
      setSavedExerciseIds(data.saved || []);
    }
  }, []);

  const savedExercises = birthBallExercises.filter(ex => 
    savedExerciseIds.includes(ex.id)
  );

  const removeFavorite = (exerciseId: string) => {
    const saved = localStorage.getItem('birthBallProgress');
    const data = saved ? JSON.parse(saved) : { completed: [], saved: [] };
    
    const newSaved = data.saved.filter((id: string) => id !== exerciseId);
    
    localStorage.setItem('birthBallProgress', JSON.stringify({
      completed: data.completed,
      saved: newSaved
    }));
    
    setSavedExerciseIds(newSaved);
  };

  return (
    <PageLayout>
      <SEO 
        title="Saved Birth Ball Exercises"
        description="Your favorite birth ball exercises for pregnancy wellness and labor preparation."
      />
      
      <div className="container px-4 mx-auto py-8 max-w-6xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/birth-ball-guide">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Birth Ball Guide
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Saved Exercises</h1>
          <p className="text-muted-foreground">
            {savedExercises.length} exercise{savedExercises.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        {savedExercises.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No saved exercises yet</h3>
              <p className="text-muted-foreground mb-6">
                Browse the birth ball guide and save your favorite exercises
              </p>
              <Button asChild>
                <Link to="/birth-ball-guide">Browse Exercises</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedExercises.map((exercise) => (
              <Card key={exercise.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                    <img 
                      src={exercise.imageUrl} 
                      alt={exercise.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">Trimester {exercise.trimester}</Badge>
                    <Badge variant="outline">{exercise.category}</Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{exercise.name}</h3>
                  
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{exercise.duration}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link to={`/birth-ball-guide/exercise/${exercise.id}`}>
                        View Exercise
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => removeFavorite(exercise.id)}
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default SavedBirthBallExercises;
