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
    
    // Checkout temporarily disabled in editor: allow access
    return <>{children}</>;
  }
  
  return <>{children}</>;
};

export default SubscriptionGuard;