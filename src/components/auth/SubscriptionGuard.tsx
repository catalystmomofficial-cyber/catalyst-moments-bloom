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
  const { subscribed, checkSubscription, user } = useAuth();
  const bypass = useDevBypass();
  const [showModal, setShowModal] = useState(false);
  const [searchParams] = useSearchParams();
  const [hasSeenDashboard, setHasSeenDashboard] = useState(false);
  
  // Check if user just completed a successful payment
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      console.log('[SUBSCRIPTION_GUARD] Success redirect detected, refreshing subscription status');
      checkSubscription();
    }
  }, [searchParams, checkSubscription]);

  // Allow users to see the dashboard first before showing subscription modal
  useEffect(() => {
    if (user && !subscribed && !bypass) {
      // Give users 5 seconds to see the dashboard before showing the modal
      const timer = setTimeout(() => {
        setHasSeenDashboard(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [user, subscribed, bypass]);
  
  console.log('[SUBSCRIPTION_GUARD] Subscription state:', { subscribed, bypass, hasSeenDashboard });
  
  if (bypass) {
    return <>{children}</>;
  }
  
  if (!subscribed) {
    console.log('[SUBSCRIPTION_GUARD] Not subscribed, showing content with delayed modal');
    
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Show the dashboard content, and after delay, show the subscription modal
    return (
      <>
        {children}
        {hasSeenDashboard && (
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