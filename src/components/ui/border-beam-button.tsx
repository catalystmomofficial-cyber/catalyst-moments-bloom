import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export type BorderBeamColorVariant = "colorful" | "ocean" | "sunset" | "mono";
export type BorderBeamSize = "sm" | "md" | "line";

const COLOR_GRADIENTS: Record<BorderBeamColorVariant, string> = {
  // Brand-leaning warm sweep: copper -> gold -> peach -> copper
  colorful:
    "conic-gradient(from var(--beam-angle), hsl(25 60% 45%) 0%, hsl(38 85% 58%) 25%, hsl(15 75% 60%) 50%, hsl(45 70% 65%) 75%, hsl(25 60% 45%) 100%)",
  // Cool teal/blue sweep
  ocean:
    "conic-gradient(from var(--beam-angle), hsl(195 70% 45%) 0%, hsl(175 60% 50%) 33%, hsl(210 65% 55%) 66%, hsl(195 70% 45%) 100%)",
  // Copper -> rose -> gold, warm "golden hour" feel
  sunset:
    "conic-gradient(from var(--beam-angle), hsl(20 80% 55%) 0%, hsl(340 65% 60%) 40%, hsl(38 85% 60%) 75%, hsl(20 80% 55%) 100%)",
  // Single-tone copper, no hue shift — for a quieter, "always on brand" look
  mono: "conic-gradient(from var(--beam-angle), hsl(var(--primary)) 0%, hsl(var(--primary) / 0.35) 50%, hsl(var(--primary)) 100%)",
};

const BEAM_RING: Record<Exclude<BorderBeamSize, "line">, { width: string; blur: string; glowOpacity: string }> = {
  sm: { width: "1.5px", blur: "10px", glowOpacity: "0.35" },
  md: { width: "2.5px", blur: "16px", glowOpacity: "0.5" },
};

interface BorderBeamStyleProps {
  colorVariant?: BorderBeamColorVariant;
  beamSize?: BorderBeamSize;
  active?: boolean;
  staticColors?: boolean;
  borderBeamClassName?: string;
  radius?: string;
}

function BeamStyles({
  id,
  colorVariant = "colorful",
  beamSize = "md",
  active = true,
  staticColors = false,
  radius = "0.75rem",
}: BorderBeamStyleProps & { id: string }) {
  const gradient = COLOR_GRADIENTS[colorVariant];
  const isLine = beamSize === "line";
  const ring = BEAM_RING[isLine ? "sm" : beamSize];

  return (
    <style>{`
      @property --beam-angle {
        syntax: "<angle>";
        inherits: false;
        initial-value: 0deg;
      }
      .beam-${id} {
        position: relative;
        isolation: isolate;
        border-radius: ${radius};
      }
      .beam-${id}::before {
        content: "";
        position: absolute;
        pointer-events: none;
        border-radius: inherit;
        z-index: 1;
        ${isLine
          ? `
        inset: auto 6% -1px 6%;
        height: 2px;
        background: ${gradient};
        opacity: ${active ? 0.9 : 0.3};
        filter: blur(0.5px);
        `
          : `
        inset: -${ring.width};
        padding: ${ring.width};
        background: ${gradient};
        -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        opacity: ${active ? 1 : 0.4};
        `}
        ${active && !staticColors ? `animation: beam-spin-${id} 3.5s linear infinite;` : ""}
      }
      .beam-${id}::after {
        content: "";
        position: absolute;
        inset: -${isLine ? "2px" : ring.width};
        border-radius: inherit;
        z-index: 0;
        pointer-events: none;
        background: ${gradient};
        filter: blur(${ring.blur});
        opacity: ${active ? ring.glowOpacity : "0"};
        ${active && !staticColors ? `animation: beam-spin-${id} 3.5s linear infinite;` : ""}
        transition: opacity 0.3s ease;
      }
      .beam-${id} > * {
        position: relative;
        z-index: 2;
      }
      @keyframes beam-spin-${id} {
        to { --beam-angle: 360deg; }
      }
      @media (prefers-reduced-motion: reduce) {
        .beam-${id}::before, .beam-${id}::after { animation: none !important; }
      }
    `}</style>
  );
}

export interface BorderBeamButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    BorderBeamStyleProps {
  variant?: "default" | "outline" | "secondary" | "ghost";
  asChild?: boolean;
}

const VARIANT_CLASS: Record<NonNullable<BorderBeamButtonProps["variant"]>, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
};

export const BorderBeamButton = React.forwardRef<HTMLButtonElement, BorderBeamButtonProps>(
  (
    {
      variant = "default",
      colorVariant = "colorful",
      beamSize = "md",
      active = true,
      staticColors = false,
      borderBeamClassName,
      className,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
    const Comp = asChild ? Slot : "button";
    // Mirror full-width intent onto the wrapper — otherwise an inline-block
    // wrapper around a `w-full` button just shrink-wraps to content width.
    const fillsWidth = typeof className === "string" && /\bw-full\b/.test(className);

    return (
      <div className={cn(`beam-${id}`, "rounded-xl", fillsWidth ? "block w-full" : "inline-block", borderBeamClassName)}>
        <BeamStyles id={id} colorVariant={colorVariant} beamSize={beamSize} active={active} staticColors={staticColors} />
        <Comp
          ref={ref}
          className={cn(
            "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-colors h-10 px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
            VARIANT_CLASS[variant],
            className
          )}
          {...props}
        >
          {children}
        </Comp>
      </div>
    );
  }
);
BorderBeamButton.displayName = "BorderBeamButton";

export interface BorderBeamIconButtonProps extends BorderBeamButtonProps {
  "aria-label": string;
}

export const BorderBeamIconButton = React.forwardRef<HTMLButtonElement, BorderBeamIconButtonProps>(
  ({ className, ...props }, ref) => (
    <BorderBeamButton ref={ref} className={cn("h-10 w-10 p-0", className)} {...props} />
  )
);
BorderBeamIconButton.displayName = "BorderBeamIconButton";
