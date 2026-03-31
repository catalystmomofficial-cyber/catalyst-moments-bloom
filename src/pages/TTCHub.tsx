import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Target, Salad, Dumbbell, BookOpen, Sparkles, Users, Trophy } from 'lucide-react';

const sections = [
  { title: 'TTC Tracker', desc: 'Track your fertility journey', icon: Target, href: '/ttc/tracker' },
  { title: 'Cycle Calendar', desc: 'Monitor your cycle and fertile window', icon: Calendar, href: '/ttc/cycle-calendar' },
  { title: 'Fertility Nutrition', desc: 'Fertility-friendly meal ideas', icon: Salad, href: '/ttc/nutrition' },
  { title: 'TTC Workouts', desc: 'Exercises to support conception', icon: Dumbbell, href: '/ttc/workouts' },
  { title: 'Educational Resources', desc: 'Learn about fertility and conception', icon: BookOpen, href: '/ttc/education' },
  { title: 'Personalized Advice', desc: 'AI-powered fertility guidance', icon: Sparkles, href: '/ttc/advice' },
  { title: 'TTC Community', desc: 'Connect with others trying to conceive', icon: Users, href: '/ttc/community' },
  { title: 'Community Challenges', desc: 'Join fertility wellness challenges', icon: Trophy, href: '/ttc/challenges' },
];

const TTCHub = () => (
  <PageLayout>
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Trying to Conceive</h1>
      <p className="text-muted-foreground mb-8">Tools and support for your fertility journey</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map(s => (
          <Card key={s.href} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10"><s.icon className="h-5 w-5 text-primary" /></div>
                <div>
                  <CardTitle className="text-lg">{s.title}</CardTitle>
                  <CardDescription>{s.desc}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full"><Link to={s.href}>Open</Link></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </PageLayout>
);

export default TTCHub;
