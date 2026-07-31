# SEO Status — Catalyst Mom

**Last updated:** 2026-07-31
**Purpose:** Single source of truth for SEO/technical status on catalystmomofficial.com. Update this file in place — whichever session (chat or Claude Code) makes or verifies a change edits this doc, so status isn't re-derived from scratch every time. Only mark something ✅ if it was independently verified (curl, direct fetch, GSC, or reading the actual committed code), not just reported as shipped.

---

## ✅ Confirmed fixed (independently verified)

- **Blog post prerendering** — root cause was `fetchBlogSlugs()` in `scripts/prerender.mjs` reading the Supabase key only from env; `.env` is gitignored, so on Lovable's GitHub build the key was undefined and **every** post silently fell back to serving the homepage's HTML. Fixed by hardcoding the committed **public anon key** as a fallback (commit `f96f16b`). **Verified live** via direct fetch of `/blog/self-care-ideas-busy-moms`: unique title, self-referencing canonical, `meta-robots: index, follow`, full article body, working internal links to other posts.
- **Blog/post canonicals** — code was always correct (`https://catalystmomofficial.com/blog/${slug}`). The "wrong canonical" was a symptom of the prerender fallback above and self-resolved once posts serve their own HTML.
- **`/contact` and `/medical-disclaimer` prerendering** — were missing from the prerender route list, so they served the homepage's HTML (the keyword-cannibalization report's real cause). Added to `STATIC_ROUTES` (commit `bd6c699`).
- **Lovable badge** — `gptengineer.js` removed from `index.html`; badge re-injected at publish, so a CSS hide rule was also added (commits `169a39f`, `7dc48ec`). Verify after each Lovable rebuild; guaranteed removal is via Lovable's own badge setting (may require plan upgrade).
- **Broken assessment link in blog CTAs** — `generate-blog-post`'s system prompt hardcoded a link to `catalystmomofficial.com/assessment`, which has never existed as a route (404), and always said "postpartum assessment" regardless of the post's actual category. Fixed the prompt to link to the real assessment (`catalystmom.online`, stage-matched: `/postpartum-assessment`, `/pregnancy-assessment`, `/ttc-assessment`, or the root for multi-stage content). Added a `vercel.json` redirect (`/assessment` → `https://catalystmom.online`, 301) so already-published posts carrying the old broken link fix themselves with no per-row editing. See the "real assessment lives at catalystmom.online" section in `CLAUDE.md` for the full picture (why the in-app `/questionnaire` and `/assessment-results` are NOT the real funnel).

## 🟡 Needs a Supabase edge-function redeploy (NOT a code fix)

- **Live sitemap** — `/sitemap.xml` is rewritten (via `vercel.json`) to the **`generate-sitemap` Supabase edge function**, NOT the static `public/sitemap.xml`. The committed edge-function code is **clean**: 13 public-only static pages (no `/meal-plan`, `/workout-plan`, or `/programs/glow-and-go`) **plus every published blog post**.
  - A prior report of "21 URLs with protected routes back" appears to be a **miscount**: 13 static + ~8 blog posts = 21. The rise is blog posts entering the sitemap (correct), not protected routes returning. No sitemap file in the repo contains protected routes, and the rebase on `f96f16b` touched only `prerender.mjs`.
  - **Important deploy note:** Supabase edge functions deploy separately from git/Lovable. If the *live* sitemap is ever stale (missing blog URLs or showing old routes), redeploy: **Supabase dashboard → Edge Functions → `generate-sitemap`**, or `supabase functions deploy generate-sitemap`. Then re-verify with `curl https://catalystmomofficial.com/sitemap.xml`.
- **Dead file:** `public/sitemap.xml` is overridden by the `vercel.json` rewrite and never served. It's stale and confusing (different contents from the live function). Safe to delete to prevent future drift — flagged, not yet removed.
- **`generate-blog-post`'s fixed CTA prompt** (see above) is also a Supabase edge function — the code fix in this repo won't take effect on newly-generated posts until it's redeployed the same way (**Supabase dashboard → Edge Functions → `generate-blog-post`**, or `supabase functions deploy generate-blog-post`). The `vercel.json` redirect for already-published posts does NOT need this — it's a Vercel-level fix and goes live on the next Vercel deploy.

## ⏳ Pending / unconfirmed

- Google recrawl of `/research` (retargeted to "Evidence-Based Mom Resources") — awaiting a fresh GSC check once the connector is back.
- GSC-side confirmation that blog posts are being indexed — blocked; GSC connector down.
- Confirm gated routes (`/dashboard`, `/meal-plan`, `/progress`, `/workouts`) aren't exposing logged-in content to Googlebot. (They're excluded from prerender via a comment in `scripts/prerender.mjs`, and absent from the sitemap function — but verify live.)

## Operational notes (for whoever picks this up next)

- **This cloud (Claude Code on web) session cannot reach the public internet** — YouTube, live site URLs, Supabase, Google are all blocked by the environment's network policy. It can read/verify the repo code and push to `main`. Live-URL verification and Supabase function deploys must be done from a session/machine with network access (the Mac Claude Code session or a browser).
- Repeated fetches of the same URL can return a stale cached copy even with cache-busting params. `curl` from a real machine is the reliable tie-breaker.

---

## Roadmap

### Phase 1 — Foundation
1. Redeploy `generate-sitemap` edge function to Supabase; re-verify `/sitemap.xml` via curl (expect 13 static + all published blog URLs, no protected routes).
2. Delete the dead `public/sitemap.xml` to end the dual-source confusion.
3. Reconnect the GSC connector.
4. Once `/research` and blog posts are confirmed live, request indexing in the GSC UI.
5. Confirm gated routes aren't exposing content publicly.

### Phase 2 — Optimize existing signal (2–4 weeks)
1. Build `/research` into a content hub around "evidence-based mom resources".
2. Expand TTC copy on homepage/FAQ (existing faint "trying to conceive" signal).
3. Investigate any desktop vs. mobile performance gap once GSC is back.

### Phase 3 — Build topical authority (ongoing)
Four pillars, priority order by existing signal:
1. **Evidence-based mom resources** (flagship — ties to `/research`)
2. **TTC**
3. **Postpartum** (ties to the Core Restore / Postpartum Reset work)
4. **Pregnancy**

Note: these are YMYL (health-adjacent) categories dominated by large established sites. Technical fixes get the site into the race; competitive rankings take sustained publishing on top of this foundation.

---

## Verification log

| Date | What | How verified | Result |
|---|---|---|---|
| 2026-07-29 | `/blog/self-care-ideas-busy-moms` | Direct fetch, no JS | ✅ Unique title, correct canonical, full article, internal links |
| 2026-07-29 | `generate-sitemap` edge function code | Read committed source | ✅ Clean: 13 public pages + all published blog posts; no protected routes |
| 2026-07-29 | `/sitemap.xml` routing | Read `vercel.json` | ℹ️ Rewrites to `generate-sitemap` edge function; `public/sitemap.xml` is dead |
| 2026-07-29 | `prerender.mjs` blog-slug fallback | Read committed source | ✅ Public anon key hardcoded as fallback (`f96f16b`) |
