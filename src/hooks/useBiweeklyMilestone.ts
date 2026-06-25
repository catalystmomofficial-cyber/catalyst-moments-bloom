import { useAuth } from '@/contexts/AuthContext';
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

// Anchor: most recent of (last booked milestone) or (program start). A booking
// resets the 14-day cycle; otherwise it anchors to paid subscription start (or
// account creation) so the cadence reflects real usage, not just signup.
export function useBiweeklyMilestoneStatus(): BiweeklyMilestoneStatus {
  const { profile, subscriptionStart, subscribed } = useAuth();

  const lastBooked = (() => {
    try {
      const v = localStorage.getItem('cm_last_milestone_at');
      return v ? new Date(v) : null;
    } catch { return null; }
  })();

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
