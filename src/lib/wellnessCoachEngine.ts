/**
 * Personalized Wellness Coach Engine
 * Pure logic module — no UI, no side effects.
 * Consumes user state + time of day, returns a tailored coach message,
 * an in-app action target, and an urgency level.
 */

export type CoachStage = 'pregnancy' | 'postpartum' | 'TTC';
export type CoachGap = 'fitness' | 'nutrition' | 'stress' | 'sleep' | 'recovery' | string;
export type UrgencyLevel = 'low' | 'medium' | 'high';
export type UserState = 'needs_support' | 'improving' | 'maintaining';
export type TimeOfDay = 'morning' | 'afternoon' | 'night';

export interface CoachInput {
  name: string;
  stage: CoachStage;
  score: number;
  gaps: CoachGap[];
  subscriptionStatus: 'active' | 'inactive' | 'expired' | string;
  currentTime?: Date;
}

export interface SuggestedAction {
  label: string;
  /** App route to navigate to */
  to: string;
  /** True if the destination is a premium/locked tool for non-subscribers */
  locked: boolean;
}

export interface CoachOutput {
  coachMessage: string;
  suggestedAction: SuggestedAction;
  urgencyLevel: UrgencyLevel;
  meta: {
    state: UserState;
    priorityGap: CoachGap | null;
    timeOfDay: TimeOfDay;
    isSubscribed: boolean;
  };
}

// ---------- helpers ----------

const getUserState = (score: number): UserState => {
  if (score < 50) return 'needs_support';
  if (score <= 75) return 'improving';
  return 'maintaining';
};

const getTimeOfDay = (date: Date): TimeOfDay => {
  const h = date.getHours();
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 18) return 'afternoon';
  return 'night'; // 6pm – 4:59am
};

const firstName = (name: string) => (name?.trim().split(/\s+/)[0] || 'friend');

const stageLabel = (stage: CoachStage): string => {
  switch (stage) {
    case 'pregnancy': return 'pregnancy';
    case 'postpartum': return 'postpartum recovery';
    case 'TTC': return 'TTC journey';
  }
};

// Map a gap → a route + label + whether it's a premium tool
const routeForGap = (gap: CoachGap | null, stage: CoachStage): SuggestedAction => {
  // Pregnant users get tracking tools prioritized
  if (stage === 'pregnancy' && (gap === 'stress' || gap === 'recovery' || !gap)) {
    return { label: 'Open Kick Counter', to: '/dashboard?tool=kick-counter', locked: true };
  }

  switch (gap) {
    case 'fitness':
      return { label: 'Start a workout', to: '/workouts', locked: false };
    case 'nutrition':
      return { label: 'View your meal plan', to: '/meal-plan', locked: false };
    case 'stress':
      return { label: 'Open self-care tools', to: '/wellness', locked: false };
    case 'sleep':
      return { label: 'Try the sleep tracker', to: '/wellness?tab=sleep', locked: false };
    case 'recovery':
      return stage === 'postpartum'
        ? { label: 'Postpartum recovery guide', to: '/wellness/recovery', locked: false }
        : { label: 'Open recovery tools', to: '/wellness', locked: false };
    default:
      return { label: 'Go to dashboard', to: '/dashboard', locked: false };
  }
};

const urgencyFor = (state: UserState, timeOfDay: TimeOfDay): UrgencyLevel => {
  if (state === 'needs_support') return 'high';
  if (state === 'improving') return timeOfDay === 'night' ? 'medium' : 'medium';
  return 'low';
};

// ---------- message composition ----------

interface MsgCtx {
  name: string;
  stage: CoachStage;
  state: UserState;
  gap: CoachGap | null;
  timeOfDay: TimeOfDay;
  isSubscribed: boolean;
}

const gapPhrase = (gap: CoachGap | null): string => {
  switch (gap) {
    case 'fitness': return 'movement';
    case 'nutrition': return 'nourishment';
    case 'stress': return 'calm';
    case 'sleep': return 'rest';
    case 'recovery': return 'recovery';
    default: return 'wellbeing';
  }
};

const composeMessage = (c: MsgCtx): string => {
  const name = firstName(c.name);
  const stage = stageLabel(c.stage);
  const focus = gapPhrase(c.gap);

  // Time-based opener
  let opener = '';
  if (c.timeOfDay === 'morning') {
    opener = `Good morning, ${name}. Let's start your day with one small win for ${focus}.`;
  } else if (c.timeOfDay === 'afternoon') {
    opener = `Hey ${name}, quick check-in — how is your ${focus} feeling so far today?`;
  } else {
    opener = `Hi ${name}. The day is winding down. Take a breath — you carried a lot today.`;
  }

  // State-based body
  let body = '';
  if (c.state === 'needs_support') {
    body = ` Your ${stage} is asking for extra care right now. We'll go gently — one step at a time.`;
  } else if (c.state === 'improving') {
    body = ` You're building real momentum in your ${stage}. Keep showing up — it's working.`;
  } else {
    body = ` You're in a strong rhythm with your ${stage}. Let's protect what you've built.`;
  }

  // Time + gap action prompt
  let prompt = '';
  if (c.timeOfDay === 'morning') {
    prompt = ` Try one focused action for ${focus} before noon.`;
  } else if (c.timeOfDay === 'afternoon') {
    prompt = ` A 5-minute reset on ${focus} now will pay off tonight.`;
  } else {
    prompt = ` Reflect on one moment today you're proud of, then rest.`;
  }

  // Subscription tail
  const tail = c.isSubscribed
    ? ''
    : ` Renew anytime to unlock your full personalized plan.`;

  return `${opener}${body}${prompt}${tail}`;
};

// ---------- main ----------

export function generateCoachOutput(input: CoachInput): CoachOutput {
  const now = input.currentTime ?? new Date();
  const state = getUserState(input.score);
  const timeOfDay = getTimeOfDay(now);
  const priorityGap = input.gaps && input.gaps.length > 0 ? input.gaps[0] : null;
  const isSubscribed = input.subscriptionStatus === 'active';

  const action = routeForGap(priorityGap, input.stage);
  // Non-subscribers see a soft upsell when the action is locked
  const suggestedAction: SuggestedAction = isSubscribed
    ? action
    : action.locked
      ? { label: `${action.label} (Premium)`, to: '/profile?tab=subscription', locked: true }
      : action;

  const coachMessage = composeMessage({
    name: input.name,
    stage: input.stage,
    state,
    gap: priorityGap,
    timeOfDay,
    isSubscribed,
  });

  return {
    coachMessage,
    suggestedAction,
    urgencyLevel: urgencyFor(state, timeOfDay),
    meta: { state, priorityGap, timeOfDay, isSubscribed },
  };
}
