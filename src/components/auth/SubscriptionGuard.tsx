import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDevBypass } from "@/hooks/useDevBypass";

interface SubscriptionGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const SubscriptionGuard = ({ children, fallback }: SubscriptionGuardProps) => {
  const { subscribed } = useAuth();
  const bypass = useDevBypass();
  
  console.log('[SUBSCRIPTION_GUARD] Subscription state:', { subscribed, bypass });
  
  if (bypass) {
    console.log('[SUBSCRIPTION_GUARD] Dev bypass active, allowing access');
    return <>{children}</>;
  }
  
  if (!subscribed) {
    console.log('[SUBSCRIPTION_GUARD] Not subscribed, blocking access');
    if (fallback) {
      console.log('[SUBSCRIPTION_GUARD] Returning fallback component');
      return <>{fallback}</>;
    }
    
    console.log('[SUBSCRIPTION_GUARD] No fallback, returning null');
    // Subscription required for access
    return null;
  }
  
  console.log('[SUBSCRIPTION_GUARD] Subscribed, allowing access');
  return <>{children}</>;
};

export default SubscriptionGuard;