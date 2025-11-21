import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Target, 
  TrendingUp, 
  Activity, 
  Heart, 
  Brain, 
  Apple,
  Dumbbell,
  Moon,
  Loader2,
  Download,
  Mail,
  Share2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface AssessmentData {
  id: string;
  email: string;
  name: string;
  primary_goal: string;
  dietary_preferences: string;
  activity_level: string;
  equipment: string;
  special_notes: string | null;
  overall_score: number | null;
  tier: string | null;
  category_scores: Record<string, number> | null;
  assessment_results: any | null;
  created_at: string;
}

const AssessmentResults = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);

  useEffect(() => {
    const assessmentId = searchParams.get('id');
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (assessmentId) {
      fetchAssessment(assessmentId);
    } else {
      // Fetch the latest assessment for this user
      fetchLatestAssessment();
    }
  }, [user, searchParams]);

  const fetchAssessment = async (assessmentId: string) => {
    try {
      const { data, error } = await supabase
        .from('lead_responses')
        .select('*')
        .eq('id', assessmentId)
        .single();

      if (error) throw error;
      setAssessment(data as AssessmentData);
    } catch (error) {
      console.error('Error fetching assessment:', error);
      toast({
        title: 'Error',
        description: 'Failed to load assessment results',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestAssessment = async () => {
    try {
      const { data, error } = await supabase
        .from('lead_responses')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      setAssessment(data as AssessmentData);
    } catch (error) {
      console.error('Error fetching latest assessment:', error);
      toast({
        title: 'No Assessment Found',
        description: 'You haven\'t completed a wellness assessment yet.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getTierBadge = (tier: string | null) => {
    if (!tier) return null;
    
    const variants: Record<string, any> = {
      high: 'default',
      medium: 'secondary',
      low: 'destructive'
    };

    return (
      <Badge variant={variants[tier] || 'outline'}>
        {tier.toUpperCase()}
      </Badge>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      fitness: Dumbbell,
      nutrition: Apple,
      mental_health: Brain,
      sleep: Moon,
      stress: Heart,
      energy: Activity
    };
    
    const Icon = icons[category.toLowerCase()] || Target;
    return <Icon className="h-5 w-5" />;
  };

  const handleShareResults = () => {
    const url = `${window.location.origin}/assessment-results?id=${assessment?.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link Copied!',
      description: 'Assessment results link copied to clipboard'
    });
  };

  const handleEmailResults = () => {
    toast({
      title: 'Coming Soon',
      description: 'Email functionality will be available soon'
    });
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  if (!assessment) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Card>
            <CardHeader>
              <CardTitle>No Assessment Found</CardTitle>
              <CardDescription>
                You haven't completed a wellness assessment yet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  const categoryScores = assessment.category_scores || {};
  const overallScore = assessment.overall_score || 0;

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Wellness Assessment</h1>
            <p className="text-muted-foreground">
              Completed on {new Date(assessment.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShareResults}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleEmailResults}>
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {/* Overall Score */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Overall Wellness Score</CardTitle>
                <CardDescription>Your comprehensive health assessment</CardDescription>
              </div>
              {getTierBadge(assessment.tier)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`text-6xl font-bold mb-4 ${getScoreColor(overallScore)}`}>
                {overallScore}/100
              </div>
              <Progress value={overallScore} className="h-4 mb-4" />
              <p className="text-muted-foreground">
                {overallScore >= 70 && "Excellent work! You're maintaining great wellness habits."}
                {overallScore >= 40 && overallScore < 70 && "Good progress! There's room to optimize your wellness journey."}
                {overallScore < 40 && "This is your starting point. We'll help you improve step by step!"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Primary Goal */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              <CardTitle>Your Primary Goal</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{assessment.primary_goal}</p>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        {Object.keys(categoryScores).length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <CardTitle>Category Breakdown</CardTitle>
              </div>
              <CardDescription>
                Your scores across different wellness dimensions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {Object.entries(categoryScores)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .map(([category, score]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(category)}
                          <span className="font-medium capitalize">
                            {category.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <span className={`font-bold ${getScoreColor((score as number) * 10)}`}>
                          {score}/10
                        </span>
                      </div>
                      <Progress value={(score as number) * 10} className="h-2" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Personal Details */}
        <Card>
          <CardHeader>
            <CardTitle>Assessment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Activity Level</p>
                <p className="font-medium capitalize">{assessment.activity_level}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dietary Preferences</p>
                <p className="font-medium capitalize">{assessment.dietary_preferences}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Equipment</p>
                <p className="font-medium capitalize">{assessment.equipment}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Ready to Start Your Journey?</h3>
              <p className="text-muted-foreground">
                Based on your assessment, we've personalized your entire experience to help you achieve your goals.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/dashboard')} size="lg">
                  View Your Dashboard
                </Button>
                <Button onClick={() => navigate('/wellness')} variant="outline" size="lg">
                  Explore Wellness
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default AssessmentResults;
