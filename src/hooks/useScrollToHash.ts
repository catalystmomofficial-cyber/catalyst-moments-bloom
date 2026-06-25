import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Smooth-scrolls to the element matching the current URL hash, so banner
// targets like "/progress#progression-sync" land on the right card.
export function useScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    const t = setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    return () => clearTimeout(t);
  }, [hash]);
}
