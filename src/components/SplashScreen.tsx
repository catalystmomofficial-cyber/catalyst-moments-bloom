import { useEffect } from 'react';
import './SplashScreen.css';

interface SplashScreenProps {
  fadeOut: boolean;
}

const LOGO_SRC =
  'https://moxxceccaftkeuaowctw.supabase.co/storage/v1/object/public/catalystcourses/Logo/LOGO%20(3)%20(1).png';

// Soft, warm three-note chime via Web Audio (no asset needed).
const playSplashChime = () => {
  try {
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx: AudioContext = new Ctx();
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});

    const master = ctx.createGain();
    master.gain.value = 0.12;
    master.connect(ctx.destination);

    const notes = [659.25, 783.99, 987.77]; // E5, G5, B5
    const start = ctx.currentTime + 0.05;
    notes.forEach((freq, i) => {
      const t0 = start + i * 0.28;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(0.9, t0 + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.6);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t0);
      osc.stop(t0 + 1.7);
    });

    setTimeout(() => ctx.close().catch(() => {}), 3000);
  } catch {
    /* ignore */
  }
};

const SplashScreen = ({ fadeOut }: SplashScreenProps) => {
  useEffect(() => {
    const t = setTimeout(playSplashChime, 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="splash-root"
      style={{ opacity: fadeOut ? 0 : 1, transition: 'opacity 0.4s ease' }}
    >
      <div className="splash">
        <div className="glow"></div>
        <div className="ring ring-1"></div>
        <div className="ring ring-2"></div>
        <div className="ring ring-3"></div>

        <div className="logo-wrap">
          <div className="logo-halo"></div>
          <div className="logo-ring"></div>
          <div className="logo-circle">
            <img src={LOGO_SRC} alt="Catalyst Mom" />
          </div>
        </div>

        <div className="brand-block">
          <span className="brand">Catalyst Mom</span>
          <div className="divider">
            <span className="divider-line"></span>
            <span className="divider-dot"></span>
            <span className="divider-line right"></span>
          </div>
          <span className="tagline">Bloom into motherhood</span>
        </div>

        <div className="loader">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>

        <div className="noise"></div>
        <div className="vignette"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
