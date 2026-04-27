import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// --- Helpers ---
function base64UrlEncode(data: Uint8Array | string): string {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s+/g, '');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

interface ServiceAccount {
  client_email: string;
  private_key: string;
  project_id: string;
  token_uri?: string;
}

async function getAccessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: sa.token_uri || 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  const encHeader = base64UrlEncode(JSON.stringify(header));
  const encPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encHeader}.${encPayload}`;

  const keyData = pemToArrayBuffer(sa.private_key.replace(/\\n/g, '\n'));
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    keyData,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuf = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, new TextEncoder().encode(signingInput));
  const jwt = `${signingInput}.${base64UrlEncode(new Uint8Array(sigBuf))}`;

  const res = await fetch(sa.token_uri || 'https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`OAuth token error: ${res.status} ${t}`);
  }
  const json = await res.json();
  return json.access_token;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, body, icon, url, user_ids } = await req.json();

    const saRaw = Deno.env.get('FIREBASE_SERVICE_ACCOUNT');
    if (!saRaw) throw new Error('FIREBASE_SERVICE_ACCOUNT not configured');

    let sa: ServiceAccount;
    try {
      sa = JSON.parse(saRaw);
    } catch {
      throw new Error('FIREBASE_SERVICE_ACCOUNT is not valid JSON');
    }

    if (!Array.isArray(user_ids) || user_ids.length === 0) {
      return new Response(JSON.stringify({ error: 'user_ids required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Sending FCM to users:', user_ids);

    const subsRes = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/rest/v1/push_subscriptions?user_id=in.(${user_ids.join(',')})&fcm_token=not.is.null&select=user_id,fcm_token`,
      {
        headers: {
          apikey: Deno.env.get('SUPABASE_ANON_KEY')!,
          Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!}`,
        },
      }
    );
    const subs: { user_id: string; fcm_token: string }[] = await subsRes.json();
    console.log(`Found ${subs.length} FCM tokens`);

    if (subs.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0, failed: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const accessToken = await getAccessToken(sa);
    const fcmUrl = `https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`;

    const results = await Promise.allSettled(
      subs.map(async (sub) => {
        const message = {
          message: {
            token: sub.fcm_token,
            notification: {
              title: title || 'Catalyst Mom',
              body: body || '',
            },
            data: {
              url: url || '/',
              icon: icon || '/catalyst-mom-logo.png',
              title: title || 'Catalyst Mom',
              body: body || '',
            },
            webpush: {
              fcm_options: { link: url || '/' },
              notification: {
                icon: icon || '/catalyst-mom-logo.png',
                badge: '/catalyst-mom-logo.png',
              },
            },
          },
        };

        const r = await fetch(fcmUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });

        if (!r.ok) {
          const errText = await r.text();
          // Clean up invalid tokens
          if (r.status === 404 || r.status === 400) {
            await fetch(
              `${Deno.env.get('SUPABASE_URL')}/rest/v1/push_subscriptions?fcm_token=eq.${encodeURIComponent(sub.fcm_token)}`,
              {
                method: 'DELETE',
                headers: {
                  apikey: Deno.env.get('SUPABASE_ANON_KEY')!,
                  Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!}`,
                },
              }
            );
          }
          throw new Error(`FCM ${r.status}: ${errText}`);
        }
        return { success: true, user_id: sub.user_id };
      })
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.length - successful;
    results.forEach((r) => {
      if (r.status === 'rejected') console.error('FCM send failed:', r.reason);
    });

    return new Response(JSON.stringify({ success: true, sent: successful, failed }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);
