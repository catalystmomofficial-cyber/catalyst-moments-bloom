import { cn } from "@/lib/utils";

interface BreathingLoaderProps {
  /** Show the "Breathe in… / and slowly out…" cue under the circle */
  withLabel?: boolean;
  /** Diameter preset */
  size?: "sm" | "md";
  className?: string;
}

/**
 * The Breathing Signature loader — replaces spinners on calm surfaces.
 * A soft copper circle expanding and settling on a 10s cycle
 * (4s inhale / 6s exhale ≈ 6 breaths per minute), so every wait
 * becomes a small guided breath. Falls back to a static circle
 * for reduced-motion users.
 */
const BreathingLoader = ({ withLabel = true, size = "md", className }: BreathingLoaderProps) => {
  const stage = size === "sm" ? "h-16 w-16" : "h-24 w-24";
  const dot = size === "sm" ? "h-11 w-11" : "h-16 w-16";

  return (
    <div className={cn("flex flex-col items-center gap-3", className)} role="status" aria-label="Loading">
      <div className={cn("relative grid place-items-center", stage)}>
        <div className="absolute inset-0 rounded-full border border-catalyst-copper/40" aria-hidden="true" />
        <div
          className={cn(
            "rounded-full bg-gradient-to-br from-catalyst-peach to-catalyst-copper",
            "animate-breathe-loader motion-reduce:animate-none",
            dot
          )}
          aria-hidden="true"
        />
      </div>
      {withLabel && (
        <div className="relative h-5 w-40 text-center text-sm text-muted-foreground" aria-hidden="true">
          <span className="absolute inset-0 animate-breathe-label-in motion-reduce:animate-none">
            Breathe in&hellip;
          </span>
          <span className="absolute inset-0 opacity-0 animate-breathe-label-out motion-reduce:hidden">
            and slowly out&hellip;
          </span>
        </div>
      )}
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default BreathingLoader;
