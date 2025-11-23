import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    console.log('Starting daily practice reminders cron job');

    // Get current UTC hour and minute
    const now = new Date();
    const currentHour = now.getUTCHours();
    const currentMinute = now.getUTCMinutes();
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}:00`;

    console.log(`Current UTC time: ${currentTime}`);

    // Get users who have reminders enabled at this time
    const { data: preferences, error: prefError } = await supabase
      .from('notification_preferences')
      .select('user_id, reminder_time')
      .eq('daily_reminders_enabled', true)
      .gte('reminder_time', `${currentHour}:${currentMinute - 5}:00`)
      .lte('reminder_time', `${currentHour}:${currentMinute + 5}:00`);

    if (prefError) {
      console.error('Error fetching preferences:', prefError);
      throw prefError;
    }

    if (!preferences || preferences.length === 0) {
      console.log('No users to send reminders to at this time');
      return new Response(
        JSON.stringify({ message: 'No reminders to send' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${preferences.length} users with reminders`);

    const userIds = preferences.map(p => p.user_id);

    // Get profiles to check trimester/stage
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, motherhood_stage')
      .in('user_id', userIds);

    // Send push notifications
    const notificationPromises = userIds.map(async (userId) => {
      const profile = profiles?.find(p => p.user_id === userId);
      const stage = profile?.motherhood_stage || 'pregnancy';
      
      let message = 'Time for your daily birth ball practice! 🎯';
      
      if (stage?.includes('trimester_1')) {
        message = 'Gentle birth ball practice helps reduce nausea and back pain. Let\'s do this! 💪';
      } else if (stage?.includes('trimester_2')) {
        message = 'Your daily birth ball practice helps prepare for labor. Keep up the great work! 🌟';
      } else if (stage?.includes('trimester_3')) {
        message = 'Almost there! Your birth ball practice is preparing your body for the big day! 🎉';
      }

      // Create notification record
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'reminder',
          title: 'Daily Practice Reminder',
          message,
          action_url: '/birth-ball-guide',
        });

      return userId;
    });

    const results = await Promise.allSettled(notificationPromises);
    const successful = results.filter(r => r.status === 'fulfilled').length;

    console.log(`Sent ${successful} reminders successfully`);

    return new Response(
      JSON.stringify({
        success: true,
        reminders_sent: successful,
        total_users: preferences.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in daily practice reminders:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);
