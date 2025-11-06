import { useEffect, useState } from "react";

/**
 * Development-only bypass for auth/subscription guards.
 * SECURITY: Only works in development environments.
 * Activate with ?bypass=1 in the URL (persists in localStorage).
 * Disable with ?bypass=0.
 */
export function useDevBypass() {
  const [bypass, setBypass] = useState<boolean>(() => {
    try {
      // Only allow bypass in development environments
      if (!isDevelopment()) {
        return false;
      }
      return localStorage.getItem("dev_bypass") === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      // Security check: Only allow bypass in development
      if (!isDevelopment()) {
        // Clear any existing bypass in production
        localStorage.removeItem("dev_bypass");
        setBypass(false);
        return;
      }

      const params = new URLSearchParams(window.location.search);
      if (params.has("bypass")) {
        const val = params.get("bypass") === "1" ? "1" : "0";
        localStorage.setItem("dev_bypass", val);
        setBypass(val === "1");
        
        // Log bypass attempts for security monitoring
        console.warn('[SECURITY] Dev bypass', val === "1" ? 'enabled' : 'disabled');
        
        // Clean the URL by removing the bypass param
        const url = new URL(window.location.href);
        params.delete("bypass");
        url.search = params.toString();
        window.history.replaceState({}, "", url.toString());
      }
    } catch {
      // no-op
    }
  }, []);

  return bypass;
}

/**
 * Check if we're in a development environment
 * SECURITY: Only trust NODE_ENV, not URL-based checks that can be spoofed
 */
function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

export default useDevBypass;
