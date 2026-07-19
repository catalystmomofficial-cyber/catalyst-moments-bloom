import { ReactNode } from 'react';
import { ratingPlate, type AwardRarity } from './AwardBadge';

interface AchievementIconBadgeProps {
  icon: ReactNode;
  rarity?: AwardRarity;
  locked?: boolean;
  className?: string;
}

// Small metallic gold/copper badge chip for achievement icons — same
// icon per achievement, just dressed in the AwardBadge's rarity gradient
// instead of a flat single-color circle.
export function AchievementIconBadge({ icon, rarity = 'common', locked = false, className = '' }: AchievementIconBadgeProps) {
  return (
    <div
      className={`relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-sm ${className}`}
      style={{
        background: locked ? 'hsl(var(--muted))' : ratingPlate[rarity],
        border: locked ? '1px solid hsl(var(--border))' : '1px solid rgba(93,41,6,0.18)',
      }}
    >
      {!locked && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, transparent 45%)' }}
          aria-hidden="true"
        />
      )}
      <div className="relative" style={{ color: locked ? 'hsl(var(--muted-foreground))' : '#5D2906' }}>
        {icon}
      </div>
    </div>
  );
}
