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

## SEO conventions

- Titles ≤ 60 chars, keyword first. Meta descriptions 120–160 chars.
- The admin SEO analyzer's "tag keyword not found" check is outdated
  (it treats category tags as keywords) — ignore it.
- Keyword research and clusters: `docs/seo/keyword-research-2026-06.md`.
- SEO skill suite installed at `.agents/skills/seo*` (claude-seo) and
  `.agents/skills/distribb` (requires DISTRIBB_API_KEY, not yet set).
