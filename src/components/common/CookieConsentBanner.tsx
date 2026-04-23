import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const STORAGE_KEY = "cookie-consent";

const CookieConsentBanner = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, [isAuthenticated, isLoading]);

  const handleChoice = (choice: "accepted" | "declined") => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[9999] border-t border-black/10 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-sm leading-relaxed text-[#2C2218]">
          We use cookies to personalise your experience and improve our platform. By continuing you accept our{" "}
          <Link to="/privacy" className="font-medium underline" style={{ color: "#B5651D" }}>
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex items-center gap-4 sm:shrink-0">
          <button
            type="button"
            onClick={() => handleChoice("declined")}
            className="text-sm text-[#8A7060] underline-offset-2 hover:underline"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => handleChoice("accepted")}
            className="rounded-md px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#B5651D" }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
