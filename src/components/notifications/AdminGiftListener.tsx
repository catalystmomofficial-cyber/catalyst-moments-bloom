import { useEffect } from 'react';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Listens for admin-gifted points and pops up a celebratory toast in real-time.
 */
const AdminGiftListener = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`admin-gifts-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'points_transactions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const row = payload.new as {
            points: number;
            source: string;
            description: string | null;
          };
          if (row.source !== 'admin_adjustment') return;
          const reason =
            row.description?.replace(/^Admin adjustment:\s*/i, '') || 'being amazing';
          const verb = row.points >= 0 ? 'gifted you' : 'adjusted';
          toast.success(
            `Congrats! Admin ${verb} ${row.points >= 0 ? '+' : ''}${row.points} points for ${reason}!`,
            {
              icon: <Sparkles className="h-5 w-5 text-catalyst-gold" />,
              duration: 8000,
            }
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return null;
};

export default AdminGiftListener;
