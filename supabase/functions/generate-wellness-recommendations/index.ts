import { corsHeaders, createClient } from "npm:@supabase/supabase-js@2";
import { generateText, Output } from "npm:ai";
import { z } from "npm:zod";
import { createLovableAiGatewayProvider } from "../_shared/ai-gateway.ts";

const ProfileSchema = z.object({
  journey: z.string().min(1).max(50).default("general"),
  stage: z.string().min(1).max(100).default("general"),
  moodScore: z.number().min(0).max(10).default(5),
  energyLevel: z.number().min(0).max(10).default(5),
  stressLevel: z.number().min(0).max(10).default(5),
  sleepHours: z.number().min(0).max(24).default(8),
  hydrationGlasses: z.number().min(0).max(100).default(0),
  selfCareCompleted: z.boolean().default(false),
  recentActivities: z.array(z.string().max(100)).max(20).default([]),
  preferences: z.array(z.string().max(200)).max(20).default([]),
}).passthrough();

const BodySchema = z.object({
  action: z.enum(["selfcare", "insights"]).optional(),
  prompt: z.string().max(10_000).optional(),
  profile: ProfileSchema,
});

const RecommendationSchema = z.object({
  id: z.string(),
  type: z.enum(["nutrition", "exercise", "mindfulness", "self-care", "sleep"]),
  title: z.string(),
  description: z.string(),
  action: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  reasoning: z.string(),
  timeframe: z.string(),
  category: z.string(),
  icon: z.string(),
});

const SelfCareIdeaSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  duration: z.string(),
  category: z.enum(["breathing", "movement", "mindfulness", "relaxation", "energy"]),
  instructions: z.array(z.string()),
  benefits: z.string(),
  icon: z.string(),
});

type Profile = z.infer<typeof ProfileSchema>;

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, "Content-Type": "application/json" },
});

const fallbackRecommendations = (profile: Profile) => ({
  recommendations: [
    {
      id: "fallback-hydration", type: "self-care", title: "Hydration Reset",
      description: "A small hydration reset can support energy and focus.",
      action: "Drink one glass of water", priority: profile.hydrationGlasses < 6 ? "high" : "low",
      reasoning: `You logged ${profile.hydrationGlasses} glasses today.`, timeframe: "Now", category: "Hydration", icon: "💧",
    },
    {
      id: "fallback-breathe", type: "mindfulness", title: "Long-Exhale Breathing",
      description: "Slow breathing can help your body shift out of a stressed state.",
      action: "Take five slow breaths", priority: profile.stressLevel > 6 ? "high" : "medium",
      reasoning: `Your stress level is ${profile.stressLevel}/10.`, timeframe: "2 minutes", category: "Mindfulness", icon: "🫁",
    },
    {
      id: "fallback-movement", type: "exercise", title: "Gentle Movement Break",
      description: "Brief, comfortable movement can reduce stiffness and support energy.",
      action: "Try five minutes of stretching", priority: profile.energyLevel < 5 ? "high" : "medium",
      reasoning: `Your energy level is ${profile.energyLevel}/10.`, timeframe: "5 minutes", category: "Movement", icon: "⚡",
    },
    {
      id: "fallback-rest", type: "sleep", title: "Protect Tonight's Rest",
      description: "Choose one small step that makes winding down easier tonight.",
      action: "Set a screen-free wind-down time", priority: profile.sleepHours < 7 ? "high" : "low",
      reasoning: `You logged ${profile.sleepHours} hours of sleep.`, timeframe: "Tonight", category: "Sleep", icon: "😴",
    },
    {
      id: "fallback-stage", type: "self-care", title: "One Kind Choice",
      description: `Choose one realistic act of care that fits your ${profile.journey} journey today.`,
      action: "Schedule a ten-minute pause", priority: "medium",
      reasoning: "Small, achievable actions are easier to repeat on demanding days.", timeframe: "Today", category: "Self-Care", icon: "♥",
    },
  ],
});

const fallbackSelfCare = {
  ideas: [
    { id: "fallback-breathing", title: "Deep Breathing", description: "Five breaths with a longer exhale", duration: "2 min", category: "breathing", instructions: ["Sit comfortably", "Inhale for four counts", "Exhale for six counts", "Repeat five times"], benefits: "Helps your body settle", icon: "🫁" },
    { id: "fallback-movement", title: "Shoulder Release", description: "Gentle shoulder rolls to release tension", duration: "3 min", category: "movement", instructions: ["Roll shoulders back five times", "Roll shoulders forward five times", "Finish with a gentle neck stretch"], benefits: "Relieves upper-body tension", icon: "🤸‍♀️" },
    { id: "fallback-mindfulness", title: "Gratitude Moment", description: "Name one thing that supported you today", duration: "2 min", category: "mindfulness", instructions: ["Pause somewhere comfortable", "Notice one helpful moment", "Write it down or say it aloud"], benefits: "Creates a brief positive focus", icon: "🧘‍♀️" },
  ],
};

const getStatusCode = (error: unknown): number | undefined => {
  if (!error || typeof error !== "object") return undefined;
  const value = error as { statusCode?: number; status?: number; cause?: unknown };
  return value.statusCode ?? value.status ?? getStatusCode(value.cause);
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Authentication required" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !anonKey) return json({ error: "Service configuration unavailable" }, 500);

    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) return json({ error: "Invalid or expired session" }, 401);

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
    const { profile, action } = parsed.data;

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) return json({ ...fallbackRecommendations(profile), degraded: true });

    let systemPrompt = '';
    let userPrompt = '';
    let output;

    if (action === 'insights') {
      systemPrompt = `You are a wellness AI coach. Generate 2-3 personalized wellness insights based on the user's profile.`;
      userPrompt = `Based on this wellness profile: ${JSON.stringify(profile)}
      
Generate 2-3 personalized wellness insights. Each insight should be specific, actionable, and encouraging. Focus on patterns, improvements, or gentle guidance.

Return as JSON: {"insights": ["insight 1", "insight 2", "insight 3"]}`;
      output = Output.object({ schema: z.object({ insights: z.array(z.string()).min(2).max(3) }) });
    } else if (action === 'selfcare') {
      systemPrompt = `You are a wellness AI coach. Generate personalized self-care ideas for quick wellness boosts.`;
      userPrompt = `Based on this wellness profile: ${JSON.stringify(profile)}
      
Generate 3-4 personalized self-care ideas for quick wellness boosts. Each should include:
- Specific title and description
- Duration (2-10 minutes)
- Category (breathing, movement, mindfulness, relaxation, energy)
- Simple step-by-step instructions
- Clear benefits
- Relevant emoji icon

Consider their current mood, energy, stress levels, and journey stage. Focus on activities that can be done anywhere, anytime.

Return as JSON: {"ideas": [array of idea objects with fields: id, title, description, duration, category, instructions, benefits, icon]}`;
      output = Output.object({ schema: z.object({ ideas: z.array(SelfCareIdeaSchema).min(3).max(4) }) });
    } else {
      systemPrompt = `You are a specialized wellness AI coach for mothers and women on their motherhood journey. 
      Generate personalized, actionable wellness recommendations based on the user's current state and journey stage.
      
      Focus on:
      - Journey-specific advice (TTC, pregnancy, postpartum, parenting)
      - Current wellness metrics (mood, energy, stress, sleep)
      - Actionable steps they can take immediately
      - Evidence-based recommendations
      
      Return a JSON object with a "recommendations" array containing exactly 5 recommendations.
      Each recommendation should have: type, title, description, action, priority, reasoning, timeframe, category, icon.`;
      userPrompt = parsed.data.prompt || `Wellness profile: ${JSON.stringify(profile)}`;
      output = Output.object({ schema: z.object({ recommendations: z.array(RecommendationSchema).length(5) }) });
    }

    try {
      const gateway = createLovableAiGatewayProvider(lovableApiKey);
      const result = await generateText({
        model: gateway("google/gemini-3.6-flash"),
        output,
        system: systemPrompt,
        prompt: userPrompt,
      });
      return json(result.output);
    } catch (error) {
      const status = getStatusCode(error);
      if (status === 402 || status === 429) {
        const fallback = action === "selfcare"
          ? fallbackSelfCare
          : action === "insights"
            ? { insights: [] }
            : fallbackRecommendations(profile);
        return json({ ...fallback, degraded: true, reason: status === 402 ? "credits_unavailable" : "rate_limited" });
      }
      throw error;
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to generate wellness recommendations";
    console.error('Error in generate-wellness-recommendations function:', message);
    return json({ error: message }, 500);
  }
});