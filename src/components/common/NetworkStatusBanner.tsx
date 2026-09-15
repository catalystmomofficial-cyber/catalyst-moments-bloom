import { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const NetworkStatusBanner = () => {
  const [online, setOnline] = useState(() => navigator.onLine);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    let restoredTimer: ReturnType<typeof setTimeout> | undefined;

    const handleOffline = () => {
      if (restoredTimer) clearTimeout(restoredTimer);
      setShowRestored(false);
      setOnline(false);
    };
    const handleOnline = () => {
      setOnline(true);
      setShowRestored(true);
      restoredTimer = setTimeout(() => setShowRestored(false), 2500);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      if (restoredTimer) clearTimeout(restoredTimer);
    };
  }, []);

  if (online && !showRestored) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-x-0 top-0 z-[100] flex min-h-10 items-center justify-center gap-2 px-4 py-2 text-center text-sm font-medium shadow-sm ${
        online
          ? 'bg-emerald-600 text-white'
          : 'bg-foreground text-background'
      }`}
    >
      {online ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
      {online
        ? 'You’re back online. Refreshing your latest information…'
        : 'You’re offline. Saved information remains available; online actions will resume when you reconnect.'}
    </div>
  );
};

export default NetworkStatusBanner;
