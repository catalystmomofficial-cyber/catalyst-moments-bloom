import React, { useState, useEffect } from 'react';
import { DashboardCard } from './DashboardCard';
import { supabase } from '@/integrations/supabase/client';
import { Users, DollarSign, TrendingUp, Activity } from 'lucide-react';

interface OverviewStats {
  totalUsers: number;
  totalRevenue: number;
  activeSubscriptions: number;
  monthlyGrowth: number;
}

const OverviewSection = () => {
  const [stats, setStats] = useState<OverviewStats>({
    totalUsers: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    monthlyGrowth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        // Mock data for demo
        const totalUsers = 1247;
        const activeSubscriptions = 25;

        // Calculate monthly growth (mock data for now)
        const monthlyGrowth = 15.2;
        const totalRevenue = (activeSubscriptions || 0) * 29.99;

        setStats({
          totalUsers: totalUsers || 0,
          totalRevenue,
          activeSubscriptions: activeSubscriptions || 0,
          monthlyGrowth,
        });
      } catch (error) {
        console.error('Error fetching overview data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          subtitle="All registered users"
          colors={["hsl(var(--primary))", "hsl(var(--primary) / 0.8)", "hsl(var(--primary) / 0.6)"]}
          delay={0.1}
        >
          <Users className="h-8 w-8 text-primary/80" />
        </DashboardCard>

        <DashboardCard
          title="Monthly Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          subtitle="From active subscriptions"
          colors={["#10B981", "#34D399", "#6EE7B7"]}
          delay={0.2}
        >
          <DollarSign className="h-8 w-8 text-green-500" />
        </DashboardCard>

        <DashboardCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions}
          subtitle="Premium members"
          colors={["#8B5CF6", "#A78BFA", "#C4B5FD"]}
          delay={0.3}
        >
          <Activity className="h-8 w-8 text-purple-500" />
        </DashboardCard>

        <DashboardCard
          title="Monthly Growth"
          value={`${stats.monthlyGrowth}%`}
          subtitle="Increase in user signups"
          colors={["#F59E0B", "#FBBF24", "#FCD34D"]}
          delay={0.4}
        >
          <TrendingUp className="h-8 w-8 text-orange-500" />
        </DashboardCard>
      </div>
    </div>
  );
};

export { OverviewSection };