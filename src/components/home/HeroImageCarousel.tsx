import { useEffect, useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Drop your 4 hero photos into  public/hero/  with these exact names.
// Until they exist, each slide falls back to the current hero image, so the
// carousel is never broken.
const FALLBACK =
  'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80';

interface Slide {
  src: string;
  eyebrow: string;
  line: string;
}

// Ordered along the motherhood journey — the caption changes with each image,
// but the page's H1 stays fixed (that's the ranking headline).
const SLIDES: Slide[] = [
  { src: '/hero/ttc.jpg', eyebrow: 'Trying to Conceive', line: 'Cycle & ovulation tracking, fertility-friendly movement' },
  { src: '/hero/pregnancy.jpg', eyebrow: 'Pregnancy', line: 'Trimester-safe workouts and birth preparation' },
  { src: '/hero/postpartum.jpg', eyebrow: 'Postpartum', line: 'Core recovery and the fourth trimester' },
  { src: '/hero/wellness.jpg', eyebrow: 'Every stage', line: 'Real coaching and a community that gets it' },
];

const HeroImageCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || paused) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused]);

  const slide = SLIDES[current];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="group"
      aria-roledescription="carousel"
      aria-label="Catalyst Mom across every stage of motherhood"
    >
      <AspectRatio ratio={4 / 5} className="bg-muted">
        {SLIDES.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt={`${s.eyebrow} — ${s.line}`}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'auto'}
            width={800}
            height={1000}
            onError={(e) => {
              const el = e.currentTarget as HTMLImageElement;
              if (el.src !== FALLBACK) el.src = FALLBACK;
            }}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
              i === current ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {/* Readability scrim + rotating caption (secondary text, not the H1) */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        <div className="absolute bottom-4 left-4 right-16 text-white" aria-live="polite">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85">
            {slide.eyebrow}
          </p>
          <p className="text-sm font-medium leading-snug drop-shadow">{slide.line}</p>
        </div>
      </AspectRatio>

      {/* Dots — tap to jump to a stage */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            aria-label={`Show ${s.eyebrow}`}
            aria-current={i === current}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroImageCarousel;
