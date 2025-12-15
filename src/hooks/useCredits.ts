import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Credit costs for different features
export const CREDIT_COSTS = {
  voice_call: 5,
  text_chat: 2,
} as const;

// Credit packs available for purchase
export const CREDIT_PACKS = {
  small: { id: 'small', credits: 50, price: 2.99, label: '50 Credits', popular: false },
  medium: { id: 'medium', credits: 150, price: 6.99, label: '150 Credits', popular: true },
  large: { id: 'large', credits: 500, price: 14.99, label: '500 Credits', popular: false },
} as const;

export const useCredits = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchCredits = useCallback(async () => {
    if (!user?.id) {
      setCredits(0);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('get_user_credits', {
        p_user_id: user.id
      });

      if (error) throw error;
      setCredits(data || 0);
    } catch (error) {
      console.error('Error fetching credits:', error);
      setCredits(0);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  const deductCredits = async (amount: number, source: string, description?: string): Promise<{ success: boolean; remaining: number; error?: string }> => {
    if (!user?.id) {
      return { success: false, remaining: 0, error: 'Not authenticated' };
    }

    try {
      const { data, error } = await supabase.rpc('deduct_user_credits', {
        p_user_id: user.id,
        p_amount: amount,
        p_source: source,
        p_description: description || `Used ${amount} credits for ${source}`
      });

      if (error) throw error;

      const result = data?.[0];
      if (result?.success) {
        setCredits(result.remaining_points);
        return { success: true, remaining: result.remaining_points };
      } else {
        return { success: false, remaining: result?.remaining_points || 0, error: result?.error_message || 'Insufficient credits' };
      }
    } catch (error) {
      console.error('Error deducting credits:', error);
      return { success: false, remaining: credits, error: 'Failed to deduct credits' };
    }
  };

  const purchaseCredits = async (packId: keyof typeof CREDIT_PACKS) => {
    try {
      const { data, error } = await supabase.functions.invoke('purchase-credits', {
        body: { packId }
      });

      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
        return { success: true };
      }
      
      return { success: false, error: 'No checkout URL returned' };
    } catch (error) {
      console.error('Error purchasing credits:', error);
      return { success: false, error: 'Failed to start purchase' };
    }
  };

  const hasEnoughCredits = (amount: number) => credits >= amount;

  return {
    credits,
    loading,
    fetchCredits,
    deductCredits,
    purchaseCredits,
    hasEnoughCredits,
    CREDIT_COSTS,
    CREDIT_PACKS,
  };
};
