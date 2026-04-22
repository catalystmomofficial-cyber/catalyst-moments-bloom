import React, { useState, useEffect } from 'react';
import { DashboardCard } from './DashboardCard';
import { BulkAffiliateApproval } from './BulkAffiliateApproval';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  TrendingUp,
  Users,
  DollarSign,
  Award,
  Eye,
  Check,
  X,
  Clock,
  Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AffiliateApplication {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  social_media_handles: string | null;
  audience_size: string | null;
  experience: string | null;
  motivation: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

const AffiliateSection = () => {
  const [applications, setApplications] = useState<AffiliateApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [selected, setSelected] = useState<AffiliateApplication | null>(null);
  const { toast } = useToast();

  const fetchApplications = async () => {
    try {
      const { data, error } = await (supabase as any).rpc(
        'get_all_affiliate_applications'
      );
      if (error) throw error;
      setApplications((data || []) as AffiliateApplication[]);
    } catch (e: any) {
      toast({
        title: 'Failed to load applications',
        description: e.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setActioningId(id);
    try {
      const { error } = await (supabase as any).rpc('update_affiliate_status', {
        application_id: id,
        new_status: status,
      });
      if (error) throw error;
      toast({
        title: status === 'approved' ? 'Approved' : 'Rejected',
        description: `Application ${status}.`,
      });
      await fetchApplications();
      setSelected(null);
    } catch (e: any) {
      toast({
        title: 'Action failed',
        description: e.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setActioningId(null);
    }
  };

  const stats = {
    totalAffiliates: applications.filter((a) => a.status === 'approved').length,
    pendingApplications: applications.filter((a) => a.status === 'pending').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
    total: applications.length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
            <Check className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-500/20 text-red-600 border-red-500/30">
            <X className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  if (loading) {
    return <div className="h-64 bg-muted/50 rounded-lg animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Approved Affiliates"
          value={stats.totalAffiliates.toLocaleString()}
          subtitle="Active partners"
          colors={['#3B82F6', '#60A5FA', '#93C5FD']}
          delay={0.1}
        >
          <Users className="h-8 w-8 text-blue-500" />
        </DashboardCard>

        <DashboardCard
          title="Pending Applications"
          value={stats.pendingApplications}
          subtitle="Awaiting review"
          colors={['#F59E0B', '#FBBF24', '#FCD34D']}
          delay={0.2}
        >
          <Clock className="h-8 w-8 text-orange-500" />
        </DashboardCard>

        <DashboardCard
          title="Rejected"
          value={stats.rejected}
          subtitle="Not approved"
          colors={['#EF4444', '#F87171', '#FCA5A5']}
          delay={0.3}
        >
          <X className="h-8 w-8 text-red-500" />
        </DashboardCard>

        <DashboardCard
          title="Total Applications"
          value={stats.total}
          subtitle="All time"
          colors={['#8B5CF6', '#A78BFA', '#C4B5FD']}
          delay={0.4}
        >
          <TrendingUp className="h-8 w-8 text-purple-500" />
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <BulkAffiliateApproval />
        </motion.div>

        <Card className="bg-background/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              All Applications ({applications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No applications yet.
              </p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {applications.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">
                        {app.full_name}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {app.email}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {app.audience_size || 'No role'} • Applied{' '}
                        {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      {getStatusBadge(app.status)}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => setSelected(app)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Full Name</div>
                <div className="font-medium">{selected.full_name}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Email</div>
                <div className="font-medium">{selected.email}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Role</div>
                <div className="font-medium">
                  {selected.audience_size || '—'}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Social / Website</div>
                <div className="font-medium">
                  {selected.social_media_handles || '—'}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Why partner</div>
                <div className="whitespace-pre-wrap">{selected.motivation}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Status:</span>
                {getStatusBadge(selected.status)}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1"
                  onClick={() => updateStatus(selected.id, 'approved')}
                  disabled={actioningId === selected.id || selected.status === 'approved'}
                >
                  {actioningId === selected.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => updateStatus(selected.id, 'rejected')}
                  disabled={actioningId === selected.id || selected.status === 'rejected'}
                >
                  {actioningId === selected.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <X className="h-4 w-4 mr-2" />
                  )}
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { AffiliateSection };
