// Post-build step: renders public pages in headless Chrome and writes the
// fully-rendered HTML into dist/<route>/index.html. This gives crawlers that
// don't execute JavaScript (ChatGPT-User, OAI-SearchBot, PerplexityBot, and
// often Google on JS-heavy SPAs) real content instead of the empty SPA shell.
//
// Static marketing pages come from STATIC_ROUTES. Individual blog posts are
// fetched live from Supabase (published only) so every article is prerendered
// too — this is the SEO win: your blog content becomes visible to crawlers.
import { spawn } from 'node:child_process';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer';

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const DIST_DIR = path.resolve(process.cwd(), 'dist');

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
  '/meal-plan',
  '/workout-plan',
  '/programs/glow-and-go',
  '/birth-ball-guide',
  '/birth-ball-guide/buying-guide',
  '/birth-ball-guide/safety',
  '/birth-ball-guide/faq',
  '/birth-ball-guide/education',
  '/diastasis-recti-recovery-program-reviews-reddit',
];

// Read a config value from process.env first (build platforms set these),
// falling back to the committed .env file. These are public VITE_ values.
async function readEnvValue(key) {
  if (process.env[key]) return process.env[key];
  try {
    const env = await readFile(path.resolve(process.cwd(), '.env'), 'utf-8');
    const line = env.split('\n').find((l) => l.trim().startsWith(`${key}=`));
    if (!line) return undefined;
    return line.slice(line.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '');
  } catch {
    return undefined;
  }
}

// Fetch every published blog slug from Supabase and turn it into a route.
// Fails soft: if Supabase is unreachable or misconfigured, we prerender the
// static routes only rather than breaking the build.
async function getBlogRoutes() {
  try {
    const url = (await readEnvValue('VITE_SUPABASE_URL')) || 'https://moxxceccaftkeuaowctw.supabase.co';
    const anon =
      (await readEnvValue('VITE_SUPABASE_PUBLISHABLE_KEY')) ||
      (await readEnvValue('VITE_SUPABASE_ANON_KEY'));
    if (!anon) {
      console.warn('Prerender: no Supabase anon key found — skipping blog posts.');
      return [];
    }
    const endpoint =
      `${url.replace(/\/$/, '')}/rest/v1/blogs` +
      `?status=eq.published&select=slug&order=published_at.desc&limit=500`;
    const res = await fetch(endpoint, {
      headers: { apikey: anon, Authorization: `Bearer ${anon}` },
    });
    if (!res.ok) {
      console.warn(`Prerender: blog slug fetch failed (HTTP ${res.status}) — skipping blog posts.`);
      return [];
    }
    const rows = await res.json();
    const routes = (Array.isArray(rows) ? rows : [])
      .map((r) => r?.slug)
      .filter(Boolean)
      .map((slug) => `/blog/${slug}`);
    console.log(`Prerender: found ${routes.length} published blog post(s).`);
    return routes;
  } catch (err) {
    console.warn(`Prerender: could not fetch blog slugs (${err.message}) — skipping blog posts.`);
    return [];
  }
}

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

    const blogRoutes = await getBlogRoutes();
    const ROUTES = [...STATIC_ROUTES, ...blogRoutes];

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      for (const route of ROUTES) {
        const page = await browser.newPage();
        const isBlogPost = route.startsWith('/blog/');
        try {
          await page.goto(`${BASE_URL}${route}`, {
            waitUntil: 'domcontentloaded',
            timeout: 30000,
          });

          if (isBlogPost) {
            // Blog posts fetch their content from Supabase client-side — wait
            // for the loaded article headline before capturing, so we never
            // snapshot an empty shell or the "Not Found" state.
            await page
              .waitForSelector('article [itemprop="headline"]', { timeout: 12000 })
              .catch(() => {});
          }

          // Extra settle time for React to finish painting. Avoid networkidle0
          // since third-party scripts (Stripe, Omnisend, Turnstile) never let
          // the network go idle.
          await new Promise((resolve) => setTimeout(resolve, isBlogPost ? 2500 : 1500));

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
