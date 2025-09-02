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
  
  if (bypass) {
    return <>{children}</>;
  }
  
  if (!subscribed) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Subscription required for access
    return null;
  }
  
  return <>{children}</>;
};

export default SubscriptionGuard;