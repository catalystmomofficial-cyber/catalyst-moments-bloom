# Catalyst Mom — Project Notes for Claude

React + Vite + Tailwind app (built in Lovable) with a Supabase backend.
Production: catalystmomofficial.com (also catalystmom.online). Audience: moms
25–40 (TTC, pregnancy, postpartum), plain language, warm but evidence-based
tone.

## Tech stack

- **Build/runtime:** Vite 5 + React 18 + TypeScript, SWC plugin
  (`@vitejs/plugin-react-swc`). SPA via `react-router-dom` v6.
- **Styling:** Tailwind CSS 3 + `shadcn/ui` (Radix primitives in
  `src/components/ui`), `tailwindcss-animate`, `@tailwindcss/typography`.
  `cn()` helper in `src/lib/utils.ts`.
- **State/data:** `@tanstack/react-query` for server state; React Context for
  auth, video player, and remote sync. Forms with `react-hook-form` + `zod`.
- **Backend:** Supabase (Postgres + Auth + Storage + Edge Functions). Also
  Firebase (`src/lib/firebase.ts`) for push/messaging.
- **Payments:** Stripe (subscriptions, credits) + PayPal
  (`@paypal/react-paypal-js`).
- **Animation/media:** `framer-motion`, `embla-carousel`, `canvas-confetti`,
  TipTap rich-text editor (admin blog editing), `recharts`.
- **Package manager:** both `bun.lockb` and `package-lock.json` are committed.
  Lovable uses Bun; either `bun install` or `npm i` works. Lovable
  auto-commits its own edits to this repo, so expect external commits.

## Commands

```sh
npm run dev        # Vite dev server on http://localhost:8080
npm run build      # production build → dist/ (runs postbuild prerender)
npm run build:dev  # build in development mode
npm run lint       # eslint .
npm run preview    # preview built dist/
npx vitest         # run unit tests (no "test" script in package.json)
npx vitest run     # single-pass test run (CI style)
```

- **Prerender:** `npm run build` triggers `postbuild` →
  `scripts/prerender.mjs`, which renders the public marketing routes in
  headless Chrome (puppeteer) and writes static `dist/<route>/index.html` so
  non-JS crawlers (ChatGPT-User, OAI-SearchBot, etc.) get real content. The
  route allowlist lives at the top of that script — add new public marketing
  pages there. Dynamic DB-backed pages (e.g. individual blog posts) are
  intentionally excluded.
- **Tests:** Vitest + Testing Library, jsdom env, setup at
  `src/test/setup.ts`. Tests are sparse (e.g. `src/test/contrast.test.ts`,
  component `__tests__` folders). Add tests beside the code they cover.

## Architecture / source layout

- `src/App.tsx` — single source of routing and the provider tree. Provider
  nesting (outer→inner): `HelmetProvider` → `QueryClientProvider` →
  `ThemeProvider` → `TooltipProvider` → `AuthProvider` → `VideoPlayerProvider`
  → `RemoteSyncProvider` → `ErrorBoundary` → `BrowserRouter` → `Routes`. All
  routes are eagerly imported (no lazy splitting today).
- `src/pages/` — one component per route (~55 pages). Auth pages under
  `pages/auth/`, wellness articles under `pages/wellness/`. Notable hubs:
  Birth Ball guide (many `/birth-ball-guide/*` routes), Workouts/Core Restore,
  Meal/Workout plans, Blog, Admin, Affiliate.
- `src/components/` — feature-grouped (`admin`, `blog`, `birth-ball`,
  `community`, `subscription`, `workouts`, `seo`, `video`, `pwa`, etc.) plus
  `ui/` (shadcn primitives). Prefer adding to the matching feature folder.
- `src/contexts/` — `AuthContext` (Supabase auth + checkout modal state),
  `VideoPlayerContext` (global player), `RemoteSyncContext` (cross-device
  remote control).
- `src/hooks/` — data/feature hooks (`useCredits`, `usePoints`,
  `useNotifications`, `useWorkoutPlans`, `useTTCData`, `useAssessmentData`,
  `useAdminAuth`, `useDevBypass`, etc.).
- `src/integrations/supabase/` — `client.ts` (auto-generated; do not hand-edit)
  and `types.ts` (generated DB types — `Database`). Import the client as
  `import { supabase } from "@/integrations/supabase/client"`.
- `src/services/` `src/lib/` `src/utils/` — domain logic (`wellnessAI`,
  `wellnessCoachEngine`, `birthBallRecommendations`, `faqSchemaDetector`,
  `imageUtils`).
- `src/data/` — static content data (recipes, birth-ball guide, Glow & Go
  video metadata).
- `@/` path alias → `src/` (configured in `vite.config.ts` + `tsconfig`).

### Routing & access control

- Public routes are bare. Auth-gated routes wrap with `<PrivateRoute>`;
  subscriber-gated routes additionally wrap with `<SubscriptionGuard>`.
  `<SubscriptionRefresher>` keeps subscription status fresh app-wide.
- Admin is gated via `useAdminAuth` (DB role check). `/admin` is the content
  + blog control center.

## Supabase backend

- **Project ref:** `moxxceccaftkeuaowctw` (`*.supabase.co`). The anon
  publishable key is committed in `client.ts` (public by design; RLS enforces
  access). Never commit service-role keys.
- **Migrations:** `supabase/migrations/` (~97 files). Add schema changes as
  new timestamped migrations; don't edit old ones.
- **Edge Functions:** `supabase/functions/` (~51 functions) with shared code
  in `_shared/`. JWT verification per function is declared in
  `supabase/config.toml` (`verify_jwt`). Functions cover payments
  (`create-checkout`, `stripe-webhook`, `customer-portal`,
  `purchase-credits`, `monthly-subscriber-credits`), email
  (`send-*-email`, transactional/lifecycle/unsubscribe), push
  (`send-push-*`), AI (`ai-wellness-chat`, `generate-blog-post`,
  `ai-edit-blog`, `analyze-*`, `detect-food`, `text-to-speech*`), and
  content (`serve-rss`, `generate-sitemap`, `publish-scheduled-blogs`,
  `serve-blog-markdown`).
- **Cron:** scheduled jobs are SQL setup files at the repo root of
  `supabase/` (`setup-*-cron.sql`) — blog scheduler, daily/birth-ball
  reminders, monthly credits, push notifications.
- **This remote env cannot reach supabase.co** (network allowlist). Generate
  SQL/migrations and hand them to the user to run via the Supabase SQL
  Editor / CLI; don't attempt live DB calls.

## Deploy / hosting

- Hosted via Lovable publish; custom domain catalystmomofficial.com.
- `vercel.json` rewrites `/rss.xml` and `/sitemap.xml` to the Supabase edge
  functions (`serve-rss`, `generate-sitemap`) with cache headers — keep these
  in sync if function names change.

## Content creation rules (IMPORTANT — user mandate)

**Always apply the `information-gain-prompt` skill
(`.agents/skills/information-gain-prompt/SKILL.md`) when creating or updating
any content** (blog posts, landing copy, social posts). Before delivering
content: identify what is generic vs unique, maximize information gain
(specific numbers, contrarian takes, process details, Catalyst Mom-specific
context), and give the user a short list of questions only they can answer
to add first-hand experience. Never fabricate first-hand stories or fake
data — real experience must come from the user.

## Blog pipeline

- Posts live in the Supabase `blogs` table (RLS: admin-only writes; anon
  key cannot insert). Content is sanitized HTML rendered with DOMPurify.
- Source of truth for seeded posts: `scripts/seed-blog-drafts.mjs`.
  - `--sql` → INSERT seed (skips existing slugs)
  - `--update-sql` → UPDATEs that only touch `status='draft'` rows and
    never overwrite `featured_image_url`
- The user runs generated SQL via the Supabase SQL Editor (this remote env
  cannot reach supabase.co — network allowlist).
- Drafts are reviewed/published at `/admin`. Publishing triggers subscriber
  notification emails (`send-blog-notification`). Scheduled posts go live via
  the `publish-scheduled-blogs` function + blog-scheduler cron.
- Blog categories (tags used by the filter): pregnancy, postpartum, ttc,
  wellness, nutrition, fitness.
- Question-style H3 headings get auto-detected into FAQ structured data
  (`src/utils/faqSchemaDetector.ts`).
- Featured images: 1200×630, subject centered (all slots use object-cover).
  Prefer uploads to the `blog-images` bucket (the app's image optimizer
  only transforms Supabase-storage and Unsplash URLs).

## SEO conventions

- Titles ≤ 60 chars, keyword first. Meta descriptions 120–160 chars.
- Per-page metadata uses `react-helmet-async`; org-level JSON-LD lives in
  `src/App.tsx`. SEO helper components live in `src/components/seo/`.
- The admin SEO analyzer's "tag keyword not found" check is outdated
  (it treats category tags as keywords) — ignore it.
- Keyword research and clusters: `docs/seo/keyword-research-2026-06.md`.
  Information-gain question bank: `docs/seo/information-gain-questions.md`.
- SEO skill suite installed at `.agents/skills/seo*` (claude-seo) and
  `.agents/skills/distribb` (requires DISTRIBB_API_KEY, not yet set).

## Conventions & gotchas

- Match the surrounding code's style; use the `@/` alias for imports.
- `src/integrations/supabase/client.ts` and `types.ts` are generated — edit
  the schema/migrations instead and regenerate types.
- Keep secrets out of the repo. Client-exposed env vars use the `VITE_` prefix
  (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PROJECT_ID`,
  `VITE_SUPABASE_PUBLISHABLE_KEY`); anything else belongs in Supabase function
  secrets, not the frontend.
- When adding a public marketing page, also add its route to the prerender
  allowlist in `scripts/prerender.mjs`.
- Medical/health content must stay evidence-based and carry appropriate
  disclaimers (`/medical-disclaimer`); never fabricate clinical claims.
