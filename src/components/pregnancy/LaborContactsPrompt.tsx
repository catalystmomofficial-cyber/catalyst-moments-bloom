import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, X } from 'lucide-react';
import { usePregnancyProgress } from '@/hooks/usePregnancyProgress';
import { useLaborContacts } from '@/hooks/useLaborContacts';

const DISMISS_KEY = 'cm_labor_contacts_prompt_dismissed';
const QUIET_DAYS = 7;
/** The appointment where her provider hands over the "when to call" sheet. */
const HANDOVER_WEEK = 36;

interface Dismissal { at: number; week: number; }

const readDismissal = (): Dismissal | null => {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    return raw ? JSON.parse(raw) as Dismissal : null;
  } catch { return null; }
};

/**
 * Whether a past dismissal still holds.
 *
 * sessionStorage was the obvious choice and it has a hole: it only clears when
 * the tab closes, and on a resident mobile PWA the tab may not close for days.
 * Dismiss on Monday, leave the app open, and by Friday she is past her 36-week
 * appointment having never been reminded — the exact failure the resurfacing
 * was meant to prevent, just on a longer timescale.
 *
 * So it resurfaces after a quiet week, or the moment she crosses the handover
 * week, whichever comes first. Dismissing at or after 36 weeks is final: by
 * then she either has the number or is deliberately choosing not to add it,
 * and asking again would be nagging.
 */
const dismissalHolds = (d: Dismissal | null, currentWeek: number): boolean => {
  if (!d) return false;
  if (d.week >= HANDOVER_WEEK) return true;
  if (currentWeek >= HANDOVER_WEEK) return false;
  return Date.now() - d.at < QUIET_DAYS * 86400000;
};

/**
 * A card, not a flow.
 *
 * At 34 weeks she does not have the number yet — her provider hands over the
 * "when to call" sheet at the 36-week appointment. So this is a nudge to add
 * it after that visit, not a wizard to complete now, and dismissing it before
 * week 36 is the correct behaviour rather than a drop-off to fix.
 *
 * It returns each session until the triage line is set, because a number added
 * once labour has started is a number added too late. It uses the form that
 * already exists in Profile rather than introducing a second place to enter
 * the same thing.
 */
export const LaborContactsPrompt = () => {
  const { progress } = usePregnancyProgress();
  const { hasTriageLine, loading } = useLaborContacts();
  const [dismissal, setDismissal] = useState<Dismissal | null>(() => readDismissal());

  const dismiss = () => {
    const d = { at: Date.now(), week: progress?.week ?? 0 };
    setDismissal(d);
    try { localStorage.setItem(DISMISS_KEY, JSON.stringify(d)); } catch { /* private mode */ }
  };

  if (loading || hasTriageLine) return null;
  if (!progress || progress.week < 34) return null;
  if (dismissalHolds(dismissal, progress.week)) return null;

  return (
    <div className="rounded-lg border border-dashed p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold">
            {progress.week} weeks — set up your labor contacts
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Your provider will likely give you a "when to call" sheet at your 36-week
            appointment. Add your triage line then, so the call button is ready when
            you need it.
          </p>
          <Button asChild size="sm" variant="outline" className="mt-3">
            <Link to="/profile#labor-contacts">
              <Phone className="h-4 w-4 mr-1.5" />Add labor contacts
            </Link>
          </Button>
        </div>
        <Button variant="ghost" size="icon" aria-label="Not now" onClick={dismiss}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default LaborContactsPrompt;
