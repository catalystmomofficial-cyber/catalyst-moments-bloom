import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface UserPoints {
  total_points: number;
  level: number;
  user_id: string;
}

interface PointsTransaction {
  id: string;
  points: number;
  transaction_type: string;
  source: string;
  description: string | null;
  created_at: string;
  user_id: string;
}

export const usePointsSystem = () => {
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserPoints();
      fetchTransactions();
    }
  }, [user]);

  const fetchUserPoints = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setUserPoints(data);
      } else {
        // Initialize user points if doesn't exist
        const { data: newData, error: insertError } = await supabase
          .from('user_points')
          .insert({
            user_id: user.id,
            total_points: 0,
            level: 1
          })
          .select()
          .single();

        if (insertError) throw insertError;
        setUserPoints(newData);
      }
    } catch (error) {
      console.error('Error fetching user points:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('points_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const awardPoints = async (points: number, source: string, description?: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('add_user_points', {
        p_user_id: user.id,
        p_points: points,
        p_source: source,
        p_description: description
      });

      if (error) throw error;

      // Refresh data
      await fetchUserPoints();
      await fetchTransactions();

      toast({
        title: "Points earned! 🎉",
        description: `You earned ${points} points for ${description || source}!`
      });
    } catch (error) {
      console.error('Error awarding points:', error);
      toast({
        title: "Error",
        description: "Failed to award points.",
        variant: "destructive"
      });
    }
  };

  const redeemPointsForDiscount = async (pointsToRedeem: number, description?: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.rpc('redeem_points_for_discount', {
        p_user_id: user.id,
        p_points_to_redeem: pointsToRedeem,
        p_description: description
      });

      if (error) throw error;

      const result = data[0];
      
      if (result.success) {
        await fetchUserPoints();
        await fetchTransactions();
        
        toast({
          title: "Points redeemed! 💰",
          description: `You got ${result.discount_percentage}% discount! ${result.remaining_points} points remaining.`
        });
      } else {
        toast({
          title: "Insufficient points",
          description: "You don't have enough points for this discount.",
          variant: "destructive"
        });
      }

      return result;
    } catch (error) {
      console.error('Error redeeming points:', error);
      toast({
        title: "Error",
        description: "Failed to redeem points.",
        variant: "destructive"
      });
      return null;
    }
  };

  const getDiscountInfo = (points: number) => {
    const maxDiscount = 30;
    const discountPercentage = Math.min(maxDiscount, Math.floor(points / 10));
    const pointsNeeded = discountPercentage * 10;
    return { discountPercentage, pointsNeeded };
  };

  return {
    userPoints,
    transactions,
    loading,
    awardPoints,
    redeemPointsForDiscount,
    getDiscountInfo,
    refreshData: () => {
      fetchUserPoints();
      fetchTransactions();
    }
  };
};