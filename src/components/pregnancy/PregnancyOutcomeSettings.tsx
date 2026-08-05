import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { usePregnancyJourney } from '@/hooks/usePregnancyJourney';
import { usePregnancyProgress } from '@/hooks/usePregnancyProgress';

/**
 * Two doors, side by side. Never one.
 *
 * Giving birth and losing a pregnancy are different events with different
 * needs. Collapsing them into a single "End pregnancy" button would force a
 * woman who has just had a loss through a "did you give birth, or…?" decision
 * tree, which is a cruelty no saving of screen space justifies.
 *
 * The word is "loss" — the word women use with each other. Not "miscarriage",
 * which is clinical, and not "ended" or "changed", which read as the app being
 * uncomfortable. If the app flinches, she learns she should too.
 *
 * This is never prompted, never popped up, never triggered by a passed due
 * date. She comes here. The discoverability cost is the correct trade for
 * never ambushing her.
 */
export const PregnancyOutcomeSettings = () => {
  const { toast } = useToast();
  const { progress } = usePregnancyProgress();
  const { recordOutcome } = usePregnancyJourney();
  const [confirming, setConfirming] = useState<'birth' | 'loss' | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!confirming) return;
    setSaving(true);
    const frozen = progress ? { week: progress.week, day: progress.dayOfWeek } : undefined;
    const { error } = await recordOutcome(confirming, frozen);
    setSaving(false);
    setConfirming(null);

    if (error) {
      toast({ title: "That didn't save", description: 'Please try again in a moment.' });
      return;
    }

    // One message, and only one. A woman who has just recorded a loss should
    // not be handed a wall of text about what happens next.
    toast(
      confirming === 'birth'
        ? { title: 'Congratulations', description: "We've moved you to your recovery plan." }
        : {
            title: 'All pregnancy reminders have been paused',
            description: 'Your coach is still here if you need her.',
          },
    );
  };

  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-sm font-semibold">Your pregnancy</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Tell us when something changes, whenever you're ready. Nothing here happens automatically.
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Button variant="outline" onClick={() => setConfirming('birth')}>
          I've given birth
        </Button>
        <Button variant="outline" onClick={() => setConfirming('loss')}>
          I've had a loss
        </Button>
      </div>

      <AlertDialog open={confirming !== null} onOpenChange={(o) => !o && setConfirming(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirming === 'birth' ? 'Congratulations' : "We're so sorry"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirming === 'birth' ? (
                <>
                  We'll move you to your recovery plan and your pregnancy tracking will stop.
                  Everything you logged stays saved.
                  {/* The two doors must be reachable from each other. The
                      postpartum flow is celebratory by design, so landing
                      there after a loss is the worst misclick in the app. */}
                  <br /><br />
                  <button
                    type="button"
                    className="underline underline-offset-2 hover:no-underline"
                    onClick={() => setConfirming('loss')}
                  >
                    If your pregnancy ended differently, you can hold your journey instead.
                  </button>
                </>
              ) : (
                <>
                  This will hold your journey here. Your reminders will stop, and nothing
                  will be asked of you. You can always come back to this.
                  <br /><br />
                  Nothing you've written or logged will be deleted. We'll check in once in
                  a month about what you'd like kept. Until then, it's simply held.
                  <br /><br />
                  <button
                    type="button"
                    className="underline underline-offset-2 hover:no-underline"
                    onClick={() => setConfirming('birth')}
                  >
                    If your baby has arrived, go here instead.
                  </button>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Not now</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => { e.preventDefault(); void submit(); }} disabled={saving}>
              {saving ? 'Saving…' : confirming === 'birth' ? 'Continue' : 'I understand'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PregnancyOutcomeSettings;
