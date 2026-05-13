import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

interface Body {
  mode: "pattern_report" | "doctor_prep";
}

const PATTERN_SYSTEM = `You are a hormone and cycle pattern analyst for Catalyst Mom, a maternal wellness app.
You help women understand patterns across their cycle, sleep, recovery, and bloodwork.
You ground every observation in published research.
You are NOT a doctor. Your job is to help her see what's happening in her body so she can make better decisions and walk into doctor appointments more prepared.

RULES:
- ALWAYS ground patterns in the actual data provided. Never invent patterns not shown in the data.
- ALWAYS cite real, established research findings. If uncertain, say so. Never fabricate citations.
- NEVER diagnose. Use language like "this pattern is consistent with" — never "you have."
- If data shows something serious (severe symptoms, extreme values), recommend seeing a doctor immediately.
- Be specific with dates and numbers from HER data.
- Be warm and kind. Health is personal. Never shame.
- Output ONLY valid JSON. No preamble, no markdown.`;

const DOCTOR_SYSTEM = `You are helping a woman prepare for a doctor appointment about her fertility and cycle health.
Generate a clear, professional 1-page summary she can hand to or read from in her appointment.
Be specific. Use her actual data. Never diagnose — describe patterns and observations.
Output ONLY valid JSON. No preamble, no markdown.`;

const PATTERN_SCHEMA = `{
  "patterns": [{"pattern":"string","evidence":"string","research":"string","what_to_try":"string"}],
  "cycle_summary": {
    "average_cycle_length": number,
    "average_energy_by_phase": {"menstrual": number, "follicular": number, "ovulation": number, "luteal": number},
    "best_days": "string",
    "challenging_days": "string"
  },
  "bloodwork_flags": ["string"],
  "overall_insight": "string"
}`;

const DOCTOR_SCHEMA = `{
  "summary": "string",
  "key_observations": ["string"],
  "suggested_questions": ["string"],
  "flags": ["string"],
  "data_to_bring": ["string"]
}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const auth = req.headers.get("Authorization");
    if (!auth) return json({ error: "Unauthorized" }, 401);

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: auth } },
    });
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return json({ error: "Unauthorized" }, 401);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) return json({ error: "LOVABLE_API_KEY is not configured" }, 500);

    const body = (await req.json()) as Body;
    if (body.mode !== "pattern_report" && body.mode !== "doctor_prep") {
      return json({ error: "Invalid mode" }, 400);
    }

    // Gather all her data in parallel
    const [settingsRes, checkinsRes, logsRes, bloodworkRes, profileRes] = await Promise.all([
      supabase.from("ttc_cycle_settings").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("ttc_daily_checkins").select("*").eq("user_id", user.id).order("checkin_date", { ascending: false }).limit(120),
      supabase.from("ttc_cycle_logs").select("*").eq("user_id", user.id).order("log_date", { ascending: false }).limit(120),
      supabase.from("ttc_bloodwork").select("*").eq("user_id", user.id).order("test_date", { ascending: false }).limit(20),
      supabase.from("profiles").select("assessment_data, motherhood_stage").eq("user_id", user.id).maybeSingle(),
    ]);

    const settings = settingsRes.data;
    const checkins = checkinsRes.data ?? [];
    const logs = logsRes.data ?? [];
    const bloodwork = bloodworkRes.data ?? [];
    const assessment = (profileRes.data?.assessment_data as Record<string, unknown> | null) ?? null;

    if (body.mode === "pattern_report" && checkins.length < 1) {
      return json({ error: "No check-in data yet. Log your first daily check-in to generate a pattern report." }, 400);
    }

    const userMessage =
      body.mode === "pattern_report"
        ? buildPatternUserMessage({ settings, checkins, logs, bloodwork, assessment })
        : buildDoctorUserMessage({ settings, checkins, logs, bloodwork, assessment });

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: body.mode === "pattern_report" ? PATTERN_SYSTEM : DOCTOR_SYSTEM },
          { role: "user", content: userMessage },
        ],
        temperature: 0.1,
      }),
    });

    if (!aiRes.ok) {
      const txt = await aiRes.text();
      console.error("AI gateway error:", aiRes.status, txt);
      if (aiRes.status === 429) return json({ error: "Rate limited. Try again in a minute." }, 429);
      if (aiRes.status === 402) return json({ error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." }, 402);
      return json({ error: "AI generation failed" }, 500);
    }

    const aiJson = await aiRes.json();
    const content = aiJson?.choices?.[0]?.message?.content ?? "{}";
    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.error("JSON parse failed:", content);
      return json({ error: "AI returned invalid JSON" }, 500);
    }

    // Persist
    const insertRow: Record<string, unknown> = {
      user_id: user.id,
      data_days_analyzed: checkins.length,
    };
    if (body.mode === "pattern_report") {
      insertRow.report_json = parsed;
      insertRow.flags = parsed?.bloodwork_flags ?? [];
    } else {
      insertRow.doctor_prep_text = parsed?.summary ?? "";
      insertRow.suggested_questions = parsed?.suggested_questions ?? [];
      insertRow.flags = parsed?.flags ?? [];
      insertRow.report_json = parsed;
    }
    const { data: inserted } = await supabase.from("ttc_pattern_reports").insert(insertRow).select().single();

    // Award points
    const points = body.mode === "pattern_report" ? 200 : 100;
    const source = body.mode === "pattern_report" ? "ttc_pattern_report" : "ttc_doctor_prep";
    const description = body.mode === "pattern_report" ? "Pattern report generated" : "Doctor prep generated";
    await supabase.rpc("add_user_points", {
      p_user_id: user.id,
      p_points: points,
      p_source: source,
      p_description: description,
    });

    return json({ success: true, report: parsed, id: inserted?.id, points_awarded: points });
  } catch (err) {
    console.error("ttc-pattern-report error:", err);
    return json({ error: (err as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function buildPatternUserMessage(d: any): string {
  const gaps = extractGaps(d.assessment);
  const score = d.assessment?.score ?? "n/a";
  return `Analyze this woman's cycle and hormone data and find real patterns.

HER PROFILE:
- Wellness score: ${score}
- Top gaps: ${JSON.stringify(gaps)}
- Average cycle length: ${d.settings?.average_cycle_length ?? "unknown"}
- Months trying to conceive: ${d.settings?.months_trying ?? "unknown"}
- Known conditions: ${JSON.stringify(d.settings?.known_conditions ?? [])}

DAILY CHECK-IN DATA (last 120 days):
${JSON.stringify(d.checkins.map((c: any) => ({
  date: c.checkin_date, cycle_day: c.cycle_day, energy: c.energy_score,
  mood: c.mood, skin: c.skin_status, notes: c.symptoms_notes,
})))}

CYCLE LOG DATA:
${JSON.stringify(d.logs.map((l: any) => ({
  date: l.log_date, cycle_day: l.cycle_day, bbt: l.basal_body_temp,
  cervical_mucus: l.cervical_mucus, ovulation_test: l.ovulation_test,
  symptoms: l.symptoms, period: l.period_status, flow: l.flow_intensity,
})))}

BLOODWORK:
${JSON.stringify(d.bloodwork)}

Find patterns and output ONLY this JSON structure:
${PATTERN_SCHEMA}`;
}

function buildDoctorUserMessage(d: any): string {
  const gaps = extractGaps(d.assessment);
  const score = d.assessment?.score ?? "n/a";
  return `Generate a doctor appointment prep for this woman based on her data.

HER PROFILE:
- Wellness score: ${score}
- Top gaps: ${JSON.stringify(gaps)}
- Cycle settings: ${JSON.stringify(d.settings)}

CHECK-INS (last 90 days):
${JSON.stringify(d.checkins.slice(0, 90))}

CYCLE LOGS:
${JSON.stringify(d.logs.slice(0, 90))}

BLOODWORK:
${JSON.stringify(d.bloodwork)}

Output ONLY this JSON:
${DOCTOR_SCHEMA}`;
}

function extractGaps(a: any): string[] {
  if (!a) return [];
  if (Array.isArray(a.gaps)) return a.gaps;
  const text = [a.biggest_obstacle, a.primary_goal].filter(Boolean).join(" ").toLowerCase();
  const out: string[] = [];
  if (/sleep|tired|fatigue|exhaust/.test(text)) out.push("sleep");
  if (/stress|anxi|overwhelm|mood/.test(text)) out.push("stress");
  if (/nutri|diet|food|eat/.test(text)) out.push("nutrition");
  if (/fit|exercise|workout|movement/.test(text)) out.push("fitness");
  return out;
}
