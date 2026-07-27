// "Your Recovery" — the postpartum domain model.
//
// Why this exists: every major maternal app tracks the BABY (feeds, diapers,
// wake windows) and treats the mother as the logger. Our own research kept
// surfacing two things: (1) nobody tracks how the mother is actually healing,
// and (2) heavy logging is itself a source of anxiety — paediatricians
// routinely tell parents to stop. So this module is deliberately the *least*
// tracking in the category: one tap, no streaks, no scores to chase.
//
// It is not medical software. Nothing here diagnoses, and every phase note
// defers to her provider.

export type RecoveryMood = 'rough' | 'okay' | 'good';

export interface RecoveryCheckIn {
  /** Local date key, YYYY-MM-DD */
  date: string;
  mood: RecoveryMood;
  at: string; // ISO timestamp
}

export interface RecoveryPhase {
  id: string;
  /** Inclusive lower bound in days postpartum */
  fromDay: number;
  /** Exclusive upper bound in days postpartum (Infinity for the last) */
  toDay: number;
  label: string;
  /** Short, non-medical reassurance for this stretch. */
  normal: string;
  /** What the app should be encouraging right now. */
  focus: string;
}

const BIRTH_DATE_KEY = 'recovery-birth-date';
const CHECKINS_KEY = 'recovery-checkins';

// ─── Phases ─────────────────────────────────────────────────────────────────
// Framing is intentionally gentle and non-prescriptive. The 6-week marker is
// named because it is the near-universal postpartum check-up in the US, not
// because we are clearing anyone for anything.
export const RECOVERY_PHASES: RecoveryPhase[] = [
  {
    id: 'first-days',
    fromDay: 0,
    toDay: 14,
    label: 'The first two weeks',
    normal:
      "Bleeding, night sweats, big feelings and almost no routine are all common right now. You are not behind — there is nothing to catch up on yet.",
    focus: 'Rest, food, and letting people help.',
  },
  {
    id: 'early-healing',
    fromDay: 14,
    toDay: 42,
    label: 'Early healing',
    normal:
      "Energy comes and goes, and many moms feel more emotional in these weeks than they expected. Most providers do a check-up around six weeks — worth writing your questions down as they come.",
    focus: 'Gentle movement only if it feels good. Nothing to prove.',
  },
  {
    id: 'finding-feet',
    fromDay: 42,
    toDay: 84,
    label: 'Finding your feet',
    normal:
      "Some days feel almost normal and some really don't. That swing is common. If you have been cleared by your provider, this is often when gentle rebuilding starts to feel good.",
    focus: 'Rebuilding slowly, on your timeline.',
  },
  {
    id: 'rebuilding',
    fromDay: 84,
    toDay: 182,
    label: 'Rebuilding',
    normal:
      "Sleep is often still broken and that alone affects everything. Strength usually returns unevenly rather than in a straight line.",
    focus: 'Consistency over intensity.',
  },
  {
    id: 'still-recovering',
    fromDay: 182,
    toDay: 365,
    label: 'Still recovering',
    normal:
      "It is completely normal to still be recovering past six months. 'Back to normal' is not a deadline, and it is not the goal either.",
    focus: 'Strength, and getting your own time back.',
  },
  {
    id: 'beyond-year',
    fromDay: 365,
    toDay: Infinity,
    label: 'Your fourth trimester, still',
    normal:
      "Recovery does not stop at a year. Plenty of moms are still rebuilding strength and sleep well past this point, and that is not a failure.",
    focus: 'Long-term strength and your own wellbeing.',
  },
];

export const phaseForDay = (dayPostpartum: number): RecoveryPhase =>
  RECOVERY_PHASES.find((p) => dayPostpartum >= p.fromDay && dayPostpartum < p.toDay) ??
  RECOVERY_PHASES[RECOVERY_PHASES.length - 1];

/** Coarse fallback when she has not set a birth date — maps the profile's
 *  stage bucket to a representative phase so the card is still useful. */
export const phaseForStageLabel = (phase?: string | null): RecoveryPhase => {
  const s = (phase || '').toLowerCase();
  if (s.includes('0-6')) return RECOVERY_PHASES[1];
  if (s.includes('6-12 weeks')) return RECOVERY_PHASES[2];
  if (s.includes('3-6 month')) return RECOVERY_PHASES[3];
  if (s.includes('6-12 month')) return RECOVERY_PHASES[4];
  if (s.includes('12+')) return RECOVERY_PHASES[5];
  return RECOVERY_PHASES[1];
};

// ─── Dates ──────────────────────────────────────────────────────────────────
export const localDateKey = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const getBirthDate = (): string | null => {
  try {
    return localStorage.getItem(BIRTH_DATE_KEY);
  } catch {
    return null;
  }
};

export const setBirthDate = (isoDate: string) => {
  try {
    localStorage.setItem(BIRTH_DATE_KEY, isoDate);
  } catch {
    /* storage unavailable — the card falls back to the stage bucket */
  }
};

/** Whole days since birth, or null when no date is set. Never negative. */
export const daysSinceBirth = (isoDate?: string | null): number | null => {
  const raw = isoDate ?? getBirthDate();
  if (!raw) return null;
  const born = new Date(`${raw}T00:00:00`);
  if (Number.isNaN(born.getTime())) return null;
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = Math.floor((startOfToday.getTime() - born.getTime()) / 86_400_000);
  return diff < 0 ? 0 : diff;
};

/** Elapsed weeks — the way mothers actually speak. 21 days is "3 weeks
 *  postpartum", not "week 4". Under a week we count in days instead. */
export const weekPostpartum = (days: number) => Math.floor(days / 7);

/** Days → weeks → months, switching over at the points mothers actually switch:
 *  "4 days", "3 weeks", "4 months". Nobody says "17 weeks postpartum". */
export const recoveryCount = (days: number): { value: number; unit: string } => {
  if (days < 7) return { value: days, unit: days === 1 ? 'day' : 'days' };
  if (days < 84) {
    const w = Math.floor(days / 7);
    return { value: w, unit: w === 1 ? 'week' : 'weeks' };
  }
  // Rounded, not floored: 12 weeks reads as "3 months" and 120 days as
  // "4 months", which is how she'd say it out loud.
  const m = Math.max(3, Math.round(days / 30.44));
  return { value: m, unit: m === 1 ? 'month' : 'months' };
};

// ─── Check-ins ──────────────────────────────────────────────────────────────
export const readCheckIns = (): RecoveryCheckIn[] => {
  try {
    const raw = localStorage.getItem(CHECKINS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/** One tap per day — a second tap replaces the day rather than stacking. */
export const saveCheckIn = (mood: RecoveryMood): RecoveryCheckIn[] => {
  const today = localDateKey(new Date());
  const next = [
    { date: today, mood, at: new Date().toISOString() },
    ...readCheckIns().filter((c) => c.date !== today),
  ].slice(0, 400);
  try {
    localStorage.setItem(CHECKINS_KEY, JSON.stringify(next));
  } catch {
    /* non-fatal */
  }
  return next;
};

export const todaysCheckIn = (list = readCheckIns()): RecoveryCheckIn | undefined =>
  list.find((c) => c.date === localDateKey(new Date()));

/** Most recent `days` calendar days, newest first, for the little history strip. */
export const recentCheckIns = (days: number, list = readCheckIns()): RecoveryCheckIn[] => {
  const cutoff = Date.now() - days * 86_400_000;
  return list.filter((c) => new Date(`${c.date}T00:00:00`).getTime() >= cutoff);
};

// ─── The quiet safety net ───────────────────────────────────────────────────
// Not a screener and not a diagnosis. Postpartum mood conditions can surface any
// time in the first year, and a run of hard days is the pattern a mother is most
// likely to explain away on her own. When we see one we say so gently, once, and
// point at real humans — never a score, never a warning colour.
export const HARD_DAY_THRESHOLD = 4;
export const SAFETY_WINDOW_DAYS = 14;

export interface SafetyNudge {
  show: boolean;
  roughDays: number;
}

export const evaluateSafetyNudge = (
  dayPostpartum: number | null,
  list = readCheckIns()
): SafetyNudge => {
  // Applies through the first year, when postpartum mood conditions most
  // commonly surface. Unknown date → still evaluate; a run of hard days
  // matters regardless of how precisely we know her timeline.
  if (dayPostpartum != null && dayPostpartum > 400) return { show: false, roughDays: 0 };
  const roughDays = recentCheckIns(SAFETY_WINDOW_DAYS, list).filter(
    (c) => c.mood === 'rough'
  ).length;
  return { show: roughDays >= HARD_DAY_THRESHOLD, roughDays };
};

// ─── Copy helpers ───────────────────────────────────────────────────────────
export const MOOD_META: Record<
  RecoveryMood,
  { label: string; emoji: string; reply: string; moodScore: number }
> = {
  rough: {
    label: 'Rough',
    emoji: '🌧',
    reply: "Thank you for being honest. Rough days are part of this — they're not a verdict on you.",
    moodScore: 3,
  },
  okay: {
    label: 'Okay',
    emoji: '🌤',
    reply: "Okay is a perfectly good day. You showed up, and that counts.",
    moodScore: 6,
  },
  good: {
    label: 'Good',
    emoji: '☀️',
    reply: "Love that. Worth remembering this one on a harder day.",
    moodScore: 9,
  },
};
