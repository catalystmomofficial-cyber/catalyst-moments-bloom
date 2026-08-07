import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Strict input validation to prevent prompt injection & API abuse
const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system', 'tool']),
  content: z.string().max(2000),
}).passthrough();

const BodySchema = z.object({
  messages: z.array(MessageSchema).min(1).max(50),
  // Photos she attached to the CURRENT question ("can I eat this?"). Data URLs
  // only, kept out of `messages` so the 2000-char content cap still applies to
  // her text. Two is plenty — a plate and a label.
  images: z.array(z.string().startsWith('data:image/').max(8_000_000)).max(2).optional(),
  userProfile: z.object({
    motherhood_stage: z.string().max(50).nullable().optional(),
    display_name: z.string().max(100).nullable().optional(),
    is_subscribed: z.boolean().optional(),
  }).optional(),
});



/**
 * Maps the funnel's signup payload into the shape the assessment prompt block
 * already reads, so there is one code path building `assessmentContext`.
 *
 * `categories` arrives as "Nutrition:6|Recovery:4" — it cannot be looked up,
 * because the funnel writes to a different Supabase project, so it travels in
 * the signup URL and lands in profiles.assessment_data.
 */
function fromFunnelProfile(prof: any) {
  if (!prof) return null;
  const a = (prof.assessment_data ?? {}) as Record<string, string>;
  const concern = prof.assessment_concern ?? a.concern ?? null;
  const reflection = prof.assessment_reflection ?? a.reflection ?? null;

  const category_scores: Record<string, number> = {};
  if (typeof a.categories === 'string') {
    for (const pair of a.categories.split('|')) {
      const i = pair.lastIndexOf(':');
      if (i < 1) continue;
      const label = pair.slice(0, i).trim();
      const value = Number(pair.slice(i + 1));
      if (label && Number.isFinite(value)) category_scores[label] = value;
    }
  }

  // Nothing usable came across — better to hand the prompt null than an empty
  // shell that makes it claim to know her.
  if (!concern && !reflection && !a.score && Object.keys(category_scores).length === 0) return null;

  return {
    primary_goal: a.primary_goal ?? null,
    biggest_obstacle: a.biggest_obstacle ?? null,
    dietary_preferences: null,
    activity_level: null,
    equipment: null,
    special_notes: {
      overall_score: a.score ?? null,
      tier: a.tier ?? null,
      category_scores,
      main_concern: concern,
      concern_reflection: reflection,
    },
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ── Auth: verify JWT and derive userId from token (never trust client) ──
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const authClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await authClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const userId = claimsData.claims.sub as string;

    // ── Validate input ──
    const rawBody = await req.json();
    const parsed = BodySchema.safeParse(rawBody);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: parsed.error.flatten() }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const { messages, userProfile, images } = parsed.data;
    console.log('[WELLNESS_COACH] Received messages:', messages.length, 'images:', images?.length ?? 0, 'Profile:', userProfile?.motherhood_stage);


    // Service-role client for trusted server-side reads/writes (scoped to authenticated userId)
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch assessment data for the authenticated user only.
    //
    // `lead_responses` is written by the in-app flows (onboarding, the results
    // page here, the voice webhook). A woman who arrived through the marketing
    // assessment at catalystmomofficial.com has no row in it — that funnel is a
    // different Supabase project entirely, so nothing about her was ever here.
    //
    // Her answers came across in the signup URL and were written to
    // `profiles.assessment_data` / `assessment_concern` / `assessment_reflection`.
    // Reading only `lead_responses` meant `assessmentContext` was an empty
    // string for every one of those women, so Coach Sarah opened knowing
    // nothing — while the results page they had just read promised the coach
    // already knew their answers.
    let assessmentData = null;
    if (userId) {
      const { data } = await supabase
        .from('lead_responses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        assessmentData = data;
        console.log('[WELLNESS_COACH] Found assessment data in lead_responses');
      } else {
        const { data: prof } = await supabase
          .from('profiles')
          .select('assessment_data, assessment_concern, assessment_reflection')
          .eq('user_id', userId)
          .maybeSingle();

        assessmentData = fromFunnelProfile(prof);
        if (assessmentData) console.log('[WELLNESS_COACH] Found assessment data from funnel signup');
      }
    }

    // Fetch recent weekly check-ins
    let checkInData = null;
    if (userId) {
      const { data } = await supabase
        .from('weekly_checkins')
        .select('*')
        .eq('user_id', userId)
        .order('week_date', { ascending: false })
        .limit(4);
      
      if (data && data.length > 0) {
        checkInData = data;
        console.log('[WELLNESS_COACH] Found', data.length, 'check-ins for user');
      }
    }

    // Get journey context
    const motherhoodStage = userProfile?.motherhood_stage || null;
    const displayName = userProfile?.display_name || 'there';
    
    // Build assessment context if available
    let assessmentContext = '';
    if (assessmentData) {
      const specialNotes = assessmentData.special_notes || {};
      const overallScore = specialNotes.overall_score || 'N/A';
      const tier = specialNotes.tier || 'N/A';
      const categoryScores = specialNotes.category_scores || {};
      
      // Find top 3 gaps (lowest scores)
      const gaps = Object.entries(categoryScores)
        .sort(([, a], [, b]) => (a as number) - (b as number))
        .slice(0, 3)
        .map(([category, score]) => `${category}: ${score}/10`);

      const line = (label: string, value: unknown) =>
        value === null || value === undefined || value === '' || value === 'N/A'
          ? '' : `\n- ${label}: ${value}`;

      // Only state what we actually have. A funnel signup has her score, her
      // gaps and her own words but no equipment or activity level, and a prompt
      // that reads "Equipment: null" makes the coach invent one.
      assessmentContext = `

## ASSESSMENT DATA
This user completed a wellness assessment. Use this to personalize your guidance:${line('Overall Score', overallScore === 'N/A' ? null : `${overallScore}/100`)}${line('Tier', tier === 'N/A' ? null : tier)}${line('Primary Goal', assessmentData.primary_goal)}${line('Biggest Obstacle', (assessmentData as any).biggest_obstacle)}${gaps.length ? `\n- Top Priority Areas (lowest scores): ${gaps.join(', ')}` : ''}${line('Dietary Preferences', assessmentData.dietary_preferences)}${line('Activity Level', assessmentData.activity_level)}${line('Available Equipment', assessmentData.equipment)}${line('In her own words', specialNotes.main_concern)}${line('What we already told her about it', specialNotes.concern_reflection)}

Reference her actual results rather than speaking generally. If she told us
something in her own words, she should never have to explain it to you a second
time — she was promised exactly that before she signed up.${gaps.length ? `
For example: "your assessment showed ${gaps[0]}, so let's start there."` : ''}`;
    }

    // Build check-in context if available
    let checkInContext = '';
    if (checkInData && checkInData.length > 0) {
      const latestCheckIn = checkInData[0];
      let focusAreaProgress = '';
      
      try {
        const notes = JSON.parse(latestCheckIn.notes || '{}');
        if (notes.categoryProgress) {
          const progressEntries = Object.entries(notes.categoryProgress)
            .map(([category, score]) => `${category}: ${score}/10`)
            .join(', ');
          focusAreaProgress = `\n- Latest Focus Area Progress: ${progressEntries}`;
        }
      } catch (e) {
        console.error('Error parsing check-in notes:', e);
      }

      const measurements = [];
      if (latestCheckIn.weight) measurements.push(`Weight: ${latestCheckIn.weight}`);
      if (latestCheckIn.waist_measurement) measurements.push(`Waist: ${latestCheckIn.waist_measurement}`);
      
      checkInContext = `

## RECENT CHECK-IN DATA
- Latest Check-In: ${new Date(latestCheckIn.week_date).toLocaleDateString()}${focusAreaProgress}
- Measurements: ${measurements.length > 0 ? measurements.join(', ') : 'not recorded'}
- Total Check-Ins: ${checkInData.length}
- Description: ${latestCheckIn.description || 'not provided'}
`;

      // Add trend analysis if multiple check-ins
      if (checkInData.length > 1) {
        const trends = [];
        const firstCheckIn = checkInData[checkInData.length - 1];
        
        if (latestCheckIn.weight && firstCheckIn.weight) {
          const weightChange = Number(latestCheckIn.weight) - Number(firstCheckIn.weight);
          trends.push(`Weight ${weightChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(weightChange).toFixed(1)} units`);
        }

        try {
          const latestNotes = JSON.parse(latestCheckIn.notes || '{}');
          const firstNotes = JSON.parse(firstCheckIn.notes || '{}');
          
          if (latestNotes.categoryProgress && firstNotes.categoryProgress) {
            const improvements = [];
            for (const [category, latestScore] of Object.entries(latestNotes.categoryProgress)) {
              const firstScore = firstNotes.categoryProgress[category];
              if (firstScore && Number(latestScore) > Number(firstScore)) {
                improvements.push(`${category} improved from ${firstScore}/10 to ${latestScore}/10`);
              }
            }
            if (improvements.length > 0) {
              trends.push(`Progress: ${improvements.join(', ')}`);
            }
          }
        } catch (e) {
          console.error('Error analyzing trends:', e);
        }

        if (trends.length > 0) {
          checkInContext += `- Trends: ${trends.join('; ')}\n`;
        }
      }

      checkInContext += `
Use check-in data to provide targeted advice:
- Reference their specific focus area progress when relevant
- Celebrate improvements in their tracked categories
- Provide actionable tips for areas showing slower progress
- Connect their measurements to their wellness goals`;
    }
    
    // ── What the app actually contains ─────────────────────────────────────
    // Without this the coach can describe wellness concepts but cannot tell a
    // user where anything lives or how a feature works, so it falls back to
    // vague generalities. Keep this in sync when sections are added/renamed.
    const appKnowledge = `

WHAT EXISTS IN THE CATALYST MOM APP (use this to answer "where do I find…",
"how does X work", "what do you have for…"). Name the section and tell her how
to get there. Never invent a feature that is not on this list.

- Dashboard - her home base: current stage, streaks, points, next actions.
- Workouts - stage-specific programs. Includes Core Restore Foundations (the
  4-week deep-core / diastasis recti rehab: Foundation, Secure, Stability,
  Integration) and the 30-Day Glow Up challenge. Members only.
- Meal Plan - 7-day mom-friendly meal plans honoring dietary preferences,
  with per-recipe nutrition. Members only.
- Wellness - self-care tracker, sleep tracker, mood/stress check-ins, and
  personalized recommendations.
- Wellness Resources - the paid digital guide library (Momodoro Planner,
  Busy Mom's Self-Care & Stress Relief System, Sleep Reset Guide, Emotional
  Load Workbook, and more). Bought with money or redeemed with points.
- Community - groups, discussion feed, and EVENTS (live workshops and
  sessions with specialists; see the events list below). Also the Birth Ball
  community.
- Birth Ball Guide - free public guide: trimester-by-trimester exercises,
  buying guide, safety, FAQ, and a weekly challenge tracker.
- TTC tools - cycle tracking (period, ovulation, fertile window), daily
  check-ins, bloodwork logging (she can upload a lab PDF and it auto-fills
  hormone values), and a TTC pattern report.
- Progress - measurements, progress photos, and milestone check-ins.
- Free Guides / Blog - public articles on postpartum recovery, pregnancy,
  TTC, sleep, and nutrition.
- Points - earned through streaks, check-ins, and challenges; redeemable for
  digital guides and some events.

MEMBERSHIP: $29/month unlocks workouts, meal plans, wellness tools, and
community. There is a 30-day fair-try guarantee - give it a genuine try and
if it is not right, email for a refund. Do not invent other pricing, tiers,
trials, or discounts.`;

    // ── Upcoming community events ──────────────────────────────────────────
    // The coach used to invent generic workshops ("a Fertility-Boosting
    // Nutrition workshop would be beneficial") because it had no idea what
    // events actually exist in the app. Load the real ones so it recommends
    // bookable sessions by name instead of describing imaginary ones.
    let eventsContext = '';
    try {
      const { data: events } = await supabase
        .from('events')
        .select('title, description, event_date, time_display, category, stage_filter, specialist_name, specialist_title, location_type, is_free_for_members, points_cost')
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true })
        .limit(8);

      if (events && events.length > 0) {
        const relevant = events.filter(
          (e: any) => !e.stage_filter || e.stage_filter === 'all' || e.stage_filter === motherhoodStage,
        );
        const shown = relevant.length > 0 ? relevant : events;

        eventsContext = `

UPCOMING EVENTS IN THE APP (Community -> Events). These are REAL and bookable.
When she asks about events, workshops, sessions, or "what's happening", recommend
BY NAME from this list and tell her where to find it (the Community section).
NEVER invent an event or describe a hypothetical workshop. If nothing here fits
her, say so plainly and point her to the Community section for the full schedule.
${shown
  .map((e: any) => {
    const when = e.event_date
      ? new Date(e.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : 'date TBA';
    // Speakers are often not confirmed yet - say "Guest Expert TBA" rather
    // than naming someone who has not actually been booked.
    const host = e.specialist_name?.trim()
      ? ` - hosted by ${e.specialist_name}${e.specialist_title ? `, ${e.specialist_title}` : ''}`
      : ' - hosted by Guest Expert TBA';
    const cost = e.is_free_for_members
      ? ' (free for members)'
      : e.points_cost
        ? ` (${e.points_cost} pts)`
        : '';
    return `- "${e.title}" | ${when}${e.time_display ? ` ${e.time_display}` : ''} | ${e.category || 'general'} | ${e.location_type || 'virtual'}${host}${cost}${e.description ? `\n  ${String(e.description).slice(0, 160)}` : ''}`;
  })
  .join('\n')}`;
      } else {
        eventsContext = `

UPCOMING EVENTS: none on the calendar right now. If she asks about events or
workshops, say honestly that nothing is scheduled yet and point her to the
Community section to watch for new sessions. Do NOT invent one.`;
      }
    } catch (e) {
      console.error('[WELLNESS_COACH] Could not load events:', e);
    }

    // ── TTC-specific context: cycle phase, recent check-ins, latest bloodwork ──
    let ttcContext = '';
    if (userId && motherhoodStage === 'ttc') {
      try {
        const [settingsRes, recentLogsRes, recentCheckinsRes, bloodworkRes] = await Promise.all([
          supabase.from('ttc_cycle_settings').select('*').eq('user_id', userId).maybeSingle(),
          supabase.from('ttc_cycle_logs').select('*').eq('user_id', userId).order('date', { ascending: false }).limit(7),
          supabase.from('ttc_daily_checkins').select('*').eq('user_id', userId).order('date', { ascending: false }).limit(7),
          supabase.from('ttc_bloodwork').select('*').eq('user_id', userId).order('date', { ascending: false }).limit(1).maybeSingle(),
        ]);

        const settings = settingsRes.data;
        let cycleDay: number | null = null;
        let phase = 'unknown';
        if (settings?.last_period_start) {
          const days = Math.floor((Date.now() - new Date(settings.last_period_start).getTime()) / 86400000);
          const cycleLen = settings.average_cycle_length || 28;
          cycleDay = (days % cycleLen) + 1;
          if (cycleDay <= (settings.average_period_length || 5)) phase = 'menstrual';
          else if (cycleDay <= 13) phase = 'follicular';
          else if (cycleDay <= 16) phase = 'ovulation (fertile window)';
          else phase = 'luteal';
        }

        const checkinAvg = recentCheckinsRes.data?.length
          ? (recentCheckinsRes.data.reduce((s: number, c: any) => s + (c.energy_score || 0), 0) / recentCheckinsRes.data.length).toFixed(1)
          : 'no data';

        const bw = bloodworkRes.data;
        const flags: string[] = [];
        if (bw) {
          if (bw.amh != null && bw.amh < 1.0) flags.push(`AMH low (${bw.amh})`);
          if (bw.tsh != null && (bw.tsh < 0.5 || bw.tsh > 2.5)) flags.push(`TSH out of fertility range (${bw.tsh}, optimal 0.5–2.5)`);
          if (bw.vitamin_d != null && bw.vitamin_d < 30) flags.push(`Vitamin D low (${bw.vitamin_d})`);
          if (bw.ferritin != null && bw.ferritin < 40) flags.push(`Ferritin low (${bw.ferritin}, optimal >40)`);
          if (bw.prolactin != null && bw.prolactin > 25) flags.push(`Prolactin elevated (${bw.prolactin})`);
        }

        ttcContext = `

## TTC CYCLE & HORMONE CONTEXT
- Cycle Day: ${cycleDay ?? 'unknown'} | Phase: ${phase}
- Months trying: ${settings?.months_trying ?? 'unknown'}
- Known conditions: ${settings?.known_conditions?.length ? settings.known_conditions.join(', ') : 'none'}
- Last 7 days avg energy: ${checkinAvg}/10
- Recent symptoms: ${recentCheckinsRes.data?.flatMap((c: any) => c.symptoms || []).slice(0, 5).join(', ') || 'none logged'}
- Latest bloodwork: ${bw ? `dated ${bw.date}` : 'none uploaded'}
${flags.length ? `- ⚠️ Bloodwork flags: ${flags.join('; ')}` : ''}

TTC COACHING RULES:
- Tailor advice to current cycle phase (menstrual = rest/iron; follicular = strength/protein; ovulation = fertility-supporting nutrients (zinc, B6); luteal = magnesium, complex carbs, stress reduction)
- If bloodwork flags exist, address them concretely (food sources, supplement ranges, when to retest) and recommend doctor follow-up
- Reference fertility-specific nutrients: folate, omega-3, CoQ10, vitamin D, iron, B12
- Encourage the daily check-in if it's missing
- Suggest the Pattern Report after 30+ days of data, or Doctor Prep before appointments
- Never diagnose — frame everything as "patterns to discuss with your provider"`;
      } catch (e) {
        console.error('[WELLNESS_COACH] TTC context error:', e);
      }
    }

    // ── What she actually did in the last few days ──
    // This is what makes the opener land: "yesterday you finished your breathing
    // session" only works if it is true. Nothing here is invented — if the reads
    // come back empty the block stays empty and the coach opens plainly instead.
    let recentActivityContext = '';
    try {
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const [ballLogs, wellness, completions] = await Promise.all([
        supabase.from('birth_ball_exercise_logs')
          .select('exercise_name, completed_at')
          .eq('user_id', userId).gte('completed_at', since)
          .order('completed_at', { ascending: false }).limit(5),
        supabase.from('wellness_entries')
          .select('entry_date, mood_rating, energy_level, sleep_hours')
          .eq('user_id', userId)
          .order('entry_date', { ascending: false }).limit(3),
        supabase.from('user_content_completion')
          .select('completed_at')
          .eq('user_id', userId).gte('completed_at', since)
          .order('completed_at', { ascending: false }).limit(5),
      ]);

      const lines: string[] = [];
      for (const l of ballLogs.data ?? []) {
        lines.push(`- Completed "${l.exercise_name}" on ${new Date(l.completed_at).toDateString()}`);
      }
      if ((completions.data?.length ?? 0) > 0) {
        lines.push(`- Finished ${completions.data!.length} program session(s) in the last 7 days`);
      }
      for (const w of wellness.data ?? []) {
        lines.push(`- Check-in ${w.entry_date}: mood ${w.mood_rating ?? '—'}/10, energy ${w.energy_level ?? '—'}/10, sleep ${w.sleep_hours ?? '—'}h`);
      }

      if (lines.length > 0) {
        recentActivityContext = `

HER LAST 7 DAYS (real logged activity — reference it naturally, never invent):
${lines.join('\n')}`;
      }
    } catch (e) {
      console.error('[WELLNESS_COACH] Recent activity context error:', e);
    }

    // ── Food, medication and supplement questions ──
    // She should never have to leave the conversation to ask "can I eat this?".
    const utilityRules = `

FOOD, MEDICATION & SUPPLEMENT LOOKUPS (she may send a photo of a plate, package or label):
- If she sends a photo, describe what you can actually see, then answer her question about it. If the image is unclear, say so and ask for a clearer shot — never guess a label.
- Food photos: give a realistic portion estimate (calories and protein), then one stage-relevant note (e.g. iron in pregnancy, protein for recovery, blood-sugar steadiness for TTC).
- Food safety: answer plainly for the well-established ones — unpasteurised dairy, high-mercury fish, deli meat, raw/undercooked egg or fish, alcohol, caffeine limits (~200mg/day in pregnancy), listeria risks. Say clearly when something is fine; most foods are.
- Medication & supplements (including "safe while breastfeeding?"): give the general picture from established references (e.g. ibuprofen is generally considered compatible with breastfeeding; it is avoided in the third trimester), then always say her pharmacist or provider is the one to confirm for her specific dose and history.
- NEVER give a dose, never tell her to start or stop a prescription, and never rule a medication in or out with certainty. If it is unclear, contested, or she mentions a condition, send her to her provider or pharmacist explicitly.
- Anything urgent — bleeding, severe pain, a baby not moving, fever, thoughts of harming herself — stop the wellness answer and tell her to contact her provider or emergency services now.

WHERE TO SEND HER (link the exact place; never tell her to "browse" or "check the library"):
- "Do I have diastasis?" / core gap / ab separation → the self-check and reviews page at /diastasis-recti-recovery-program-reviews-reddit, then Core Restore Foundations at /core-restore-foundations for the actual program.
- Postpartum core/pelvic floor rebuilding → /core-restore-foundations (Phase 1). Phase 2 (30 Days Glow Up) unlocks after Phase 1.
- Pregnancy comfort, hip pain, labour prep, positions → /birth-ball-guide (and /birth-ball-program for the structured program).
- Baby movement / kick counting → /dashboard?tool=kick-counter. Contractions/labour timing → the labour tools on /dashboard.
- Meal plans → /meal-plan?stage=pregnancy | postpartum | ttc. Recipes → /recipes.
- Workouts by stage → /workouts?stage=pregnancy | postpartum | ttc.
- Sleep, stress, self-care → /wellness?tab=sleep or /wellness?tab=selfcare, and guides at /wellness/resources.
- Cycle tracking, bloodwork, ovulation, doctor prep (TTC) → the TTC tools on /dashboard.
- Digital guides (freezer meals, allergen tracking, C-section prep, village building) → /guides.
- Community and peer support → /community. Live expert sessions → /events.
- Subscription, billing, plan questions → /profile?tab=subscription.
- Give at most two links per reply, and only when they answer what she actually asked.`;

    // Build comprehensive system prompt focused on the four pillars and conversion
    const systemPrompt = `You are Coach Sarah, an expert wellness coach for Catalyst Mom - providing nutrition guidance, expert advice, personalized plans, and tools that grow with women through every stage of motherhood.${assessmentContext}${checkInContext}${ttcContext}${recentActivityContext}${appKnowledge}${eventsContext}${utilityRules}


## CATALYST MOM CORE OFFERING
The four pillars of our platform:
🥗 Nutrition Guidance - Stage-specific meal plans, recipes, and nutritional strategies
💡 Expert Advice - Science-backed recommendations from wellness professionals  
📋 Personalized Plans - Custom workout routines and wellness programs that evolve
🌱 Tools That Grow - Trackers, journals, and resources that adapt to each journey stage

## MOTHERHOOD JOURNEY STAGES
- TTC (Trying to Conceive): Fertility nutrition, cycle optimization, stress management
- Pregnancy (Trimesters 1-3): Safe prenatal fitness, trimester-specific nutrition, symptom relief
- Postpartum (0-6 weeks, 6-12 weeks, 3-6 months, 6-12 months): Recovery protocols, healing nutrition, strength rebuilding
- Toddler & Beyond: Energy-boosting strategies, quick workouts, sustainable wellness

## YOUR COACHING APPROACH
1. Create actionable plans: When users need meal plans or workout programs, USE YOUR TOOLS to create and save them directly to their account
2. Emphasize personalization: Everything is tailored to their exact stage and individual needs
3. Focus on growth: Plans and tools evolve as they progress through their journey
4. Be action-oriented: Offer concrete next steps and actually CREATE the plans they need
5. Conversion psychology: Use value-focused language, show transformation possibilities, create urgency subtly

## CURRENT USER
${motherhoodStage ? `Stage: ${motherhoodStage}` : 'Stage: Not specified — DO NOT ask the user about it. Infer from assessment/check-in context above and proceed with general maternal wellness guidance.'}
Name: ${displayName}
Subscription Status: ${userProfile?.is_subscribed ? 'PREMIUM MEMBER' : 'FREE TRIAL - Limited access'}

## CONVERSATION GUIDELINES
- NEVER use asterisks or markdown formatting in responses (no ** or __ characters)
- NEVER ask the user to tell you their stage, goals, dietary preferences, equipment, or activity level — you already have this from their assessment data above. Use it.
- Do NOT open with questions. Open with a personalized insight using their actual data, then offer a concrete next step.
- Address ${displayName} by name naturally (1–2 times per reply max).
- When users ask for meal plans or workout programs, CREATE them using your tools immediately — do not ask clarifying questions first; use their assessment data (dietary_preferences, equipment, activity_level, primary_goal, top gap categories) to make the call.
- Connect all advice to Catalyst Mom's four pillars: nutrition, expert advice, personalized plans, growing tools
- Keep responses warm but concise (100-150 words) - use emojis sparingly (💚, 💪, 🥗, ✨)
- After creating a plan, celebrate it: "I've created a personalized [meal plan/workout program] just for you, ${displayName}! It's now saved to your account."
- For non-subscribers: Naturally mention premium features when relevant (e.g., "With premium access, I can create unlimited custom plans for you")
- Use social proof subtly: "Thousands of moms are seeing results with personalized plans"
- Focus on outcomes and transformation: "Imagine having energy to play with your kids"
- Prioritize safety: remind pregnant/postpartum users to consult healthcare providers for medical concerns`;

    // Define tools for creating plans
    const tools = [
      {
        type: "function",
        function: {
          name: "create_meal_plan",
          description: "Create and save a personalized meal plan for the user based on their motherhood stage and goals",
          parameters: {
            type: "object",
            properties: {
              title: {
                type: "string",
                description: "Title of the meal plan (e.g., 'First Trimester Energy Boost Meal Plan')"
              },
              description: {
                type: "string",
                description: "Brief description of the meal plan and its benefits"
              },
              duration_days: {
                type: "number",
                description: "Number of days the meal plan covers (typically 7 or 14)"
              },
              plan_data: {
                type: "object",
                description: "The actual meal plan structure with daily meals",
                properties: {
                  daily_meals: {
                    type: "array",
                    description: "Array of daily meal plans",
                    items: {
                      type: "object",
                      properties: {
                        day: { type: "number" },
                        breakfast: { type: "string" },
                        morning_snack: { type: "string" },
                        lunch: { type: "string" },
                        afternoon_snack: { type: "string" },
                        dinner: { type: "string" },
                        evening_snack: { type: "string" },
                        notes: { type: "string" }
                      }
                    }
                  },
                  nutrition_tips: {
                    type: "array",
                    items: { type: "string" }
                  }
                }
              }
            },
            required: ["title", "description", "duration_days", "plan_data"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "create_workout_program",
          description: "Create and save a personalized workout program for the user based on their motherhood stage and fitness level",
          parameters: {
            type: "object",
            properties: {
              title: {
                type: "string",
                description: "Title of the workout program (e.g., 'Second Trimester Safe Strength Program')"
              },
              description: {
                type: "string",
                description: "Brief description of the program and its benefits"
              },
              duration_weeks: {
                type: "number",
                description: "Number of weeks the program runs (typically 4, 6, or 8)"
              },
              difficulty_level: {
                type: "string",
                enum: ["beginner", "intermediate", "advanced"],
                description: "Difficulty level of the program"
              },
              program_data: {
                type: "object",
                description: "The actual workout program structure",
                properties: {
                  weekly_schedule: {
                    type: "array",
                    description: "Array of weekly workout schedules",
                    items: {
                      type: "object",
                      properties: {
                        week: { type: "number" },
                        focus: { type: "string" },
                        workouts: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              day: { type: "string" },
                              workout_name: { type: "string" },
                              duration_minutes: { type: "number" },
                              exercises: {
                                type: "array",
                                items: { type: "string" }
                              },
                              notes: { type: "string" }
                            }
                          }
                        }
                      }
                    }
                  },
                  safety_guidelines: {
                    type: "array",
                    items: { type: "string" }
                  }
                }
              }
            },
            required: ["title", "description", "duration_weeks", "difficulty_level", "program_data"]
          }
        }
      }
    ];

    // Attach any photos she sent to her CURRENT question, so "can I eat this?"
    // with a picture of a plate actually works instead of the coach guessing.
    const outgoing: any[] = [...messages];
    if (images && images.length > 0) {
      const lastUserIdx = [...outgoing].reverse().findIndex((m) => m.role === 'user');
      if (lastUserIdx !== -1) {
        const idx = outgoing.length - 1 - lastUserIdx;
        const original = outgoing[idx];
        const text = typeof original.content === 'string' && original.content.trim()
          ? original.content
          : 'What can you tell me about this? Is it safe for me right now?';
        outgoing[idx] = {
          role: 'user',
          content: [
            { type: 'text', text },
            ...images.map((url) => ({ type: 'image_url', image_url: { url } })),
          ],
        };
      }
    }

    const requestBody = {
      messages: [
        { role: 'system', content: systemPrompt },
        ...outgoing
      ],
      tools: tools,
      tool_choice: "auto" as const,
    };


    let response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: 'google/gemini-2.5-flash', ...requestBody }),
    });

    // Fallback to direct Gemini API if Lovable AI is out of credits or rate-limited
    if ((response.status === 402 || response.status === 429)) {
      const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
      if (GEMINI_API_KEY) {
        console.log('[WELLNESS_COACH] Lovable AI returned', response.status, '— falling back to direct Gemini API');
        response = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GEMINI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ model: 'gemini-2.5-flash', ...requestBody }),
        });
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[WELLNESS_COACH] AI API error:', response.status, errorText);
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please top up Lovable AI balance or add a GEMINI_API_KEY secret.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message;
    
    // Handle tool calls if present
    const toolCalls = aiMessage.tool_calls;
    const createdPlans: any[] = [];
    
    if (toolCalls && toolCalls.length > 0 && userId) {
      console.log('[WELLNESS_COACH] Processing tool calls:', toolCalls.length);
      
      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);
        
        console.log('[WELLNESS_COACH] Tool call:', functionName, functionArgs);
        
        if (functionName === 'create_meal_plan') {
          const { error } = await supabase
            .from('custom_meal_plans')
            .insert({
              user_id: userId,
              title: functionArgs.title,
              description: functionArgs.description,
              duration_days: functionArgs.duration_days,
              plan_data: functionArgs.plan_data,
              created_by: 'coach_sarah'
            });
          
          if (error) {
            console.error('[WELLNESS_COACH] Error creating meal plan:', error);
          } else {
            createdPlans.push({ type: 'meal_plan', title: functionArgs.title });
          }
        } else if (functionName === 'create_workout_program') {
          const { error } = await supabase
            .from('custom_workout_programs')
            .insert({
              user_id: userId,
              title: functionArgs.title,
              description: functionArgs.description,
              duration_weeks: functionArgs.duration_weeks,
              difficulty_level: functionArgs.difficulty_level,
              program_data: functionArgs.program_data,
              created_by: 'coach_sarah'
            });
          
          if (error) {
            console.error('[WELLNESS_COACH] Error creating workout program:', error);
          } else {
            createdPlans.push({ type: 'workout_program', title: functionArgs.title });
          }
        }
      }
    }
    
    const aiResponse = aiMessage.content || "I've created your personalized plan!";
    
    console.log('[WELLNESS_COACH] AI response generated successfully');
    
    return new Response(JSON.stringify({ 
      response: aiResponse,
      created_plans: createdPlans 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[WELLNESS_COACH] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        response: "I'm having trouble connecting right now. Please try again in a moment!" 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
