# Deploy Skill — TrustLineBiz.com

## Deployment Stack
- Host: Netlify
- Method: Drag-and-drop OR git-connected auto-deploy
- Config: `netlify.toml` (read automatically at deploy time)
- No build command needed — publish root directory as-is

## How to Deploy

### Option A: Git Push (Recommended once repo is connected)
```bash
# Stage and commit changes
git add -A
git commit -m "describe what changed"
git push origin main
# Netlify auto-deploys on push
```

### Option B: Netlify CLI
```bash
# Install once
npm install -g netlify-cli
netlify login

# Deploy to production
netlify deploy --prod --dir .

# Deploy preview (doesn't affect production)
netlify deploy --dir .
```

### Option C: Drag-and-Drop
1. Go to app.netlify.com
2. Open your site
3. Drag the entire `/trustlinebiz/` folder onto the deploy drop zone

## Pre-Deploy Checklist
- [ ] No console errors on localhost (open index.html in browser)
- [ ] Form submission test: fill out form → verify leads appear in Netlify Dashboard → Forms
- [ ] All CTAs link to `#get-quote` correctly
- [ ] Privacy/Terms links work in footer
- [ ] Lead-finder loads and basic CRUD works
- [ ] `netlify.toml` syntax is valid (check with `netlify dev` or paste into toml validator)

## Post-Deploy Verification
- [ ] Visit live URL and verify pages load
- [ ] Check security headers: securityheaders.com → paste your URL
- [ ] Submit test form → confirm lead appears in Netlify Forms dashboard
- [ ] Check for console errors in browser DevTools

## Connect Repo to Netlify (One-Time Setup)
1. Push repo to GitHub: `git remote add origin <url> && git push -u origin main`
2. In Netlify Dashboard: New Site → Import from Git → Select repo
3. Build command: (leave blank)
4. Publish directory: `.`
5. Deploy

## Custom Domain Setup
1. In Netlify Dashboard → Domain Management → Add custom domain
2. Point DNS: CNAME `www` → `[site-name].netlify.app` AND ALIAS/ANAME `@` → Netlify IP
3. Netlify provisions SSL automatically via Let's Encrypt
4. Update `netlify.toml` www→non-www redirect (already configured)
5. Update all canonical URLs in `index.html` from `trustlinebiz.netlify.app` to `trustlinebiz.com`

## Environment Variables
Currently none needed (static site, no API keys).
If added in future: Netlify Dashboard → Site → Environment Variables.
