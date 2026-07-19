import { MouseEvent, ReactNode, useEffect, useRef, useState } from 'react';

export type AwardRarity = 'common' | 'rare' | 'epic' | 'legendary';

interface AwardBadgeProps {
  title: string;
  eyebrow?: string;
  rarity?: AwardRarity;
  icon: ReactNode;
  className?: string;
}

const identityMatrix =
  '1, 0, 0, 0, ' +
  '0, 1, 0, 0, ' +
  '0, 0, 1, 0, ' +
  '0, 0, 0, 1';

const maxRotate = 6;
const minRotate = -6;
const maxScale = 1;
const minScale = 0.97;

// Warm copper/gold sheen instead of the original's full rainbow — same
// rotating mix-blend-mode glow, just re-tuned to the brand palette.
const sheenHues = ['#D4A76A', '#C17F45', '#FDE1D3', '#FFF8F0', '#E8B96B', '#5D2906'];

const ratingPlate: Record<AwardRarity, string> = {
  legendary: 'linear-gradient(150deg, #F3E3AC 0%, #D4A76A 100%)',
  epic: 'linear-gradient(150deg, #FDE1D3 0%, #C17F45 100%)',
  rare: 'linear-gradient(150deg, #F9F0E6 0%, #E5D3B3 100%)',
  common: 'linear-gradient(150deg, #FFF8F0 0%, #F9F0E6 100%)',
};

export const AwardBadge = ({ title, eyebrow = 'Catalyst Mom', rarity = 'epic', icon, className }: AwardBadgeProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [sheenAngle, setSheenAngle] = useState(0);
  const [matrix, setMatrix] = useState(identityMatrix);
  const [currentMatrix, setCurrentMatrix] = useState(identityMatrix);
  const [ambient, setAmbient] = useState(true);
  const leaveTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const getDimensions = () => ref.current?.getBoundingClientRect() ?? { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };

  const getMatrix = (clientX: number, clientY: number) => {
    const { left, right, top, bottom, width, height } = getDimensions();
    const xCenter = (left + right) / 2;
    const yCenter = (top + bottom) / 2;
    const xRatio = width ? (clientX - xCenter) / (width / 2) : 0;
    const yRatio = height ? (clientY - yCenter) / (height / 2) : 0;

    const scale = maxScale - (maxScale - minScale) * Math.min(1, Math.abs(xRatio) + Math.abs(yRatio));
    const rotateX = minRotate + (maxRotate - minRotate) * ((1 - yRatio) / 2);
    const rotateY = minRotate + (maxRotate - minRotate) * ((xRatio + 1) / 2);

    return (
      `${scale}, 0, 0, 0, ` +
      `0, ${scale}, 0, 0, ` +
      `0, 0, ${scale}, 0, ` +
      `${-rotateY * 0.02}, ${rotateX * 0.02}, 0, 1`
    );
  };

  const onMouseEnter = () => {
    if (reduceMotion) return;
    if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
    setAmbient(false);
  };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    setMatrix(getMatrix(e.clientX, e.clientY));
    const { left, right, top, bottom } = getDimensions();
    const xCenter = (left + right) / 2;
    const yCenter = (top + bottom) / 2;
    setSheenAngle((Math.abs(xCenter - e.clientX) + Math.abs(yCenter - e.clientY)) / 1.5);
  };

  const onMouseLeave = () => {
    if (reduceMotion) return;
    setMatrix(identityMatrix);
    leaveTimeout.current = setTimeout(() => setAmbient(true), 300);
  };

  return (
    <div
      ref={ref}
      className={`relative select-none ${className ?? ''}`}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <style>{`
        @keyframes award-sheen-drift {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(25deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
      <div
        style={{
          transform: `perspective(700px) matrix3d(${matrix})`,
          transformOrigin: 'center center',
          transition: 'transform 200ms ease-out',
        }}
      >
        <div
          className="relative overflow-hidden rounded-2xl border shadow-lg flex items-center gap-4 px-5 py-4"
          style={{ background: ratingPlate[rarity], borderColor: 'rgba(93,41,6,0.15)' }}
        >
          {/* Icon chip */}
          <div
            className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center shadow-inner"
            style={{ background: 'rgba(255,255,255,0.55)', color: '#5D2906' }}
          >
            {icon}
          </div>

          {/* Text lockup */}
          <div className="min-w-0 text-left">
            <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'rgba(93,41,6,0.6)' }}>
              {eyebrow}
            </p>
            <p className="text-lg font-extrabold leading-tight truncate" style={{ color: '#3A2412' }}>
              {title}
            </p>
          </div>

          {/* Rotating brand-color sheen, blended over the plaque */}
          <div className="pointer-events-none absolute inset-0" style={{ mixBlendMode: 'overlay' }} aria-hidden="true">
            <div
              className="absolute -inset-1/2"
              style={{
                transform: `rotate(${sheenAngle}deg)`,
                transition: !reduceMotion && !ambient ? 'transform 200ms ease-out' : 'none',
                animation: reduceMotion || !ambient ? 'none' : 'award-sheen-drift 6s ease-in-out infinite',
              }}
            >
              {sheenHues.map((hue, i) => (
                <div
                  key={hue}
                  className="absolute inset-0 blur-2xl"
                  style={{
                    background: `linear-gradient(${i * 60}deg, transparent 45%, ${hue} 50%, transparent 55%)`,
                    opacity: 0.45,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
