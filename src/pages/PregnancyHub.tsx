import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Baby, Heart, BookOpen, Activity, Stethoscope, Users, Newspaper } from 'lucide-react';

const sections = [
  { title: 'Pregnancy Tracker', desc: 'Track your pregnancy week by week', icon: Baby, href: '/pregnancy/tracker' },
  { title: 'Baby Kick Counter', desc: 'Monitor baby movements daily', icon: Activity, href: '/pregnancy/kick-counter' },
  { title: 'Contraction Tracker', desc: 'Time and track contractions', icon: Stethoscope, href: '/pregnancy/contractions' },
  { title: 'Pregnancy Journal', desc: 'Document your journey', icon: BookOpen, href: '/pregnancy/journal' },
  { title: 'Postpartum Prep', desc: 'Prepare for postpartum recovery', icon: Heart, href: '/pregnancy/postpartum-prep' },
  { title: 'Wellness Digest', desc: 'Weekly pregnancy wellness tips', icon: Newspaper, href: '/pregnancy/wellness-digest' },
  { title: 'Pregnancy Community', desc: 'Connect with other expecting moms', icon: Users, href: '/pregnancy/community' },
];

const PregnancyHub = () => (
  <PageLayout>
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Pregnancy Suite</h1>
      <p className="text-muted-foreground mb-8">Everything you need for a healthy pregnancy journey</p>
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

export default PregnancyHub;
