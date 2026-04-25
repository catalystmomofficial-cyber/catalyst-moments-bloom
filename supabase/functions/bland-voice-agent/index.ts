import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Strict input validation to prevent prompt injection & API abuse
const BodySchema = z.object({
  action: z.enum(['start_call', 'get_call_status', 'end_call']),
  callId: z.string().max(200).optional(),
  userProfile: z.object({
    motherhood_stage: z.string().max(50).optional(),
    display_name: z.string().max(100).optional(),
  }).passthrough().optional(),
  wellnessData: z.object({
    latestMoodScore: z.number().min(0).max(10).optional(),
    latestEnergyLevel: z.number().min(0).max(10).optional(),
  }).passthrough().optional(),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const BLAND_API_KEY = Deno.env.get('BLAND_API_KEY');
    if (!BLAND_API_KEY) {
      throw new Error('BLAND_API_KEY not configured');
    }

    const rawBody = await req.json();
    const parsed = BodySchema.safeParse(rawBody);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: parsed.error.flatten() }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const { action, callId, userProfile, wellnessData } = parsed.data;

    switch (action) {
      case 'start_call':
        // Create personalized task based on user profile and wellness data
        let personalizedTask = "You are Dr. Maya, a warm and empathetic wellness coach specializing in maternal health. ";
        
        if (userProfile?.motherhood_stage === 'pregnant') {
          personalizedTask += "The user is currently pregnant. Focus on pregnancy wellness, safe exercises, nutrition during pregnancy, and emotional support. ";
        } else if (userProfile?.motherhood_stage === 'postpartum') {
          personalizedTask += "The user is in the postpartum period. Focus on recovery, postpartum wellness, managing fatigue, and adjusting to life with a new baby. ";
        } else if (userProfile?.motherhood_stage === 'ttc') {
          personalizedTask += "The user is trying to conceive. Focus on fertility wellness, stress management, nutrition for fertility, and emotional support during the TTC journey. ";
        } else {
          personalizedTask += "Focus on general maternal wellness, stress management, nutrition, and fitness. ";
        }

        if (wellnessData?.latestMoodScore && wellnessData.latestMoodScore < 5) {
          personalizedTask += "The user has reported low mood recently - be extra supportive and ask about their emotional wellbeing. ";
        }
        
        if (wellnessData?.latestEnergyLevel && wellnessData.latestEnergyLevel < 5) {
          personalizedTask += "The user has reported low energy levels - discuss ways to boost energy naturally. ";
        }

        personalizedTask += `The user's name is ${userProfile?.display_name || 'there'}. Be encouraging, ask follow-up questions, and provide actionable wellness advice. Keep the conversation natural and flowing. Don't mention this is an AI call.`;

        // Start a new call without requiring phone number
        const callResponse = await fetch('https://api.bland.ai/v1/calls', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${BLAND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone_number: null, // Start web-based call
            task: personalizedTask,
            voice: "maya",
            model: "enhanced",
            max_duration: 15,
            answered_by_enabled: true,
            wait_for_greeting: false,
            record: true,
            language: "en",
            reduce_latency: true,
            start_time: new Date().toISOString()
          }),
        });

        if (!callResponse.ok) {
          const error = await callResponse.text();
          throw new Error(`Bland API error: ${error}`);
        }

        const callData = await callResponse.json();
        console.log('Call started:', callData);

        return new Response(JSON.stringify(callData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'get_call_status':
        // Get call status
        const statusResponse = await fetch(`https://api.bland.ai/v1/calls/${callId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${BLAND_API_KEY}`,
          },
        });

        if (!statusResponse.ok) {
          throw new Error('Failed to get call status');
        }

        const statusData = await statusResponse.json();
        return new Response(JSON.stringify(statusData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'end_call':
        // End the call
        const endResponse = await fetch(`https://api.bland.ai/v1/calls/${callId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${BLAND_API_KEY}`,
          },
        });

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in bland-voice-agent:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});