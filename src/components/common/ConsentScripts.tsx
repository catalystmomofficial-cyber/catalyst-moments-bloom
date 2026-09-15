import { useEffect } from "react";
import { COOKIE_CONSENT_EVENT, readCookieConsent, type CookieConsent } from "@/lib/cookieConsent";

declare global {
  interface Window {
    pintrk?: ((...args: unknown[]) => void) & { queue?: unknown[]; version?: string };
    clarity?: (...args: unknown[]) => void;
    omnisend?: unknown[];
  }
}

const addScript = (id: string, src: string) => {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
};

const enableAnalytics = () => {
  if (!window.clarity) {
    const clarity = (...args: unknown[]) => {
      (clarity as typeof window.clarity & { q?: unknown[][] }).q ||= [];
      (clarity as typeof window.clarity & { q?: unknown[][] }).q?.push(args);
    };
    window.clarity = clarity;
    addScript("catalyst-clarity", "https://www.clarity.ms/tag/xcankt4adz");
  }
};

const enableMarketing = () => {
  if (!window.pintrk) {
    const tracker = (...args: unknown[]) => tracker.queue?.push(args);
    tracker.queue = [];
    tracker.version = "3.0";
    window.pintrk = tracker;
    addScript("catalyst-pinterest-tag", "https://s.pinimg.com/ct/core.js");
    tracker("load", "2614036176727");
    tracker("page");
  }

  if (!document.getElementById("catalyst-omnisend")) {
    window.omnisend = window.omnisend || [];
    window.omnisend.push(["brandID", "6900970c13ca46de858ceadb"]);
    window.omnisend.push(["track", "$pageViewed"]);
    addScript("catalyst-omnisend", "https://omnisnippet1.com/inshop/launcher-v2.js");
  }
};

const applyConsent = (consent: CookieConsent | null) => {
  if (consent?.analytics) enableAnalytics();
  if (consent?.marketing) enableMarketing();
};

const ConsentScripts = () => {
  useEffect(() => {
    applyConsent(readCookieConsent());
    const onChange = (event: Event) => applyConsent((event as CustomEvent<CookieConsent>).detail);
    window.addEventListener(COOKIE_CONSENT_EVENT, onChange);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onChange);
  }, []);

  return null;
};

export default ConsentScripts;
