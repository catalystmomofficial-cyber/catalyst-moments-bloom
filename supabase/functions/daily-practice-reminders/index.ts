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
    const currentDayOfMonth = now.getUTCDate();

    console.log(`Current UTC time: ${currentTime}, Day of month: ${currentDayOfMonth}`);

    // Get current day of week (1=Monday, 7=Sunday)
    const dayOfWeek = ((now.getUTCDay() + 6) % 7) + 1;

    // Get users who have reminders enabled at this time
    const { data: preferences, error: prefError } = await supabase
      .from('notification_preferences')
      .select('user_id, reminder_time')
      .eq('daily_reminders_enabled', true)
      .gte('reminder_time', `${currentHour}:${currentMinute - 5}:00`)
      .lte('reminder_time', `${currentHour}:${currentMinute + 5}:00`);

    // Get custom reminders for this time and day
    const { data: customReminders, error: customError } = await supabase
      .from('custom_reminders')
      .select('id, user_id, title, description, frequency, days_of_week, monthly_day')
      .eq('is_active', true)
      .gte('reminder_time', `${currentHour}:${currentMinute - 5}:00`)
      .lte('reminder_time', `${currentHour}:${currentMinute + 5}:00`);
    
    // Filter custom reminders based on frequency
    const filteredCustomReminders = customReminders?.filter(reminder => {
      if (reminder.frequency === 'daily') return true;
      if (reminder.frequency === 'weekly') {
        return reminder.days_of_week?.includes(dayOfWeek);
      }
      if (reminder.frequency === 'monthly') {
        return reminder.monthly_day === currentDayOfMonth;
      }
      return false;
    }) || [];

    if (prefError) {
      console.error('Error fetching preferences:', prefError);
      throw prefError;
    }

    if (customError) {
      console.error('Error fetching custom reminders:', customError);
    }

    const totalReminders = (preferences?.length || 0) + filteredCustomReminders.length;

    if (totalReminders === 0) {
      console.log('No users to send reminders to at this time');
      return new Response(
        JSON.stringify({ message: 'No reminders to send' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${preferences?.length || 0} daily reminders and ${filteredCustomReminders.length} custom reminders`);

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

      // Log reminder sent
      await supabase
        .from('reminder_logs')
        .insert({
          user_id: userId,
          reminder_type: 'daily_practice',
          title: 'Daily Practice Reminder',
          message,
          status: 'sent',
        });

      return userId;
    });

    // Send custom reminders
    const customNotificationPromises = filteredCustomReminders.map(async (reminder) => {
      await supabase
        .from('notifications')
        .insert({
          user_id: reminder.user_id,
          type: 'reminder',
          title: reminder.title,
          message: reminder.description || 'Time for your scheduled reminder!',
          action_url: '/birth-ball-guide',
        });

      // Log reminder sent
      await supabase
        .from('reminder_logs')
        .insert({
          user_id: reminder.user_id,
          reminder_id: reminder.id,
          reminder_type: 'custom',
          title: reminder.title,
          message: reminder.description || 'Time for your scheduled reminder!',
          status: 'sent',
        });

      return reminder.user_id;
    });

    const results = await Promise.allSettled([...notificationPromises, ...customNotificationPromises]);
    const successful = results.filter(r => r.status === 'fulfilled').length;

    console.log(`Sent ${successful} reminders successfully`);

    return new Response(
      JSON.stringify({
        success: true,
        reminders_sent: successful,
        total_users: totalReminders,
        daily_reminders: preferences?.length || 0,
        custom_reminders: filteredCustomReminders.length,
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
