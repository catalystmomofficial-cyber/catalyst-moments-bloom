import React, { useState } from 'react';
import {
  Clock,
  HeartHandshake,
  Moon,
  Feather,
  Snowflake,
  NotebookPen,
  type LucideIcon,
} from 'lucide-react';

/**
 * Branded cover art for the digital guides.
 *
 * This replaces the old flat gold-gradient placeholders (which read as
 * generic AI covers) with one editorial system: a layered background, a small
 * "CATALYST MOM" imprint, a serif title lockup, and a single motif per guide.
 * Every cover is drawn in code, so a not-yet-shot guide still looks finished,
 * and swapping in real photography later is just setting the product's `cover`.
 */

type Motif = 'stars' | 'grid' | 'blooms' | 'arc';

interface Theme {
  from: string;
  via: string;
  to: string;
  ink: string;
  sub: string;
  accent: string;
  kicker: string;
  Icon: LucideIcon;
  motif: Motif;
  /** true when the background is dark and text should read light */
  dark: boolean;
}

const THEMES: Record<string, Theme> = {
  'momodoro-planner': {
    from: '#2A1B10', via: '#4A2A12', to: '#5D2906',
    ink: '#FFF8F0', sub: 'rgba(255,248,240,0.72)', accent: '#D4A76A',
    kicker: 'TIME · FOCUS · CALM', Icon: Clock, motif: 'arc', dark: true,
  },
  'busy-mom-self-care': {
    from: '#FFF8F0', via: '#EFE7D9', to: '#D4DBCA',
    ink: '#5D2906', sub: 'rgba(93,41,6,0.66)', accent: '#C17F45',
    kicker: 'RECHARGE · EVERY DAY', Icon: HeartHandshake, motif: 'blooms', dark: false,
  },
  'sleep-reset-guide': {
    from: '#101726', via: '#1E2740', to: '#3A2416',
    ink: '#FFF8F0', sub: 'rgba(255,248,240,0.68)', accent: '#D4A76A',
    kicker: 'REST · RESTORE', Icon: Moon, motif: 'stars', dark: true,
  },
  'emotional-load-workbook': {
    from: '#FFF8F0', via: '#F9F0E6', to: '#FDE1D3',
    ink: '#5D2906', sub: 'rgba(93,41,6,0.66)', accent: '#C17F45',
    kicker: 'PROCESS · RELEASE', Icon: Feather, motif: 'arc', dark: false,
  },
  'freezer-stash-guide': {
    from: '#EAF1EC', via: '#D4DBCA', to: '#BAC9BF',
    ink: '#33453B', sub: 'rgba(51,69,59,0.66)', accent: '#C17F45',
    kicker: 'PREP ONCE · NOURISH FOR WEEKS', Icon: Snowflake, motif: 'grid', dark: false,
  },
  'keepsake-journal': {
    from: '#FFF8F0', via: '#FDE1D3', to: '#E7C6B7',
    ink: '#5D2906', sub: 'rgba(93,41,6,0.66)', accent: '#C17F45',
    kicker: 'REMEMBER · REFLECT', Icon: NotebookPen, motif: 'blooms', dark: false,
  },
};

const FALLBACK: Theme = {
  from: '#F9F0E6', via: '#EFE1CE', to: '#E5D3B3',
  ink: '#5D2906', sub: 'rgba(93,41,6,0.66)', accent: '#C17F45',
  kicker: 'CATALYST MOM', Icon: HeartHandshake, motif: 'arc', dark: false,
};

const Motifs = ({ motif, accent, dark }: { motif: Motif; accent: string; dark: boolean }) => {
  const line = dark ? 'rgba(255,255,255,0.10)' : 'rgba(93,41,6,0.08)';
  switch (motif) {
    case 'stars':
      return (
        <>
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                width: i % 3 === 0 ? 3 : 2,
                height: i % 3 === 0 ? 3 : 2,
                top: `${(i * 29) % 78}%`,
                left: `${(i * 47) % 92}%`,
                background: i % 4 === 0 ? accent : 'rgba(255,255,255,0.7)',
                opacity: 0.8,
              }}
            />
          ))}
        </>
      );
    case 'grid':
      return (
        <svg className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <pattern id="cg" width="26" height="26" patternUnits="userSpaceOnUse">
              <path d="M26 0H0V26" fill="none" stroke={line} strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cg)" />
        </svg>
      );
    case 'blooms':
      return (
        <>
          <span
            className="absolute rounded-full blur-2xl"
            style={{ width: 150, height: 150, top: -40, left: -30, background: `${accent}33` }}
          />
          <span
            className="absolute rounded-full blur-2xl"
            style={{ width: 130, height: 130, bottom: -36, right: -24, background: `${accent}26` }}
          />
        </>
      );
    case 'arc':
    default:
      return (
        <>
          <span
            className="absolute rounded-full"
            style={{
              width: 220, height: 220, right: -70, top: -70,
              border: `1px solid ${dark ? 'rgba(255,255,255,0.14)' : 'rgba(93,41,6,0.10)'}`,
            }}
          />
          <span
            className="absolute rounded-full"
            style={{
              width: 320, height: 320, right: -120, top: -120,
              border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(93,41,6,0.06)'}`,
            }}
          />
        </>
      );
  }
};

export const ProductCoverArt = ({ slug, title }: { slug: string; title: string }) => {
  const t = THEMES[slug] ?? FALLBACK;
  const { Icon } = t;

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${t.from} 0%, ${t.via} 52%, ${t.to} 100%)` }}
    >
      <Motifs motif={t.motif} accent={t.accent} dark={t.dark} />

      <div className="relative z-10 flex h-full flex-col justify-between p-5">
        {/* Imprint + motif mark */}
        <div className="flex items-center justify-between">
          <span
            className="text-[9px] font-semibold uppercase"
            style={{ color: t.sub, letterSpacing: '0.34em' }}
          >
            Catalyst&nbsp;Mom
          </span>
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ border: `1px solid ${t.accent}`, background: `${t.accent}1f` }}
          >
            <Icon className="h-4 w-4" strokeWidth={1.6} style={{ color: t.accent }} />
          </span>
        </div>

        {/* Title lockup */}
        <div>
          <div className="mb-2 h-px w-8" style={{ background: t.accent }} />
          <h3
            className="font-serif leading-tight"
            style={{ color: t.ink, fontSize: '1.22rem', letterSpacing: '-0.01em' }}
          >
            {title}
          </h3>
          <p
            className="mt-2 text-[9.5px] font-medium uppercase"
            style={{ color: t.sub, letterSpacing: '0.22em' }}
          >
            {t.kicker}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Renders the real cover when a guide has one and it loads; otherwise the
 * branded ProductCoverArt above. Placeholders (no `src`) go straight to the
 * branded art, so the card is always finished-looking.
 */
export const CoverImage = ({
  src,
  alt,
  slug,
  title,
}: {
  src?: string;
  alt: string;
  slug: string;
  title: string;
}) => {
  const [errored, setErrored] = useState(false);

  if (src && !errored) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setErrored(true)}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    );
  }

  return <ProductCoverArt slug={slug} title={title} />;
};

export default ProductCoverArt;
