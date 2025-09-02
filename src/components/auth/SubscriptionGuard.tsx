import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDevBypass } from "@/hooks/useDevBypass";
import SubscriptionPrompt from "@/components/subscription/SubscriptionPrompt";

interface SubscriptionGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const SubscriptionGuard = ({ children, fallback }: SubscriptionGuardProps) => {
  const { subscribed } = useAuth();
  const bypass = useDevBypass();
  
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
    return <SubscriptionPrompt />;
  }
  
  return <>{children}</>;
};

export default SubscriptionGuard;