import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

/**
 * Compact points pill — sits on the stage row at the top of the dashboard.
 * Reads the same user_points.total_points source as before (negative values included)
 * and refreshes on the existing 'points-updated' event.
 */
export const PointsBalance = () => {
  const { user } = useAuth();
  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const fetchPoints = async () => {
      const { data } = await supabase
        .from('user_points')
        .select('total_points')
        .eq('user_id', user.id)
        .maybeSingle();
      if (!cancelled) setPoints(data?.total_points ?? 0);
    };
    fetchPoints();
    const handler = () => fetchPoints();
    window.addEventListener('points-updated', handler);
    return () => {
      cancelled = true;
      window.removeEventListener('points-updated', handler);
    };
  }, [user]);

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap"
      style={{
        background: 'rgba(244,197,160,0.3)',
        color: '#8B4513',
        padding: '7px 14px',
        fontSize: '13px',
      }}
      title="Points balance"
    >
      <Sparkles className="h-3.5 w-3.5" />
      {points ?? '—'} pts
    </span>
  );
};

export default PointsBalance;
