import { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as any).standalone === true;

const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as any).MSStream;

// Only invite full members to install once they're actually working out —
// never a first-time visitor browsing the landing page.
const isWorkoutRoute = (path: string) =>
  path.startsWith('/workouts') || path.startsWith('/programs');

const PWAInstallBanner = () => {
  const { subscribed } = useAuth();
  const location = useLocation();

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(
    () => typeof localStorage !== 'undefined' && localStorage.getItem('pwa-banner-dismissed') === 'true'
  );
  const [visible, setVisible] = useState(false);

  // A subscribed member is on a workout page and hasn't already installed/dismissed.
  const eligible =
    !!subscribed &&
    isWorkoutRoute(location.pathname) &&
    !dismissed &&
    !isStandalone();

  // Capture the browser's install event whenever it fires (often early, on any
  // page). We hold onto it so we can offer the prompt later, once she's a
  // member in a workout — instead of showing it too soon.
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Reveal the banner only when a subscribed member reaches a workout page.
  useEffect(() => {
    if (!eligible) {
      setShowBanner(false);
      setVisible(false);
      return;
    }
    // Android/Chrome needs the captured prompt; iOS uses the manual Share guide.
    if (!isIOS() && !deferredPrompt) return;
    setShowBanner(true);
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, [eligible, deferredPrompt]);

  const handleInstall = async () => {
    if (isIOS()) {
      setShowIOSGuide(true);
      return;
    }
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowBanner(false);
    setShowIOSGuide(false);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  if (!showBanner || dismissed || isStandalone()) return null;

  return (
    <>
      {/* iOS Guide Popup */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-card rounded-2xl p-5 shadow-xl border border-border mb-16 animate-in slide-in-from-bottom-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-foreground text-base">Install Catalyst Mom</h3>
              <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-3 italic">Install the app for exclusive features including Night Mode</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <span className="text-base">1</span>
                </div>
                <p>Tap the <Share className="w-4 h-4 inline text-primary" /> <strong className="text-foreground">Share</strong> button in Safari</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <span className="text-base">2</span>
                </div>
                <p>Scroll down and tap <strong className="text-foreground">Add to Home Screen</strong></p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <span className="text-base">3</span>
                </div>
                <p>Tap <strong className="text-foreground">Add</strong> to install</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Banner */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 p-3 bg-card/95 backdrop-blur-md border-t border-border shadow-lg safe-area-bottom transition-transform duration-500 ease-out ${visible ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <img
            src="/brand/catalyst-mom-logo.png"
            alt="Catalyst Mom"
            className="w-10 h-10 rounded-xl object-contain"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">Install the Catalyst Mom App</p>
            <p className="text-xs text-muted-foreground">Install the app for exclusive features including Night Mode</p>
          </div>
          <Button size="sm" onClick={handleInstall} className="shrink-0 gap-1.5">
            <Download className="w-4 h-4" />
            Install
          </Button>
          <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
};

export default PWAInstallBanner;
