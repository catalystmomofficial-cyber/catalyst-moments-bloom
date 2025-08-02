import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Users, Star } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  duration_weeks: number;
  category: string;
  difficulty_level: string;
  is_active: boolean;
}

interface UserProgress {
  current_week: number;
  current_day: number;
  started_at: string;
  completed_at?: string;
}

interface CourseCardProps {
  course: Course;
  userProgress?: UserProgress;
  onEnroll?: () => void;
  onContinue?: () => void;
}

export function CourseCard({ course, userProgress, onEnroll, onContinue }: CourseCardProps) {
  const isEnrolled = !!userProgress;
  const isCompleted = userProgress?.completed_at;
  const totalDays = course.duration_weeks * 7;
  const currentDay = userProgress ? (userProgress.current_week - 1) * 7 + userProgress.current_day : 0;
  const progressPercentage = isCompleted ? 100 : (currentDay / totalDays) * 100;

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-red-500/10 text-red-700 border-red-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'postpartum': return 'bg-purple-500/10 text-purple-700 border-purple-200';
      case 'fitness': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'nutrition': return 'bg-green-500/10 text-green-700 border-green-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl">{course.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {course.description}
            </CardDescription>
          </div>
          {isCompleted && (
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={getCategoryColor(course.category)}>
            {course.category}
          </Badge>
          <Badge variant="outline" className={getDifficultyColor(course.difficulty_level)}>
            {course.difficulty_level}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{course.duration_weeks} weeks</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{totalDays} days</span>
          </div>
        </div>

        {isEnrolled && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>
                {isCompleted ? 'Completed!' : `Day ${currentDay} of ${totalDays}`}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        <Button 
          onClick={isEnrolled ? onContinue : onEnroll}
          className="w-full"
          variant={isCompleted ? "outline" : "default"}
        >
          {isCompleted ? 'Review Course' : isEnrolled ? 'Continue' : 'Start Course'}
        </Button>
      </CardContent>
    </Card>
  );
}