# Catalyst Mom — Project Notes for Claude

React + Vite + Tailwind app (built in Lovable) with a Supabase backend.
Production: catalystmomofficial.com. Audience: moms 25–40 (TTC, pregnancy,
postpartum), plain language, warm but evidence-based tone.

## Content creation rules (IMPORTANT — user mandate)

**Always apply the `information-gain-prompt` skill
(`.agents/skills/information-gain-prompt/SKILL.md`) when creating or updating
any content** (blog posts, landing copy, social posts). Before delivering
content: identify what is generic vs unique, maximize information gain
(specific numbers, contrarian takes, process details, Catalyst Mom-specific
context), and give the user a short list of questions only they can answer
to add first-hand experience. Never fabricate first-hand stories or fake
data — real experience must come from the user.

**Experience-led SEO (standing rule):** For blog posts, YouTube scripts, and
long-form content, also follow `docs/seo/experience-led-seo.md`. In 2026 a
real first-hand story is a Google ranking factor (E-E-A-T "Experience" + the
Helpful Content system; AI-spam is being demoted). For every piece: (1) reject
any generic title a competitor could also use, (2) re-anchor it on an
experience only Catalyst Mom has, (3) anchor it in a real number or story the
brand can stand behind, (4) flag anything needing first-hand input instead of
fabricating it.

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
  notification emails.
- Blog categories (tags used by the filter): pregnancy, postpartum, ttc,
  wellness, nutrition, fitness.
- Question-style H3 headings get auto-detected into FAQ structured data
  (`src/utils/faqSchemaDetector.ts`).
- Featured images: 1200×630, subject centered (all slots use object-cover).
  Prefer uploads to the `blog-images` bucket (the app's image optimizer
  only transforms Supabase-storage and Unsplash URLs).

## The real assessment lives at catalystmom.online (IMPORTANT — read before touching "assessment" anything)

**catalystmom.online is the one real assessment / lead-magnet funnel.** It's a
separate Next.js app in a separate repo (`v0-catalyst-mom-lead`), deployed on
Vercel, with its own stage-specific pages:
- `https://catalystmom.online/postpartum-assessment`
- `https://catalystmom.online/pregnancy-assessment`
- `https://catalystmom.online/ttc-assessment`
- `https://catalystmom.online` (root) when a piece of content spans more than
  one stage, or the stage is unknown.

**Everything that looks like an "assessment" inside *this* app is legacy and
not the real thing:** the `/questionnaire` and `/assessment-results` routes,
`AssessmentPopup`, `useAssessmentData`, `PlanPreview`'s "Start My Journey Now"
(a demo stub - it just shows a toast), and the `vo-assessment-webhook`
Supabase function. These were built by mistake at some point and are not
wired to real leads. **Do not build on, "fix," or extend them as if they
matter** - the user has explicitly said to leave that code alone. If asked to
remove it, that's a real, careful, staged job (it's referenced from ~15
files including the home page) - don't attempt it in one pass.

**Blog CTAs and any assessment link must point to catalystmom.online**, using
the stage-matched path above. `supabase/functions/generate-blog-post/index.ts`
enforces this in its system prompt (fixed after previously hardcoding a
broken `https://catalystmomofficial.com/assessment` link into every post,
regardless of topic - that route has never existed).

Because already-published posts can't be bulk-edited, `vercel.json` has a
redirect: `/assessment` → `https://catalystmom.online` (301). That's the
safety net for old posts still carrying the broken link; new posts should
never need it since the generator now writes the correct stage URL directly.

## SEO conventions

- Titles ≤ 60 chars, keyword first. Meta descriptions 120–160 chars.
- The admin SEO analyzer's "tag keyword not found" check is outdated
  (it treats category tags as keywords) — ignore it.
- Keyword research and clusters: `docs/seo/keyword-research-2026-06.md`.
- SEO skill suite installed at `.agents/skills/seo*` (claude-seo) and
  `.agents/skills/distribb` (requires DISTRIBB_API_KEY, not yet set).
