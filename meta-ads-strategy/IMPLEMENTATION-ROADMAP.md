# TrustLine — Meta Ads Implementation Roadmap
**Timeline:** 8 weeks to stable lead flow
**Budget:** $150–300/month throughout

---

## Pre-Launch Checklist (Do These First — Before Spending $1)

- [ ] Meta Business Manager account created (business.facebook.com)
- [ ] Meta Pixel installed on all pages of trustlinebiz.com
- [ ] CSP in netlify.toml updated to allow Meta Pixel domains
- [ ] `Lead` conversion event firing on thank-you.html (verified via Events Manager)
- [ ] `InitiateCheckout` event firing on form focus
- [ ] Meta Ad Account created inside Business Manager
- [ ] Payment method added to Ad Account
- [ ] **Special Ad Category: Credit declared** on all campaigns
- [ ] Instant Form built with TCPA consent language (or website URL with UTM ready)
- [ ] 2 static creative assets ready (Speed angle + Anti-bank angle minimum)
- [ ] UTM parameters added to destination URLs

---

## Week 1–2: Foundation & Launch

**Goal:** Get campaigns live. Generate first impressions and learn.

**Actions:**
1. Install Meta Pixel → verify all events fire → commit pixel changes to GitHub
2. Build Instant Form in Meta (per CAMPAIGN-ARCHITECTURE.md spec)
3. Produce creative assets (2–3 statics using Canva or brand colors)
4. Create campaign: `META_LEADS_BizOwners-Broad_FL_202604`
   - Special Ad Category: Credit ← declare this
   - CBO: $5/day ($150 budget) or $10/day ($300 budget)
   - 1 ad set, 3 ad creatives (speed, anti-bank, social proof)
   - Automatic placements
5. Launch — monitor daily for first 7 days

**What to watch:**
- Are ads getting approved? (Finance ads sometimes get flagged — check for policy issues within 24h)
- Is the pixel firing? (Events Manager → Test Events)
- First impressions and CTR by Day 3

---

## Week 3–4: First Optimization Pass

**Goal:** Identify which of the 3 ad angles is working. Kill the worst.

**Data threshold before making decisions:**
- Each ad needs at least $15–20 spent before drawing conclusions
- At $5–10/day this means wait until Week 3 before pausing any ad

**Actions:**
1. Check performance: CTR, CPL (if using Instant Form), Frequency
2. Apply 3× Kill Rule: any ad spent 3× target CPL with 0 leads → pause
3. If CTR on any ad < 0.5% after $20 spent → replace that creative
4. If one ad has 60%+ of budget delivery with 0 leads → investigate (potential disapproval or poor quality score)
5. Produce 1 replacement creative for any paused ad

**Decision matrix:**
| Scenario | Action |
|----------|--------|
| 0 leads after $50 spent | Review ad copy for policy violations; test new headline |
| 1–3 leads, CPL > $80 | Acceptable at seed stage — continue gathering data |
| 1–3 leads, CPL < $50 | Strong signal — this angle is working, keep budget here |
| 0 ad approvals | Check Special Ad Category is declared; review copy for "guaranteed" language |

---

## Week 5–6: Double Down on Winner

**Goal:** Budget concentration. Put 80%+ on the winning creative.

**Actions:**
1. Identify top-performing ad (lowest CPL or highest CTR)
2. Pause bottom-performing ad
3. Duplicate winning ad with 1 small variation (different headline or image — not both at once)
4. If $300 budget: activate retargeting campaign (30% of budget)
   - Custom audience: website visitors last 30 days
   - Ad copy: slightly different angle from prospecting ("Still thinking about it?")
5. Create Special Ad Audience from lead converters (once 50+ leads collected)

**KPI targets by Week 6:**
- CPL < $50 (Instant Form)
- CTR > 1.0%
- Frequency < 2.5
- At least 5–10 leads collected

---

## Week 7–8: Establish Baseline & Plan Scale

**Goal:** Confirm repeatable CPL. Plan for budget increase if ROI is positive.

**Actions:**
1. Run full 8-week performance report:
   - Total spend, total leads, CPL
   - Lead-to-application rate (how many leads became full applications?)
   - Lead-to-funded rate (if trackable)
2. If CPL < $50 and any lead has converted to a funded deal → **strong signal to scale**
3. Prepare scale plan: increase budget 20% per week toward $300 (if at $150) or toward $500
4. Begin planning Google Search when Meta budget hits $400/month stable
5. Refresh creative set: produce 2 new statics, add Florida-specific copy ("FL business owners")

---

## Ongoing Monthly Rhythm

| Week of month | Task |
|--------------|------|
| Week 1 | Review last month's CPL, leads, spend. Make 1 optimization change. |
| Week 2 | Check creative frequency. Refresh any creative with Frequency > 3.0 |
| Week 3 | Produce 1 new ad creative (rotation keeps algorithm fresh) |
| Week 4 | Budget review: scale up 20% if CPL targets met; hold if not |

---

## Scale Triggers Summary

| Milestone | Action to take |
|-----------|---------------|
| First funded deal from Meta lead | Increase budget to $400–500/month |
| CPL < $35 for 3 consecutive weeks | Increase budget 20% |
| 10+ leads/month collected | Activate Special Ad Audience |
| 50+ website visitors/month | Activate retargeting campaign |
| $400/month Meta budget stable | Add Google Search (FL keywords only) |
| $800/month Meta budget stable | Add TikTok (video creative needed) |
| $1,500/month total ad budget | Full multi-platform strategy justified |

---

## 12-Month Outlook (If Scaled Successfully)

| Month | Platform | Budget | Est. Leads | Est. Funded |
|-------|----------|--------|-----------|-------------|
| 1–2 | Meta only | $150–300 | 5–15 | 0–2 |
| 3–4 | Meta primary | $300–500 | 10–25 | 1–4 |
| 5–6 | Meta + Google | $600–900 | 20–45 | 2–6 |
| 7–9 | Meta + Google + TikTok | $1,000–1,500 | 40–80 | 4–12 |
| 10–12 | Full platform mix | $1,500–2,500 | 70–150 | 8–20 |

> Funded deal assumptions: 5–10% lead → funded rate (industry typical for MCA/business loan lead gen).
> Each funded deal generates a commission. 5 deals/month at even $200 commission = $1,000/month return on $300 ad spend = 3.3× ROAS.
