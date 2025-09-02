
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useDevBypass } from "@/hooks/useDevBypass";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const bypass = useDevBypass();

  console.log('[PRIVATE_ROUTE] Auth state:', { isAuthenticated, isLoading, bypass, location: location.pathname });

  if (bypass) {
    console.log('[PRIVATE_ROUTE] Dev bypass active, allowing access');
    return <>{children}</>;
  }
  
  if (isLoading) {
    console.log('[PRIVATE_ROUTE] Still loading, showing spinner');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    console.log('[PRIVATE_ROUTE] Not authenticated, redirecting to login');
    // Save the current location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  console.log('[PRIVATE_ROUTE] Authenticated, rendering children');
  return <>{children}</>;
};

export default PrivateRoute;
