import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushSubscription {
  endpoint: string;
  auth_key: string;
  p256dh_key: string;
  user_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, body, icon, url, user_ids } = await req.json();

    console.log('Sending push notifications to users:', user_ids);

    // Get push subscriptions for the specified users
    const subscriptionsResponse = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/rest/v1/push_subscriptions?user_id=in.(${user_ids.join(',')})`,
      {
        headers: {
          'apikey': Deno.env.get('SUPABASE_ANON_KEY')!,
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!}`,
        },
      }
    );

    const subscriptions: PushSubscription[] = await subscriptionsResponse.json();

    console.log(`Found ${subscriptions.length} subscriptions`);

    // Send notification to each subscription
    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          // Use Web Push API to send notification
          const response = await fetch(sub.endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'TTL': '86400', // 24 hours
            },
            body: JSON.stringify({
              title,
              body,
              icon: icon || '/catalyst-mom-logo.png',
              badge: '/catalyst-mom-logo.png',
              url: url || '/',
              timestamp: Date.now(),
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to send notification: ${response.statusText}`);
          }

          return { success: true, user_id: sub.user_id };
        } catch (error) {
          console.error(`Failed to send notification to user ${sub.user_id}:`, error);
          return { success: false, user_id: sub.user_id, error: error.message };
        }
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;

    console.log(`Sent ${successful} notifications successfully, ${failed} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        sent: successful,
        failed,
        details: results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error sending push notifications:', error);
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
