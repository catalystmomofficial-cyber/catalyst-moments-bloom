import { useEffect, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Mounts inside the Router and keeps subscription status fresh:
 *  1. On every route change (cheap — server is the source of truth)
 *  2. When the tab regains focus / becomes visible (covers Stripe return)
 *  3. Aggressive polling for ~30s after detecting a Stripe success redirect
 *     (?success=true or ?session_id=...) to bridge Stripe → Supabase delay.
 */
const SubscriptionRefresher = () => {
  const { user, checkSubscription, subscribed } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const lastPathRef = useRef<string>("");
  const pollingRef = useRef<number | null>(null);

  // 1. Refresh on route change (only when path actually changes)
  useEffect(() => {
    if (!user) return;
    if (lastPathRef.current === location.pathname) return;
    lastPathRef.current = location.pathname;
    checkSubscription();
  }, [location.pathname, user, checkSubscription]);

  // 2. Refresh on tab focus / visibility
  useEffect(() => {
    if (!user) return;
    const onFocus = () => checkSubscription();
    const onVisible = () => {
      if (document.visibilityState === "visible") checkSubscription();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [user, checkSubscription]);

  // 3. Stripe return — poll until subscribed flips true (or timeout)
  useEffect(() => {
    if (!user) return;
    const isStripeReturn =
      searchParams.get("success") === "true" ||
      !!searchParams.get("session_id");
    if (!isStripeReturn || subscribed) return;

    let attempts = 0;
    const maxAttempts = 10; // ~30s total
    pollingRef.current = window.setInterval(async () => {
      attempts += 1;
      await checkSubscription();
      if (attempts >= maxAttempts && pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }, 3000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [user, searchParams, subscribed, checkSubscription]);

  // Stop polling as soon as we detect an active subscription
  useEffect(() => {
    if (subscribed && pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, [subscribed]);

  return null;
};

export default SubscriptionRefresher;
