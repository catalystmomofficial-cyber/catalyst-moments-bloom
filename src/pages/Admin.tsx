import React from 'react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { UserPointsManager } from '@/components/admin/UserPointsManager';
import { AffiliateApplicationManager } from '@/components/admin/AffiliateApplicationManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Award, Users, BarChart3 } from 'lucide-react';

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

          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                User Points
              </TabsTrigger>
              <TabsTrigger value="affiliates" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Affiliate Applications
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <UserPointsManager />
            </TabsContent>

            <TabsContent value="affiliates">
              <AffiliateApplicationManager />
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Analytics Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Analytics Coming Soon</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Advanced analytics and reporting features will be available here soon. 
                      Track user engagement, points distribution, and affiliate performance.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AdminGuard>
    </PageLayout>
  );
};

export default Admin;