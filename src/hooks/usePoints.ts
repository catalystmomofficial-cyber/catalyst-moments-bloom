import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function usePoints() {
  const { user } = useAuth();

  const awardPoints = useCallback(
    async (points: number, source: string, description?: string) => {
      if (!user) return;
      try {
        await supabase.rpc('add_user_points', {
          p_user_id: user.id,
          p_points: points,
          p_source: source,
          p_description: description ?? null,
        });
      } catch (err) {
        console.error('Failed to award points:', err);
      }
    },
    [user]
  );

  const getPoints = useCallback(async () => {
    if (!user) return { total: 0, level: 1 };
    const { data } = await supabase
      .from('user_points')
      .select('total_points, level')
      .eq('user_id', user.id)
      .maybeSingle();
    return { total: data?.total_points ?? 0, level: data?.level ?? 1 };
  }, [user]);

  return { awardPoints, getPoints };
}
