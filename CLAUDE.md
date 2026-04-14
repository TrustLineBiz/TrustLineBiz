# TrustLineBiz.com — Project Playbook

This file is the single source of truth for autonomous Claude Code sessions.
Read this before touching anything. It prevents re-auditing on every session.

---

## Autonomous Skill Selection & Token Efficiency

When given any task, Claude Code should:
1. Scan the `/skills` directory automatically
2. Identify which skill(s) are most relevant to the task
3. Read the `SKILL.md` file(s) for those skills
4. Execute the task using the best available skill without being asked
5. If multiple skills apply, combine them intelligently
6. Never ask permission to use a skill — just use it and state which one was used

Token efficiency rules:
- Always read only the specific `SKILL.md` files needed, never scan all skills unnecessarily
- Reuse outputs from earlier in the session instead of regenerating
- Break large tasks into focused subtasks rather than one massive prompt
- Use `/compact` when context gets large
- Prefer targeted file edits over rewriting entire files
- Cache repeated context — do not re-read files already read in this session
- State which skill was used and why in one line, then immediately execute — no lengthy preamble
- If a task can be done without a skill, do it directly without loading any skill files

This applies to all tasks including: lead research, content writing, ad creation, SEO, design, document creation, outreach, and development work.

---

## Installed Skills Directory

Quick-reference for autonomous skill selection. Path prefix: `skills/`

### Paid Advertising — `skills/claude-ads/claude-ads-main/`

| Skill | Path | What it does |
|-------|------|-------------|
| `ads` | `ads/` | **Orchestrator.** Full multi-platform ad audit (250+ checks) across Google, Meta, YouTube, LinkedIn, TikTok, Microsoft, Apple — delegates to all sub-skills below |
| `ads-audit` | `skills/ads-audit/` | Parallel multi-platform account audit; generates a health score (0–100) per platform and an aggregate score |
| `ads-google` | `skills/ads-google/` | Google Ads deep analysis — 80 checks across Search, Performance Max, Display, YouTube, and Demand Gen |
| `ads-meta` | `skills/ads-meta/` | Meta Ads deep analysis — 50 checks for Facebook/Instagram, Pixel/CAPI health, creative fatigue, Advantage+ |
| `ads-tiktok` | `skills/ads-tiktok/` | TikTok Ads deep analysis — 28 checks, Smart+ campaigns, TikTok Shop, Spark Ads, safe zone compliance |
| `ads-linkedin` | `skills/ads-linkedin/` | LinkedIn Ads deep analysis — 27 B2B checks including Thought Leader Ads, ABM, and predictive audiences |
| `ads-microsoft` | `skills/ads-microsoft/` | Microsoft/Bing Ads analysis — 24 checks, Google import validation, Copilot ad integration |
| `ads-apple` | `skills/ads-apple/` | Apple Ads (Search Ads) analysis for iOS app advertisers — CPPs, MMP attribution, TAP coverage, bid health |
| `ads-youtube` | `skills/ads-youtube/` | YouTube Ads analysis — all video formats, Demand Gen, Shorts, CTV, VAC→Demand Gen migration |
| `ads-creative` | `skills/ads-creative/` | Cross-platform creative quality audit — detects fatigue, format diversity gaps, platform-native compliance |
| `ads-landing` | `skills/ads-landing/` | Landing page quality for ad campaigns — message match, speed, mobile UX, trust signals, CRO |
| `ads-budget` | `skills/ads-budget/` | Budget allocation and bidding strategy review — 70/20/10 rule, 3× Kill Rule, scaling readiness |
| `ads-math` | `skills/ads-math/` | PPC financial calculator — CPA/ROAS/CPL, break-even analysis, budget forecasting, LTV:CAC, MER |
| `ads-competitor` | `skills/ads-competitor/` | Competitor ad intelligence — copy themes, estimated spend, keyword gaps, creative strategy across all platforms |
| `ads-plan` | `skills/ads-plan/` | Strategic ad plan — platform selection, campaign architecture, budget phasing, creative roadmap |
| `ads-test` | `skills/ads-test/` | A/B test design — hypothesis framework, statistical significance calculator, sample size and duration estimator |
| `ads-dna` | `skills/ads-dna/` | Brand DNA extractor — scans a URL and outputs `brand-profile.json` (colors, tone, typography, imagery) |
| `ads-create` | `skills/ads-create/` | Campaign brief generator — reads `brand-profile.json` and outputs structured `campaign-brief.md` |
| `ads-generate` | `skills/ads-generate/` | AI ad image generator — reads `campaign-brief.md` and produces platform-sized creatives via banana-claude |
| `ads-photoshoot` | `skills/ads-photoshoot/` | AI product photography — generates 5 styles (Studio, Floating, Ingredient, In Use, Lifestyle) via banana-claude |

### Lead Generation & Outreach — `skills/`

| Skill | What it does |
|-------|-------------|
| `lead-research-assistant` | Lead research and prospect profiling |
| `composio-skills/apollo-automation` | Apollo.io automation for prospect sourcing and sequencing |
| `composio-skills/instantly-automation` | Instantly.ai automation for cold email campaigns |
| `composio-skills/phantombuster-automation` | PhantomBuster automation for LinkedIn/web scraping |
| `composio-skills/hunter-automation` | Hunter.io automation for email finding and verification |
| `composio-skills/lemlist-automation` | Lemlist automation for personalized outreach sequences |

### Ads & Marketing — `skills/`

| Skill | What it does |
|-------|-------------|
| `competitive-ads-extractor` | Extracts and analyzes competitor ad creative from public sources |
| `content-research-writer` | Researches a topic and writes long-form content |
| `composio-skills/facebook-automation` | Facebook page/ads automation via Composio |
| `composio-skills/googleads-automation` | Google Ads automation via Composio |
| `composio-skills/metaads-automation` | Meta Ads automation via Composio |
| `twitter-algorithm-optimizer` | Optimizes content for Twitter/X algorithmic reach |

### SEO & Analytics — `skills/`

| Skill | What it does |
|-------|-------------|
| `composio-skills/google-search-console-automation` | GSC data pulls, indexing checks, query analysis |
| `composio-skills/semrush-automation` | SEMrush automation for keyword research and site audits |
| `composio-skills/ahrefs-automation` | Ahrefs automation for backlink analysis and keyword tracking |

### Design & Content — `skills/`

| Skill | What it does |
|-------|-------------|
| `canvas-design` | Canvas-based design generation with bundled font library (80+ typefaces) |

### CRM & Productivity — `skills/`

| Skill | What it does |
|-------|-------------|
| `composio-skills/capsule-crm-automation` | Capsule CRM automation for contact and deal management |
| `composio-skills/attio-automation` | Attio CRM automation for pipeline and relationship management |

### Documents — `skills/document-skills/`

| Skill | What it does |
|-------|-------------|
| `docx` | Create and edit Word documents with full OOXML schema support |
| `pdf` | Read, fill, annotate, and generate PDFs |
| `pptx` | Build PowerPoint presentations from HTML or structured data |
| `xlsx` | Create and manipulate Excel spreadsheets |

### Developer Tools — `skills/`

| Skill | What it does |
|-------|-------------|
| `skill-creator` | Scaffolds new skills with proper SKILL.md structure and packaging scripts |
| `webapp-testing` | Automated browser/UI testing with Playwright-style scripting |
| `mcp-builder` | Builds, evaluates, and deploys MCP servers (Node or Python) |

---

## Stack

| Layer       | Technology                             |
|-------------|----------------------------------------|
| Frontend    | Vanilla HTML + CSS + JS (no framework) |
| Hosting     | Netlify (static site)                  |
| Forms       | Netlify Forms (`data-netlify="true"`)  |
| Database    | None — lead-finder uses `localStorage` |
| Auth        | None                                   |
| Build step  | None — deploy root directory as-is     |
| DNS         | trustlinebiz.com → Netlify             |
| Dev domain  | trustlinebiz.netlify.app               |

---

## File Inventory

```
trustlinebiz/
├── index.html          # Public homepage + lead capture form (PRIMARY)
├── lead-finder.html    # Internal CRM / pipeline tool (PRIVATE — noindex)
├── privacy.html        # Privacy policy
├── terms.html          # Terms & conditions
├── thank-you.html      # Post-form confirmation (redirected to after successful form submit)
├── 404.html            # Custom 404 error page (served by Netlify catch-all redirect)
├── favicon.svg         # SVG favicon — TL gold square, works in all modern browsers
├── netlify.toml        # Netlify config: security headers, cache, redirects
├── robots.txt          # SEO: disallows lead-finder, declares sitemap
├── sitemap.xml         # SEO: public pages only
├── .gitignore          # Git ignore rules
├── CLAUDE.md           # This file — project playbook
└── skills/             # Reusable runbooks for common tasks
    ├── README.md
    ├── copywriting.md
    ├── seo.md
    ├── design-tokens.md
    ├── forms.md
    ├── security.md
    └── deploy.md
```

---

## Design System Tokens

All four HTML files share the same CSS custom properties. Do NOT introduce new
color values — always reference existing variables.

```css
--navy:       #0d1f3c   /* Primary brand blue */
--navy-light: #162d55   /* Slightly lighter navy */
--navy-dark:  #081426   /* Darkest navy — nav, footer, hero bg */
--gold:       #c9a84c   /* Primary accent */
--gold-light: #e0be72   /* Gold on hover */
--gold-dark:  #a8863a   /* Gold links, badges */
--white:      #ffffff
--off-white:  #f5f7fa   /* Section backgrounds */
--gray:       #8a95a3   /* Muted text */
--text:       #1a2940   /* Body text */
--border:     #dde3ea   /* Light borders */
```

**Note:** `lead-finder.html` uses shortened aliases (`--navy-l`, `--navy-d`,
`--gold-l`, `--gold-d`, `--bg`, `--card`, `--card2`). These are local to that
file only — do not mix naming conventions across files.

---

## Critical Architecture Notes

### Forms (READ THIS — EASY TO BREAK)
The homepage form (`#quoteForm`) uses **Netlify Forms** with AJAX submission.

Key requirements for it to work:
1. `data-netlify="true"` on the `<form>` tag (Netlify detects this at deploy time)
2. `<input type="hidden" name="form-name" value="lead-capture" />` must be present
3. `data-netlify-honeypot="bot-field"` + the hidden honeypot input must exist
4. The JS `submit` handler must call `fetch('/', { method: 'POST', ... })` with
   `new URLSearchParams(new FormData(form))` as the body — NOT just show a
   success state via setTimeout. The setTimeout approach silently drops all leads.

**DO NOT** remove the `e.preventDefault()` (would cause hard page reload).
**DO NOT** replace the `fetch()` with a timeout again (that was the original bug).

### Lead Finder
- Stores all data in `localStorage` key `tl_leads`
- Data format: array of lead objects (see `submitLead()` in lead-finder.html)
- `esc()` function must escape `& < > " '` — do not simplify it
- `safeHref()` function must be used for all user-supplied URLs
- Keyboard shortcuts: `n` = new lead, `p` = pipeline, `d` = dashboard,
  `a` = all leads, `Escape` = close modal
- CSV export available in All Leads tab → "Export CSV" button

---

## Deployment

This is a static site. Deploying = pushing to git (if Netlify is connected to
the repo) or dragging the folder into the Netlify dashboard.

```bash
# Check what changed
git diff

# Deploy everything (if git-connected to Netlify)
git add -A && git commit -m "your message" && git push

# Or manually: drag /trustlinebiz folder into Netlify dashboard
```

Netlify reads `netlify.toml` automatically at deploy time.

---

## Common Tasks

### Update homepage copy
1. Edit the text in `index.html` — do not touch the `<style>` block
2. Sections are clearly labeled with `<!-- ═══ SECTION N: ... ═══ -->` comments
3. See `skills/copywriting.md` for copy guidelines

### Add a new form field
1. Add the `<input>` with a `name=""` attribute inside the form in `index.html`
2. Add the corresponding validation entry in the `fields` object in the JS
3. Netlify will automatically capture the new field — no backend changes needed

### Update security headers
Edit `netlify.toml` → the `[[headers]]` block for `"/*"`

### Update SEO metadata
- Homepage: edit the `<head>` block in `index.html`
- Sitemap: edit `sitemap.xml`
- Robots: edit `robots.txt`

### Add a new public page
1. Create the `.html` file
2. Add to `sitemap.xml`
3. Ensure it has canonical, og, and description meta tags

### Change brand colors
Update `:root` CSS variables in ALL four HTML files (index, lead-finder,
privacy, terms). They are NOT shared via an external file yet.

---

## Security Notes

- **No API keys** exist in this codebase — if you add any, store them as
  Netlify environment variables and access via a Netlify Function, never inline
- **CSP** is set via `netlify.toml` — currently allows `unsafe-inline` because
  there is no build step. If a build step is added, move to nonces/hashes.
- **Honeypot** is wired on the main form (`bot-field`) — do not remove it
- **Lead finder** is blocked from search indexing via `<meta name="robots">`
  and `robots.txt` — keep it that way
- **XSS** in lead-finder: all user data goes through `esc()` before innerHTML
  injection. All user-supplied URLs go through `safeHref()`. Do not bypass these.

---

## Infrastructure Changes

**Migrated April 14, 2026: Netlify → Cloudflare Pages + Web3Forms**

Netlify was dropped due to billing limits taking the site down.

| Layer | Before | After |
|-------|--------|-------|
| Hosting | Netlify (free tier) | Cloudflare Pages |
| Form submission | Netlify Forms (POST to `/`) | Web3Forms API (`https://api.web3forms.com/submit`) |
| Security headers | `netlify.toml` `[[headers]]` block | `_headers` file (Cloudflare Pages native) |
| Redirects | `netlify.toml` `[[redirects]]` block | `_redirects` file (Cloudflare Pages native) |
| Build config | `netlify.toml` | No config file needed — static site, root deploy |

### Web3Forms Details
- **Access key:** `f9f861ea-7483-421e-804b-da15dbeeb0df`
- **Account email:** `jm.02.contact@gmail.com`
- Submissions POST as JSON to `https://api.web3forms.com/submit`
- Hidden `<input name="access_key">` in form + key set in `doSubmit()` JS
- Honeypot field renamed from `bot-field` → `botcheck` (Web3Forms convention)
- On success: redirects to `/thank-you.html`
- On failure: shows inline error, re-enables submit button

### Files Changed
- `netlify.toml` — **deleted**
- `_headers` — **created** (security headers: X-Frame-Options, CSP-adjacent headers, X-Robots-Tag for lead-finder)
- `_redirects` — **created** (extensionless URLs + 404 fallback)
- `index.html` — form tag stripped of `data-netlify` attrs, `doSubmit()` rewritten for Web3Forms

### Current Blocker — SSL
Cloudflare Pages is connected to the GitHub repo and deploying successfully, but the custom domain (`trustlinebiz.com`) has an SSL/TLS issue preventing the live site from loading. The Cloudflare Pages deployment itself is healthy. Resolution requires correcting the SSL/TLS encryption mode in the Cloudflare dashboard (likely needs to be set to **Full** or **Full (Strict)** rather than Flexible) and/or verifying DNS records point correctly to Cloudflare Pages.

---

## Current Status & Next Steps

**As of: April 14, 2026**

---

### What Has Been Built and Deployed

#### Site (all pages — pending SSL resolution)

| File | Status | Notes |
|------|--------|-------|
| `index.html` | ✅ Built | Homepage + lead form, scheduling modal, Meta Pixel, Web3Forms |
| `thank-you.html` | ✅ Built | Jack intro card, What Happens Next, 15-min Cal.com button |
| `additional-info.html` | ✅ Built | Post-Meta-ad landing page — fires Lead pixel event on load |
| `privacy.html` | ✅ Built | Footer disclaimer, Pixel |
| `terms.html` | ✅ Built | Updated notice language, footer disclaimer |
| `404.html` | ✅ Built | On-brand error page, footer disclaimer |
| `favicon.svg` | ✅ Built | Gold TL square, all pages |

#### Lead Capture Form (index.html)
- **Web3Forms** submission — leads emailed to `jm.02.contact@gmail.com` on every submit
- Fields captured: Full Name, Business Name, Phone, Email, Estimated Credit Score, Credit Score (exact), Monthly Revenue, Prefer Text, Preferred Call Time, UTM params (source/medium/campaign/content)
- Honeypot bot filter active (`botcheck`)
- Form redirects to `/thank-you.html` on success

#### Scheduling Popup Modal (index.html)
- Intercepts form submit after validation passes
- **Today tab**: reads current EST time, shows 30-min slots with 15-min buffer, up to 4 hours ahead, 8AM–8PM EST window only
- **Another Day tab**: next 3 days as date pills → 30-min slots for that day, 8AM–8PM EST
- "Secure My Spot →" button: sets `preferredCallTime` hidden field, confirms for 1.5s, then submits
- "Skip scheduling" link: bypasses modal, submits directly
- `preferredCallTime` value is included in every Web3Forms submission

#### Meta Pixel Tracking
- **Pixel ID:** `1232015482337066`
- Installed on all 6 HTML pages
- Events firing:
  - `PageView` — all pages on load
  - `InitiateCheckout` — fires when user first focuses the lead form
  - `Lead` — fires on `thank-you.html` and `additional-info.html` load
- UTM hidden fields capture `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` from URL

#### Meta Ads (built and paused)
- **Meta Business Manager:** ✅ Created
- **Facebook Page:** ✅ Live — profile photo uploaded (`trustline-profile.png`)
- **Ad campaign:** ✅ Built and published — currently **paused** (pending SSL fix)
- **Instant Form:** ✅ Created with TCPA language — post-submit URL set to `https://trustlinebiz.com/additional-info`
- **Special Ad Category:** Credit set on campaign
- **Special Ad Audience:** Configured — Florida targeting, no age/gender/ZIP restrictions
- Ad creatives: `ad-creative-1.png` (pain), `ad-creative-2.png` (speed), `ad-creative-3.png` (trust)
- Strategy files: `meta-ads-strategy/` — full copy deck, budget plan, architecture, roadmap

#### Cal.com Booking Link
- **URL:** `https://cal.com/jack-mcgrath-gxkgbb/trustline-funding-consultation`
- **Status:** ✅ Verified — configured for 8AM–8PM EST, Mon–Sun
- Used on: `thank-you.html` → "Book Your 15-Minute Call →" and `additional-info.html` → "Book Your Call →"
- The scheduling modal on `index.html` is a separate in-page time picker — captures preferred call time via form field

#### Copy & Content State
- USP: **We never sell customer data** — one team, one conversation, your data stays with us forever
- Response time: **4 business hours, 8AM–8PM EST, 7 days a week**
- After-hours: followed up first thing next morning
- Funding range: **$5K–$20M+** across all pages
- Hero stats: $20M+ MAX FUNDING · 24–48h · 100+ Lenders · 2 min

---

### Meta Ads Account Setup Status

| Item | Status |
|------|--------|
| Meta Pixel installed | ✅ Done — ID `1232015482337066` |
| Pixel firing (PageView, Lead, InitiateCheckout) | ✅ Done |
| Ad creatives (3 images) | ✅ Done — polished and in repo root |
| Copy deck | ✅ Done — `meta-ads-strategy/AD-COPY.md` |
| Facebook Page + profile photo | ✅ Done — page live, `trustline-profile.png` uploaded |
| Meta Business Manager account | ✅ Done |
| Ad account created | ✅ Done |
| Special Ad Category: Credit set | ✅ Done |
| Campaign built and published | ✅ Done — **currently paused** pending SSL fix |
| Instant Form created (with TCPA language) | ✅ Done — post-submit → `/additional-info` |
| Special Ad Audience configured | ✅ Done — Florida, Special Ad Audience |
| Campaign unpaused and running | ⏸ Blocked — waiting on SSL resolution |

---

### What Still Needs to Be Done

#### Immediate — Current Blocker
- [ ] **Resolve SSL on Cloudflare** — site is down. In Cloudflare dashboard: check SSL/TLS encryption mode (set to **Full** or **Full (Strict)**). Verify DNS A/CNAME records point to Cloudflare Pages deployment. Once SSL is green, unpause the Meta campaign.

#### High Priority — After SSL Resolved
- [ ] **Unpause Meta campaign** — campaign is built, creatives uploaded, Instant Form live. Just needs site to be up, then set to Active.
- [ ] **Test full form flow end-to-end** — submit the form on the live site, confirm: (1) email arrives at `jm.02.contact@gmail.com`, (2) `preferredCallTime` is in the email, (3) UTM params pass through, (4) thank-you page loads, (5) Cal.com button works
- [ ] **Verify Pixel is firing** — Meta Pixel Helper Chrome extension on live site: confirm PageView fires on homepage, Lead fires on thank-you and additional-info pages

#### Medium Priority
- [ ] **Create `og-image.png`** (1200×630px) — navy background, TrustLine logo + tagline. Referenced in OG/Twitter meta tags but file doesn't exist. Affects link previews on social/SMS.
- [ ] **Fix git remote URL warning** — every push shows "repository moved". Fix: `git remote set-url origin https://github.com/TrustLineBiz/TrustLineBiz.git`

#### Lower Priority / Future
- [ ] **Lead Finder integration** — `lead-finder.html` stores leads in `localStorage` only. As volume grows, consider Web3Forms → Zapier → CRM pipeline.
- [ ] **A/B test scheduling modal** — after 50+ submissions, test modal vs skip conversion rate
- [ ] **Scale Meta budget** — after 2–3 weeks of data, apply 20% weekly scale to winning ad. See `meta-ads-strategy/BUDGET-PLAN.md`
- [ ] **Add Stories/Reels creatives** — current images are 1080×1080 only. Add 1080×1920 versions for Reels/Stories placements.

---

## Known TODOs (Manual Steps Required)

1. **Resolve Cloudflare SSL** — set encryption mode to Full/Full (Strict) in Cloudflare dashboard. This is the current site blocker.

2. **Unpause Meta campaign** — once SSL is resolved and site loads cleanly.

3. **Create `og-image.png`** (1200×630px) — navy background, TrustLine logo +
   headline. Place in repo root. Referenced in OG/Twitter meta tags but missing.

4. ~~**Create `thank-you.html`**~~ — DONE.

5. ~~**Connect repo to Netlify**~~ — SUPERSEDED. Migrated to Cloudflare Pages.

6. ~~**Set custom domain URLs**~~ — DONE.

7. ~~**Netlify form notifications**~~ — SUPERSEDED. Web3Forms emails every submission directly.

8. ~~**Replace placeholder stats**~~ — DONE.

9. ~~**Create Meta Business Manager**~~ — DONE.

10. ~~**Launch first Meta campaign**~~ — DONE (paused pending SSL).

---

## Prompt Engineering Notes for Future AI Sessions

When asking Claude to work on this project:
- Always mention "TrustLineBiz.com static site, **Cloudflare Pages**-hosted, no build step"
- This CLAUDE.md gives full context — tell Claude to read it first
- For form changes: form submits via **Web3Forms** JSON POST — do NOT revert to Netlify Forms patterns
- Security headers are in `_headers` file, NOT `netlify.toml` (deleted)
- Redirects are in `_redirects` file, NOT `netlify.toml`
- For copy changes, use `skills/copywriting.md` for tone/style guide
