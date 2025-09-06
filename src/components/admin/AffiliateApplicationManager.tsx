import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, Check, X, Users } from 'lucide-react';

interface AffiliateApplication {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  social_media_handles: string;
  audience_size: string;
  experience: string;
  motivation: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const AffiliateApplicationManager: React.FC = () => {
  const [applications, setApplications] = useState<AffiliateApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<AffiliateApplication | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const fetchApplications = async () => {
    try {
      console.log('[ADMIN] Fetching affiliate applications...');
      const { data, error } = await supabase.rpc('get_all_affiliate_applications');
      
      console.log('[ADMIN] RPC response:', { data, error });
      
      if (error) throw error;
      
      console.log('[ADMIN] Applications loaded:', data?.length || 0);
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load affiliate applications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.rpc('update_affiliate_status', {
        application_id: applicationId,
        new_status: status
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Application ${status} successfully`,
      });

      // Refresh applications data
      await fetchApplications();
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Affiliate Application Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Audience Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <div className="font-medium">{application.full_name}</div>
                  </TableCell>
                  <TableCell>{application.email}</TableCell>
                  <TableCell>{application.audience_size}</TableCell>
                  <TableCell>{getStatusBadge(application.status)}</TableCell>
                  <TableCell>
                    {new Date(application.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedApplication(application)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              Affiliate Application - {application.full_name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                <div className="text-sm">{application.full_name}</div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Email</label>
                                <div className="text-sm">{application.email}</div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Social Media</label>
                                <div className="text-sm">{application.social_media_handles || 'Not provided'}</div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Audience Size</label>
                                <div className="text-sm">{application.audience_size}</div>
                              </div>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Experience</label>
                              <div className="text-sm mt-1 p-3 bg-muted rounded-md">
                                {application.experience}
                              </div>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Motivation</label>
                              <div className="text-sm mt-1 p-3 bg-muted rounded-md">
                                {application.motivation}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t">
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Current Status</label>
                                <div className="mt-1">{getStatusBadge(application.status)}</div>
                              </div>
                              
                              {application.status === 'pending' && (
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => updateApplicationStatus(application.id, 'rejected')}
                                    disabled={isUpdating}
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                  <Button
                                    onClick={() => updateApplicationStatus(application.id, 'approved')}
                                    disabled={isUpdating}
                                  >
                                    {isUpdating ? (
                                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                    ) : (
                                      <Check className="h-4 w-4 mr-1" />
                                    )}
                                    Approve
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      {application.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateApplicationStatus(application.id, 'rejected')}
                            disabled={isUpdating}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => updateApplicationStatus(application.id, 'approved')}
                            disabled={isUpdating}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};