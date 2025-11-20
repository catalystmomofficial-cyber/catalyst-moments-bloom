import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heart, Clock, Target, BookOpen, Award, AlertCircle } from 'lucide-react';
import SEO from '@/components/seo/SEO';
import { trimesterPrograms, educationalContent } from '@/data/birthBallGuideData';

const BirthBallGuide = () => {
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [savedExercises, setSavedExercises] = useState<string[]>([]);

  useEffect(() => {
    // Load progress from localStorage
    const saved = localStorage.getItem('birthBallProgress');
    if (saved) {
      const data = JSON.parse(saved);
      setCompletedExercises(data.completed || []);
      setSavedExercises(data.saved || []);
    }
  }, []);

  const totalExercises = trimesterPrograms.reduce((acc, program) => acc + program.exercises.length, 0);
  const progress = (completedExercises.length / totalExercises) * 100;

  return (
    <PageLayout>
      <SEO 
        title="The Ultimate Birth Ball Guide - Safe Exercises for Every Trimester"
        description="Complete birth ball guide with trimester-specific exercises, safety tips, and labor preparation techniques. Learn hip mobility, pelvic floor support, and reduce tearing risk."
      />

      <div className="container px-4 mx-auto py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="text-sm">
              Pregnancy Fitness
            </Badge>
            <Badge variant="outline" className="text-sm">
              Expert Approved
            </Badge>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            The Ultimate Birth Ball Guide
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            {educationalContent.introduction.subtitle}
          </p>

          {/* Progress Tracker */}
          {completedExercises.length > 0 && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Your Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {completedExercises.length} of {totalExercises} exercises completed
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </CardContent>
            </Card>
          )}

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">10-15 min per session</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="h-4 w-4" />
              <span className="text-sm">All Trimesters</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Award className="h-4 w-4" />
              <span className="text-sm">Expert Designed</span>
            </div>
            {savedExercises.length > 0 && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Heart className="h-4 w-4 fill-current" />
                <span className="text-sm">{savedExercises.length} saved</span>
              </div>
            )}
          </div>
        </div>

        {/* Introduction Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {educationalContent.introduction.content}
            </p>
          </CardContent>
        </Card>

        {/* Why These Moves Help */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {educationalContent.reducesTearing.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{educationalContent.reducesTearing.content}</p>
            <ul className="space-y-2">
              {educationalContent.reducesTearing.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground mt-4 italic">
              {educationalContent.reducesTearing.note}
            </p>
          </CardContent>
        </Card>

        {/* Trimester Programs */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Trimester-Specific Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trimesterPrograms.map((program) => (
              <Card key={program.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-primary mb-2">
                      {program.trimester}
                    </div>
                    <div className="text-sm text-muted-foreground">Trimester</div>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{program.weeks}</Badge>
                    <Badge variant="outline">{program.exercises.length} exercises</Badge>
                  </div>
                  <CardTitle className="text-xl">{program.title.split(':')[1]}</CardTitle>
                  <CardDescription>{program.goal}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{program.routineTime}</span>
                    </div>
                    <Button asChild className="w-full">
                      <Link to={`/birth-ball-guide/trimester-${program.trimester}`}>
                        View Program
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Access Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Essential Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Buying Guide</CardTitle>
                <CardDescription>Choose the right birth ball for your height and needs</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/birth-ball-guide/buying-guide">View Guide</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Safety & Comfort</CardTitle>
                <CardDescription>Important tips for safe and effective practice</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/birth-ball-guide/safety">View Tips</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">FAQs & Troubleshooting</CardTitle>
                <CardDescription>Common questions and solutions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/birth-ball-guide/faq">Get Answers</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Education Section Preview */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Understanding Your Body</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pelvic Floor & Body Mechanics</CardTitle>
                <CardDescription>
                  Learn how your body changes and how the birth ball supports you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/birth-ball-guide/education">Learn More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Using the Ball in Early Labor</CardTitle>
                <CardDescription>
                  Techniques for managing contractions and staying comfortable
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/birth-ball-guide/early-labor">View Techniques</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default BirthBallGuide;
