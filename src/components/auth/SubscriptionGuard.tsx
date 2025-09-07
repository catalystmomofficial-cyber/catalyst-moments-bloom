import { ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDevBypass } from "@/hooks/useDevBypass";
import CheckoutModal from "@/components/subscription/CheckoutModal";
import { useSearchParams } from "react-router-dom";

interface SubscriptionGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const SubscriptionGuard = ({ children, fallback }: SubscriptionGuardProps) => {
  const { subscribed, checkSubscription } = useAuth();
  const bypass = useDevBypass();
  const [showModal, setShowModal] = useState(false);
  const [searchParams] = useSearchParams();
  
  // Check if user just completed a successful payment
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      console.log('[SUBSCRIPTION_GUARD] Success redirect detected, refreshing subscription status');
      checkSubscription();
    }
  }, [searchParams, checkSubscription]);
  
  console.log('[SUBSCRIPTION_GUARD] Subscription state:', { subscribed, bypass });
  
  if (bypass) {
    return <>{children}</>;
  }
  
  if (!subscribed) {
    console.log('[SUBSCRIPTION_GUARD] Not subscribed, blocking access');
    
    if (fallback) {
      return <>{fallback}</>;
    }
    
    console.log('[SUBSCRIPTION_GUARD] No fallback, showing subscription prompt');
    return (
      <>
        {children}
        <CheckoutModal 
          isOpen={true} 
          onClose={() => setShowModal(false)} 
        />
      </>
    );
  }
  
  return <>{children}</>;
};

export default SubscriptionGuard;