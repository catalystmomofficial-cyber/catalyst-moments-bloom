import { ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDevBypass } from "@/hooks/useDevBypass";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import CheckoutModal from "@/components/subscription/CheckoutModal";
import { useSearchParams, useLocation } from "react-router-dom";

interface SubscriptionGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const SubscriptionGuard = ({ children, fallback }: SubscriptionGuardProps) => {
  const { subscribed, isReturningCustomer, checkSubscription, user, isCheckingSubscription } = useAuth();
  const bypass = useDevBypass();
  const { isAdmin } = useAdminAuth();
  const [showModal, setShowModal] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Routes that should NOT trigger the subscription modal
  const publicRoutes = ['/', '/auth', '/login', '/register', '/forgot-password', '/reset-password', '/subscription-success', '/credit-purchase-success'];

  // Returning customers (previously purchased) keep dashboard + content access even when expired.
  // Premium tools are gated separately by PremiumToolGuard.
  const hasDashboardAccess = subscribed || isReturningCustomer;

  // Check if user just completed a successful payment
  useEffect(() => {
    if (searchParams.get('success') === 'true' || searchParams.get('session_id')) {
      console.log('[SUBSCRIPTION_GUARD] Success/session redirect detected, refreshing subscription status');
      checkSubscription();
    }
  }, [searchParams, checkSubscription]);

  // Show modal only when we KNOW the user has no access (not while checking)
  useEffect(() => {
    if (user && !hasDashboardAccess && !bypass && !isCheckingSubscription) {
      const isPublicRoute = publicRoutes.includes(location.pathname);
      setShowModal(!isPublicRoute);
    } else {
      setShowModal(false);
    }
  }, [user, hasDashboardAccess, bypass, isCheckingSubscription, location.pathname]);

  console.log('[SUBSCRIPTION_GUARD] State:', { subscribed, isReturningCustomer, bypass, isAdmin, route: location.pathname });

  // Admins and dev bypass get free access
  if (isAdmin || bypass) {
    return <>{children}</>;
  }

  // While verifying with the server, render content normally — never flash the paywall.
  if (!hasDashboardAccess && isCheckingSubscription) {
    return <>{children}</>;
  }

  if (!hasDashboardAccess) {
    console.log('[SUBSCRIPTION_GUARD] Brand-new user (no purchase history), showing paywall:', showModal);

    const isPublicRoute = publicRoutes.includes(location.pathname);

    // If on public route, show content normally
    if (isPublicRoute) {
      return <>{children}</>;
    }

    // If on protected route, show fallback or modal only (no content access)
    if (fallback) {
      return <>{fallback}</>;
    }

    // Show the subscription modal with dimmed background content
    return (
      <>
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
        <CheckoutModal
          isOpen={true}
          onClose={() => window.dispatchEvent(new CustomEvent('open-mobile-menu'))}
        />
      </>
    );
  }

  return <>{children}</>;
};

export default SubscriptionGuard;