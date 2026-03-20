import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get all active subscribers
    const { data: subscribers, error: subError } = await supabase
      .from('subscribers')
      .select('user_id, email')
      .eq('subscribed', true)

    if (subError) throw subError
    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({ message: 'No active subscribers found', awarded: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    let awarded = 0

    for (const sub of subscribers) {
      // Check if already awarded this month
      const { data: existing } = await supabase
        .from('points_transactions')
        .select('id')
        .eq('user_id', sub.user_id)
        .eq('source', 'monthly_subscriber_bonus')
        .gte('created_at', monthStart)
        .limit(1)

      if (existing && existing.length > 0) continue

      // Award 50 bonus credits
      const { error: creditError } = await supabase.rpc('add_purchased_credits', {
        p_user_id: sub.user_id,
        p_amount: 50,
        p_source: 'monthly_subscriber_bonus',
        p_description: 'Monthly subscriber bonus - 50 free credits!',
      })

      if (!creditError) awarded++
    }

    return new Response(JSON.stringify({ message: `Awarded monthly credits to ${awarded} subscribers`, awarded }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
