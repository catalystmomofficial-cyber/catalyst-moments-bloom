import { useState, useEffect } from "react";
import glowUpCover from "@/assets/30-days-glow-up-cover.jpg";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Play, CheckCircle, Calendar, Clock, Target } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import WorkoutPlayer from "@/components/workouts/WorkoutPlayer";

interface Course {
  id: string;
  title: string;
  description: string;
  duration_weeks: number;
  category: string;
  difficulty_level: string;
}

interface CourseWeek {
  id: string;
  week_number: number;
  title: string;
  description: string;
  focus_areas: string[];
}

interface UserProgress {
  current_week: number;
  current_day: number;
  started_at: string;
  completed_at?: string;
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [weeks, setWeeks] = useState<CourseWeek[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState<{ week: number; day: number } | null>(null);

  useEffect(() => {
    if (id) {
      fetchCourseData();
    }
  }, [id, user]);

  const fetchCourseData = async () => {
    if (!id) return;

    try {
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch course weeks
      const { data: weeksData, error: weeksError } = await supabase
        .from('course_weeks')
        .select('*')
        .eq('course_id', id)
        .order('week_number');

      if (weeksError) throw weeksError;
      setWeeks(weeksData || []);

      // Fetch user progress if logged in
      if (user) {
        const { data: progressData, error: progressError } = await supabase
          .from('user_course_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', id)
          .eq('is_active', true)
          .single();

        if (progressError && progressError.code !== 'PGRST116') throw progressError;
        setUserProgress(progressData);
      }

    } catch (error) {
      console.error('Error fetching course data:', error);
      toast({
        title: "Error",
        description: "Failed to load course data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startDay = async (weekNumber: number, dayNumber: number) => {
    if (!user || !course) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to start your workout",
        variant: "destructive",
      });
      return;
    }

    // Debug logging
    console.log('Starting day:', weekNumber, dayNumber);
    console.log('User:', user);
    console.log('Course:', course);

    // Launch workout player immediately
    setActiveWorkout({ week: weekNumber, day: dayNumber });
    setIsWorkoutActive(true);
    
    console.log('Set workout active:', { week: weekNumber, day: dayNumber });

    try {
      if (!userProgress) {
        // Enroll user first
        const { error: enrollError } = await supabase
          .from('user_course_progress')
          .insert({
            user_id: user.id,
            course_id: course.id,
            current_week: weekNumber,
            current_day: dayNumber,
          });

        if (enrollError) throw enrollError;
      } else {
        // Update progress
        const { error: updateError } = await supabase
          .from('user_course_progress')
          .update({
            current_week: weekNumber,
            current_day: dayNumber,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id)
          .eq('course_id', course.id);

        if (updateError) throw updateError;
      }

      fetchCourseData();
    } catch (error) {
      console.error('Error starting day:', error);
      toast({
        title: "Error",
        description: "Failed to start the day",
        variant: "destructive",
      });
    }
  };

  const completeWorkout = async () => {
    if (!user || !course || !activeWorkout) return;

    try {
      // Update progress to next day
      const nextDay = activeWorkout.day < 7 ? activeWorkout.day + 1 : 1;
      const nextWeek = activeWorkout.day < 7 ? activeWorkout.week : activeWorkout.week + 1;
      
      const isLastDay = activeWorkout.week === course.duration_weeks && activeWorkout.day === 7;

      const { error } = await supabase
        .from('user_course_progress')
        .update({
          current_week: isLastDay ? activeWorkout.week : nextWeek,
          current_day: isLastDay ? activeWorkout.day : nextDay,
          completed_at: isLastDay ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('course_id', course.id);

      if (error) throw error;

      setIsWorkoutActive(false);
      setActiveWorkout(null);
      fetchCourseData();

      if (isLastDay) {
        toast({
          title: "🎉 Challenge Complete!",
          description: "Congratulations! You've completed the entire 30 Days Glow Up Challenge!",
        });
      }
    } catch (error) {
      console.error('Error completing workout:', error);
      toast({
        title: "Error",
        description: "Failed to save workout completion",
        variant: "destructive",
      });
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-50 text-green-700 border-green-200';
      case 'intermediate': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'postpartum': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'fitness': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'nutrition': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-48 bg-muted rounded"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!course) {
    return (
      <PageLayout>
        <div className="container mx-auto py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/courses')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </PageLayout>
    );
  }

  const totalDays = course.duration_weeks * 7;
  const currentDay = userProgress ? (userProgress.current_week - 1) * 7 + userProgress.current_day : 0;
  const progressPercentage = userProgress?.completed_at ? 100 : (currentDay / totalDays) * 100;

  return (
    <PageLayout>
      <div className="container mx-auto py-8 space-y-8">
        {/* Debug info */}
        <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
          Debug: isWorkoutActive={isWorkoutActive ? 'true' : 'false'}, activeWorkout={JSON.stringify(activeWorkout)}
        </div>
        
        {/* Show Workout Player when active */}
        {isWorkoutActive && activeWorkout ? (
          <WorkoutPlayer
            week={activeWorkout.week}
            day={activeWorkout.day}
            onComplete={completeWorkout}
            onBack={() => {
              console.log('Back button clicked');
              setIsWorkoutActive(false);
              setActiveWorkout(null);
            }}
          />
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between">
              <Button variant="ghost" onClick={() => navigate('/courses')} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Button>
            </div>

            {/* Course Hero */}
            <div className="relative">
              <div className="h-64 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-lg overflow-hidden">
                <img 
                  src={glowUpCover}
                  alt="30 Days Glow Up Challenge - Transform your postpartum journey"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
                  <p className="text-white/90 text-lg">{course.description}</p>
                </div>
              </div>
              
              <Card className="mt-6">
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className={getCategoryColor(course.category)}>
                        {course.category}
                      </Badge>
                      <Badge variant="outline" className={getDifficultyColor(course.difficulty_level)}>
                        {course.difficulty_level}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{course.duration_weeks} weeks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{totalDays} days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        <span>15-30 min daily</span>
                      </div>
                    </div>
                  </div>

                  {userProgress && (
                    <div className="mt-6 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Your Progress</span>
                        <span className="text-muted-foreground">
                          {userProgress.completed_at ? 'Completed!' : `Day ${currentDay} of ${totalDays}`}
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-3" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Course Content */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Course</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {course.description}
                    </p>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">What You'll Learn</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Safe and effective postpartum exercises</li>
                          <li>• Core recovery and strengthening</li>
                          <li>• Energy boosting techniques</li>
                          <li>• Confidence building strategies</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">What's Included</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• 28 days of guided workouts</li>
                          <li>• Weekly progress tracking</li>
                          <li>• Expert tips and advice</li>
                          <li>• Community support</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-6">
                <div className="grid gap-6">
                  {weeks.map((week) => (
                    <Card key={week.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              Week {week.week_number}: {week.title}
                            </CardTitle>
                            <CardDescription>{week.description}</CardDescription>
                          </div>
                          {userProgress && userProgress.current_week >= week.week_number && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {week.focus_areas?.map((area, index) => (
                              <Badge key={index} variant="secondary">
                                {area}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
                            {[...Array(7)].map((_, dayIndex) => {
                              const dayNumber = dayIndex + 1;
                              const isCurrentDay = userProgress?.current_week === week.week_number && userProgress?.current_day === dayNumber;
                              const isCompleted = userProgress && (
                                userProgress.current_week > week.week_number || 
                                (userProgress.current_week === week.week_number && userProgress.current_day > dayNumber)
                              );
                              const isAccessible = !userProgress || 
                                userProgress.current_week > week.week_number || 
                                userProgress.current_week === week.week_number ||
                                (userProgress.current_week === week.week_number - 1 && userProgress.current_day === 7);

                              return (
                                <Button
                                  key={dayIndex}
                                  variant={isCurrentDay ? "default" : isCompleted ? "secondary" : "outline"}
                                  size="sm"
                                  className="h-12"
                                  onClick={() => startDay(week.week_number, dayNumber)}
                                  disabled={!isAccessible}
                                >
                                  <div className="text-center">
                                    <div className="text-xs">Day</div>
                                    <div className="font-bold">{dayNumber}</div>
                                  </div>
                                  {isCompleted && <CheckCircle className="h-3 w-3 ml-1" />}
                                  {isCurrentDay && <Play className="h-3 w-3 ml-1" />}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="progress" className="space-y-6">
                {userProgress ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">
                          {Math.round(progressPercentage)}%
                        </div>
                        <p className="text-muted-foreground">Complete</p>
                      </div>
                      
                      <Progress value={progressPercentage} className="h-4" />
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold">{currentDay}</div>
                          <p className="text-sm text-muted-foreground">Days Completed</p>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{totalDays - currentDay}</div>
                          <p className="text-sm text-muted-foreground">Days Remaining</p>
                        </div>
                      </div>

                      {userProgress.completed_at && (
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <h3 className="font-semibold text-green-800">Congratulations!</h3>
                          <p className="text-green-700">You completed this challenge on {new Date(userProgress.completed_at).toLocaleDateString()}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Start Your Journey</h3>
                      <p className="text-muted-foreground mb-6">
                        Enroll in this course to track your progress and access all content.
                      </p>
                      <Button onClick={() => startDay(1, 1)}>
                        <Play className="h-4 w-4 mr-2" />
                        Start Challenge
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </PageLayout>
  );
}