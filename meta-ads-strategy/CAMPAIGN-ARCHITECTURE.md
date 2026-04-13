# TrustLine — Meta Campaign Architecture
**Platform:** Meta Ads Manager
**Budget:** $150–$300/month
**Special Ad Category:** Credit (MUST be declared on every campaign)

---

## Naming Convention

```
[Platform]_[Objective]_[Audience]_[Geo]_[YYYYMM]
```

Examples:
- `META_LEADS_BizOwners-Broad_FL_202604`
- `META_LEADS_Retargeting-SiteVisitors_FL_202605`

---

## Phase 1 Structure (Month 1–2) — $150–300/month

```
Meta Ad Account
└── CAMPAIGN: META_LEADS_BizOwners-Broad_FL_202604
    │   Objective: Leads
    │   Special Ad Category: Credit  ← DECLARE THIS
    │   Budget type: Campaign Budget Optimization (CBO)
    │   Daily budget: $5/day ($150/mo) or $10/day ($300/mo)
    │   Bid strategy: Lowest Cost
    │
    └── AD SET: ADSET_FL-BizOwners_Interests_202604
        │   Location: Florida (statewide)
        │   Age/Gender: ALL (cannot restrict under Special Ad Category)
        │   Interests: Small Business Owners, Entrepreneurship,
        │              Business Finance, Self-Employed
        │   Placements: Automatic (let Meta optimize)
        │   Optimization: Leads
        │   Lead method: Instant Form (recommended) OR Website
        │
        ├── AD: Creative_Speed_StaticImage_202604
        │       Angle: Speed ("Get funded in 24 hours")
        │       Format: 1080×1080 static + 1080×1920 story crop
        │
        ├── AD: Creative_AntiBank_StaticImage_202604
        │       Angle: Anti-bank ("Banks said no. We say yes.")
        │       Format: 1080×1080 static + 1080×1920 story crop
        │
        └── AD: Creative_SocialProof_StaticImage_202604
                Angle: Testimonial ("3,200+ Businesses Funded")
                Format: 1080×1080 static + 1080×1920 story crop
```

---

## Phase 2 Structure (Month 3+) — Add Retargeting

**Activate only when:** Website has 100+ monthly visitors OR 50+ Instant Form openers.

```
Meta Ad Account
│
├── CAMPAIGN 1: META_LEADS_BizOwners-Broad_FL_202606  [same as above]
│   Budget: 70% of total ($105–210/mo)
│
└── CAMPAIGN 2: META_LEADS_Retargeting_FL_202606
    │   Objective: Leads
    │   Special Ad Category: Credit
    │   Budget: 30% of total ($45–90/mo)
    │   Bid strategy: Lowest Cost
    │
    └── AD SET: ADSET_SiteVisitors-30d_FL_202606
        │   Custom Audience: Website visitors (all pages, 30 days)
        │   Exclude: People who already submitted the lead form
        │   Placements: Automatic
        │
        ├── AD: Retargeting_Urgency_202606
        │       Copy: "You checked your options — take 2 minutes to finish."
        │       Different creative from prospecting (avoids fatigue)
        │
        └── AD: Retargeting_Testimonial_202606
                Copy: Specific testimonial + "See if you qualify today"
```

---

## Instant Form Setup (Recommended over Website for this budget)

**Why Instant Form:** Loads 10× faster than external website, higher conversion rate, lower CPL. Data feeds directly into Netlify Forms via webhook or manual export.

**Form configuration:**

```
Form Name: TrustLine FL Business Funding — Lead Form
Form Type: More Volume (optimizes for quantity)

Intro screen:
  Headline: "Check Your Business Funding Options"
  Paragraph: "Free to apply · No credit impact · 100+ lenders"
  Image: Hero image or brand logo lockup

Questions (pre-fill where available):
  1. Full Name (pre-fill)
  2. Email Address (pre-fill)
  3. Phone Number (pre-fill)
  4. Business Name (custom question)
  5. Monthly Revenue (dropdown):
     - Under $10K/month
     - $10K – $50K/month
     - $50K – $100K/month
     - $100K+/month

Disclaimer (TCPA consent):
  "By submitting this form you consent to be contacted by TrustLine 
  and its partners via phone, email, or SMS regarding your funding 
  inquiry. Message & data rates may apply. See our Privacy Policy 
  and Terms & Conditions."
  Link: https://trustlinebiz.com/privacy.html

Thank You screen:
  Headline: "You're in the queue!"
  Paragraph: "A funding specialist will reach out within 1 business 
  hour with your options."
  CTA: "Visit Website" → https://trustlinebiz.com/thank-you
```

**Lead retrieval:** Download leads from Meta Ads Manager → Leads Center, or connect via Zapier/Make to automatically email each new lead to your inbox.

---

## Creative Fatigue Monitoring

At $5–10/day, fatigue is unlikely in Month 1. However:

| Signal | Action |
|--------|--------|
| Frequency > 3.0 on an ad | Pause that creative, launch replacement |
| CTR drops >30% week-over-week | Refresh copy or image |
| CPL increases >50% from baseline | Test new angle |
| One ad spends >80% of budget | Check if others are under-delivering; may need to separate ad sets |

**Refresh cadence:** Prepare 1–2 replacement creatives at the 4-week mark, ready to swap in if fatigue signals appear.

---

## Excluded Audiences (always exclude these)

- People who have already submitted a lead form (exclude via Custom Audience: Leads)
- Current employees (if Meta Audience for business page exists)
- Existing customers (if contact list is available — upload as exclusion)
