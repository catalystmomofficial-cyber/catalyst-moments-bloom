import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as jose from "https://deno.land/x/jose@v5.2.0/index.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function base64UrlEncode(data: Uint8Array): string {
  let binary = '';
  for (const byte of data) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = str.length % 4;
  if (pad) str += '='.repeat(4 - pad);
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function importVapidKeys(publicKeyB64: string, privateKeyB64: string) {
  const publicKeyBytes = base64UrlDecode(publicKeyB64);
  const privateKeyBytes = base64UrlDecode(privateKeyB64);

  // Build JWK for ES256
  const x = base64UrlEncode(publicKeyBytes.slice(1, 33));
  const y = base64UrlEncode(publicKeyBytes.slice(33, 65));
  const d = base64UrlEncode(privateKeyBytes);

  const privateKey = await crypto.subtle.importKey(
    'jwk',
    { kty: 'EC', crv: 'P-256', x, y, d },
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign']
  );

  return privateKey;
}

async function createVapidAuthHeader(
  endpoint: string,
  vapidSubject: string,
  publicKey: string,
  privateKeyB64: string
): Promise<{ authorization: string; cryptoKey: string }> {
  const url = new URL(endpoint);
  const audience = `${url.protocol}//${url.host}`;

  const privateKey = await importVapidKeys(publicKey, privateKeyB64);

  const header = { alg: 'ES256', typ: 'JWT' };
  const payload = {
    aud: audience,
    exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
    sub: vapidSubject,
  };

  const encodedHeader = base64UrlEncode(new TextEncoder().encode(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    privateKey,
    new TextEncoder().encode(signingInput)
  );

  // Convert DER signature to raw r||s format if needed
  const sigBytes = new Uint8Array(signature);
  let rawSig: Uint8Array;
  if (sigBytes.length === 64) {
    rawSig = sigBytes;
  } else {
    // Already raw from WebCrypto
    rawSig = sigBytes;
  }

  const token = `${signingInput}.${base64UrlEncode(rawSig)}`;

  return {
    authorization: `vapid t=${token}, k=${publicKey}`,
    cryptoKey: `p256ecdsa=${publicKey}`,
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, body, icon, url, user_ids } = await req.json();
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');
    const vapidPublicKey = 'BNE3CbrZIF5fS_HMByom1M9MuwcEn_aRiIJS3LFQRJdp7plk40tKMqHQMH07zSm1ZgkKxTVAsVDTfk7ofy3BfM0';
    const vapidSubject = 'mailto:catalystmom@outlook.com';

    if (!vapidPrivateKey) {
      throw new Error('VAPID_PRIVATE_KEY not configured');
    }

    console.log('Sending push notifications to users:', user_ids);

    const subscriptionsResponse = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/rest/v1/push_subscriptions?user_id=in.(${user_ids.join(',')})`,
      {
        headers: {
          'apikey': Deno.env.get('SUPABASE_ANON_KEY')!,
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!}`,
        },
      }
    );

    interface PushSub {
      endpoint: string;
      auth_key: string;
      p256dh_key: string;
      user_id: string;
    }

    const subscriptions: PushSub[] = await subscriptionsResponse.json();
    console.log(`Found ${subscriptions.length} subscriptions`);

    const payload = JSON.stringify({
      title: title || 'Catalyst Mom',
      body: body || '',
      icon: icon || '/catalyst-mom-logo.png',
      url: url || '/',
      timestamp: Date.now(),
    });

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          const vapidHeaders = await createVapidAuthHeader(
            sub.endpoint,
            vapidSubject,
            vapidPublicKey,
            vapidPrivateKey
          );

          const response = await fetch(sub.endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/octet-stream',
              'Content-Encoding': 'aes128gcm',
              'TTL': '86400',
              'Authorization': vapidHeaders.authorization,
              'Crypto-Key': vapidHeaders.cryptoKey,
            },
            body: new TextEncoder().encode(payload),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Push failed (${response.status}): ${errorText}`);
          }

          return { success: true, user_id: sub.user_id };
        } catch (error) {
          console.error(`Failed for user ${sub.user_id}:`, error);
          return { success: false, user_id: sub.user_id, error: (error as Error).message };
        }
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled' && (r.value as any).success).length;
    const failed = results.length - successful;

    return new Response(
      JSON.stringify({ success: true, sent: successful, failed }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
