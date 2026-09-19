import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
const corsHeaders = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};
const normalizeInterest = (value = '') => {
 const input = value.trim().toLowerCase();
 if(input.includes('postpartum')) return 'postpartum';
 if(input.includes('pregnan')) return 'pregnancy';
 if(input === 'ttc' || input.includes('conceiv') || input.includes('fertility')) return 'ttc';
 if(input.includes('nutrition')) return 'nutrition';
 if(input.includes('fitness') || input.includes('workout')) return 'fitness';
 if(input.includes('wellness') || input.includes('self-care')) return 'wellness';
 return 'general';
};
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), {status, headers:{...corsHeaders,'Content-Type':'application/json'}});
serve(async (req: Request) => {
 if(req.method === 'OPTIONS') return new Response(null,{headers:corsHeaders});
 if(req.method !== 'POST') return reply({error:'Method not allowed'},405);
 try {
 const {email, interest: rawInterest, source: rawSource, articleSlug} = await req.json();
 const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
 if(!normalizedEmail || normalizedEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return reply({error:'Invalid email format'},400);
 let interest = normalizeInterest(typeof rawInterest === 'string' ? rawInterest : '');
 const source = (typeof rawSource === 'string' ? rawSource : 'website').trim().toLowerCase().replace(/[^a-z0-9_-]+/g,'-').slice(0,50) || 'website';
 const supabase = createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
 let verifiedArticle: string | undefined;
 if(typeof articleSlug === 'string' && articleSlug.length <= 250) {
 const {data:article,error} = await supabase.from('blogs').select('slug,tags').eq('slug',articleSlug).eq('status','published').maybeSingle();
 if(error) throw error;
 if(article) {
 const tags = (article.tags ?? []).map((tag: string) => normalizeInterest(tag));
 interest = ['ttc','pregnancy','postpartum','nutrition','fitness','wellness'].find(tag => tags.includes(tag)) ?? 'general';
 verifiedArticle = article.slug;
 }
 }
 const {data:suppression,error:suppressionError} = await supabase.from('suppressed_emails').select('reason').eq('email',normalizedEmail).maybeSingle();
 if(suppressionError) throw suppressionError;
 if(suppression && suppression.reason !== 'unsubscribe') return reply({error:'This address cannot receive updates. Please use another email or contact us.'},409);
 const apiKey = Deno.env.get('OMNISEND_API_KEY');
 if(!apiKey) throw new Error('OMNISEND_API_KEY not configured');
 const {error:saveError} = await supabase.from('newsletter_subscribers').upsert({email:normalizedEmail,interest,source,is_active:true,subscribed_at:new Date().toISOString()},{onConflict:'email'});
 if(saveError) throw saveError;
 const {error:unsuppressError} = await supabase.from('suppressed_emails').delete().eq('email',normalizedEmail).eq('reason','unsubscribe');
 if(unsuppressError) throw unsuppressError;
 const {error:tokenError} = await supabase.from('email_unsubscribe_tokens').update({used_at:null}).eq('email',normalizedEmail);
 if(tokenError) throw tokenError;
 const response = await fetch('https://api.omnisend.com/v3/contacts',{
 method:'POST',signal:AbortSignal.timeout(12000),headers:{'X-API-KEY':apiKey,'Content-Type':'application/json'},
 body:JSON.stringify({identifiers:[{type:'email',id:normalizedEmail,channels:{email:{status:'subscribed',statusDate:new Date().toISOString()}}}],tags:['newsletter-subscriber', 'newsletter-interest-'+interest, 'newsletter-source-'+source],customProperties:{newsletter_interest:interest,newsletter_source:source,...(verifiedArticle ? {newsletter_article:verifiedArticle} : {})}})
 });
 if(!response.ok) throw new Error('Omnisend contact sync failed ('+response.status+')');
 return reply({message:'Successfully subscribed! Check your email for a welcome message.'});
 } catch(error) {
 console.error('Newsletter signup failed:',error);
 return reply({error:'Unable to complete signup. Please try again.'},500);
 }
});
