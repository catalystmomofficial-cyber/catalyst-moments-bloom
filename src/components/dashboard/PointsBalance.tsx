import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
      <CardContent className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-primary/10 p-2 rounded-lg shrink-0">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Points Balance</p>
            <p className="font-semibold text-lg">{points ?? '—'} Points</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground hidden sm:block max-w-[55%] text-right">
          Redeem for exclusive digital products and premium services.
        </p>
      </CardContent>
    </Card>
  );
};

export default PointsBalance;
