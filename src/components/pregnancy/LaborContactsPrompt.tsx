import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, X } from 'lucide-react';
import { usePregnancyProgress } from '@/hooks/usePregnancyProgress';
import { useLaborContacts } from '@/hooks/useLaborContacts';

const DISMISS_KEY = 'cm_labor_contacts_prompt_dismissed';

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
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem(DISMISS_KEY) === '1'; } catch { return false; }
  });

  // sessionStorage, not localStorage: "dismissed" lasts this visit only.
  const dismiss = () => {
    setDismissed(true);
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* private mode */ }
  };

  if (loading || dismissed || hasTriageLine) return null;
  if (!progress || progress.week < 34) return null;

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
