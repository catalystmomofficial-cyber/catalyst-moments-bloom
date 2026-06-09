import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml',
};

const BASE_URL = 'https://catalystmomofficial.com';

const STATIC_PAGES = [
  { loc: '/',                             changefreq: 'daily',   priority: '1.0' },
  { loc: '/blog',                         changefreq: 'daily',   priority: '0.9' },
  { loc: '/about',                        changefreq: 'monthly', priority: '0.7' },
  { loc: '/experts',                      changefreq: 'monthly', priority: '0.7' },
  { loc: '/research',                     changefreq: 'monthly', priority: '0.6' },
  { loc: '/faq',                          changefreq: 'monthly', priority: '0.6' },
  { loc: '/food-calories',               changefreq: 'weekly',  priority: '0.7' },
  { loc: '/affiliate',                    changefreq: 'monthly', priority: '0.5' },
  { loc: '/birth-ball-guide',            changefreq: 'monthly', priority: '0.7' },
  { loc: '/birth-ball-guide/buying-guide',  changefreq: 'monthly', priority: '0.6' },
  { loc: '/birth-ball-guide/education',  changefreq: 'monthly', priority: '0.6' },
  { loc: '/birth-ball-guide/safety',     changefreq: 'monthly', priority: '0.6' },
  { loc: '/birth-ball-guide/faq',        changefreq: 'monthly', priority: '0.6' },
  { loc: '/birth-ball-guide/early-labor', changefreq: 'monthly', priority: '0.6' },
  { loc: '/community',                   changefreq: 'daily',   priority: '0.7' },
  { loc: '/terms',                       changefreq: 'yearly',  priority: '0.2' },
  { loc: '/privacy',                     changefreq: 'yearly',  priority: '0.2' },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const currentDate = new Date().toISOString();

    // Fetch published blog posts
    const { data: blogs, error: blogsError } = await supabase
      .from('blogs')
      .select('slug, published_at, updated_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (blogsError) throw blogsError;

    // Fetch distinct community group slugs
    const { data: groups, error: groupsError } = await supabase
      .from('community_posts')
      .select('group_slug')
      .not('group_slug', 'is', null);

    if (groupsError) throw groupsError;

    const uniqueGroupSlugs = [...new Set((groups ?? []).map(g => g.group_slug).filter(Boolean))];

    const url = (loc: string, lastmod: string, changefreq: string, priority: string) =>
      `  <url>\n    <loc>${BASE_URL}${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

    const staticUrls = STATIC_PAGES.map(p => url(p.loc, currentDate, p.changefreq, p.priority)).join('\n');

    const blogUrls = (blogs ?? []).map(b =>
      url(`/blog/${b.slug}`, b.updated_at || b.published_at, 'monthly', '0.7')
    ).join('\n');

    const groupUrls = uniqueGroupSlugs.map(slug =>
      url(`/community/groups/${slug}`, currentDate, 'daily', '0.6')
    ).join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

${staticUrls}

${blogUrls}

${groupUrls}

</urlset>`;

    return new Response(sitemap, { headers: corsHeaders, status: 200 });

  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
