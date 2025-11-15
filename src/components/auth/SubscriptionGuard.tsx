import { ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDevBypass } from "@/hooks/useDevBypass";
import CheckoutModal from "@/components/subscription/CheckoutModal";
import { useSearchParams, useLocation } from "react-router-dom";

interface SubscriptionGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const SubscriptionGuard = ({ children, fallback }: SubscriptionGuardProps) => {
  const { subscribed, checkSubscription, user } = useAuth();
  const bypass = useDevBypass();
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
  
  console.log('[SUBSCRIPTION_GUARD] Subscription state:', { subscribed, bypass, route: location.pathname });
  
  if (bypass) {
    return <>{children}</>;
  }
  
  if (!subscribed) {
    console.log('[SUBSCRIPTION_GUARD] Not subscribed, showing modal:', showModal);
    
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Show the subscription modal when accessing protected features
    return (
      <>
        {children}
        {showModal && (
          <CheckoutModal 
            isOpen={true} 
            onClose={() => setShowModal(false)} 
          />
        )}
      </>
    );
  }
  
  return <>{children}</>;
};

export default SubscriptionGuard;