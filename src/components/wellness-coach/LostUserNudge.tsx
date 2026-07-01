import { useState, useEffect } from 'react';
import { X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EnhancedWellnessCoachModal from './EnhancedWellnessCoachModal';
import { useLostUserDetector } from '@/hooks/useLostUserDetector';

/**
 * Slides in from the bottom-right when the user has navigated several pages
 * without finding what they're looking for. Opens the wellness coach on click.
 * No generic AI logos — uses brand color + icon only.
 */
export const LostUserNudge = () => {
  const { isLost, dismiss } = useLostUserDetector();
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Small delay so it doesn't pop instantly — feels more natural
  useEffect(() => {
    if (isLost) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [isLost]);

  if (!visible && !modalOpen) return null;

  return (
    <>
      {/* Slide-in nudge card */}
      {visible && !modalOpen && (
        <div
          className={`
            fixed bottom-20 right-4 z-50 w-72 rounded-xl shadow-xl
            bg-background border border-catalyst-copper/25
            transition-all duration-500 ease-out
            animate-in slide-in-from-bottom-4 fade-in
          `}
        >
          {/* top accent stripe */}
          <div className="h-1 w-full rounded-t-xl bg-gradient-to-r from-catalyst-copper to-catalyst-gold" />

          <div className="p-4">
            {/* header row */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-catalyst-copper/10 flex items-center justify-center shrink-0">
                  <Heart className="w-3.5 h-3.5 text-catalyst-copper" />
                </div>
                <p className="text-xs font-semibold text-catalyst-copper uppercase tracking-wide">
                  Wellness Coach
                </p>
              </div>
              <button
                onClick={dismiss}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* message */}
            <p className="text-sm text-foreground leading-snug mb-3">
              Looking for something specific? I can point you straight to the right program, meal plan, or guide.
            </p>

            {/* CTA */}
            <Button
              size="sm"
              className="w-full bg-catalyst-copper hover:bg-catalyst-copper/90 text-white text-xs"
              onClick={() => {
                setVisible(false);
                setModalOpen(true);
              }}
            >
              Ask your wellness coach
            </Button>
          </div>
        </div>
      )}

      {/* Coach modal */}
      <EnhancedWellnessCoachModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          dismiss();
        }}
      />
    </>
  );
};

export default LostUserNudge;
