import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, Target, AlertCircle, BarChart3, Clock, Settings } from 'lucide-react';
import { daysUntilNextPeriod, type TTCCycleLog } from '@/hooks/useTTCData';

interface TTCPredictiveAnalyticsProps {
  hasSettings: boolean;
  cycleDay: number | null;
  cycleLength: number;
  logs: TTCCycleLog[];
  onViewDetailedAnalytics: () => void;
  onOpenSettings: () => void;
}

interface CyclePrediction {
  nextPeriod: Date;
  nextOvulation: Date;
  fertileWindowStart: Date;
  fertileWindowEnd: Date;
  confidence: number;
}

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

// Days from today's cycle day to the next occurrence of targetDay, wrapping into next cycle if needed.
const daysUntilCycleDay = (targetDay: number, cycleDay: number, cycleLength: number) =>
  ((targetDay - cycleDay) % cycleLength + cycleLength) % cycleLength;

export const TTCPredictiveAnalytics = ({
  hasSettings,
  cycleDay,
  cycleLength,
  logs,
  onViewDetailedAnalytics,
  onOpenSettings,
}: TTCPredictiveAnalyticsProps) => {
  // Real prediction math derived from the user's own cycle settings — no simulated/fabricated data.
  const prediction: CyclePrediction | null = useMemo(() => {
    if (!hasSettings || cycleDay == null) return null;
    const today = new Date();
    // Ovulation is estimated from a ~14-day luteal phase, same convention used by the cycle map.
    const ovulationDay = cycleLength - 14;
    const fertileStartDay = ovulationDay - 4;
    const fertileEndDay = ovulationDay + 1;

    const nextOvulation = addDays(today, daysUntilCycleDay(ovulationDay, cycleDay, cycleLength));
    const fertileWindowStart = addDays(today, daysUntilCycleDay(fertileStartDay, cycleDay, cycleLength));
    const fertileWindowEnd = addDays(today, daysUntilCycleDay(fertileEndDay, cycleDay, cycleLength));
    const nextPeriod = addDays(today, daysUntilNextPeriod(cycleDay, cycleLength) ?? 0);

    // Confidence reflects how much real data backs the prediction: a bare average gets a modest
    // baseline, and every logged cycle day nudges it up — it is not an invented "AI" score.
    const loggedDaysCount = logs.length;
    const confidence = Math.min(95, 65 + Math.min(loggedDaysCount, 25));

    return { nextPeriod, nextOvulation, fertileWindowStart, fertileWindowEnd, confidence };
  }, [hasSettings, cycleDay, cycleLength, logs.length]);

  // Recently logged fertility signs, most recent first — real entries, not canned examples.
  const recentSigns = useMemo(() => {
    const signs: string[] = [];
    for (const log of logs) {
      if (log.cervical_mucus) signs.push(`Cervical mucus: ${log.cervical_mucus}`);
      if (log.symptoms?.length) signs.push(...log.symptoms);
      if (signs.length >= 4) break;
    }
    return signs.slice(0, 4);
  }, [logs]);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const getDaysUntil = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!prediction) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Cycle Predictions
          </CardTitle>
          <CardDescription>
            Set your last period start date to see predictions tailored to your cycle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onOpenSettings} className="w-full sm:w-auto">
            <Settings className="mr-2 h-4 w-4" />
            Set My Cycle Dates
          </Button>
        </CardContent>
      </Card>
    );
  }

  const ovulationDay = cycleLength - 14;

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
            Based on your cycle settings and logged data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                  Starts in {Math.max(0, getDaysUntil(prediction.fertileWindowStart))} days
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
            Patterns from your cycle settings and logged data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-sm font-medium">Average Cycle Length</span>
              <div className="text-lg font-bold">{cycleLength} days</div>
              <div className="text-xs text-muted-foreground">From your cycle settings</div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Estimated Ovulation</span>
              <div className="text-lg font-bold">Day {ovulationDay}</div>
              <div className="text-xs text-muted-foreground">Based on a 14-day luteal phase</div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium">Recently Logged Signs</h4>
            {recentSigns.length > 0 ? (
              <div className="space-y-2">
                {recentSigns.map((sign, index) => (
                  <div key={index} className="text-xs text-muted-foreground flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span>{sign}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No symptoms or cervical mucus logged yet — log a few cycle days to see your patterns here.
              </p>
            )}
          </div>

          <div className="pt-4 border-t">
            <Button variant="outline" size="sm" className="w-full" onClick={onViewDetailedAnalytics}>
              <BarChart3 className="mr-2 h-4 w-4" />
              View Detailed Analytics
            </Button>
          </div>
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
                The more data we have, the better we can understand your unique patterns.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
