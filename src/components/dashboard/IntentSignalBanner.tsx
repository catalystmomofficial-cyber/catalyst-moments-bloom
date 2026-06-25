import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X } from 'lucide-react';
import { useIntentSignals } from '@/hooks/useIntentSignals';

// Renders nothing when there's no active signal — the dashboard looks exactly
// as it does today. Mounts with a gentle slide/fade-in, and collapses
// immediately (no reserved gap) on dismiss or tap-through.
export const IntentSignalBanner = () => {
  const { activeSignal, dismiss, action } = useIntentSignals();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!activeSignal) { setVisible(false); return; }
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, [activeSignal]);

  if (!activeSignal) return null;

  const handleTap = async () => {
    setVisible(false);
    await action();
    navigate(activeSignal.targetPath);
  };

  const handleDismiss = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setVisible(false);
    await dismiss();
  };

  return (
    <div
      className={`mb-4 overflow-hidden transition-all duration-300 ease-out ${
        visible ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={handleTap}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTap(); }}
        className="w-full flex items-center gap-3 rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 px-4 py-3 text-left shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="p-2 rounded-full bg-primary/20 shrink-0">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <p className="flex-1 text-sm font-medium text-foreground">{activeSignal.body}</p>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={handleDismiss}
          className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-background/60 shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
