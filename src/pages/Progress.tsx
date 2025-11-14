import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  Calendar, 
  Award, 
  Target,
  Crown,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CheckIn {
  id: string;
  week_date: string;
  weight: number | null;
  waist_measurement: number | null;
  hip_measurement: number | null;
  chest_measurement: number | null;
  thigh_measurement: number | null;
  notes: string | null;
  created_at: string;
}

const Progress = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCheckIns: 0,
    daysActive: 0,
    weightChange: 0,
    measurementChanges: {} as Record<string, number>
  });

  useEffect(() => {
    if (user) {
      fetchCheckIns();
    }
  }, [user]);

  const fetchCheckIns = async () => {
    try {
      const { data, error } = await supabase
        .from('weekly_checkins')
        .select('*')
        .eq('user_id', user?.id)
        .order('week_date', { ascending: true });

      if (error) throw error;

      if (data) {
        setCheckIns(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error('Error fetching check-ins:', error);
      toast({
        title: 'Error loading progress',
        description: 'Failed to load your check-in data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: CheckIn[]) => {
    if (data.length === 0) {
      setStats({
        totalCheckIns: 0,
        daysActive: 0,
        weightChange: 0,
        measurementChanges: {}
      });
      return;
    }

    const first = data[0];
    const latest = data[data.length - 1];
    
    const firstDate = new Date(first.week_date);
    const latestDate = new Date(latest.week_date);
    const daysActive = Math.floor((latestDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));

    const weightChange = (latest.weight || 0) - (first.weight || 0);

    const measurementChanges: Record<string, number> = {
      waist: (latest.waist_measurement || 0) - (first.waist_measurement || 0),
      hip: (latest.hip_measurement || 0) - (first.hip_measurement || 0),
      chest: (latest.chest_measurement || 0) - (first.chest_measurement || 0),
      thigh: (latest.thigh_measurement || 0) - (first.thigh_measurement || 0)
    };

    setStats({
      totalCheckIns: data.length,
      daysActive,
      weightChange,
      measurementChanges
    });
  };

  const getChartData = () => {
    return checkIns.map(checkIn => ({
      date: format(new Date(checkIn.week_date), 'MMM d'),
      weight: checkIn.weight || 0,
      waist: checkIn.waist_measurement || 0,
      hip: checkIn.hip_measurement || 0
    }));
  };

  const getMilestoneProgress = () => {
    const milestones = [
      { count: 4, label: 'First Month', color: 'bg-secondary' },
      { count: 12, label: '3 Months Strong', color: 'bg-primary' },
      { count: 24, label: '6 Month Warrior', color: 'bg-accent' },
      { count: 52, label: 'One Year Champion', color: 'bg-gradient-to-r from-primary to-secondary' }
    ];

    const currentMilestone = milestones.find(m => stats.totalCheckIns < m.count) || milestones[milestones.length - 1];
    const progress = (stats.totalCheckIns / currentMilestone.count) * 100;

    return { currentMilestone, progress: Math.min(progress, 100) };
  };

  const { currentMilestone, progress: milestoneProgress } = getMilestoneProgress();

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Your Transformation Journey
          </h1>
          <p className="text-muted-foreground">
            Track your progress and celebrate every milestone
          </p>
        </div>

        {checkIns.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Start Tracking Your Progress</h3>
              <p className="text-muted-foreground text-center mb-6">
                Record your first check-in to begin your transformation journey
              </p>
              <Button asChild>
                <a href="/dashboard">Go to Dashboard</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Check-ins Completed
                  </CardDescription>
                  <CardTitle className="text-3xl font-bold text-primary">
                    {stats.totalCheckIns}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent">
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Days Active
                  </CardDescription>
                  <CardTitle className="text-3xl font-bold text-secondary">
                    {stats.daysActive}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Weight Change
                  </CardDescription>
                  <CardTitle className="text-3xl font-bold">
                    {stats.weightChange > 0 ? '+' : ''}{stats.weightChange.toFixed(1)} lbs
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    Current Streak
                  </CardDescription>
                  <CardTitle className="text-3xl font-bold">
                    {Math.floor(stats.daysActive / 7)} weeks
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Milestone Progress */}
            <Card className="mb-8 border-2 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Next Milestone: {currentMilestone.label}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {stats.totalCheckIns} of {currentMilestone.count} check-ins completed
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {Math.floor(milestoneProgress)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ProgressBar value={milestoneProgress} className="h-3 mb-4" />
                <p className="text-sm text-muted-foreground">
                  Keep going! You're {currentMilestone.count - stats.totalCheckIns} check-ins away from {currentMilestone.label}
                </p>
              </CardContent>
            </Card>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Weight Trend</CardTitle>
                  <CardDescription>Track your weight over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))' 
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Measurements</CardTitle>
                  <CardDescription>Body measurements progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))' 
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="waist" 
                        stroke="hsl(var(--secondary))" 
                        strokeWidth={2}
                        name="Waist"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="hip" 
                        stroke="hsl(var(--accent))" 
                        strokeWidth={2}
                        name="Hip"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Measurement Changes */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Total Changes Since Day 1</CardTitle>
                <CardDescription>
                  Comparing your first check-in to your most recent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(stats.measurementChanges).map(([key, value]) => (
                    <div key={key} className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground capitalize mb-1">{key}</p>
                      <p className={`text-2xl font-bold ${value < 0 ? 'text-primary' : 'text-foreground'}`}>
                        {value > 0 ? '+' : ''}{value.toFixed(1)}"
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Premium CTA */}
            <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="h-6 w-6 text-primary" />
                      <h3 className="text-2xl font-bold">Keep Your Momentum Going</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Your progress is incredible! Stay on track with unlimited access to personalized meal plans, 
                      advanced workouts, and expert coaching to reach your goals faster.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Custom nutrition plans that adapt to your progress
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Advanced workout programs for faster results
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Priority support from Coach Sarah
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button size="lg" className="gap-2">
                      Upgrade to Premium
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Join 10,000+ moms transforming their lives
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default Progress;
