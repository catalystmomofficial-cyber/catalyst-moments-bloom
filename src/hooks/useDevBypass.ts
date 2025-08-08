import { useEffect, useState } from "react";

/**
 * Development-only bypass for auth/subscription guards.
 * Activate with ?bypass=1 in the URL (persists in localStorage).
 * Disable with ?bypass=0.
 */
export function useDevBypass() {
  const [bypass, setBypass] = useState<boolean>(() => {
    try {
      return localStorage.getItem("dev_bypass") === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has("bypass")) {
        const val = params.get("bypass") === "1" ? "1" : "0";
        localStorage.setItem("dev_bypass", val);
        setBypass(val === "1");
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

export default useDevBypass;
