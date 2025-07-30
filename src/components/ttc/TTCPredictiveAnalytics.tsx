import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Calendar, Target, AlertCircle, BarChart3, Clock } from 'lucide-react';

interface CyclePrediction {
  nextPeriod: Date;
  nextOvulation: Date;
  fertileWindowStart: Date;
  fertileWindowEnd: Date;
  confidence: number;
}

interface CycleTrends {
  averageCycleLength: number;
  cycleVariability: number;
  ovulationTiming: number;
  lutealPhaseLength: number;
  trends: {
    cycleLength: 'stable' | 'lengthening' | 'shortening';
    ovulation: 'consistent' | 'early' | 'late' | 'irregular';
    symptoms: string[];
  };
}

export const TTCPredictiveAnalytics = () => {
  const [prediction, setPrediction] = useState<CyclePrediction | null>(null);
  const [trends, setTrends] = useState<CycleTrends | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generatePredictions();
    analyzeTrends();
  }, []);

  const generatePredictions = () => {
    setLoading(true);
    
    // Simulate AI prediction based on cycle data
    setTimeout(() => {
      const today = new Date();
      const nextOvulation = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days from now
      const fertileWindowStart = new Date(nextOvulation.getTime() - 3 * 24 * 60 * 60 * 1000);
      const fertileWindowEnd = new Date(nextOvulation.getTime() + 1 * 24 * 60 * 60 * 1000);
      const nextPeriod = new Date(nextOvulation.getTime() + 14 * 24 * 60 * 60 * 1000);

      setPrediction({
        nextPeriod,
        nextOvulation,
        fertileWindowStart,
        fertileWindowEnd,
        confidence: 87
      });
      setLoading(false);
    }, 1500);
  };

  const analyzeTrends = () => {
    // Simulate trend analysis based on historical data
    setTrends({
      averageCycleLength: 28,
      cycleVariability: 2,
      ovulationTiming: 14,
      lutealPhaseLength: 14,
      trends: {
        cycleLength: 'stable',
        ovulation: 'consistent',
        symptoms: ['Clear CM on fertile days', 'Consistent BBT rise', 'Regular luteal phase']
      }
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDaysUntil = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'stable':
      case 'consistent':
        return '✓';
      case 'lengthening':
      case 'late':
        return '↗️';
      case 'shortening':
      case 'early':
        return '↘️';
      case 'irregular':
        return '⚠️';
      default:
        return '•';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Analyzing Your Cycle...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={33} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Using AI to analyze your cycle patterns and generate predictions...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Predictions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Cycle Predictions
          </CardTitle>
          <CardDescription>
            AI-powered predictions based on your cycle history
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {prediction && (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Prediction Confidence</span>
                <Badge className={getConfidenceColor(prediction.confidence)} variant="outline">
                  {prediction.confidence}% accurate
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-2 border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="font-medium">Next Ovulation</span>
                    </div>
                    <div className="text-lg font-bold">{formatDate(prediction.nextOvulation)}</div>
                    <div className="text-sm text-muted-foreground">
                      In {getDaysUntil(prediction.nextOvulation)} days
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Fertile Window</span>
                    </div>
                    <div className="text-sm font-semibold">
                      {formatDate(prediction.fertileWindowStart)} - {formatDate(prediction.fertileWindowEnd)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Starts in {getDaysUntil(prediction.fertileWindowStart)} days
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Next Period</span>
                    </div>
                    <div className="text-lg font-bold">{formatDate(prediction.nextPeriod)}</div>
                    <div className="text-sm text-muted-foreground">
                      In {getDaysUntil(prediction.nextPeriod)} days
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200 bg-purple-50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Best Timing</span>
                    </div>
                    <div className="text-sm font-semibold">Every other day</div>
                    <div className="text-sm text-muted-foreground">
                      During fertile window
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Trends Analysis Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Cycle Trends & Insights
          </CardTitle>
          <CardDescription>
            Patterns identified from your cycle data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {trends && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium">Average Cycle Length</span>
                  <div className="text-lg font-bold">{trends.averageCycleLength} days</div>
                  <div className="text-xs text-muted-foreground">
                    Variability: ±{trends.cycleVariability} days
                  </div>
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm font-medium">Ovulation Day</span>
                  <div className="text-lg font-bold">Day {trends.ovulationTiming}</div>
                  <div className="text-xs text-muted-foreground">
                    Luteal phase: {trends.lutealPhaseLength} days
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-medium">Trend Analysis</h4>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cycle Length</span>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <span>{getTrendIcon(trends.trends.cycleLength)}</span>
                      <span>{trends.trends.cycleLength}</span>
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ovulation Timing</span>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <span>{getTrendIcon(trends.trends.ovulation)}</span>
                      <span>{trends.trends.ovulation}</span>
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h5 className="text-sm font-medium">Positive Patterns</h5>
                  {trends.trends.symptoms.map((symptom, index) => (
                    <div key={index} className="text-xs text-muted-foreground flex items-center space-x-2">
                      <span className="text-green-600">✓</span>
                      <span>{symptom}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" size="sm" className="w-full">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Detailed Analytics
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-1" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-800">
                Improve Prediction Accuracy
              </p>
              <p className="text-xs text-blue-600">
                Log temperature, symptoms, and mood daily for more accurate predictions. 
                The more data we have, the better our AI can understand your unique patterns.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};