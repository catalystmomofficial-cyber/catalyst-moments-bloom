import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { COOKIE_SETTINGS_EVENT, readCookieConsent, saveCookieConsent } from "@/lib/cookieConsent";

const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const saved = readCookieConsent();
    if (!saved) setVisible(true);
    else {
      setAnalytics(saved.analytics);
      setMarketing(saved.marketing);
    }
    const open = () => {
      const current = readCookieConsent();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      setCustomizing(true);
      setVisible(true);
    };
    window.addEventListener(COOKIE_SETTINGS_EVENT, open);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, open);
  }, []);

  const handleChoice = (choice: "accepted" | "declined" | "custom") => {
    const previous = readCookieConsent();
    let next = previous;
    try {
      next = saveCookieConsent(
        choice === "accepted"
          ? { analytics: true, marketing: true }
          : choice === "declined"
            ? { analytics: false, marketing: false }
            : { analytics, marketing },
      );
    } catch {
      // ignore
    }
    setVisible(false);
    // A reload removes already-loaded third-party scripts when consent is
    // withdrawn. On the new page load, only the allowed categories start.
    if (previous && next && ((previous.analytics && !next.analytics) || (previous.marketing && !next.marketing))) {
      window.location.reload();
    }
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
        <p className="max-w-2xl text-sm leading-relaxed text-[#2C2218]">
          We use cookies to personalise your experience and improve Catalyst Mom. See our{" "}
          <Link to="/privacy" className="font-medium underline" style={{ color: "#B5651D" }}>
            Privacy Policy
          </Link>
          .
        </p>
        {customizing && (
          <div className="grid gap-2 text-sm sm:min-w-64">
            <label className="flex items-center justify-between gap-4"><span>Essential</span><input type="checkbox" checked disabled aria-label="Essential cookies are always active" /></label>
            <label className="flex items-center justify-between gap-4"><span>Analytics</span><input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} /></label>
            <label className="flex items-center justify-between gap-4"><span>Marketing</span><input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} /></label>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-4 sm:shrink-0">
          <button
            type="button"
            onClick={() => handleChoice("declined")}
            className="text-sm text-[#8A7060] underline-offset-2 hover:underline"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => handleChoice(customizing ? "custom" : "accepted")}
            className="rounded-md px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#B5651D" }}
          >
            {customizing ? "Save choices" : "Accept"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
