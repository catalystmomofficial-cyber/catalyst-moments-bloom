import React from 'react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { UserPointsManager } from '@/components/admin/UserPointsManager';
import { PendingUsersSection } from '@/components/admin/PendingUsersSection';
import { AffiliateSection } from '@/components/admin/AffiliateSection';
import { OverviewSection } from '@/components/admin/OverviewSection';
import { UsersSection } from '@/components/admin/UsersSection';
import { RevenueSection } from '@/components/admin/RevenueSection';
import { AnalyticsSection } from '@/components/admin/AnalyticsSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Award, Users, BarChart3, DollarSign, TrendingUp, Sparkles, CreditCard, FileText } from 'lucide-react';
import { BlogPostGenerator } from '@/components/admin/BlogPostGenerator';
import { BlogPostManager } from '@/components/admin/BlogPostManager';
import { BlogAnalyticsDashboard } from '@/components/admin/BlogAnalyticsDashboard';
import { SubscriptionSection } from '@/components/admin/SubscriptionSection';
import { BlogSchedulerSetup } from '@/components/admin/BlogSchedulerSetup';
import { StageChangeRequestsSection } from '@/components/admin/StageChangeRequestsSection';

const Admin = () => {
  return (
    <PageLayout>
      <AdminGuard>
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            </div>
            <p className="text-muted-foreground">
              Manage users, points, and affiliate applications
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="subscriptions" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Subscriptions
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="revenue" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Revenue
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="affiliates" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Affiliates
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Blog
              </TabsTrigger>
              <TabsTrigger value="blog-analytics" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Blog Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <OverviewSection />
            </TabsContent>

            <TabsContent value="subscriptions">
              <SubscriptionSection />
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <PendingUsersSection />
              <StageChangeRequestsSection />
              <UsersSection />
              <UserPointsManager />
            </TabsContent>

            <TabsContent value="revenue">
              <RevenueSection />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsSection />
            </TabsContent>

            <TabsContent value="affiliates">
              <AffiliateSection />
            </TabsContent>

            <TabsContent value="blog" className="space-y-6">
              <BlogSchedulerSetup />
              <BlogPostGenerator />
              <BlogPostManager />
            </TabsContent>

            <TabsContent value="blog-analytics">
              <BlogAnalyticsDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </AdminGuard>
    </PageLayout>
  );
};

export default Admin;