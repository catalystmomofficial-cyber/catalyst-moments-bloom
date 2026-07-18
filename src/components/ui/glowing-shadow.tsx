import { type ReactNode } from "react";

interface GlowingShadowProps {
  children: ReactNode;
  className?: string;
  /** Corner radius to match the wrapped card. Tailwind class fragment, e.g. "1rem". */
  radius?: string;
}

/**
 * Animated glowing-shadow wrapper for highlighting a featured pricing card.
 * Wrap a Card (or any element with its own background) — the wrapper renders
 * a rotating conic border + soft outer glow behind the child.
 *
 * Uses the brand copper accent (hsl(var(--primary))) so it fits the theme.
 */
export function GlowingShadow({ children, className = "", radius = "1rem" }: GlowingShadowProps) {
  return (
    <div
      className={`glow-shadow-wrap ${className}`}
      style={{ borderRadius: radius }}
    >
      <style>{`
        @property --glow-angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }
        .glow-shadow-wrap {
          position: relative;
          isolation: isolate;
          overflow: visible;
        }
        .glow-shadow-wrap::before,
        .glow-shadow-wrap::after {
          content: "";
          position: absolute;
          inset: -4px;
          border-radius: inherit;
          background: conic-gradient(
            from var(--glow-angle),
            hsl(var(--primary)) 0deg,
            hsl(25 90% 65%) 90deg,
            hsl(45 95% 62%) 180deg,
            hsl(15 85% 55%) 270deg,
            hsl(var(--primary)) 360deg
          );
          animation: glow-shadow-spin 5s linear infinite;
          pointer-events: none;
        }
        .glow-shadow-wrap::before {
          padding: 3px;
          -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          z-index: 1;
        }
        .glow-shadow-wrap::after {
          inset: -12px;
          filter: blur(24px);
          opacity: 0.75;
          z-index: 0;
        }
        .glow-shadow-wrap > *:not(style) {
          position: relative;
          z-index: 2;
          border-radius: inherit;
        }
        @keyframes glow-shadow-spin {
          to { --glow-angle: 360deg; }
        }
        @media (prefers-reduced-motion: reduce) {
          .glow-shadow-wrap::before,
          .glow-shadow-wrap::after { animation: none; }
        }
      `}</style>
      {children}
    </div>
  );
}

export default GlowingShadow;
