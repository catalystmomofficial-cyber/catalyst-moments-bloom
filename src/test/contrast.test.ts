import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Automated WCAG contrast checks for hero and navbar text in
 * both light and dark modes. Tokens are parsed directly from
 * src/index.css so the tests stay in sync with the design system.
 */

type Hsl = { h: number; s: number; l: number };

const css = readFileSync(resolve(__dirname, "../index.css"), "utf8");

function parseTokens(scope: ":root" | ".dark"): Record<string, Hsl> {
  // Match the first block for the given selector
  const re = new RegExp(`${scope.replace(".", "\\.")}\\s*\\{([\\s\\S]*?)\\}`);
  const match = css.match(re);
  if (!match) throw new Error(`Could not find ${scope} block in index.css`);
  const body = match[1];
  const tokens: Record<string, Hsl> = {};
  const varRe = /--([a-z-]+):\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/g;
  let m: RegExpExecArray | null;
  while ((m = varRe.exec(body)) !== null) {
    tokens[m[1]] = { h: +m[2], s: +m[3], l: +m[4] };
  }
  return tokens;
}

function hslToRgb({ h, s, l }: Hsl): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((v) => Math.round(v * 255)) as [number, number, number];
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

function relLuminance([r, g, b]: [number, number, number]): number {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(fg: [number, number, number], bg: [number, number, number]): number {
  const L1 = relLuminance(fg);
  const L2 = relLuminance(bg);
  const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (hi + 0.05) / (lo + 0.05);
}

const light = parseTokens(":root");
const dark = parseTokens(".dark");

const CATALYST = {
  copper: hexToRgb("#C17F45"),
  gold: hexToRgb("#D4A76A"),
  peach: hexToRgb("#FDE1D3"),
  cream: hexToRgb("#FFF8F0"),
  brown: hexToRgb("#5D2906"),
};

// AA thresholds
const AA_NORMAL = 4.5;
const AA_LARGE = 3.0; // also used for UI/non-text per WCAG 1.4.11

describe("Contrast: light mode", () => {
  const bg = hslToRgb(light.background);
  const fg = hslToRgb(light.foreground);
  const muted = hslToRgb(light["muted-foreground"]);

  it("hero heading (foreground on background) meets AA normal", () => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it("hero paragraph (muted-foreground on background) meets AA normal", () => {
    expect(contrast(muted, bg)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('hero "Journey" accent (catalyst-copper on background) meets AA large', () => {
    // Large text (>=24px / 18.66px bold) — heading is ~text-5xl
    expect(contrast(CATALYST.copper, bg)).toBeGreaterThanOrEqual(AA_LARGE);
  });

  it("navbar links (muted-foreground on background) meet AA normal", () => {
    expect(contrast(muted, bg)).toBeGreaterThanOrEqual(AA_NORMAL);
  });
});

describe("Contrast: dark mode", () => {
  const bg = hslToRgb(dark.background);
  const card = hslToRgb(dark.card);
  const fg = hslToRgb(dark.foreground);
  const muted = hslToRgb(dark["muted-foreground"]);

  it("hero heading (foreground on background) meets AA normal", () => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it("hero paragraph (muted-foreground / peach on background) meets AA normal", () => {
    expect(contrast(muted, bg)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('hero "Journey" accent (catalyst-gold on dark background) meets AA large', () => {
    // We swap copper -> gold in dark mode for the hero accent.
    expect(contrast(CATALYST.gold, bg)).toBeGreaterThanOrEqual(AA_LARGE);
  });

  it("navbar links (muted-foreground on background) meet AA normal", () => {
    expect(contrast(muted, bg)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it("testimonial body text (foreground on card) meets AA normal", () => {
    expect(contrast(fg, card)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it("testimonial author (catalyst-gold on card) meets AA large", () => {
    expect(contrast(CATALYST.gold, card)).toBeGreaterThanOrEqual(AA_LARGE);
  });
});
