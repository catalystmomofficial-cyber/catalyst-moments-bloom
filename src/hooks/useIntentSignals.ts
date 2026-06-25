import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useContentFilter } from '@/hooks/useContentFilter';
import { useTTCData } from '@/hooks/useTTCData';
import { useBiweeklyMilestoneStatus } from '@/hooks/useBiweeklyMilestone';
import { supabase } from '@/integrations/supabase/client';
import { differenceInDays, differenceInHours } from 'date-fns';

export type SignalType = 'ttc_possible_transition' | 'milestone_approaching';

export interface IntentSignal {
  type: SignalType;
  instanceKey: string;
  priority: number; // lower = shown first when multiple signals are eligible
  body: string;
  targetPath: string;
}

interface SignalEventRow {
  signal_type: string;
  instance_key: string;
  shown_at: string;
  dismissed_at: string | null;
  actioned_at: string | null;
}

const FREQUENCY_CAP_HOURS = 72;
const EARLY_SYMPTOMS = ['nausea', 'tender breasts', 'fatigue'];

const todayISO = () => new Date().toISOString().slice(0, 10);
const daysBetween = (a: string, b: string) =>
  Math.floor((new Date(b + 'T00:00:00Z').getTime() - new Date(a + 'T00:00:00Z').getTime()) / 86400000);

export function useIntentSignals() {
  const { user } = useAuth();
  const { stageInfo } = useContentFilter();
  const { settings, logs } = useTTCData();
  const milestone = useBiweeklyMilestoneStatus();

  const [events, setEvents] = useState<SignalEventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvedKey, setResolvedKey] = useState<string | null>(null);

  const refreshEvents = useCallback(async () => {
    if (!user) { setEvents([]); setLoading(false); return; }
    setLoading(true);
    const { data } = await (supabase as any)
      .from('signal_events')
      .select('signal_type, instance_key, shown_at, dismissed_at, actioned_at')
      .eq('user_id', user.id);
    setEvents((data as SignalEventRow[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => { refreshEvents(); }, [refreshEvents]);

  // A signal type is in cooldown if its most recent dismissal/action happened
  // within FREQUENCY_CAP_HOURS — independent of whether a *new* instance now
  // matches. This avoids re-prompting a user who just closed the same kind of
  // banner, while never blocking a still-open (not yet dismissed) instance.
  const isTypeInCooldown = useCallback((type: SignalType, excludeInstanceKey: string) => {
    const resolutions = events
      .filter(e => e.signal_type === type && e.instance_key !== excludeInstanceKey)
      .map(e => e.dismissed_at || e.actioned_at)
      .filter(Boolean) as string[];
    if (resolutions.length === 0) return false;
    const mostRecent = resolutions.sort().at(-1)!;
    return differenceInHours(new Date(), new Date(mostRecent)) < FREQUENCY_CAP_HOURS;
  }, [events]);

  const isInstanceDismissed = useCallback((type: SignalType, instanceKey: string) => {
    return events.some(e =>
      e.signal_type === type &&
      e.instance_key === instanceKey &&
      (e.dismissed_at || e.actioned_at)
    );
  }, [events]);

  const candidates: IntentSignal[] = [];

  // Priority 1: stage transition — cycle running late with early-pregnancy-adjacent symptoms.
  if (stageInfo?.journey === 'ttc' && settings?.last_period_start) {
    const cycleLength = settings.average_cycle_length || 28;
    const elapsed = daysBetween(settings.last_period_start, todayISO());
    const daysLate = elapsed - cycleLength;

    const recentSymptomDays = logs
      .filter(l => differenceInDays(new Date(), new Date(l.log_date + 'T00:00:00Z')) <= 7)
      .flatMap(l => (l.symptoms || []).map(s => s.toLowerCase()));
    const matchedSymptoms = new Set(EARLY_SYMPTOMS.filter(s => recentSymptomDays.some(rs => rs.includes(s))));

    if (daysLate >= 3 && matchedSymptoms.size >= 2) {
      candidates.push({
        type: 'ttc_possible_transition',
        instanceKey: settings.last_period_start,
        priority: 1,
        body: `Your cycle is running ${daysLate} days later than usual, and you've logged a few signs that often show up early. Want to check in?`,
        targetPath: '/dashboard#ttc-tracker',
      });
    }
  }

  // Priority 2: milestone/churn-risk — 1:1 Progression Sync unlocking in 1-2 days.
  if (!milestone.isActive && milestone.daysUntilNext > 0 && milestone.daysUntilNext <= 2) {
    const instanceKey = milestone.nextMilestoneDate.toISOString().slice(0, 10);
    candidates.push({
      type: 'milestone_approaching',
      instanceKey,
      priority: 2,
      body: `Your 1:1 Progression Sync unlocks in ${milestone.daysUntilNext} day${milestone.daysUntilNext === 1 ? '' : 's'} — see what's next.`,
      targetPath: '/progress#progression-sync',
    });
  }

  const activeSignal = candidates
    .filter(c => !isInstanceDismissed(c.type, c.instanceKey))
    .filter(c => !isTypeInCooldown(c.type, c.instanceKey))
    .sort((a, b) => a.priority - b.priority)[0] ?? null;

  // Record "shown" the first time this instance appears (idempotent — re-renders won't duplicate rows).
  useEffect(() => {
    if (!user || !activeSignal) return;
    const key = `${activeSignal.type}:${activeSignal.instanceKey}`;
    if (resolvedKey === key) return;
    const alreadyLogged = events.some(e => e.signal_type === activeSignal.type && e.instance_key === activeSignal.instanceKey);
    setResolvedKey(key);
    if (alreadyLogged) return;
    (supabase as any).from('signal_events').insert({
      user_id: user.id,
      signal_type: activeSignal.type,
      instance_key: activeSignal.instanceKey,
    }).then(() => refreshEvents());
  }, [user, activeSignal, events, resolvedKey, refreshEvents]);

  const resolve = useCallback(async (field: 'dismissed_at' | 'actioned_at') => {
    if (!user || !activeSignal) return;
    await (supabase as any)
      .from('signal_events')
      .update({ [field]: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('signal_type', activeSignal.type)
      .eq('instance_key', activeSignal.instanceKey);
    await refreshEvents();
  }, [user, activeSignal, refreshEvents]);

  return {
    activeSignal,
    loading,
    dismiss: () => resolve('dismissed_at'),
    action: () => resolve('actioned_at'),
  };
}
