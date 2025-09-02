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
    console.log('[SUBSCRIPTION_GUARD] Dev bypass active, allowing access');
    return <>{children}</>;
  }
  
  if (!subscribed) {
    console.log('[SUBSCRIPTION_GUARD] Not subscribed, blocking access');
    if (fallback) {
      console.log('[SUBSCRIPTION_GUARD] Returning fallback component');
      return <>{fallback}</>;
    }
    
    console.log('[SUBSCRIPTION_GUARD] No fallback, showing subscription prompt');
    // Show subscription prompt instead of blank screen
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <SubscriptionPrompt 
            title="Premium Access Required"
            description="Upgrade to premium to access this feature and unlock all content."
            action="Subscribe Now"
          />
        </div>
      </div>
    );
  }
  
  console.log('[SUBSCRIPTION_GUARD] Subscribed, allowing access');
  return <>{children}</>;
};

export default SubscriptionGuard;