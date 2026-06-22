// Post-build step: renders the public marketing pages in headless Chrome and
// writes the fully-rendered HTML into dist/<route>/index.html. This gives
// crawlers that don't execute JavaScript (ChatGPT-User, OAI-SearchBot, etc.)
// real content instead of the empty SPA shell. Dynamic, database-backed pages
// (e.g. individual blog posts) are intentionally left out of this list.
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer';

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const DIST_DIR = path.resolve(process.cwd(), 'dist');

const ROUTES = [
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
