export const COOKIE_CONSENT_KEY = "catalyst-cookie-consent";
export const COOKIE_CONSENT_EVENT = "catalyst-cookie-consent-changed";
export const COOKIE_SETTINGS_EVENT = "catalyst-open-cookie-settings";

export type CookieConsent = {
  version: 1;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

export const readCookieConsent = (): CookieConsent | null => {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (value) {
      const parsed = JSON.parse(value) as CookieConsent;
      if (parsed.version === 1) return parsed;
    }

    // Honour choices saved by the previous banner without silently expanding
    // an old acceptance into marketing consent.
    const legacy = window.localStorage.getItem("cookie-consent");
    if (legacy === "declined") {
      return { version: 1, analytics: false, marketing: false, updatedAt: new Date().toISOString() };
    }
  } catch {
    return null;
  }

  return null;
};

export const saveCookieConsent = (preferences: Pick<CookieConsent, "analytics" | "marketing">) => {
  const consent: CookieConsent = {
    version: 1,
    ...preferences,
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  window.localStorage.removeItem("cookie-consent");
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: consent }));
  return consent;
};

export const openCookieSettings = () => {
  window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT));
};

