# Security Skill — TrustLineBiz.com

## Security Architecture Overview
This is a static site with no server-side code. The attack surface is limited.
No API keys, no backend, no database. Main risks: form spam, XSS in lead-finder,
clickjacking, content injection.

## Security Controls in Place
- [x] HTTP security headers via `netlify.toml` (CSP, X-Frame-Options, etc.)
- [x] Honeypot field on homepage form (bot-field)
- [x] Netlify Forms spam filtering (built-in)
- [x] Full HTML escaping in lead-finder (`esc()` escapes `& < > " '`)
- [x] URL sanitization in lead-finder (`safeHref()` blocks `javascript:` URIs)
- [x] `noindex, nofollow` on lead-finder (prevents search indexing)
- [x] `rel="noopener noreferrer"` on all external links from lead-finder
- [x] `maxlength` attributes on form inputs (prevents oversized payloads)
- [x] `form-action 'self'` in CSP (forms can only submit to same origin)
- [x] `frame-ancestors 'none'` in CSP (prevents clickjacking)

## CSP Notes
Current CSP allows `unsafe-inline` for scripts and styles because all code is
inline. This is acceptable for a static site with no external script loading.

To tighten CSP in future (if a build step is added):
1. Move all `<style>` blocks to external `.css` files
2. Move all `<script>` blocks to external `.js` files  
3. Remove `unsafe-inline` from CSP
4. Add script/style `integrity` hashes for any CDN resources

## Form Security Checklist
When modifying the homepage form:
- [ ] `data-netlify="true"` is present
- [ ] `data-netlify-honeypot="bot-field"` is present
- [ ] Hidden `bot-field` input exists (display:none, tabindex=-1)
- [ ] JS submit handler uses `fetch()` not setTimeout
- [ ] All inputs have `maxlength` attributes
- [ ] Email validated with regex before submission
- [ ] Phone validated: 10+ digits after stripping non-numeric

## Lead Finder Security Checklist
When modifying lead-finder.html:
- [ ] All user data rendered via innerHTML goes through `esc()`
- [ ] All user-supplied URLs go through `safeHref()`
- [ ] External links have `rel="noopener noreferrer"`
- [ ] Page has `<meta name="robots" content="noindex, nofollow">`
- [ ] `robots.txt` disallows `/lead-finder.html`

## Threat Model
| Threat                  | Mitigation                                    |
|-------------------------|-----------------------------------------------|
| Form spam/bots          | Honeypot + Netlify spam filter                |
| Clickjacking            | `X-Frame-Options: DENY` + CSP frame-ancestors |
| XSS in lead-finder      | `esc()` + `safeHref()` on all user data       |
| MIME sniffing           | `X-Content-Type-Options: nosniff`             |
| Referrer leakage        | `Referrer-Policy: strict-origin-when-cross-origin` |
| API key exposure        | No API keys exist; if added, use Netlify Env Vars |
| Data exfiltration       | CSP `connect-src 'self'` limits outbound reqs |
| Lead data exposure      | localStorage — only accessible to same-origin JS |

## If API Keys Are Added In Future
1. Create a Netlify Function in `/netlify/functions/`
2. Store keys as Netlify Environment Variables (Dashboard → Site → Environment)
3. Call the function from the frontend via `fetch('/api/my-function')`
4. NEVER include API keys in any HTML, JS, or committed file
