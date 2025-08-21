import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushSubscription {
  endpoint: string;
  p256dh_key: string;
  auth_key: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, title, message, action_url } = await req.json();

    if (!user_id || !title || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user's push subscriptions
    const { data: subscriptions, error: subError } = await supabaseClient
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', user_id);

    if (subError) {
      throw subError;
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No push subscriptions found for user' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Store notification in database
    const { error: notifError } = await supabaseClient
      .from('notifications')
      .insert({
        user_id,
        title,
        message,
        action_url,
        type: 'info'
      });

    if (notifError) {
      console.error('Error storing notification:', notifError);
    }

    // Send push notifications
    const pushPromises = subscriptions.map(async (subscription: PushSubscription) => {
      try {
        const payload = JSON.stringify({
          title,
          message,
          action_url
        });

        // For demo purposes, we'll use a mock VAPID setup
        // In production, you'd need to implement proper VAPID signing
        const response = await fetch(subscription.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `key=${Deno.env.get('FCM_SERVER_KEY')}`, // For FCM
            'TTL': '86400'
          },
          body: JSON.stringify({
            to: subscription.endpoint,
            data: {
              title,
              message,
              action_url
            }
          })
        });

        if (!response.ok) {
          console.error(`Failed to send push notification: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error sending push notification:', error);
      }
    });

    await Promise.all(pushPromises);

    return new Response(
      JSON.stringify({ message: 'Push notifications sent successfully' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in send-push-notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});