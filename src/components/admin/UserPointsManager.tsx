import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Edit, Award, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserWithPoints {
  user_id: string;
  email: string;
  display_name: string;
  total_points: number;
  level: number;
  created_at: string;
}

export const UserPointsManager: React.FC = () => {
  const [users, setUsers] = useState<UserWithPoints[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithPoints | null>(null);
  const [pointsAdjustment, setPointsAdjustment] = useState('');
  const [reason, setReason] = useState('');
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.rpc('get_all_users_with_points');
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePointsAdjustment = async () => {
    const amount = Number.parseInt(pointsAdjustment, 10);

    if (!selectedUser) return;
    if (!Number.isFinite(amount) || amount === 0) {
      toast({
        title: 'Enter a points amount',
        description: 'Use a non-zero number (negative to remove).',
        variant: 'destructive',
      });
      return;
    }
    if (!reason.trim()) {
      toast({
        title: 'Reason required',
        description: 'Tell the user why they got this adjustment.',
        variant: 'destructive',
      });
      return;
    }

    setIsAdjusting(true);
    const targetId = selectedUser.user_id;
    const targetName = selectedUser.display_name || selectedUser.email;

    try {
      console.log('[admin_adjust_user_points] calling', {
        target_user_id: targetId,
        points_adjustment: amount,
        reason,
      });

      const { data, error } = await supabase.rpc('admin_adjust_user_points', {
        target_user_id: targetId,
        points_adjustment: amount,
        reason: reason.trim(),
      });

      console.log('[admin_adjust_user_points] response', { data, error });

      if (error) throw error;

      // Pull the authoritative fresh row straight from the database.
      const { data: fresh, error: freshError } = await supabase
        .from('user_points')
        .select('total_points, level')
        .eq('user_id', targetId)
        .maybeSingle();

      if (freshError) throw freshError;

      const newTotal = fresh?.total_points ?? 0;
      const newLevel = fresh?.level ?? 1;

      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === targetId
            ? { ...u, total_points: newTotal, level: newLevel }
            : u
        )
      );

      toast({
        title: 'Points adjusted',
        description: `${amount >= 0 ? '+' : ''}${amount} pts for ${targetName}. New balance: ${newTotal}. ${
          onlineUsers.has(targetId)
            ? 'They are online — celebration sent live!'
            : "They'll see it on next sign-in."
        }`,
      });

      setDialogOpen(false);
      setSelectedUser(null);
      setPointsAdjustment('');
      setReason('');

      // Background full refresh to keep sort order accurate.
      fetchUsers();
    } catch (err: any) {
      console.error('Error adjusting points:', err);
      toast({
        title: 'Failed to adjust points',
        description: err?.message || err?.error_description || 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsAdjusting(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Subscribe to the shared online-users presence channel
  useEffect(() => {
    const channel = supabase.channel('online-users');

    const syncOnline = () => {
      const state = channel.presenceState() as Record<string, unknown[]>;
      setOnlineUsers(new Set(Object.keys(state)));
    };

    channel
      .on('presence', { event: 'sync' }, syncOnline)
      .on('presence', { event: 'join' }, syncOnline)
      .on('presence', { event: 'leave' }, syncOnline)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
          <Award className="h-5 w-5" />
          User Points Management
          <Badge variant="outline" className="ml-2 gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            {onlineUsers.size} online
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Member Since</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const isOnline = onlineUsers.has(user.user_id);
                return (
                  <TableRow key={user.user_id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'h-2.5 w-2.5 rounded-full shrink-0',
                            isOnline
                              ? 'bg-emerald-500 shadow-[0_0_0_3px_hsl(var(--background))] ring-2 ring-emerald-500/30 animate-pulse'
                              : 'bg-muted-foreground/40'
                          )}
                          title={isOnline ? 'Online now' : 'Offline'}
                          aria-label={isOnline ? 'Online now' : 'Offline'}
                        />
                        <span className="font-medium">
                          {user.display_name || 'Unknown User'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{user.total_points}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge>{user.level}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setPointsAdjustment('');
                          setReason('');
                          setDialogOpen(true);
                        }}
                      >
                        <Sparkles className="h-4 w-4 mr-1" />
                        Adjust Points
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Adjust Points for {selectedUser?.display_name || selectedUser?.email}
                {selectedUser && onlineUsers.has(selectedUser.user_id) && (
                  <Badge variant="outline" className="gap-1.5 ml-auto">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Online now
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Current Points</label>
                <div className="text-2xl font-bold text-primary">
                  {selectedUser?.total_points ?? 0}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Points Adjustment</label>
                <Input
                  type="number"
                  placeholder="Enter points to add/remove (use negative to remove)"
                  value={pointsAdjustment}
                  onChange={(e) => setPointsAdjustment(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Reason</label>
                <Textarea
                  placeholder="e.g. completing the 7-day birth ball challenge"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  maxLength={200}
                />
              </div>
              <Button
                onClick={handlePointsAdjustment}
                disabled={isAdjusting}
                className="w-full"
              >
                {isAdjusting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Apply & Celebrate
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
