# Holding — the state after a pregnancy loss

Holding is where a user goes when she tells us she has had a loss. It is not a
stage. Stages progress; this one does not.

If you are about to change anything that touches notifications, the dashboard,
analytics, or the growth funnel, read this first.

## The constraint that will be tested

**Analytics on Holding users are never used to improve engagement.**

Entry into Holding is tracked for exactly one reason: so we know how many women
are in this state at any time, and can audit whether the experience we built for
them is actually decent. That is the whole purpose.

It is not a conversion event. It is not a funnel stage. It is not a cohort to
re-activate, win back, or A/B test against. No campaign may target it. No
retention metric may include it as an outcome to be reduced.

This constraint will be tested the moment somebody notices the metric exists and
observes that Holding users have low engagement. The answer is that their
engagement is *supposed* to be low, and that "fixing" it means interrupting a
woman who has just lost a pregnancy. If that conversation happens, this
paragraph is the answer.

## What Holding does

- **Notifications hard-stop.** Suppressed in `send-lifecycle-notifications`
  before every other check, and deliberately outside the `!immediate` guard, so
  an admin blast cannot reach her either. Suppressed types: `daily_workout`,
  `meal_reminder`, `milestone_ready`, `inactivity`, `achievement`.
- **The dashboard changes.** `HoldingCard` replaces every stage branch. The
  coach card, monthly challenge, daily checklist, nutrition section and intent
  banner are all gated off — they nudge, score, or celebrate.
- **The ring freezes** at the week it stopped, from `frozen_week` /
  `frozen_day`. Stored, not recomputed: if the easing curve or the leaf shapes
  ever change, she must still see the picture she last saw.
- **Muted, never greyed.** Greyed reads as broken or disabled. Muted reads as
  at rest. This was real and is not being erased.
- **No numbers.** No week, no trimester, no countdown. The numbers that measured
  the pregnancy stop measuring.
- **The coach is present, not pushing.** A door she opens. It never opens
  itself.

## Rules that must not be broken

1. **Nothing moves her out of Holding except a control she presses.** No timer,
   no cron, no default, no "it's been six weeks, are you ready to try again?".
   That prompt is what gets apps deleted and talked about.
2. **Holding has no duration.** Two days or two years are both correct.
3. **Never prompt entry.** She tells the app, on her timeline. No pop-up, no
   "we noticed your due date has passed" — ever.
4. **Two doors, never one.** "I've given birth" and "I've had a loss" are
   different events. They must stay separate and reachable from each other's
   confirmation, because landing in the celebratory postpartum flow after a loss
   is the worst misclick in the product.
5. **The word is "loss".** Not "miscarriage" (clinical), not "ended" or
   "changed" (reads as the app being uncomfortable — and if the app flinches,
   she learns she should too).
6. **A new pregnancy starts a new ring.** The old one is archived, never
   resumed. She must never feel she is continuing something that ended.

## Adding a new notification type

If it references a pregnancy in progress, add it to `PREGNANCY_TYPES` in
`send-lifecycle-notifications/index.ts`. If it congratulates, scores, or asks
her to come back, add it to `suppressedByHolding`. When in doubt, suppress it.
The cost of a missed nudge is nothing. The cost of the other mistake is a woman
receiving "You're 25 weeks today!" two days after her loss.

## Still to build

- The 30-day data prompt. `prompt_after` is recorded but read by nothing yet —
  verified as a clean no-op, not a half-rendered state.
- PDF keepsake export. Spec the format before building: cover, contents, order,
  printable, shareable. Format matters as much as content.
- 90-day photo hold. Photos are never auto-deleted, even when she deletes
  everything else.
- Catalyst AI pause toggle. Default paused; the toggle is how she chooses to
  keep the companion. The default protects her, the toggle respects her.
- Partner propagation. When partner mode ships, suppression must reach linked
  accounts — a partner receiving "She's 25 weeks today!" is the same harm with a
  different recipient.

## Before this reaches a real user

Walking a test account catches engineering bugs. It does not catch emotional
logic bugs. **A perinatal mental health professional should review the
experience** — the words, the timing, the silences, the confirmations — not the
code. Engineering can be perfect and the emotional logic still wrong.
