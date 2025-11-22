import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReminderUser {
  id: string;
  email: string;
  reminder_time: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting birth ball reminder job...");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get current time in HH:MM format
    const now = new Date();
    const currentHour = String(now.getUTCHours()).padStart(2, '0');
    const currentMinute = String(now.getUTCMinutes()).padStart(2, '0');
    const currentTime = `${currentHour}:${currentMinute}:00`;

    console.log(`Looking for reminders scheduled for ${currentTime}`);

    // Fetch active reminders for the current hour
    const { data: reminders, error: fetchError } = await supabase
      .from('birth_ball_reminders')
      .select('id, user_id, email, reminder_time')
      .eq('is_active', true)
      .gte('reminder_time', `${currentHour}:00:00`)
      .lt('reminder_time', `${currentHour}:59:59`);

    if (fetchError) {
      console.error("Error fetching reminders:", fetchError);
      throw fetchError;
    }

    if (!reminders || reminders.length === 0) {
      console.log("No reminders to send at this time");
      return new Response(
        JSON.stringify({ message: "No reminders scheduled for this time", sent: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${reminders.length} reminders to send`);

    let successCount = 0;
    let failureCount = 0;

    // Send emails to each user
    for (const reminder of reminders) {
      try {
        const emailResponse = await resend.emails.send({
          from: "Catalyst Mom <noreply@catalystmom.com>",
          to: [reminder.email],
          subject: "🌟 Time for Your Daily Birth Ball Practice!",
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">🎯 Daily Practice Reminder</h1>
                </div>
                
                <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <h2 style="color: #667eea; margin-top: 0;">Time to Practice with Your Birth Ball! 🤰✨</h2>
                  
                  <p style="font-size: 16px;">Hey there, amazing mama!</p>
                  
                  <p style="font-size: 16px;">This is your friendly reminder to spend some quality time with your birth ball today. Even just 10-15 minutes can make a big difference!</p>
                  
                  <div style="background: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #764ba2;">✨ Quick Practice Ideas:</h3>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                      <li style="margin: 8px 0;">Hip circles (2 minutes)</li>
                      <li style="margin: 8px 0;">Gentle bounces (3 minutes)</li>
                      <li style="margin: 8px 0;">Pelvic tilts (2 minutes)</li>
                      <li style="margin: 8px 0;">Deep breathing while seated (3 minutes)</li>
                    </ul>
                  </div>
                  
                  <p style="font-size: 16px;">Remember: Consistency is key! Even a short session counts toward building your birth ball practice habit.</p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://catalystmom.com/birth-ball-guide" 
                       style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                      Log Today's Practice
                    </a>
                  </div>
                  
                  <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    Keep up the great work! You're doing an amazing job preparing for your baby's arrival. 💜
                  </p>
                  
                  <p style="font-size: 12px; color: #999; margin-top: 20px;">
                    Don't want these reminders? You can turn them off in your <a href="https://catalystmom.com/birth-ball-guide" style="color: #667eea;">Birth Ball Guide settings</a>.
                  </p>
                </div>
              </body>
            </html>
          `,
        });

        console.log(`Email sent successfully to ${reminder.email}:`, emailResponse);
        successCount++;
      } catch (emailError) {
        console.error(`Failed to send email to ${reminder.email}:`, emailError);
        failureCount++;
      }
    }

    console.log(`Reminder job complete. Sent: ${successCount}, Failed: ${failureCount}`);

    return new Response(
      JSON.stringify({
        message: "Reminder job completed",
        sent: successCount,
        failed: failureCount,
        total: reminders.length
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-birth-ball-reminders function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
