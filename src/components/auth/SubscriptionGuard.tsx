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
  const { subscribed, checkSubscription, user } = useAuth();
  const bypass = useDevBypass();
  const { isAdmin } = useAdminAuth();
  const [showModal, setShowModal] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // Routes that should NOT trigger the subscription modal
  const publicRoutes = ['/', '/auth', '/login', '/register', '/forgot-password', '/reset-password'];
  
  // Check if user just completed a successful payment
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      console.log('[SUBSCRIPTION_GUARD] Success redirect detected, refreshing subscription status');
      checkSubscription();
    }
  }, [searchParams, checkSubscription]);

  // Show modal immediately when accessing protected routes
  useEffect(() => {
    if (user && !subscribed && !bypass) {
      const isPublicRoute = publicRoutes.includes(location.pathname);
      setShowModal(!isPublicRoute);
    }
  }, [user, subscribed, bypass, location.pathname]);
  
  console.log('[SUBSCRIPTION_GUARD] Subscription state:', { subscribed, bypass, isAdmin, route: location.pathname });
  
  // Admins get free access
  if (isAdmin || bypass) {
    return <>{children}</>;
  }
  
  if (!subscribed) {
    console.log('[SUBSCRIPTION_GUARD] Not subscribed, showing modal:', showModal);
    
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
          onClose={() => window.location.href = '/'} 
        />
      </>
    );
  }
  
  return <>{children}</>;
};

export default SubscriptionGuard;