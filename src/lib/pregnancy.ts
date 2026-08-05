// Pregnancy progress — the domain model behind "what week am I?"
//
// Why this exists: PregnancyTracker was generating the current week with
// Math.random() inside a trimester band, and carrying a hardcoded due date of
// 2024-08-15. A woman at 22 weeks could open the app and be told she was at
// week 14, then week 25 on the next render, with weekly guidance written for
// whichever number came up. Everything below is derived from one real date.
//
// This is not medical software. Gestational age here is the ordinary EDD-based
// estimate every pregnancy app uses; it does not replace her provider's dating
// scan, and nothing in this file diagnoses anything.

/** Standard term: 280 days (40 weeks) from LMP to estimated due date. */
export const TERM_DAYS = 280;
export const TERM_WEEKS = 40;

export interface PregnancyProgress {
  /** Completed weeks of gestation, 0–42. */
  week: number;
  /** Days into the current week, 0–6. Clinicians write this as "24+3". */
  dayOfWeek: number;
  /** 1, 2 or 3, derived from the week — never from a profile string. */
  trimester: 1 | 2 | 3;
  /** Whole days remaining until the due date. Negative once overdue. */
  daysRemaining: number;
  /** Fraction of the 40-week span completed, clamped 0–1. For arcs/rings. */
  fraction: number;
  /** True past 40+0. */
  isOverdue: boolean;
  /** "24 weeks + 3 days" / "40 weeks + 2 days · overdue" */
  label: string;
}

const DAY = 86_400_000;

/** Midnight-normalised so a render at 23:59 and one at 00:01 agree. */
const startOfDay = (d: Date) => {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
};

/**
 * Gestational progress from an estimated due date.
 *
 * Returns null when there is no usable date, so callers can ask her for one
 * rather than rendering a confident-looking number built on nothing — which is
 * exactly the failure this module replaces.
 */
export function pregnancyProgress(
  dueDate: string | Date | null | undefined,
  today: Date = new Date(),
): PregnancyProgress | null {
  if (!dueDate) return null;

  const due = startOfDay(new Date(dueDate));
  if (Number.isNaN(due.getTime())) return null;

  const now = startOfDay(today);
  const daysRemaining = Math.round((due.getTime() - now.getTime()) / DAY);

  // Guard against a date typed wrong (a year out, or long past). Better to ask
  // again than to show week 91.
  if (daysRemaining > TERM_DAYS || daysRemaining < -70) return null;

  const gestationalDays = TERM_DAYS - daysRemaining;
  const week = Math.floor(gestationalDays / 7);
  const dayOfWeek = gestationalDays % 7;

  const trimester: 1 | 2 | 3 = week < 13 ? 1 : week < 27 ? 2 : 3;
  const isOverdue = gestationalDays > TERM_DAYS;

  const label = isOverdue
    ? `${week} weeks + ${dayOfWeek} days · past your due date`
    : `${week} weeks + ${dayOfWeek} days`;

  return {
    week,
    dayOfWeek,
    trimester,
    daysRemaining,
    fraction: Math.min(Math.max(gestationalDays / TERM_DAYS, 0), 1),
    isOverdue,
    label,
  };
}

/** Estimated due date from the first day of her last period. */
export const dueDateFromLMP = (lmp: string | Date): Date =>
  new Date(startOfDay(new Date(lmp)).getTime() + TERM_DAYS * DAY);

// ─── Weekly content ─────────────────────────────────────────────────────────
// Deliberately two-sided. Every competitor describes the BABY this week; the
// second half of each entry is what is happening to HER, which is the framing
// the rest of the product already takes ("a postpartum body is a clinical
// reality, not a fitness goal"). Sizes are typical crown-rump / crown-heel
// figures — approximate by nature, and labelled that way in the UI.

export interface WeekNote {
  /** Size comparison, botanical rather than the fruit every competitor uses. */
  compare: string;
  /** Approximate length, already formatted. */
  size: string;
  /** One line about the baby. */
  baby: string;
  /** One line about her — the half nobody else writes. */
  mother: string;
}

const WEEK_NOTES: Record<number, WeekNote> = {
  4:  { compare: 'a poppy seed',      size: '2 mm',   baby: 'The neural tube is forming.', mother: 'You may not feel pregnant yet. That is completely normal.' },
  6:  { compare: 'a lentil',          size: '5 mm',   baby: 'A heartbeat is usually detectable.', mother: 'Nausea and exhaustion often start now. Eat what stays down.' },
  8:  { compare: 'a raspberry',       size: '1.6 cm', baby: 'Fingers and toes are separating.', mother: 'Your blood volume is already climbing. Dizziness is common.' },
  10: { compare: 'a kumquat',         size: '3 cm',   baby: 'Vital organs are all in place.', mother: 'Your uterus is roughly the size of a grapefruit now.' },
  12: { compare: 'a fig',             size: '5 cm',   baby: 'Reflexes are beginning.', mother: 'Nausea often eases from here. Energy may start returning.' },
  14: { compare: 'a lemon',           size: '9 cm',   baby: 'Facial muscles are developing.', mother: 'Round ligament pain can begin as things stretch.' },
  16: { compare: 'an avocado',        size: '11 cm',  baby: 'Baby can hear muffled sound.', mother: 'Your centre of gravity is shifting. Core work matters now.' },
  18: { compare: 'a bell pepper',     size: '14 cm',  baby: 'Movement is getting stronger.', mother: 'First flutters are often felt around now.' },
  20: { compare: 'a banana',          size: '25 cm',  baby: 'Halfway. The anatomy scan usually happens.', mother: 'Back and hip load increases from here.' },
  22: { compare: 'a small squash',    size: '28 cm',  baby: 'Grip is developing.', mother: 'Braxton Hicks may begin. They should not be painful.' },
  24: { compare: 'an ear of corn',    size: '30 cm',  baby: 'Lungs are developing rapidly.', mother: 'Your abdominal wall is stretching — this is where diastasis begins.' },
  26: { compare: 'a head of lettuce', size: '35 cm',  baby: 'Eyes are beginning to open.', mother: 'Heartburn and swelling are common now.' },
  28: { compare: 'an aubergine',      size: '37 cm',  baby: 'Third trimester begins.', mother: 'Breathlessness is normal — your diaphragm has less room.' },
  30: { compare: 'a cabbage',         size: '39 cm',  baby: 'Baby is gaining weight steadily.', mother: 'Pelvic floor pressure increases. Gentle work, not heavy.' },
  32: { compare: 'a squash',          size: '42 cm',  baby: 'Bones are hardening.', mother: 'Sleep gets harder. Side-lying and pillows help.' },
  34: { compare: 'a cantaloupe',      size: '45 cm',  baby: 'Lungs are nearly ready.', mother: 'Practice contractions may get noticeably stronger.' },
  36: { compare: 'a honeydew',        size: '47 cm',  baby: 'Baby may move head-down.', mother: 'Breathing may ease as baby drops. Pelvic pressure rises.' },
  38: { compare: 'a pumpkin',         size: '49 cm',  baby: 'Considered full term.', mother: 'Nesting energy and exhaustion often arrive together.' },
  40: { compare: 'a watermelon',      size: '51 cm',  baby: 'Due date week.', mother: 'Only about 4% arrive on the due date. You are not late yet.' },
};

/** Nearest even-week note at or below the given week. */
export function weekNote(week: number): WeekNote | null {
  for (let w = Math.min(week, 40); w >= 4; w--) {
    if (WEEK_NOTES[w]) return WEEK_NOTES[w];
  }
  return null;
}

export const trimesterLabel = (t: 1 | 2 | 3): string =>
  t === 1 ? 'First trimester' : t === 2 ? 'Second trimester' : 'Third trimester';
