// Post-build step: renders the public marketing pages in headless Chrome and
// writes the fully-rendered HTML into dist/<route>/index.html. This gives
// crawlers that don't execute JavaScript (ChatGPT-User, OAI-SearchBot, etc.)
// real content instead of the empty SPA shell. Blog posts are fetched from
// Supabase at build time so every published article is prerendered for Google.
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

// Vite only loads .env for the browser bundle (import.meta.env.*); this is a
// plain Node script run as a postbuild step, so it never sees those values
// unless the host platform happens to export .env into the shell first. That
// silent gap meant fetchBlogSlugs() below could return an empty list on a
// platform that doesn't do that, so every blog post would fall back to
// serving the homepage's static file. Load .env directly so this never
// depends on the platform's behavior.
function loadDotEnv() {
  try {
    const content = readFileSync(path.resolve(process.cwd(), '.env'), 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // No .env file present — rely on whatever the platform already set.
  }
}
loadDotEnv();

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const DIST_DIR = path.resolve(process.cwd(), 'dist');

async function fetchBlogSlugs() {
  const url = process.env.VITE_SUPABASE_URL || 'https://moxxceccaftkeuaowctw.supabase.co';
  // Public anon key — the same one committed in src/integrations/supabase/client.ts
  // and already shipped in the browser bundle. Hardcoded as a fallback so blog
  // prerendering never silently skips when the build has no .env, which is the
  // normal case for a GitHub-based build (.env is gitignored). This was the root
  // cause of every post falling back to the homepage's static file.
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
    || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1veHhjZWNjYWZ0a2V1YW93Y3R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NTEyOTYsImV4cCI6MjA2MjQyNzI5Nn0.zInlBzKCVwrhKBW-nAc5b7BoxrXmlYF25cuqfippu3U';
  if (!key) { console.warn('No Supabase key — skipping blog prerender'); return []; }
  try {
    const res = await fetch(
      `${url}/rest/v1/blogs?select=slug,title,excerpt,author,tags,featured_image_url,published_at,updated_at&status=eq.published&order=published_at.desc`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    );
    if (!res.ok) { console.warn(`Supabase returned ${res.status} — skipping blog prerender`); return []; }
    return await res.json();
  } catch (e) {
    console.warn('Could not fetch blog slugs:', e.message);
    return [];
  }
}

// The published sitemap is the static public/sitemap.xml (the vercel.json rewrite
// to the generate-sitemap function is not active on this host), so it never listed
// blog posts. Inject the published posts into dist/sitemap.xml at build time so the
// sitemap always matches exactly what was prerendered.
async function writeSitemap(blogs) {
  const src = path.resolve(process.cwd(), 'public', 'sitemap.xml');
  let xml;
  try {
    xml = readFileSync(src, 'utf-8');
  } catch {
    console.warn('No public/sitemap.xml — skipping sitemap blog injection');
    return;
  }
  const entries = blogs.map((b) => {
    const lastmod = (b.updated_at || b.published_at || new Date().toISOString()).slice(0, 10);
    return `  <url>\n    <loc>https://catalystmomofficial.com/blog/${b.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`;
  }).join('\n');
  const out = xml.replace('</urlset>', `  <!-- Published blog posts (generated at build time) -->\n${entries}\n</urlset>`);
  await writeFile(path.join(DIST_DIR, 'sitemap.xml'), out, 'utf-8');
  console.log(`Wrote dist/sitemap.xml with ${blogs.length} blog URLs`);
}

// Pinterest (and any other RSS-driven auto-publisher) reads https://catalystmomofficial.com/rss.xml.
// The vercel.json rewrite to the serve-rss edge function is NOT active on this host, so that URL
// was serving a stale single-item static file — which is why newly published posts never turned
// into pins. Generate the feed at build time, exactly like the sitemap, so /rss.xml always matches
// what is actually published. Each item carries <media:content> + <enclosure> because Pinterest
// skips any feed item without an image.
function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function writeRss(blogs) {
  const BASE = 'https://catalystmomofficial.com';
  const now = new Date().toUTCString();
  const withImages = blogs.filter((b) => b.featured_image_url);
  const items = withImages.map((b) => {
    const link = `${BASE}/blog/${b.slug}`;
    const pubDate = new Date(b.published_at || b.updated_at || Date.now()).toUTCString();
    const img = escapeXml(b.featured_image_url);
    const ext = (b.featured_image_url.split('?')[0].split('.').pop() || 'jpg').toLowerCase();
    const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
    const categories = (b.tags || [])
      .map((t) => `      <category>${escapeXml(t)}</category>`)
      .join('\n');
    return [
      '    <item>',
      `      <title>${escapeXml(b.title)}</title>`,
      `      <link>${link}</link>`,
      `      <guid isPermaLink="true">${link}</guid>`,
      `      <description>${escapeXml(b.excerpt || b.title)}</description>`,
      `      <pubDate>${pubDate}</pubDate>`,
      `      <dc:creator>${escapeXml(b.author || 'Catalyst Mom')}</dc:creator>`,
      categories,
      `      <media:content url="${img}" medium="image" type="${mime}"/>`,
      `      <media:thumbnail url="${img}"/>`,
      `      <enclosure url="${img}" type="${mime}" length="0"/>`,
      '    </item>',
    ].filter(Boolean).join('\n');
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Catalyst Mom - Maternal Wellness Blog</title>
    <link>${BASE}/blog</link>
    <description>Evidence-based articles on pregnancy, postpartum recovery, breastfeeding, and maternal wellness - written for real moms by Catalyst Mom.</description>
    <language>en-us</language>
    <managingEditor>hello@catalystmomofficial.com (Catalyst Mom Team)</managingEditor>
    <lastBuildDate>${now}</lastBuildDate>
    <ttl>60</ttl>
    <atom:link href="${BASE}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${BASE}/catalyst-mom-logo.png</url>
      <title>Catalyst Mom - Maternal Wellness Blog</title>
      <link>${BASE}/blog</link>
    </image>
${items}
  </channel>
</rss>
`;
  await writeFile(path.join(DIST_DIR, 'rss.xml'), xml, 'utf-8');
  const skipped = blogs.length - withImages.length;
  console.log(`Wrote dist/rss.xml with ${withImages.length} items${skipped ? ` (${skipped} skipped: no featured image, Pinterest would reject them)` : ''}`);
}

const STATIC_ROUTES = [
  '/',
  '/about',
  '/faq',
  '/research',
  '/experts',
  '/food-calories',
  '/blog',
  '/terms',
  '/privacy',
  '/affiliate',
  '/contact',
  '/medical-disclaimer',
  // /meal-plan, /workout-plan, /programs/glow-and-go are intentionally
  // excluded — they're gated by PrivateRoute, so prerendering them just
  // bakes the client-side login redirect's HTML into these URLs, which is
  // what Google was indexing (a login page under a meal-plan URL).
  '/birth-ball-guide',
  '/birth-ball-guide/buying-guide',
  '/birth-ball-guide/safety',
  '/birth-ball-guide/faq',
  '/birth-ball-guide/education',
  '/diastasis-recti-recovery-program-reviews-reddit',
  '/guides',
  '/postpartum-body-changes-what-nobody-tells-you',
  '/c-section-prep-checklist',
  '/stop-breastfeeding-without-guilt',
  '/exhausted-mom-sleep-troubleshooting',
  '/baby-tracking-anxiety',
  '/honest-pregnancy-truths',
  '/postpartum-freezer-meal-prep',
  '/build-your-village',
  '/baby-allergen-tracker',
];

function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tryOnce = () => {
      fetch(url)
        .then(() => resolve())
        .catch(() => {
          if (Date.now() - start > timeoutMs) {
            reject(new Error(`Timed out waiting for ${url}`));
          } else {
            setTimeout(tryOnce, 500);
          }
        });
    };
    tryOnce();
  });
}

async function outputPathFor(route) {
  const filePath =
    route === '/'
      ? path.join(DIST_DIR, 'index.html')
      : path.join(DIST_DIR, route.replace(/^\//, ''), 'index.html');
  await mkdir(path.dirname(filePath), { recursive: true });
  return filePath;
}

async function main() {
  const server = spawn(
    'npx',
    ['vite', 'preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'],
    { stdio: 'inherit' }
  );

  const cleanup = () => server.kill();
  process.on('exit', cleanup);

  try {
    await waitForServer(BASE_URL);

    const blogs = await fetchBlogSlugs();
    console.log(`Found ${blogs.length} published blog posts to prerender`);
    await writeSitemap(blogs);
    const ROUTES = [...STATIC_ROUTES, ...blogs.map((b) => `/blog/${b.slug}`)];

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      for (const route of ROUTES) {
        const page = await browser.newPage();
        try {
          await page.goto(`${BASE_URL}${route}`, {
            waitUntil: 'domcontentloaded',
            timeout: 30000,
          });
          // Give React time to render; avoid networkidle0 since third-party
          // analytics/tracking scripts (Stripe, Omnisend, Turnstile) keep
          // making background requests and never let the network go idle.
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const html = await page.content();
          const outPath = await outputPathFor(route);
          await writeFile(outPath, html, 'utf-8');
          console.log(`Prerendered ${route} -> ${path.relative(process.cwd(), outPath)}`);
        } catch (err) {
          console.warn(`Skipped ${route}: ${err.message}`);
        } finally {
          await page.close();
        }
      }
    } finally {
      await browser.close();
    }
  } finally {
    cleanup();
  }
}

main().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
