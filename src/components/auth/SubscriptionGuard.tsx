import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDevBypass } from "@/hooks/useDevBypass";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import CheckoutModal from "@/components/subscription/CheckoutModal";
import AssessmentGuideChat from "@/components/subscription/AssessmentGuideChat";
import { useSearchParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface SubscriptionGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// Routes that are always public — never blocked by the paywall
const PUBLIC_ROUTES = [
  '/', '/auth', '/login', '/register', '/signup',
  '/forgot-password', '/reset-password',
  '/subscription-success', '/credit-purchase-success',
];

const SubscriptionGuard = ({ children, fallback }: SubscriptionGuardProps) => {
  const { subscribed, isReturningCustomer, checkSubscription, user, isCheckingSubscription, setShowCheckoutModal } = useAuth();
  const bypass = useDevBypass();
  const { isAdmin } = useAdminAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Returning customers (previously purchased) keep dashboard + content access even when expired.
  const hasDashboardAccess = subscribed || isReturningCustomer;

  // Refresh subscription status after a successful payment redirect
  useEffect(() => {
    if (searchParams.get('success') === 'true' || searchParams.get('session_id')) {
      checkSubscription();
    }
  }, [searchParams, checkSubscription]);

  // Admins and dev bypass get free access — render immediately
  if (isAdmin || bypass) {
    return <>{children}</>;
  }

  // While verifying subscription with the server: show a neutral loading screen
  // so the user never sees any app content flash before the paywall.
  if (isCheckingSubscription) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">Loading your account…</p>
        </div>
      </div>
    );
  }

  // Public routes — always show content
  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // User has access — show content
  if (hasDashboardAccess) {
    return <>{children}</>;
  }

  // ── HARD PAYWALL ──
  // No content visible, no blurred ghost, no way around it.
  // The only action available is to complete payment.
  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background px-4">
      {/* Minimal branded header so it doesn't feel broken */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-foreground">
          Unlock Catalyst Mom
        </h2>
        <p className="mt-2 text-muted-foreground text-sm max-w-xs">
          Choose your plan to get full access to workouts, meal plans, coaching, and more.
        </p>
      </div>

      <CheckoutModal
        isOpen={true}
        onClose={() => {
          // Closing the modal on the paywall just re-opens it —
          // there is nowhere else to go without a subscription.
          setShowCheckoutModal(true);
        }}
      />

      {/* Assessment Guide Chat — floats above the paywall, only shows
          for users who arrived from the assessment funnel. */}
      <AssessmentGuideChat />
    </div>
  );
};

export default SubscriptionGuard;