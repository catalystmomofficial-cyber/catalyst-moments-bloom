import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDevBypass } from "@/hooks/useDevBypass";

interface SubscriptionGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const SubscriptionGuard = ({ children, fallback }: SubscriptionGuardProps) => {
  const { subscribed, setShowCheckoutModal } = useAuth();
  const bypass = useDevBypass();
  
  if (bypass) {
    return <>{children}</>;
  }
  
  if (!subscribed) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Show checkout modal immediately for premium content
    setShowCheckoutModal(true);
    return null;
  }
  
  return <>{children}</>;
};

export default SubscriptionGuard;