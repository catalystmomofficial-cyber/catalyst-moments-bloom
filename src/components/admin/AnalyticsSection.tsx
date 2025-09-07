import React, { useState, useEffect } from 'react';
import { DashboardCard } from './DashboardCard';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Eye, MousePointer, Clock, Zap } from 'lucide-react';

interface AnalyticsStats {
  totalPageViews: number;
  averageSessionDuration: string;
  bounceRate: number;
  conversionRate: number;
}

const AnalyticsSection = () => {
  const [analyticsStats, setAnalyticsStats] = useState<AnalyticsStats>({
    totalPageViews: 0,
    averageSessionDuration: '0m',
    bounceRate: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  // Mock analytics data (in real app, this would come from Google Analytics or similar)
  const pageViewsData = [
    { page: 'Dashboard', views: 15420, uniqueViews: 12300 },
    { page: 'Workouts', views: 12800, uniqueViews: 9800 },
    { page: 'Recipes', views: 11200, uniqueViews: 8900 },
    { page: 'Community', views: 9600, uniqueViews: 7200 },
    { page: 'Wellness', views: 8400, uniqueViews: 6500 },
  ];

  const userEngagementData = [
    { name: 'High Engagement', value: 45, color: '#10B981' },
    { name: 'Medium Engagement', value: 35, color: '#3B82F6' },
    { name: 'Low Engagement', value: 20, color: '#F59E0B' },
  ];

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        // Mock analytics calculations (in real app, integrate with analytics service)
        setAnalyticsStats({
          totalPageViews: 57420,
          averageSessionDuration: '4m 32s',
          bounceRate: 28.5,
          conversionRate: 3.2,
        });
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) {
    return <div className="h-64 bg-muted/50 rounded-lg animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Page Views"
          value={analyticsStats.totalPageViews.toLocaleString()}
          subtitle="Last 30 days"
          colors={["#3B82F6", "#60A5FA", "#93C5FD"]}
          delay={0.1}
        >
          <Eye className="h-8 w-8 text-blue-500" />
        </DashboardCard>

        <DashboardCard
          title="Avg Session Duration"
          value={analyticsStats.averageSessionDuration}
          subtitle="Time spent per session"
          colors={["#10B981", "#34D399", "#6EE7B7"]}
          delay={0.2}
        >
          <Clock className="h-8 w-8 text-green-500" />
        </DashboardCard>

        <DashboardCard
          title="Bounce Rate"
          value={`${analyticsStats.bounceRate}%`}
          subtitle="Single page sessions"
          colors={["#F59E0B", "#FBBF24", "#FCD34D"]}
          delay={0.3}
        >
          <MousePointer className="h-8 w-8 text-orange-500" />
        </DashboardCard>

        <DashboardCard
          title="Conversion Rate"
          value={`${analyticsStats.conversionRate}%`}
          subtitle="Visitors to subscribers"
          colors={["#8B5CF6", "#A78BFA", "#C4B5FD"]}
          delay={0.4}
        >
          <Zap className="h-8 w-8 text-purple-500" />
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-background/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Most Popular Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pageViewsData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis type="number" />
                <YAxis dataKey="page" type="category" width={80} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-medium">{label}</p>
                          <p className="text-primary">
                            Views: {payload[0].value?.toLocaleString()}
                          </p>
                          <p className="text-muted-foreground">
                            Unique: {payload[0].payload.uniqueViews?.toLocaleString()}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="views" 
                  fill="hsl(var(--primary))"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-background/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userEngagementData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userEngagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-medium">{payload[0].name}</p>
                          <p className="text-primary">
                            {payload[0].value}% of users
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { AnalyticsSection };