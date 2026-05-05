import './SplashScreen.css';

interface SplashScreenProps {
  fadeOut: boolean;
}

const LOGO_SRC =
  'https://moxxceccaftkeuaowctw.supabase.co/storage/v1/object/public/catalystcourses/Logo/LOGO%20(3)%20(1).png';

const SplashScreen = ({ fadeOut }: SplashScreenProps) => {
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
