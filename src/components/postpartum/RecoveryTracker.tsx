import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, CalendarDays, Heart, Sparkles } from 'lucide-react';
import { useContentFilter } from '@/hooks/useContentFilter';
import { useRecovery } from '@/hooks/useRecovery';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import RecoveryRing from './RecoveryRing';
import OneTapCheckIn from './OneTapCheckIn';
import {
  MOOD_META,
  daysSinceBirth,
  evaluateSafetyNudge,
  getBirthDate,
  localDateKey,
  phaseForDay,
  phaseForStageLabel,
  readCheckIns,
  recentCheckIns,
  setBirthDate,
  type RecoveryCheckIn,
} from '@/lib/recovery';

const RECOVERY_PROGRAM = '/course/266ae389-409f-4847-9a10-e29a2f3eb3f9';

/**
 * "Your Recovery" — the postpartum hero.
 *
 * Pregnancy has a tracker. TTC has one. Postpartum had nothing: she landed in
 * the same default branch as a user who never picked a stage. This is the
 * missing piece, and it is deliberately about the MOTHER — not the baby, which
 * is the one thing every competing app already does.
 *
 * It also closes a real safety gap. The recommendation used to key off her mood
 * score, so one good check-in could push a woman three weeks post-caesarean
 * toward "full-body transformation". Here the recommendation keys off her
 * actual timeline, and before the six-week mark it never suggests a workout.
 */
export const RecoveryTracker = () => {
  const { stageInfo } = useContentFilter();
  // Server-backed. Both the birth date and every check-in used to live only in
  // localStorage, so a new phone erased how many weeks postpartum she was and
  // silently reset the safety nudge that watches for a run of hard days.
  const { birthDate, checkIns, saveBirth, checkIn, reload, hasActiveRecovery, birth } = useRecovery();
  const [confirmNewBaby, setConfirmNewBaby] = useState(false);
  const [draftDate, setDraftDate] = useState('');

  const days = useMemo(() => daysSinceBirth(birthDate), [birthDate]);
  const phase = days != null ? phaseForDay(days) : phaseForStageLabel(stageInfo?.phase);

  const safety = useMemo(() => evaluateSafetyNudge(days, checkIns), [days, checkIns]);

  const saveDate = () => {
    if (!draftDate) return;
    // Correcting a date on the birth she already has is not a new baby, so it
    // updates in place. Only a genuinely new birth archives the old recovery,
    // and only after she says so.
    if (hasActiveRecovery && !birth) { setConfirmNewBaby(true); return; }
    void saveBirth(draftDate);
  };

  // Before the standard six-week check-up we never point her at a workout.
  const clearedWindow = days == null || days >= 42;

  const last14 = useMemo(() => {
    const map = new Map(recentCheckIns(14, checkIns).map((c) => [c.date, c]));
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      return { key: localDateKey(d), entry: map.get(localDateKey(d)) };
    });
  }, [checkIns]);

  const hasHistory = last14.some((d) => d.entry);

  return (
    <Card className="overflow-hidden border-primary/25">
      {/* Soft copper wash, matching every other feature surface on the app. */}
      <div className="bg-gradient-to-b from-primary/[0.06] to-transparent">
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-primary">
              Your Recovery
            </h2>
          </div>

          <RecoveryRing dayPostpartum={days} phase={phase} />

          {/* What's normal right now — reassurance, not metrics */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" />
              What&apos;s normal right now
            </p>
            <p className="text-sm leading-relaxed text-foreground">{phase.normal}</p>
          </div>

          {/* Birth date — asked once, gently, and always skippable */}
          <AlertDialog open={confirmNewBaby} onOpenChange={setConfirmNewBaby}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You're adding a new baby</AlertDialogTitle>
            {/* Her language, not the database's. It names what is happening,
                promises the old recovery is kept, and frames the new one as
                starting rather than the old one as ending. One tap; the
                archive happens on confirm. */}
            <AlertDialogDescription>
              Your recovery from your first will be kept — you can still find it in
              your history. Start fresh recovery?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Not yet</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setConfirmNewBaby(false); void saveBirth(draftDate); }}>
              Start fresh recovery
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {!birthDate && (
            <div className="rounded-xl border border-dashed border-border p-4">
              <label
                htmlFor="recovery-birth-date"
                className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground"
              >
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                When was your baby born?
              </label>
              <p className="mb-3 text-xs text-muted-foreground">
                Optional — it just makes the weeks above yours instead of an estimate.
              </p>
              <div className="flex gap-2">
                <Input
                  id="recovery-birth-date"
                  type="date"
                  value={draftDate}
                  max={localDateKey(new Date())}
                  onChange={(e) => setDraftDate(e.target.value)}
                  className="h-9"
                />
                <Button size="sm" onClick={saveDate} disabled={!draftDate} className="h-9 shrink-0">
                  Save
                </Button>
              </div>
            </div>
          )}

          <OneTapCheckIn checkIns={checkIns} onSaved={() => { void reload(); }} onCheckIn={checkIn} />

          {/* Two weeks at a glance — presence, never a streak to protect */}
          {hasHistory && (
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Your last two weeks</p>
              <div className="flex items-end gap-1">
                {last14.map(({ key, entry }) => (
                  <span
                    key={key}
                    title={entry ? MOOD_META[entry.mood].label : 'No check-in'}
                    className="h-6 flex-1 rounded-sm transition-colors"
                    style={{
                      background: entry
                        ? entry.mood === 'good'
                          ? 'hsl(var(--primary))'
                          : entry.mood === 'okay'
                            ? 'hsl(var(--primary) / 0.5)'
                            : 'hsl(var(--primary) / 0.22)'
                        : 'hsl(var(--border) / 0.6)',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* The quiet safety net. Not a diagnosis, not a warning colour —
              just a mother being told a hard run is worth saying out loud. */}
          {safety.show && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
              <p className="mb-1.5 text-sm font-semibold text-foreground">
                That&apos;s been a lot of hard days.
              </p>
              <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                You&apos;ve marked {safety.roughDays} rough days in the last two weeks. That
                doesn&apos;t mean anything is wrong with you — it means you&apos;re carrying
                something heavy, and you deserve someone in your corner. Telling your provider,
                or one of the lines below, is a completely normal thing to do.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Postpartum Support International:</strong>{' '}
                1-800-944-4773 · <strong className="text-foreground">Call or text 988</strong>,
                any time.
              </p>
            </div>
          )}

          {/* Recommendation keyed to her TIMELINE, never her mood score */}
          {clearedWindow ? (
            <Button asChild className="w-full justify-between">
              <Link to={RECOVERY_PROGRAM}>
                <span>Continue your recovery program</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <div className="rounded-xl border border-border p-4">
              <p className="mb-2 text-sm leading-relaxed text-foreground">
                <strong>{phase.focus}</strong> Movement can wait until after your six-week
                check-up — there&apos;s nothing to catch up on.
              </p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/postpartum-body-changes-what-nobody-tells-you">
                  What nobody tells you about postpartum
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

export default RecoveryTracker;
