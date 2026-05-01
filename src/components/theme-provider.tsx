import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Theme = "light" | "dark";

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const STORAGE_KEY = "catalyst-theme";

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "light",
  setTheme: () => null,
  toggleTheme: () => null,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    return stored === "dark" || stored === "light" ? stored : "light";
  });

  // Track current user so theme follows the account across reinstalls/devices.
  const userIdRef = useRef<string | null>(null);
  const hydratedFromServerRef = useRef(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  // On auth changes, hydrate theme from the user's profile (server-side persistence).
  useEffect(() => {
    const hydrateFromProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("theme_preference")
          .eq("user_id", userId)
          .maybeSingle();
        if (error) return;
        const remote = (data as any)?.theme_preference as Theme | null;
        if (remote === "light" || remote === "dark") {
          hydratedFromServerRef.current = true;
          localStorage.setItem(STORAGE_KEY, remote);
          setThemeState(remote);
        } else {
          // No remote preference yet — push current local theme up so it persists.
          const local = (localStorage.getItem(STORAGE_KEY) as Theme | null) || theme;
          await supabase
            .from("profiles")
            .update({ theme_preference: local })
            .eq("user_id", userId);
          hydratedFromServerRef.current = true;
        }
      } catch {
        /* non-fatal */
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user?.id ?? null;
      userIdRef.current = uid;
      if (uid) {
        // Defer to avoid blocking auth callback.
        setTimeout(() => hydrateFromProfile(uid), 0);
      } else {
        hydratedFromServerRef.current = false;
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      const uid = session?.user?.id ?? null;
      userIdRef.current = uid;
      if (uid) hydrateFromProfile(uid);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const setTheme = (t: Theme) => {
    localStorage.setItem(STORAGE_KEY, t);
    setThemeState(t);
    const uid = userIdRef.current;
    if (uid) {
      // Persist to profile so it survives reinstall and follows the user across devices.
      supabase
        .from("profiles")
        .update({ theme_preference: t })
        .eq("user_id", uid)
        .then(() => {});
    }
  };

  return (
    <ThemeProviderContext.Provider
      value={{ theme, setTheme, toggleTheme: () => setTheme(theme === "light" ? "dark" : "light") }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeProviderContext);
