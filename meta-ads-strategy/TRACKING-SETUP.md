# TrustLine — Tracking Setup (Meta)
**Priority:** Must complete BEFORE launching ads. No pixel = no optimization.

---

## Meta Pixel Installation

### Step 1: Create the Pixel
1. Meta Business Manager → Events Manager → Connect Data Sources → Web
2. Name it: "TrustLine Website Pixel"
3. Copy the Pixel ID (15-digit number)

### Step 2: Install on trustlinebiz.com (Netlify, no build step)
Since TrustLine is a static HTML site with no build step, paste the pixel code directly into the `<head>` of `index.html`, `thank-you.html`, `privacy.html`, and `terms.html`.

Add this just before `</head>` in all HTML files:

```html
<!-- Meta Pixel -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
<noscript>
  <img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"/>
</noscript>
<!-- End Meta Pixel -->
```

Replace `YOUR_PIXEL_ID` with your actual Pixel ID.

### Step 3: Update CSP in netlify.toml
The current CSP restricts `connect-src 'self'`. Meta Pixel makes requests to `connect.facebook.net`. Add it:

```toml
Content-Security-Policy = "upgrade-insecure-requests; default-src 'self'; script-src 'self' 'unsafe-inline' https://connect.facebook.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://www.facebook.com https://connect.facebook.net; font-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
```

---

## Conversion Events to Fire

### Event 1: Lead (primary conversion — most important)

Fire on `thank-you.html` page load (after successful form submit, the JS redirects here):

```html
<script>
  fbq('track', 'Lead', {
    content_name: 'Business Funding Application',
    content_category: 'Financial Services'
  });
</script>
```

Add this inline script to `thank-you.html` inside the `<body>` tag.

### Event 2: InitiateCheckout (form engagement — secondary)

Fire when user focuses on the form (starts filling it out). Add to `index.html` JS:

```javascript
// Fire Meta InitiateCheckout when form is first interacted with
let formStarted = false;
document.getElementById('quoteForm').addEventListener('focusin', function() {
  if (!formStarted && typeof fbq !== 'undefined') {
    fbq('track', 'InitiateCheckout');
    formStarted = true;
  }
}, { once: true });
```

### Event 3: ViewContent (page view — already covered by PageView base pixel)

The base `fbq('track', 'PageView')` handles this automatically.

---

## Conversion Event Priority

| Event | Where fired | Optimization use |
|-------|-------------|-----------------|
| Lead | thank-you.html | Primary — optimize ad delivery for leads |
| InitiateCheckout | index.html (form focus) | Secondary — shows form engagement |
| PageView | All pages (base pixel) | Audience building for retargeting |

---

## Instant Form Lead Download

If using Meta Instant Forms (recommended), leads are stored in Meta Ads Manager. Retrieve them:

**Manual:** Ads Manager → Campaigns → Lead Center → Download CSV (daily)
**Automated (recommended):** Connect via Zapier or Make.com:
- Trigger: New Lead in Meta Lead Ads
- Action: Send email to your inbox with all form fields
- Optional: Also send to a Google Sheet for tracking

**Zapier template:** Search "Meta Lead Ads → Email" — free plan supports this.

---

## Verification Checklist

- [ ] Meta Pixel ID installed in `<head>` of all HTML files
- [ ] CSP in netlify.toml updated to allow connect.facebook.net
- [ ] `Lead` event fires on thank-you.html (verify in Meta Events Manager → Test Events)
- [ ] `InitiateCheckout` fires on form focus (verify via Events Manager → Test Events)
- [ ] `PageView` fires on homepage and thank-you page
- [ ] Pixel Helper Chrome extension shows events firing correctly
- [ ] UTM parameters added to all ad destination URLs
- [ ] Instant Form lead notifications set up (Zapier/email) if using Instant Forms
- [ ] Lead deduplication considered (Meta Pixel + Instant Form can double-count)

---

## UTM Tracking (for Netlify analytics + future GA4)

Add these parameters to all Meta ad destination URLs:

```
https://trustlinebiz.com/?utm_source=meta&utm_medium=paid_social&utm_campaign=fl-smb-leads&utm_content=speed-angle

https://trustlinebiz.com/?utm_source=meta&utm_medium=paid_social&utm_campaign=fl-smb-leads&utm_content=antibank-angle

https://trustlinebiz.com/?utm_source=meta&utm_medium=paid_social&utm_campaign=fl-smb-leads&utm_content=socialproof-angle
```

This lets you see in Netlify's analytics which creative drove which traffic, independent of Meta's reporting.
