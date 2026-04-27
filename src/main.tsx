import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Guard: don't register SW in iframes or preview hosts
const isInIframe = (() => {
  try { return window.self !== window.top; } catch { return true; }
})();
const isPreviewHost =
  window.location.hostname.includes('id-preview--') ||
  window.location.hostname.includes('lovableproject.com') ||
  window.location.hostname.includes('lovable.app');

if (isPreviewHost || isInIframe) {
  navigator.serviceWorker?.getRegistrations().then((regs) => {
    regs.forEach((r) => r.unregister());
  });
} else if ('serviceWorker' in navigator) {
  // Unregister legacy /sw.js if present (replaced by Firebase Messaging SW)
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((r) => {
      if (r.active?.scriptURL.endsWith('/sw.js')) r.unregister();
    });
  });
  // FCM service worker is registered on demand by usePushNotifications
}

createRoot(document.getElementById("root")!).render(
  <App />
);
