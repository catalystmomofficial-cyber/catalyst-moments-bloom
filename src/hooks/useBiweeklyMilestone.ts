import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { differenceInDays } from 'date-fns';

export interface BiweeklyMilestoneStatus {
  startDate: Date;
  daysSinceStart: number;
  currentCycle: number;
  daysUntilNext: number;
  isActive: boolean;
  nextMilestoneDate: Date;
  weeksCompleted: number;
}

/**
 * The last booking, from the server, falling back to this browser's copy.
 *
 * Bookings used to live only in localStorage, which made them per-browser:
 * booking on a phone and then opening the app on a laptop showed the prompt
 * all over again. milestone_bookings is now the source of truth; localStorage
 * is kept as an offline/first-paint fallback so the countdown does not flicker
 * back to "due" while the query is in flight.
 */
function useLastBooking(userId?: string): Date | null {
  const localCopy = (() => {
    try {
      const v = localStorage.getItem('cm_last_milestone_at');
      return v ? new Date(v) : null;
    } catch { return null; }
  })();

  const [remote, setRemote] = useState<Date | null>(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('milestone_bookings')
        .select('booked_at')
        .eq('user_id', userId)
        .order('booked_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cancelled || error || !data?.booked_at) return;
      setRemote(new Date(data.booked_at));
      // Heal this browser so the offline fallback is not stale next time.
      try { localStorage.setItem('cm_last_milestone_at', data.booked_at); } catch {}
    })();
    return () => { cancelled = true; };
  }, [userId]);

  if (remote && localCopy) return remote > localCopy ? remote : localCopy;
  return remote ?? localCopy;
}

// Anchor: most recent of (last booked milestone) or (program start). A booking
// resets the 14-day cycle; otherwise it anchors to paid subscription start (or
// account creation) so the cadence reflects real usage, not just signup.
export function useBiweeklyMilestoneStatus(): BiweeklyMilestoneStatus {
  const { profile, subscriptionStart, subscribed, user } = useAuth();
  const lastBooked = useLastBooking(user?.id);

  let startDate: Date;
  const stored = localStorage.getItem('cm_program_start_date');
  if (subscriptionStart) {
    // Anchor to actual Stripe subscription start so the 2-week cycle reflects paid membership, not account creation.
    startDate = new Date(subscriptionStart);
  } else if (subscribed && stored) {
    startDate = new Date(stored);
  } else if (subscribed && profile?.created_at) {
    startDate = new Date(profile.created_at);
  } else {
    // Not subscribed yet — anchor "now" so countdown shows 14 days, never instantly active.
    startDate = stored ? new Date(stored) : new Date();
    if (!stored) localStorage.setItem('cm_program_start_date', startDate.toISOString());
  }

  const anchor = lastBooked && lastBooked > startDate ? lastBooked : startDate;
  const today = new Date();
  const daysSinceStart = differenceInDays(today, startDate);
  const daysSinceAnchor = differenceInDays(today, anchor);
  const daysUntilNext = Math.max(0, 14 - daysSinceAnchor);
  const isActive = daysSinceAnchor >= 14;
  const nextMilestoneDate = new Date(anchor);
  nextMilestoneDate.setDate(nextMilestoneDate.getDate() + 14);

  return {
    startDate,
    daysSinceStart,
    currentCycle: Math.floor(daysSinceStart / 14),
    daysUntilNext,
    isActive,
    nextMilestoneDate,
    weeksCompleted: Math.floor(daysSinceStart / 7),
  };
}
