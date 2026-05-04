import { ReactNode } from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useDevBypass } from '@/hooks/useDevBypass';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PremiumToolGuardProps {
  children: ReactNode;
  toolName?: string;
  description?: string;
  /** When true, blur the children behind the prompt instead of replacing them */
  preview?: boolean;
}

/**
 * Gates premium tools (Kick Counter, Contraction Tracker, AI Insights) behind
 * an active subscription. Unsubscribed users still keep dashboard + purchased
 * program content access — they only lose these tools and see a renew prompt.
 */
export const PremiumToolGuard = ({
  children,
  toolName = 'This tool',
  description = 'Renew your subscription to unlock this premium tool again.',
  preview = false,
}: PremiumToolGuardProps) => {
  const { subscribed, isCheckingSubscription, user } = useAuth();
  const bypass = useDevBypass();
  const { isAdmin } = useAdminAuth();

  // Full access tiers
  if (isAdmin || bypass || subscribed) {
    return <>{children}</>;
  }

  // While verifying, render content normally — never flash the lock
  if (isCheckingSubscription) {
    return <>{children}</>;
  }

  const handleRenew = async () => {
    if (!user) {
      window.location.href = '/auth/login';
      return;
    }
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('[PremiumToolGuard] checkout error:', err);
      toast.error('Could not start checkout. Please try again.');
    }
  };

  const Prompt = (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
      <CardContent className="p-6 text-center space-y-4">
        <div className="mx-auto h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
          <Lock className="h-6 w-6 text-amber-600" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-amber-900">
            {toolName} is a premium tool
          </h3>
          <p className="text-sm text-amber-800/80 max-w-sm mx-auto">
            {description}
          </p>
        </div>
        <Button
          onClick={handleRenew}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Renew subscription
        </Button>
        <p className="text-xs text-amber-700/70">
          Your dashboard and purchased programs stay available.
        </p>
      </CardContent>
    </Card>
  );

  if (preview) {
    return (
      <div className="relative">
        <div className="pointer-events-none select-none opacity-30 blur-sm">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center p-4">
          {Prompt}
        </div>
      </div>
    );
  }

  return Prompt;
};

export default PremiumToolGuard;
