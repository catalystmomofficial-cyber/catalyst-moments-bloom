import React from 'npm:react@18.3.1'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { WelcomeEmail } from './_templates/welcome-email.tsx'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { user_id } = await req.json()

    if (!user_id) {
      throw new Error('user_id is required')
    }

    console.log('Sending welcome email to user:', user_id)

    // Create Supabase client to fetch user details
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user email from auth.users
    const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserById(user_id)
    
    if (userError || !userData.user) {
      throw new Error(`Failed to fetch user: ${userError?.message}`)
    }

    const userEmail = userData.user.email
    if (!userEmail) {
      throw new Error('User email not found')
    }

    // Try to get display name from profiles table
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('display_name')
      .eq('user_id', user_id)
      .single()

    console.log('User email:', userEmail, 'Display name:', profile?.display_name)

    // Render the branded email template
    const html = await renderAsync(
      React.createElement(WelcomeEmail, {
        user_email: userEmail,
        display_name: profile?.display_name,
      })
    )

    // Send the email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Catalyst Mom <onboarding@resend.dev>',
      to: [userEmail],
      subject: 'Welcome to Catalyst Mom - Let\'s Get Started! 🌟',
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Welcome email sent successfully:', data)

    return new Response(
      JSON.stringify({ success: true, message: 'Welcome email sent successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  } catch (error) {
    console.error('Error in send-welcome-email function:', error)
    return new Response(
      JSON.stringify({
        error: {
          http_code: error.code || 500,
          message: error.message || 'Internal server error',
        },
      }),
      {
        status: error.code || 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  }
})
