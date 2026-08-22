import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDevBypass } from "@/hooks/useDevBypass";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import CheckoutModal from "@/components/subscription/CheckoutModal";
import { useSearchParams, useLocation } from "react-router-dom";
import { Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface SubscriptionGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const PUBLIC_ROUTES = [
  '/', '/auth', '/login', '/register', '/signup',
  '/forgot-password', '/reset-password',
  '/subscription-success', '/credit-purchase-success',
];

const ASSESSMENT_URL = "https://catalystmom.online";

const SubscriptionGuard = ({ children, fallback }: SubscriptionGuardProps) => {
  const { subscribed, isReturningCustomer, checkSubscription, user, isCheckingSubscription, setShowCheckoutModal } = useAuth();
  const bypass = useDevBypass();
  const { isAdmin } = useAdminAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const [stage, setStage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [hasAssessment, setHasAssessment] = useState<boolean | null>(null);

  const hasDashboardAccess = subscribed || isReturningCustomer;

  useEffect(() => {
    if (searchParams.get('success') === 'true' || searchParams.get('session_id')) {
      checkSubscription();
    }
  }, [searchParams, checkSubscription]);

  useEffect(() => {
    if (!user || hasDashboardAccess) return;
    supabase
      .from('profiles')
      .select('display_name, motherhood_stage, assessment_data, assessment_concern')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        const ad = data?.assessment_data as Record<string, string> | null;
        const hasFunnelData = !!(
          data?.assessment_concern || ad?.score || ad?.tier || ad?.concern
        );
        setHasAssessment(hasFunnelData);
        setStage(ad?.stage ?? data?.motherhood_stage ?? null);
        setFirstName(data?.display_name?.split(' ')[0] ?? null);
      });
  }, [user, hasDashboardAccess]);

  if (isAdmin || bypass) return <>{children}</>;

  if (isCheckingSubscription) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">Loading your account…</p>
        </div>
      </div>
    );
  }

  if (PUBLIC_ROUTES.includes(location.pathname)) return <>{children}</>;
  if (hasDashboardAccess) return <>{children}</>;
  if (fallback) return <>{fallback}</>;

  // No assessment data → redirect to assessment first
  if (hasAssessment === false) {
    return (
      <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-background px-6 text-center">
        <div className="max-w-sm space-y-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mx-auto">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Start with your free assessment</h2>
            <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
              Take the free 2-minute assessment first — your plan will be personalized from
              your answers, and you'll know exactly what you're getting before you pay.
            </p>
          </div>
          <Button className="w-full" onClick={() => { window.location.href = ASSESSMENT_URL; }}>
            Take the Free Assessment
          </Button>
          <button
            type="button"
            onClick={() => setHasAssessment(null)}
            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            I already took it — continue to checkout
          </button>
        </div>
      </div>
    );
  }

  // ── HARD PAYWALL ──
  // AssessmentGuideChat is rendered at app level in App.tsx — NOT here.
  // Having it in both places caused two instances to fight each other.
  // The app-level instance automatically appears above the paywall (z-[80])
  // because it's in the root stacking context, above this div's z-[60].
  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-background px-4">
      <CheckoutModal
        isOpen={true}
        stage={stage}
        firstName={firstName}
        onClose={() => {}}
      />
    </div>
  );
};

export default SubscriptionGuard;