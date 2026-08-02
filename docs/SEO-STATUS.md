# SEO Status — Catalyst Mom

**Last updated:** 2026-08-02 (merged in GSC findings from a 2026-07-26 check)
**Purpose:** Single source of truth for SEO/technical status on catalystmomofficial.com. Update this file in place — whichever session (chat or Claude Code) makes or verifies a change edits this doc, so status isn't re-derived from scratch every time. Only mark something ✅ if it was independently verified (curl, direct fetch, GSC, or reading the actual committed code), not just reported as shipped.

---

## ✅ Confirmed fixed (independently verified)

- **Blog post prerendering** — root cause was `fetchBlogSlugs()` in `scripts/prerender.mjs` reading the Supabase key only from env; `.env` is gitignored, so on Lovable's GitHub build the key was undefined and **every** post silently fell back to serving the homepage's HTML. Fixed by hardcoding the committed **public anon key** as a fallback (commit `f96f16b`). **Verified live** via direct fetch of `/blog/self-care-ideas-busy-moms`: unique title, self-referencing canonical, `meta-robots: index, follow`, full article body, working internal links to other posts.
- **Blog/post canonicals** — code was always correct (`https://catalystmomofficial.com/blog/${slug}`). The "wrong canonical" was a symptom of the prerender fallback above and self-resolved once posts serve their own HTML.
- **`/contact` and `/medical-disclaimer` prerendering** — were missing from the prerender route list, so they served the homepage's HTML (the keyword-cannibalization report's real cause). Added to `STATIC_ROUTES` (commit `bd6c699`).
- **Lovable badge** — `gptengineer.js` removed from `index.html`; badge re-injected at publish, so a CSS hide rule was also added (commits `169a39f`, `7dc48ec`). Verify after each Lovable rebuild; guaranteed removal is via Lovable's own badge setting (may require plan upgrade).
- **Broken assessment link in blog CTAs** — `generate-blog-post`'s system prompt hardcoded a link to `catalystmomofficial.com/assessment`, which has never existed as a route (404), and always said "postpartum assessment" regardless of the post's actual category. Fixed the prompt to link to the real assessment (`catalystmom.online`, stage-matched: `/postpartum-assessment`, `/pregnancy-assessment`, `/ttc-assessment`, or the root for multi-stage content). Added a `vercel.json` redirect (`/assessment` → `https://catalystmom.online`, 301) so already-published posts carrying the old broken link fix themselves with no per-row editing. See the "real assessment lives at catalystmom.online" section in `CLAUDE.md` for the full picture (why the in-app `/questionnaire` and `/assessment-results` are NOT the real funnel).
- **Sitemap protected-route removal — re-confirmed holding.** After the earlier regression (see log), a 2026-07-26 direct fetch/GSC check confirmed `/meal-plan`, `/workout-plan`, `/programs/glow-and-go` are absent again and it's held since.
- **9 new content pages (2026-07-22)** confirmed indexed with zero issues via GSC's `check_indexing_issues` (2026-07-26): `/postpartum-body-changes-what-nobody-tells-you`, `/c-section-prep-checklist`, `/stop-breastfeeding-without-guilt`, `/exhausted-mom-sleep-troubleshooting`, `/baby-tracking-anxiety`, `/honest-pregnancy-truths`, `/postpartum-freezer-meal-prep`, `/build-your-village`, `/baby-allergen-tracker`, plus the `/guides` index. Good direct hits on the postpartum/pregnancy pillars. Note: these are root-level URLs (e.g. `/c-section-prep-checklist`), a second content pattern alongside `/blog/*` posts — not a problem, just worth knowing when reasoning about the sitemap/prerender route lists.

## 🔴 Known issues

- **`/research` had a real duplicate-content problem — diagnosed and fixed in code 2026-08-02, needs live re-verification.** GSC's `inspect_url_enhanced` (2026-07-26) returned `coverage_state: "Duplicate without user-selected canonical"`: Google was crawling `www.catalystmomofficial.com/research` and `catalystmomofficial.com/research` as separate pages and picking a canonical itself. Traced the cause: the page's canonical tag is actually correct (`SEO.tsx`'s fallback hardcodes the non-www absolute URL, and `/research` is in the prerender list) — but there was **no host-level redirect** forcing `www` → non-www, so if both hostnames really do serve this Vercel deployment, Google can find the same content under both regardless of what the tag says. Added a host-based redirect in `vercel.json` (`www.catalystmomofficial.com/*` → `https://catalystmomofficial.com/*`, 301) using Vercel's `has: [{type: "host", ...}]` matcher. **This needs a live GSC recheck after the next deploy** to confirm the duplicate-content flag clears — I can't verify live from this session (see operational notes).
- **Sitemap warnings increased to 12** (from 7) as of the 2026-07-26 GSC read, despite the protected-route fix holding. Cause unconfirmed — the API only exposes a count, not detail. Likely related to the 10 newly-added root-level content pages; check the Search Console UI directly for specifics.
- **Individual blog post URLs (`/blog/*`) are still not in the sitemap** — only `/blog` (the index) is listed. Internal "related articles" links give Google a crawl path regardless, but sitemap inclusion is still standard best practice and more efficient. Ideally auto-generated on publish, not hand-maintained.

## 🟡 Needs a Supabase edge-function redeploy (NOT a code fix)

- **`generate-sitemap`** — `/sitemap.xml` is rewritten (via `vercel.json`) to this Supabase edge function, NOT the static `public/sitemap.xml`. The committed code is **clean**: 13 public-only static pages (no `/meal-plan`, `/workout-plan`, or `/programs/glow-and-go`) **plus every published blog post**. **Re-confirmed live and holding as of 2026-07-26** (see log) after an earlier regression.
  - **Important deploy note:** Supabase edge functions deploy separately from git/Lovable. If the *live* sitemap is ever stale again, redeploy: **Supabase dashboard → Edge Functions → `generate-sitemap`**, or `supabase functions deploy generate-sitemap`. Then re-verify with `curl https://catalystmomofficial.com/sitemap.xml`.
- **Dead file:** `public/sitemap.xml` is overridden by the `vercel.json` rewrite and never served. It's stale and confusing (different contents from the live function). Safe to delete to prevent future drift — flagged, not yet removed.
- **`generate-blog-post`'s fixed CTA prompt** is also a Supabase edge function — the code fix in this repo won't take effect on newly-generated posts until it's redeployed the same way (**Supabase dashboard → Edge Functions → `generate-blog-post`**, or `supabase functions deploy generate-blog-post`). The `vercel.json` redirects (assessment link, www→non-www) do NOT need this — they're Vercel-level and go live on the next Vercel deploy.

## ⏳ Pending / unconfirmed

- **Re-verify `/research`'s canonical/duplicate-content status via GSC** after the www→non-www redirect above goes live — this is the direct follow-up to confirm the fix actually worked, not just that it's reasoned-through.
- GSC-side confirmation that `/blog/*` posts specifically are indexed (as opposed to the 9 root-level pages, which are confirmed) — not yet spot-checked via GSC.
- Confirm gated routes (`/dashboard`, `/meal-plan`, `/progress`, `/workouts`) aren't exposing logged-in content to Googlebot. (They're excluded from prerender via a comment in `scripts/prerender.mjs`, and absent from the sitemap function — but verify live.)
- Cause of the sitemap-warnings count rising to 12 (see above).

## Operational notes (for whoever picks this up next)

- **This cloud (Claude Code on web) session cannot reach the public internet** — YouTube, live site URLs, Supabase, Google are all blocked by the environment's network policy. It can read/verify the repo code and push to `main`. Live-URL verification, GSC checks, and Supabase function deploys must be done from a session/machine with network access (the Mac Claude Code session, the GSC-connected session, or a browser).
- The GSC MCP connector has been intermittently unreachable in the past (`tool not found`, timeouts) but was working as of the 2026-07-26 check. If it drops again, a manual reconnect is needed — retrying alone doesn't fix it.
- Repeated fetches of the same URL can return a stale cached copy even with cache-busting params. `curl` from a real machine is the reliable tie-breaker.

---

## Roadmap

### Phase 1 — Foundation
1. Re-verify `/research`'s duplicate-content status via GSC after the www→non-www redirect deploys.
2. Delete the dead `public/sitemap.xml` to end the dual-source confusion.
3. Track down the sitemap-warnings count (7 → 12).
4. Spot-check a `/blog/*` post via GSC (root-level pages are confirmed indexed; blog posts specifically aren't yet).
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
| 2026-07-26 | `/research` Google crawl/canonical status | GSC `inspect_url_enhanced` | Recrawled 2026-07-13 11:48, but flagged `Duplicate without user-selected canonical` vs. the www version |
| 2026-07-26 | Sitemap protected-route regression, recheck | Direct fetch, cache-busted | ✅ Protected routes still absent — fix held |
| 2026-07-26 | 9 new root-level content pages | GSC `check_indexing_issues` | ✅ All confirmed indexed, zero issues |
| 2026-08-02 | `/research` duplicate-content root cause | Read `SEO.tsx`, `Research.tsx`, `scripts/prerender.mjs`, `vercel.json` | Canonical tag itself is correct; no www→non-www host redirect existed. Added one (`vercel.json`) — pending live re-verification |
