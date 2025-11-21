import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VoAssessmentData {
  name: string;
  email: string;
  primary_goal: string;
  activity_level: string;
  equipment: string;
  dietary_preferences: string;
  special_notes?: string;
  // Score data from vo.app
  overall_score?: number;
  tier?: string; // 'low', 'medium', 'high'
  category_scores?: {
    fitness?: number;
    nutrition?: number;
    mental_health?: number;
    sleep?: number;
    stress?: number;
    energy?: number;
    [key: string]: number | undefined;
  };
  assessment_results?: any; // Full assessment data
  user_id?: string; // Optional if user is already registered
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received assessment webhook request');

    // Parse the incoming request
    const assessmentData: VoAssessmentData = await req.json();
    console.log('Assessment data received:', { 
      email: assessmentData.email, 
      name: assessmentData.name,
      overall_score: assessmentData.overall_score,
      tier: assessmentData.tier
    });

    // Validate required fields
    if (!assessmentData.email || !assessmentData.name || !assessmentData.primary_goal) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: name, email, and primary_goal are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client with service role key for admin access
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user exists by email
    let userId = assessmentData.user_id;
    
    if (!userId) {
      const { data: existingUser, error: userError } = await supabase.auth.admin.getUserByEmail(
        assessmentData.email
      );

      if (!userError && existingUser?.user) {
        userId = existingUser.user.id;
        console.log('Found existing user:', userId);
      } else {
        console.log('No existing user found, will create lead response without user_id');
      }
    }

    // Calculate tier if not provided but score is
    let tier = assessmentData.tier;
    if (!tier && assessmentData.overall_score !== undefined) {
      if (assessmentData.overall_score >= 70) tier = 'high';
      else if (assessmentData.overall_score >= 40) tier = 'medium';
      else tier = 'low';
    }

    // Prepare the data for insertion/update
    const leadResponseData = {
      name: assessmentData.name,
      email: assessmentData.email,
      primary_goal: assessmentData.primary_goal,
      activity_level: assessmentData.activity_level || 'moderate',
      equipment: assessmentData.equipment || 'none',
      dietary_preferences: assessmentData.dietary_preferences || 'none',
      special_notes: assessmentData.special_notes || null,
      user_id: userId || null,
      overall_score: assessmentData.overall_score || null,
      tier: tier || null,
      category_scores: assessmentData.category_scores || null,
      assessment_results: assessmentData.assessment_results || null,
    };

    console.log('Preparing to insert/update lead response');

    // Insert the assessment data into lead_responses table
    const { data: leadResponse, error: insertError } = await supabase
      .from('lead_responses')
      .insert(leadResponseData)
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting lead response:', insertError);
      throw insertError;
    }

    console.log('Lead response created successfully:', leadResponse.id);

    // If user exists, create a notification
    if (userId) {
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: 'Wellness Assessment Complete! 🎉',
          message: `Your wellness assessment results are ready. Score: ${assessmentData.overall_score || 'N/A'}/100`,
          type: 'success',
          action_url: `/assessment-results?id=${leadResponse.id}`,
        });

      if (notificationError) {
        console.error('Error creating notification:', notificationError);
      } else {
        console.log('Notification created for user');
      }
    }

    // Return success response with the assessment ID
    return new Response(
      JSON.stringify({ 
        success: true,
        assessment_id: leadResponse.id,
        message: 'Assessment data received and stored successfully',
        redirect_url: userId 
          ? `https://lovable.app/assessment-results?id=${leadResponse.id}`
          : `https://lovable.app/register?assessment_id=${leadResponse.id}`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in vo-assessment-webhook:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
