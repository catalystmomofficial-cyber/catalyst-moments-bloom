import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { isServiceRoleRequest, getUser, isAdmin, forbidden } from "../_shared/auth.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANON = Deno.env.get('SUPABASE_ANON_KEY')!;

type LifecycleType =
  | 'welcome' | 'daily_workout' | 'meal_reminder' | 'inactivity'
  | 'milestone_ready' | 'achievement';
type Stage = 'ttc' | 'pregnancy' | 'postpartum' | 'none';

// Types whose message is built per user from their own data rather than
// picked from the COPY table. They skip the stage-variant lookup entirely.
const DYNAMIC_TYPES = new Set<LifecycleType>(['milestone_ready', 'achievement']);

// Users span US, Canada, UK, Australia and Asia. There is no UTC hour that is
// morning for all of them, so every scheduled type names the LOCAL hour it
// wants and the cron runs hourly to find whoever is at that hour right now.
const SLOT: Record<Exclude<LifecycleType, 'welcome'>, {
  localHour: number;
  /** Honour notification_preferences.reminder_time instead of localHour. */
  usePreferredTime?: boolean;
  prefField?: string;
}> = {
  daily_workout: { localHour: 9,  usePreferredTime: true, prefField: 'daily_reminders_enabled' },
  meal_reminder: { localHour: 17, prefField: 'daily_reminders_enabled' },
  inactivity:    { localHour: 19, prefField: 'daily_reminders_enabled' },
  // Late morning: she is awake, and the Calendly page is something you sit
  // down with rather than glance at.
  milestone_ready: { localHour: 10, prefField: 'event_reminders_enabled' },
  // Earning a badge should land while the win is still warm, so this one runs
  // at every hour that is not the middle of the night.
  achievement:     { localHour: -1, prefField: 'achievement_alerts_enabled' },
};

// ── Time -------------------------------------------------------------------
// A user's timezone is an IANA name from the browser. Intl does the DST and
// offset arithmetic; doing it by hand with stored offsets breaks twice a year.
const DEFAULT_TZ = 'America/New_York'; // largest cohort, used when unknown

function localParts(tz: string, now: Date): { hour: number; dateKey: string; isoWeek: string } {
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', hour12: false,
    }).formatToParts(now);
  } catch {
    // Garbage timezone string (stale browser, spoofed client). Don't drop the
    // user, just treat them as the default cohort.
    return localParts(DEFAULT_TZ, now);
  }
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  // 'en-CA' with hour12:false yields 24 for midnight in some runtimes.
  const hour = Number(get('hour')) % 24;
  const dateKey = `${get('year')}-${get('month')}-${get('day')}`;
  const d = new Date(`${dateKey}T00:00:00Z`);
  const week = Math.ceil(((d.getTime() - Date.UTC(d.getUTCFullYear(), 0, 1)) / 86400000 + 1) / 7);
  return { hour, dateKey, isoWeek: `${get('year')}-W${String(week).padStart(2, '0')}` };
}

function inQuietHours(hour: number, start?: string | null, end?: string | null): boolean {
  if (!start || !end) return hour >= 22 || hour < 7; // sane default: no 3am pushes
  const s = Number(start.slice(0, 2));
  const e = Number(end.slice(0, 2));
  return s <= e ? hour >= s && hour < e : hour >= s || hour < e; // handles overnight
}

// ── Copy -------------------------------------------------------------------
// Written per stage. A TTC user and a 6-weeks-postpartum user have nothing in
// common, and generic copy is what makes an app's notifications get muted.
// Variants rotate on the local date so the same words don't arrive daily.
type Copy = { title: string; body: string; url: string };

const COPY: Record<LifecycleType, Partial<Record<Stage, Copy[]>> & { none: Copy[] }> = {
  welcome: {
    none: [{ title: 'Welcome to Catalyst Mom', body: "You're in. Let's start where you are.", url: '/dashboard' }],
    ttc: [{ title: 'Welcome to Catalyst Mom', body: "Your cycle tools are ready when you are.", url: '/dashboard' }],
    pregnancy: [{ title: 'Welcome to Catalyst Mom', body: "Let's take this one week at a time.", url: '/dashboard' }],
    postpartum: [{ title: 'Welcome to Catalyst Mom', body: "Rebuilding starts gently. We'll show you how.", url: '/dashboard' }],
  },
  daily_workout: {
    none: [
      { title: 'Your movement is ready', body: 'Ten minutes counts. Start there.', url: '/workouts' },
      { title: 'Today\'s session is waiting', body: 'Short and doable. Come see.', url: '/workouts' },
    ],
    ttc: [
      { title: 'Today\'s movement is ready', body: 'Gentle work that supports your cycle.', url: '/workouts' },
      { title: 'A session for today', body: 'Low-stress movement, built for where you are.', url: '/workouts' },
    ],
    pregnancy: [
      { title: 'Your prenatal session is ready', body: 'Safe for your trimester. Ten minutes.', url: '/workouts' },
      { title: 'Movement for today', body: 'Built around your bump, not against it.', url: '/workouts' },
    ],
    postpartum: [
      { title: 'Your core work is ready', body: 'Rebuilding from the inside out. Start slow.', url: '/workouts' },
      { title: 'Today\'s recovery session', body: 'Ten minutes for your core. That\'s enough.', url: '/workouts' },
    ],
  },
  meal_reminder: {
    none: [{ title: 'Time to eat something real', body: 'Your meal plan is one tap away.', url: '/recipes' }],
    ttc: [
      { title: 'Fuel for your cycle', body: 'Tonight\'s meal supports hormone balance.', url: '/recipes' },
      { title: 'Dinner ideas ready', body: 'Cycle-friendly food, nothing complicated.', url: '/recipes' },
    ],
    pregnancy: [
      { title: 'Time to nourish you both', body: 'Tonight\'s plan covers what you need.', url: '/recipes' },
      { title: 'Dinner is sorted', body: 'Iron, protein, and no thinking required.', url: '/recipes' },
    ],
    postpartum: [
      { title: 'Eat something, mama', body: 'Recovery runs on food. Tonight\'s plan is ready.', url: '/recipes' },
      { title: 'Quick dinner, real nutrition', body: 'One hand, fifteen minutes. We planned for that.', url: '/recipes' },
    ],
  },
  inactivity: {
    none: [{ title: 'Still here when you are', body: 'No guilt. Pick up wherever you left off.', url: '/dashboard' }],
    ttc: [{ title: 'Your cycle log is waiting', body: 'A few days missing. Catching up takes a minute.', url: '/ttc' }],
    pregnancy: [{ title: 'How are you feeling this week?', body: 'Log where you are. It only takes a minute.', url: '/dashboard' }],
    postpartum: [{ title: 'No guilt, just a check-in', body: 'Some weeks survival is the win. Come back when ready.', url: '/dashboard' }],
  },
  // Built per user in selectDynamic(); these are only a safety net.
  milestone_ready: { none: [{ title: 'Your check-in is ready to book', body: 'Two weeks in. Grab a slot with your expert.', url: '/progress' }] },
  achievement:     { none: [{ title: 'You earned a badge', body: 'Nice work, mama.', url: '/progress' }] },
};

// The Progress page tells her "your 2-week check-in is ready" and some users
// never scroll far enough to see it. This mirrors that message, worded for a
// lock screen, and escalates once if she has not booked the next day.
function milestoneCopy(p: ProfileRow, day: 1 | 2): Copy {
  const first = (p.display_name ?? '').trim().split(/\s+/)[0];
  const who = first && first.length <= 20 ? first : 'mama';
  const stage = (p.motherhood_stage ?? 'none') as Stage;
  const what = stage === 'ttc' ? 'fertility momentum'
    : stage === 'pregnancy' ? 'pregnancy momentum'
    : stage === 'postpartum' ? 'recovery momentum'
    : 'momentum';

  return day === 1
    ? { title: `${who}, your 2-week check-in is unlocked`,
        body: `Two weeks of ${what}. Book your 1-on-1 and shape what comes next.`,
        url: '/progress' }
    : { title: 'Your check-in slot is still open',
        body: 'Day two. It takes a minute to book, and the spot is yours.',
        url: '/progress' };
}

// One-time congratulation using the badge's own title, so it reads as the app
// noticing her specifically rather than a generic "achievement unlocked".
function achievementCopy(p: ProfileRow, a: AchievementRow): Copy {
  const first = (p.display_name ?? '').trim().split(/\s+/)[0];
  const who = first && first.length <= 20 ? `${first}, ` : '';
  return {
    title: `${who}you earned "${a.title}"`,
    body: a.description?.slice(0, 120) || 'Badge unlocked. Go take a look.',
    url: '/progress',
  };
}

/**
 * Swap in her own words where we have them. She told us her concern in the
 * assessment; echoing it back is the difference between a broadcast and
 * something that sounds like it was written for her.
 */
function personalize(base: Copy, p: ProfileRow, type: LifecycleType): Copy {
  const first = (p.display_name ?? '').trim().split(/\s+/)[0];
  let { title, body } = base;

  if (first && first.length <= 20) title = `${first}, ${title[0].toLowerCase()}${title.slice(1)}`;

  const concern = (p.assessment_concern ?? '').trim();
  const goal = (p.assessment_data?.primary_goal ?? '').toString().trim();
  const focus = concern || goal;

  // Only on re-engagement, where the reason to return is the whole message.
  // On a daily nudge it reads as nagging about a thing she already knows.
  if (type === 'inactivity' && focus && focus.length <= 60) {
    body = `You told us ${focus.toLowerCase()} mattered. It's still here when you are.`;
  }

  return { ...base, title, body };
}

// ── Data -------------------------------------------------------------------
interface ProfileRow {
  user_id: string;
  display_name: string | null;
  motherhood_stage: string | null;
  timezone: string | null;
  last_active_at: string | null;
  created_at: string | null;
  assessment_concern: string | null;
  assessment_data: Record<string, unknown> | null;
}

interface AchievementRow {
  user_id: string;
  achievement_id: string;
  title: string;
  description: string | null;
  earned_at: string;
}

interface PrefRow {
  user_id: string;
  daily_reminders_enabled: boolean;
  reminder_time: string | null;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
  max_pushes_per_day: number;
}

async function sbFetch(path: string, init: RequestInit = {}) {
  return fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init.headers || {}),
      apikey: ANON,
      Authorization: `Bearer ${SERVICE_ROLE}`,
      'Content-Type': 'application/json',
    },
  });
}

const chunk = <T,>(a: T[], n: number): T[][] =>
  Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, i * n + n));

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    // local_hour lets one type run in more than one slot — lunch and dinner
    // are both meal_reminder, they just want different hours. It also keeps
    // the schedule editable from SQL without a redeploy.
    const { type, user_ids, local_hour } = await req.json() as {
      type: LifecycleType; user_ids?: string[]; local_hour?: number;
    };
    if (!type || !COPY[type]) {
      return new Response(JSON.stringify({ error: 'Invalid lifecycle type' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ---- Authorization (never trust the request to decide this) ------------
    // This function had NO caller check: an anonymous POST pushed to every
    // user holding an FCM token, and it forwards to send-push-blast with the
    // SERVICE_ROLE key — so an anonymous caller inherited service-role reach.
    //
    // Legitimate callers: the pg_cron jobs (service role), an admin, or an
    // authenticated user notifying ONLY themselves (the onboarding welcome
    // push, which posts user_ids:[own id]).
    const serviceRole = isServiceRoleRequest(req);
    let callerId: string | null = null;
    let admin = false;

    if (!serviceRole) {
      const user = await getUser(req);
      if (!user) return forbidden(corsHeaders, 401, 'Unauthorized');
      callerId = user.id;
      admin = await isAdmin(user.id);
    }

    const targeted = Array.isArray(user_ids) && user_ids.length > 0;

    if (!serviceRole && !admin) {
      // Without user_ids this fans out to the whole subscriber list, so an
      // absent list is a broadcast attempt and must be refused.
      if (!targeted || !user_ids!.every((id) => id === callerId)) {
        return forbidden(corsHeaders, 403, 'Not authorized to notify other users');
      }
    }

    const now = new Date();
    const slot = type === 'welcome' ? null : SLOT[type];

    // An explicitly targeted send (welcome push, admin test) is immediate and
    // skips clock/cap gating — it is a direct response to something she just
    // did, not a scheduled interruption.
    const immediate = targeted;

    // ---- Candidates --------------------------------------------------------
    let candidateIds: string[];
    if (targeted) {
      candidateIds = user_ids!;
    } else {
      const r = await sbFetch('/rest/v1/push_subscriptions?fcm_token=not.is.null&select=user_id');
      const rows: { user_id: string }[] = await r.json();
      candidateIds = [...new Set(rows.map((x) => x.user_id))];
    }
    if (candidateIds.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0, type, reason: 'no subscribers' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ---- Profiles + preferences -------------------------------------------
    const profiles: ProfileRow[] = [];
    const prefs = new Map<string, PrefRow>();
    for (const ids of chunk(candidateIds, 200)) {
      const inList = `(${ids.join(',')})`;
      const [pr, nr] = await Promise.all([
        sbFetch(`/rest/v1/profiles?user_id=in.${inList}&select=user_id,display_name,motherhood_stage,timezone,last_active_at,created_at,assessment_concern,assessment_data`),
        sbFetch(`/rest/v1/notification_preferences?user_id=in.${inList}&select=user_id,daily_reminders_enabled,reminder_time,quiet_hours_start,quiet_hours_end,max_pushes_per_day`),
      ]);
      profiles.push(...(await pr.json() as ProfileRow[]));
      for (const row of await nr.json() as PrefRow[]) prefs.set(row.user_id, row);
    }

    // ---- How many pushes has each user already had today? ------------------
    // Types are added over time and several can match the same user on the
    // same day. Without a cap, a mom who logs a workout, has an event
    // tomorrow and hit a milestone gets three interruptions and mutes us.
    const sentToday = new Map<string, number>();
    if (!immediate) {
      const since = new Date(now.getTime() - 24 * 3600 * 1000).toISOString();
      for (const ids of chunk(candidateIds, 200)) {
        const r = await sbFetch(
          `/rest/v1/push_delivery_log?user_id=in.(${ids.join(',')})&sent_at=gte.${since}&select=user_id`,
        );
        if (!r.ok) continue;
        for (const row of await r.json() as { user_id: string }[]) {
          sentToday.set(row.user_id, (sentToday.get(row.user_id) ?? 0) + 1);
        }
      }
    }

    // ---- Extra data for the per-user types ---------------------------------
    // milestone_ready needs the 14-day anchor: her last booking, else when her
    // paid subscription began, else account creation. Bookings used to live
    // only in localStorage, which is why this reminder could not exist before.
    const lastBooking = new Map<string, string>();
    const subStart = new Map<string, string>();
    const freshAchievements: AchievementRow[] = [];

    if (type === 'milestone_ready') {
      for (const ids of chunk(candidateIds, 200)) {
        const inList = `(${ids.join(',')})`;
        const [mb, sb] = await Promise.all([
          sbFetch(`/rest/v1/milestone_bookings?user_id=in.${inList}&select=user_id,booked_at&order=booked_at.desc`),
          sbFetch(`/rest/v1/subscribers?user_id=in.${inList}&subscribed=eq.true&select=user_id,created_at`),
        ]);
        // Ordered desc, so the first row seen per user is their latest.
        for (const r of await mb.json() as { user_id: string; booked_at: string }[]) {
          if (!lastBooking.has(r.user_id)) lastBooking.set(r.user_id, r.booked_at);
        }
        for (const r of await sb.json() as { user_id: string; created_at: string }[]) {
          subStart.set(r.user_id, r.created_at);
        }
      }
    }

    if (type === 'achievement') {
      // Only badges earned since the last sweep. The dedupe key is the
      // achievement id, so a wider window is harmless — it just re-checks
      // rows already claimed — but keeping it tight keeps the query small.
      const since = new Date(now.getTime() - 3 * 3600 * 1000).toISOString();
      for (const ids of chunk(candidateIds, 200)) {
        const r = await sbFetch(
          `/rest/v1/user_achievements?user_id=in.(${ids.join(',')})&earned_at=gte.${since}` +
          `&select=user_id,achievement_id,title,description,earned_at&order=earned_at.desc`,
        );
        if (r.ok) freshAchievements.push(...(await r.json() as AchievementRow[]));
      }
    }

    // ---- Select who gets this, right now -----------------------------------
    const selected: { p: ProfileRow; copy: Copy; dedupeKey: string }[] = [];

    for (const p of profiles) {
      const tz = p.timezone || DEFAULT_TZ;
      const { hour, dateKey, isoWeek } = localParts(tz, now);
      const pref = prefs.get(p.user_id);
      // Resolved outside the gate so it can key the ledger row below.
      let wanted = typeof local_hour === 'number' ? local_hour : slot?.localHour ?? -1;

      if (!immediate && slot) {
        // Opted out of this category entirely.
        if (pref && slot.prefField && (pref as any)[slot.prefField] === false) continue;

        // Is it her hour? reminder_time already existed in the schema and was
        // never read; this is the first thing that honours it. An explicit
        // local_hour from the cron wins, since that names a specific slot.
        if (typeof local_hour !== 'number' && slot.usePreferredTime && pref?.reminder_time) {
          wanted = Number(pref.reminder_time.slice(0, 2));
        }
        // achievement uses localHour -1, meaning "any waking hour" — a badge
        // should land while the win is warm, not at a fixed slot tomorrow.
        if (wanted >= 0 && hour !== wanted) continue;

        if (inQuietHours(hour, pref?.quiet_hours_start, pref?.quiet_hours_end)) continue;

        // Daily budget. Two is the default and it is deliberately low.
        const cap = pref?.max_pushes_per_day ?? 2;
        if ((sentToday.get(p.user_id) ?? 0) >= cap) continue;

        // Inactivity is a re-engagement nudge, not a daily one.
        if (type === 'inactivity') {
          const last = p.last_active_at ? new Date(p.last_active_at).getTime() : 0;
          const daysAway = (now.getTime() - last) / 86400000;
          if (daysAway < 4) continue;   // still active, leave her alone
          if (daysAway > 120) continue; // long gone, this is spam not outreach
        }
      }

      // ---- Per-user types: message and eligibility come from her own data --
      if (DYNAMIC_TYPES.has(type) && !immediate) {
        if (type === 'milestone_ready') {
          // Same 14-day anchor the Progress page uses: last booking, else
          // paid subscription start, else account creation.
          const anchorIso = lastBooking.get(p.user_id)
            ?? subStart.get(p.user_id)
            ?? p.created_at;
          if (!anchorIso) continue;

          const daysSince = Math.floor((now.getTime() - new Date(anchorIso).getTime()) / 86400000);
          // Day 14 is the unlock. Day 15 is the single follow-up she asked
          // for. After that we stop — a third nudge about the same booking is
          // where a reminder turns into nagging.
          const day = daysSince === 14 ? 1 : daysSince === 15 ? 2 : 0;
          if (day === 0) continue;

          selected.push({
            p,
            copy: milestoneCopy(p, day as 1 | 2),
            // Keyed on the anchor, so a new cycle after booking gets its own
            // pair of nudges rather than being suppressed as a duplicate.
            dedupeKey: `${anchorIso.slice(0, 10)}:d${day}`,
          });
        }

        if (type === 'achievement') {
          for (const a of freshAchievements.filter((x) => x.user_id === p.user_id)) {
            selected.push({
              p,
              copy: achievementCopy(p, a),
              // One congratulation per badge, ever.
              dedupeKey: a.achievement_id,
            });
          }
        }
        continue;
      }

      const stage = (p.motherhood_stage ?? 'none') as Stage;
      const variants = COPY[type][stage] ?? COPY[type].none;
      const { dateKey: dk } = localParts(tz, now);
      const variant = variants[Number(dk.replace(/-/g, '')) % variants.length];

      selected.push({
        p,
        copy: personalize(variant, p, type),
        // Encodes the window each type means, so an hourly cron cannot send
        // the same nudge twice and a retry is harmless. Daily types include
        // the slot hour, so lunch and dinner are distinct sends rather than
        // the second one being swallowed as a duplicate of the first.
        dedupeKey: type === 'inactivity' ? isoWeek
          : type === 'welcome' ? 'once'
          : `${dateKey}:${wanted}`,
      });
    }

    if (selected.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0, type, considered: profiles.length }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ---- Claim before sending ---------------------------------------------
    // Insert the ledger row first with ON CONFLICT DO NOTHING. Only rows that
    // actually inserted come back, and only those get a push. This makes the
    // hourly cron idempotent: a duplicate run, an overlapping run, or a retry
    // after a timeout cannot double-notify anyone.
    const claimed = new Set<string>();
    if (!immediate) {
      for (const batch of chunk(selected, 200)) {
        const res = await sbFetch('/rest/v1/push_delivery_log', {
          method: 'POST',
          headers: { Prefer: 'resolution=ignore-duplicates,return=representation' },
          body: JSON.stringify(batch.map((s) => ({
            user_id: s.p.user_id,
            notification_type: type,
            dedupe_key: s.dedupeKey,
            title: s.copy.title,
            body: s.copy.body,
          }))),
        });
        if (res.ok) {
          // Keyed on user AND dedupe key, not user alone: one user can have
          // two new badges in the same sweep, and claiming per-user would send
          // both even when only one was actually new.
          for (const row of await res.json() as { user_id: string; dedupe_key: string }[]) {
            claimed.add(`${row.user_id}|${row.dedupe_key}`);
          }
        } else {
          // Ledger unavailable: skip rather than risk duplicate sends.
          console.error('push_delivery_log claim failed:', await res.text());
        }
      }
    }

    const toSend = immediate
      ? selected
      : selected.filter((s) => claimed.has(`${s.p.user_id}|${s.dedupeKey}`));
    if (toSend.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0, type, reason: 'already sent this window' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ---- Send ---------------------------------------------------------------
    // Copy differs per user now, so this can no longer be one blast call.
    // Group identical copy so the number of calls stays proportional to the
    // number of distinct messages, not the number of users.
    const groups = new Map<string, { copy: Copy; ids: string[] }>();
    for (const s of toSend) {
      const k = `${s.copy.title}|${s.copy.body}|${s.copy.url}`;
      if (!groups.has(k)) groups.set(k, { copy: s.copy, ids: [] });
      groups.get(k)!.ids.push(s.p.user_id);
    }

    let sent = 0, failed = 0;
    for (const g of groups.values()) {
      for (const ids of chunk(g.ids, 400)) {
        const blastRes = await sbFetch('/functions/v1/send-push-blast', {
          method: 'POST',
          body: JSON.stringify({ title: g.copy.title, body: g.copy.body, url: g.copy.url, user_ids: ids }),
        });
        if (blastRes.ok) {
          const r = await blastRes.json();
          sent += r.sent ?? 0;
          failed += r.failed ?? 0;
        } else {
          failed += ids.length;
          console.error('send-push-blast failed:', await blastRes.text());
        }
      }
    }

    return new Response(JSON.stringify({
      success: true, type, sent, failed,
      considered: profiles.length, selected: selected.length, distinct_messages: groups.size,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (e) {
    console.error('send-lifecycle-notifications error:', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
