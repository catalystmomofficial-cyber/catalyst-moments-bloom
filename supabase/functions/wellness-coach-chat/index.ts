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
  userProfile: z.object({
    motherhood_stage: z.string().max(50).nullable().optional(),
    display_name: z.string().max(100).nullable().optional(),
    is_subscribed: z.boolean().optional(),
  }).optional(),
});

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
    const { messages, userProfile } = parsed.data;
    console.log('[WELLNESS_COACH] Received messages:', messages.length, 'Profile:', userProfile?.motherhood_stage);

    // Service-role client for trusted server-side reads/writes (scoped to authenticated userId)
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch assessment data for the authenticated user only
    let assessmentData = null;
    if (userId) {
      const { data } = await supabase
        .from('lead_responses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (data) {
        assessmentData = data;
        console.log('[WELLNESS_COACH] Found assessment data for user');
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

      assessmentContext = `

## ASSESSMENT DATA
This user completed a wellness assessment. Use this to personalize your guidance:
- Overall Score: ${overallScore}/100 (Tier: ${tier})
- Primary Goal: ${assessmentData.primary_goal}
- Top 3 Priority Areas (lowest scores): ${gaps.join(', ')}
- Dietary Preferences: ${assessmentData.dietary_preferences}
- Activity Level: ${assessmentData.activity_level}
- Available Equipment: ${assessmentData.equipment}
${specialNotes.main_concern ? `- Main Concern: ${specialNotes.main_concern}` : ''}

When providing advice, reference their specific assessment results and focus on their priority areas. For example:
- "I noticed from your assessment that [category] scored ${gaps[0]?.split(':')[1]}, so let's focus on..."
- "Since your primary goal is ${assessmentData.primary_goal}, I recommend..."
- "Given your ${assessmentData.activity_level} activity level and ${assessmentData.equipment} equipment availability..."`;
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
    
    // Build comprehensive system prompt focused on the four pillars and conversion
    const systemPrompt = `You are Coach Sarah, an expert wellness coach for Catalyst Mom - providing nutrition guidance, expert advice, personalized plans, and tools that grow with women through every stage of motherhood.${assessmentContext}${checkInContext}

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
${motherhoodStage ? `Stage: ${motherhoodStage}` : 'Stage: Unknown - ASK them where they are in their motherhood journey first'}
Name: ${displayName}
Subscription Status: ${userProfile?.is_subscribed ? 'PREMIUM MEMBER' : 'FREE TRIAL - Limited access'}

## CONVERSATION GUIDELINES
- NEVER use asterisks or markdown formatting in responses (no ** or __ characters)
- If stage is unknown, start by asking where they are in their journey to personalize everything
- When users ask for meal plans or workout programs, CREATE them using your tools immediately
- Connect all advice to Catalyst Mom's four pillars: nutrition, expert advice, personalized plans, growing tools
- Keep responses warm but concise (100-150 words) - use emojis sparingly (💚, 💪, 🥗, ✨)
- After creating a plan, celebrate it: "I've created a personalized [meal plan/workout program] just for you! It's now saved to your account."
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

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        tools: tools,
        tool_choice: "auto"
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[WELLNESS_COACH] AI API error:', response.status, errorText);
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
