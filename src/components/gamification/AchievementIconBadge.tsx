import { ReactNode } from 'react';
import type { AwardRarity } from './AwardBadge';

interface AchievementIconBadgeProps {
  icon: ReactNode;
  rarity?: AwardRarity;
  locked?: boolean;
  className?: string;
}

// Polished-metal medallion faces — multi-stop radial gradients with a bright
// top-left specular so each reads as struck metal, not a flat disc. Rim color
// is the deep edge used for the bevel shadow.
const metalFace: Record<AwardRarity, { face: string; rim: string }> = {
  legendary: {
    face: 'radial-gradient(circle at 32% 26%, #FCEFB8 0%, #F0D06A 30%, #D6A63F 62%, #A9762A 100%)',
    rim: '#7C531A',
  },
  epic: {
    face: 'radial-gradient(circle at 32% 26%, #FBDFC6 0%, #E7A46E 32%, #C77F45 64%, #90542A 100%)',
    rim: '#6E3F20',
  },
  rare: {
    face: 'radial-gradient(circle at 32% 26%, #F7EBDD 0%, #E4CBA9 34%, #C9AA7E 66%, #9A7C52 100%)',
    rim: '#6F573A',
  },
  common: {
    face: 'radial-gradient(circle at 32% 26%, #FCFAF6 0%, #ECE2D2 34%, #D3C4AF 66%, #A9987F 100%)',
    rim: '#7C6E58',
  },
};

const STYLE_ID = 'achievement-icon-badge-anim';

if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.innerHTML = `
    @keyframes achv-sheen {
      0%   { transform: translateX(-140%) rotate(18deg); }
      55%  { transform: translateX(140%) rotate(18deg); }
      100% { transform: translateX(140%) rotate(18deg); }
    }
  `;
  document.head.appendChild(style);
}

// Small metallic gold/copper medallion for achievement icons — same lucide
// icon per achievement, just struck in the AwardBadge rarity metal instead of
// a flat single-color circle. Locked achievements stay muted so earned ones pop.
export function AchievementIconBadge({ icon, rarity = 'common', locked = false, className = '' }: AchievementIconBadgeProps) {
  if (locked) {
    return (
      <div
        className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${className}`}
        style={{ background: 'hsl(var(--muted))', border: '1px solid hsl(var(--border))' }}
      >
        <div className="[&_svg]:h-5 [&_svg]:w-5" style={{ color: 'hsl(var(--muted-foreground))' }}>
          {icon}
        </div>
      </div>
    );
  }

  const { face, rim } = metalFace[rarity];

  return (
    <div
      className={`relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full ${className}`}
      style={{
        background: face,
        border: `1.5px solid ${rim}`,
        // Outer lift + beveled coin edge (bright top rim, dark bottom rim).
        boxShadow: `0 4px 8px -2px rgba(93,41,6,0.45), inset 0 2px 2px rgba(255,255,255,0.7), inset 0 -3px 4px rgba(93,41,6,0.32)`,
      }}
    >
      {/* Sweeping specular sheen */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.85) 50%, transparent 100%)',
          width: '55%',
          animation: 'achv-sheen 4.5s ease-in-out infinite',
          mixBlendMode: 'soft-light',
        }}
        aria-hidden="true"
      />
      {/* Static top-left glint */}
      <div
        className="pointer-events-none absolute -left-1 -top-1 h-6 w-6 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.75) 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      {/* Bold, embossed icon */}
      <div
        className="relative [&_svg]:h-5 [&_svg]:w-5 [&_svg]:[stroke-width:2.4px]"
        style={{ color: '#4A2D12', filter: 'drop-shadow(0 1px 0.5px rgba(255,255,255,0.45))' }}
      >
        {icon}
      </div>
    </div>
  );
}
