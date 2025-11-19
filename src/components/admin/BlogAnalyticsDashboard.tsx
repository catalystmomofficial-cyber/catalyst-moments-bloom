import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Users, Clock, TrendingUp } from 'lucide-react';

interface BlogAnalytics {
  blog_id: string;
  blog_title: string;
  total_views: number;
  unique_visitors: number;
  avg_time_spent: number;
}

export function BlogAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<BlogAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_blog_analytics_summary', { days_back: timeRange });

      if (error) throw error;
      setAnalytics(data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalViews = analytics.reduce((sum, a) => sum + Number(a.total_views), 0);
  const totalUniqueVisitors = analytics.reduce((sum, a) => sum + Number(a.unique_visitors), 0);
  const avgTimeSpent = analytics.length > 0
    ? analytics.reduce((sum, a) => sum + Number(a.avg_time_spent || 0), 0) / analytics.length
    : 0;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Blog Analytics</CardTitle>
          <CardDescription>Loading analytics data...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last {timeRange} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last {timeRange} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time Spent</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgTimeSpent)}s</div>
            <p className="text-xs text-muted-foreground">Per article</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Popular Posts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.length}</div>
            <p className="text-xs text-muted-foreground">Published articles</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Posts Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Posts</CardTitle>
          <CardDescription>Views by blog post (last {timeRange} days)</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="blog_title" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_views" fill="#8884d8" name="Total Views" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              No analytics data available yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Engagement Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Metrics</CardTitle>
          <CardDescription>Average time spent per post</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="blog_title"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="avg_time_spent" 
                  stroke="#82ca9d" 
                  name="Avg Time (seconds)"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              No engagement data available yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
