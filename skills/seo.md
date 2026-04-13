# SEO Skill — TrustLineBiz.com

## Current SEO State
- [x] Title tag with keyword + benefit
- [x] Meta description
- [x] Keywords meta
- [x] Canonical URL
- [x] Open Graph tags (og:title, og:description, og:image, og:url)
- [x] Twitter Card tags
- [x] Schema.org FinancialService structured data
- [x] robots.txt (lead-finder disallowed)
- [x] sitemap.xml (3 public pages)
- [x] Semantic HTML sections
- [x] noindex on legal + internal pages
- [ ] og-image.png (1200×630px) — NEEDS CREATING
- [ ] favicon.ico — MISSING
- [ ] Google Search Console setup — MANUAL STEP
- [ ] Google Analytics — NOT INSTALLED

## Target Keywords
Primary:
- "business funding" 
- "small business loans"
- "merchant cash advance"
- "fast business capital"
- "working capital loan"

Secondary:
- "business funding no bank"
- "same day business loan"
- "24 hour business funding"
- "business line of credit"
- "equipment financing small business"

## On-Page SEO Checklist (Run Before Any Copy Update)
1. H1 includes primary keyword ("business funding")
2. H2s in product/section titles use secondary keywords
3. No duplicate H1 tags
4. All images have descriptive alt text (currently none — add when images added)
5. Internal links: privacy and terms linked from footer ✓
6. Page loads fast — no external dependencies ✓ (all inline)

## Technical SEO
- Hosted on Netlify CDN → fast globally ✓
- All pages are HTTPS ✓
- No JavaScript blocking render (all inline) ✓
- Mobile responsive ✓
- sitemap.xml submitted to Google Search Console? → TODO

## Schema.org Update Instructions
The FinancialService schema is in `index.html` `<head>`.
When real stats become available, add `aggregateRating`:
```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.8",
  "reviewCount": "3200"
}
```

## Sitemap Maintenance
When adding a new public page:
1. Create the HTML file with proper meta tags
2. Add to `sitemap.xml`
3. Make sure it is NOT disallowed in `robots.txt`
4. Submit updated sitemap in Google Search Console
