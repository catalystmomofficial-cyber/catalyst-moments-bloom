# Births, recoveries and check-ins

Read this before changing anything in `src/lib/recovery.ts`,
`src/hooks/useRecovery.ts`, or the `births` / `recoveries` tables.

## Fields that exist on purpose but are not read yet

**`births.birth_type`** — vaginal, cesarean, VBAC, assisted, unknown.

Collected today, consumed by nothing. Core Restore, VBAC prep and cesarean
recovery all need to differ by delivery type, and that feature is not built.

**Do not remove it as unused.** It is the kind of field that, once missing, gets
back-filled wrong six months later when someone finally needs it — she is asked
to remember her delivery type a year after the fact, or worse, it is inferred.
Collecting it at the moment she records the birth is the only time the answer is
reliable.

Same reasoning as the analytics constraint in `holding-state.md`: write down why
a seemingly-unused thing exists, or it gets tidied away.

## Why a birth and a recovery are separate tables

A birth is an event. It happened, and it is never archived.

A recovery is a timeline that starts, runs, and is eventually superseded by the
next one. `recoveries.archived_at` is what decides which timeline is current.

The first version put `archived_at` on `births`, which conflated "this birth is
superseded" with "this recovery is no longer active". They are different facts,
and only the second one is ever true.

## Why a birth event is not a baby

`baby_count` sits on the birth row. Twins are one labour, one recovering body,
one timeline.

Modelling one row per baby would force a mother of twins to choose which baby's
recovery to track, which is the wrong question — recovery is about her body, not
the child count.

## Why `pregnancy_journey_id` is nullable

A woman who joins the app already postpartum has no pregnancy journey, and that
segment is deliberately served. Requiring a journey would mean fabricating a
pregnancy she never logged just to reach her own recovery.

## A stillbirth is a birth event

`births.outcome` is `live | stillbirth | neonatal_death`.

Recording loss only on `pregnancy_journeys.outcome` left a woman who delivered a
stillborn baby with no birth event and no recovery timeline — the app had no way
to acknowledge that her body had been through labour. The physical recovery is
real, and often harder.

**Holding and recovery are different axes.** Holding handles the emotional side
and stops the notifications; recovery handles the body. One does not substitute
for the other, and a woman can be in both.

## The constraint and its error paths

`recoveries_one_active_per_user` is a partial unique index on
`(user_id) WHERE archived_at IS NULL`.

Every path that could violate it, and how it is handled:

1. **`record_birth`** archives any active recovery in the same statement before
   inserting the new one. The client confirms with her first; the archive in the
   RPC is the safety net, not the decision. The constraint must never surface as
   an error to a woman who has just had a baby.
2. **`record_pregnancy_outcome('birth')`** used to write its own `births` row and
   knew nothing about recoveries — leaving her with a closed pregnancy and no
   recovery at all. It now calls `record_birth`, so there is one creator, not
   two.
3. **Correcting a birth date** UPDATEs the existing `births` row. It must never
   call `record_birth` again: that would archive her recovery and start a
   second, which is reserved for an actual second baby.

If you add a fourth path that creates a birth, it goes through `record_birth`.

## The second-birth confirmation

The wording is deliberate:

> **You're adding a new baby**
> Your recovery from your first will be kept — you can still find it in your
> history. Start fresh recovery?

It names the event in her language rather than the database's ("adding a new
baby", not "you have an active recovery"), promises the old one is kept, and
frames the new one as starting rather than the old one as ending. One tap.

Do not add a biological plausibility check. A four-month gap might mean a
surrogate, a loss, or someone recording on another's behalf. The app is not an
obstetrician.

## The localStorage migration

Both the birth date (`recovery-birth-date`) and every check-in
(`recovery-checkins`) lived in localStorage alone until August 2026. A new phone
erased her timeline and silently reset the safety nudge that watches for a run
of hard days.

`useRecovery` lifts the local copy into the database once, silently, without
blocking the UI, and only after the server confirms. It never deletes local data
before the write succeeds — a migration that clears first and fails second loses
exactly what it was meant to rescue.
