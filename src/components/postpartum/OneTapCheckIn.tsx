import { useState } from 'react';
import { Check } from 'lucide-react';
import {
  MOOD_META,
  saveCheckIn,
  todaysCheckIn,
  type RecoveryCheckIn,
  type RecoveryMood,
} from '@/lib/recovery';
import posthog from '@/lib/posthog';

interface Props {
  /** Writes through to the server. Optional so the component still works if
      mounted somewhere without the recovery hook. */
  onCheckIn?: (mood: RecoveryMood) => Promise<{ error: unknown }>;
  checkIns: RecoveryCheckIn[];
  onSaved: (next: RecoveryCheckIn[]) => void;
}

const ORDER: RecoveryMood[] = ['rough', 'okay', 'good'];

/**
 * The whole check-in: one tap, three choices, done.
 *
 * Built for the actual moment — 3am, phone in one hand, baby in the other. No
 * sliders, no multi-step form, no streak counter and no "you missed 2 days"
 * guilt, because the research that motivated this feature said the logging
 * itself is what's making mothers anxious. Recording nothing is always allowed.
 *
 * Note: this deliberately stores only what she actually told us (a mood). It
 * does not synthesise energy/stress values to feed the wellness score — the
 * full check-in on the Wellness page is where those come from.
 */
export const OneTapCheckIn = ({ checkIns, onSaved, onCheckIn }: Props) => {
  const existing = todaysCheckIn(checkIns);
  const [justSaved, setJustSaved] = useState<RecoveryMood | null>(null);

  const pick = async (mood: RecoveryMood) => {
    // Local write first so the tap feels instant and still works offline; the
    // server write follows. localStorage alone was the bug — the safety nudge
    // reads this history and reset itself on every new device.
    const next = saveCheckIn(mood);
    posthog.capture('recovery_check_in_completed');
    setJustSaved(mood);
    if (onCheckIn) await onCheckIn(mood);
    onSaved(next);
  };

  const selected = justSaved ?? existing?.mood ?? null;

  return (
    <div>
      <p className="mb-3 text-sm font-medium text-foreground">
        How are you doing today — really?
      </p>

      <div className="grid grid-cols-3 gap-2">
        {ORDER.map((mood) => {
          const meta = MOOD_META[mood];
          const isSelected = selected === mood;
          return (
            <button
              key={mood}
              type="button"
              onClick={() => void pick(mood)}
              aria-pressed={isSelected}
              className={`group relative flex min-h-[86px] flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-3 transition-all duration-200 active:scale-[0.97] ${
                isSelected
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-border bg-card hover:border-primary/40 hover:bg-primary/5'
              }`}
            >
              {isSelected && (
                <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                  <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                </span>
              )}
              <span className="text-2xl leading-none" aria-hidden>
                {meta.emoji}
              </span>
              <span
                className={`text-sm font-medium ${
                  isSelected ? 'text-primary' : 'text-foreground'
                }`}
              >
                {meta.label}
              </span>
            </button>
          );
        })}
      </div>

      {selected && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {MOOD_META[selected].reply}
        </p>
      )}
    </div>
  );
};

export default OneTapCheckIn;
