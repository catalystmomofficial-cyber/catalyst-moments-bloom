import React, { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { GlowingShadow } from "@/components/ui/glowing-shadow";

// Native assessment invite popup — no third-party service, no external branding.
// Shows once per visitor (7-day snooze on dismiss), only for logged-out users,
// after 10s on page OR 35% scroll depth, whichever comes first.
const SNOOZE_KEY = "cm_assessment_popup_dismissed_at";
const SNOOZE_DAYS = 7;

const ASSESSMENT_BASE = "https://catalystmom.online";
const UTM = "utm_source=app-site&utm_medium=popup&utm_campaign=assessment-invite";

const stages = [
  { label: "Trying to Conceive", emoji: "🌱", href: `${ASSESSMENT_BASE}/ttc-assessment?${UTM}` },
  { label: "I'm Pregnant", emoji: "🤰", href: `${ASSESSMENT_BASE}/pregnancy-assessment?${UTM}` },
  { label: "I'm Postpartum", emoji: "🤱", href: `${ASSESSMENT_BASE}/postpartum-assessment?${UTM}` },
];

const AssessmentPopup = () => {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const shownRef = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const snoozed = useCallback(() => {
    try {
      const at = localStorage.getItem(SNOOZE_KEY);
      if (!at) return false;
      return Date.now() - Number(at) < SNOOZE_DAYS * 24 * 60 * 60 * 1000;
    } catch {
      return false;
    }
  }, []);

  const dismiss = useCallback(() => {
    setOpen(false);
    try {
      localStorage.setItem(SNOOZE_KEY, String(Date.now()));
    } catch {
      /* private mode — just close */
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated || snoozed()) return;

    const show = () => {
      if (!shownRef.current) {
        shownRef.current = true;
        setOpen(true);
      }
    };

    const timer = window.setTimeout(show, 10000);

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable >= 0.35) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [isAuthenticated, snoozed]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    dialogRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 motion-reduce:animate-none"
      onClick={dismiss}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="assessment-popup-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl bg-background border border-catalyst-copper/20 shadow-2xl p-6 sm:p-8 animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300 motion-reduce:animate-none"
      >
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-3 right-3 p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 id="assessment-popup-title" className="text-2xl font-bold mb-2 text-foreground">
          Take the free 2-minute assessment
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          Get your Maternal Wellness Score. Where are you right now?
        </p>

        <div className="space-y-3">
          {stages.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="flex items-center gap-3 w-full rounded-xl border border-catalyst-copper/25 px-4 py-3 font-medium text-foreground hover:bg-catalyst-copper hover:text-white transition-colors group"
            >
              <span className="text-xl" aria-hidden="true">{s.emoji}</span>
              <span>{s.label}</span>
              <span className="ml-auto opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
            </a>
          ))}
        </div>

        <p className="text-[11px] text-muted-foreground text-center mt-4">
          Get your score instantly • No credit card
        </p>
      </div>
    </div>
  );
};

export default AssessmentPopup;
