import { Resend } from 'npm:resend@4.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Payload {
  email: string
  firstName: string
  lastName?: string
  eventTitle: string
  eventDate?: string
  eventTime?: string
  instructor?: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const body = (await req.json()) as Payload
    const { email, firstName, lastName, eventTitle, eventDate, eventTime, instructor } = body

    if (!email || !firstName || !eventTitle) {
      return new Response(
        JSON.stringify({ error: 'email, firstName, and eventTitle are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const fullName = `${firstName}${lastName ? ` ${lastName}` : ''}`

    const html = `
      <!doctype html>
      <html>
        <body style="font-family: Arial, sans-serif; background:#f7f5f2; margin:0; padding:24px;">
          <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #ecebe7;">
            <div style="background:linear-gradient(135deg,#b87333,#8b5a2b); padding:24px; text-align:center;">
              <h1 style="color:#ffffff; margin:0; font-size:22px;">Catalyst Mom</h1>
              <p style="color:#fde7d3; margin:8px 0 0; font-size:13px;">You're registered 🎉</p>
            </div>
            <div style="padding:28px;">
              <h2 style="color:#2a2a2a; margin:0 0 12px; font-size:20px;">Hi ${fullName},</h2>
              <p style="color:#4a4a4a; line-height:1.6; margin:0 0 16px;">
                Thank you for registering for <strong>${eventTitle}</strong>! We can't wait to see you there.
              </p>
              <div style="background:#faf6f1; border-left:3px solid #b87333; padding:16px; border-radius:6px; margin:20px 0;">
                <p style="margin:0 0 6px; color:#2a2a2a;"><strong>Event:</strong> ${eventTitle}</p>
                ${eventDate ? `<p style="margin:0 0 6px; color:#2a2a2a;"><strong>Date:</strong> ${eventDate}</p>` : ''}
                ${eventTime ? `<p style="margin:0 0 6px; color:#2a2a2a;"><strong>Time:</strong> ${eventTime}</p>` : ''}
                ${instructor ? `<p style="margin:0; color:#2a2a2a;"><strong>Host:</strong> ${instructor}</p>` : ''}
              </div>
              <p style="color:#4a4a4a; line-height:1.6;">
                We'll send you a reminder before the event with the access link. In the meantime, head over to the community to meet other moms.
              </p>
              <p style="color:#888; font-size:12px; margin-top:32px;">
                If you didn't sign up, please ignore this email.
              </p>
            </div>
            <div style="background:#faf6f1; padding:16px; text-align:center; color:#888; font-size:12px;">
              With love, the Catalyst Mom team
            </div>
          </div>
        </body>
      </html>
    `

    const { error } = await resend.emails.send({
      from: 'Catalyst Mom <onboarding@resend.dev>',
      to: [email],
      subject: `You're registered for ${eventTitle}`,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('send-event-confirmation error:', err)
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
