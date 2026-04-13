# Forms Skill — TrustLineBiz.com

## Form Architecture
The homepage has ONE form: `#quoteForm` → Netlify Forms → `lead-capture` endpoint.

## How Netlify Forms Works (Important)
1. Netlify scans HTML at **deploy time** for `data-netlify="true"` — this registers the endpoint
2. At **runtime**, JS submits via `fetch('/', { method: 'POST' })` with URL-encoded body
3. Netlify's CDN intercepts the POST and stores the submission
4. You view leads at: Netlify Dashboard → Your Site → Forms → lead-capture

The `name="form-name"` hidden field must match the form's `name` attribute.
Without it, Netlify won't know which form endpoint received the submission.

## Adding a New Field
1. Add the input inside the form in `index.html`:
```html
<div class="form-group">
  <label for="myField">My Label</label>
  <input type="text" id="myField" name="myField" placeholder="..." maxlength="200" />
  <div class="error-msg" id="myField-err">Error message here.</div>
</div>
```

2. Add validation in the JS `fields` object:
```javascript
myField: { el: document.getElementById('myField'), validate: v => v.trim().length >= 1 },
```

3. Add error clearing:
```javascript
// In the forEach at the bottom of the script:
['fullName','businessName','phone','email','revenue','myField'].forEach(id => { ... });
```

Netlify automatically captures any named field — no backend changes needed.

## Modifying Validation
Validation runs in the `submit` handler. Each field has a `validate` function
that returns true/false. The submit is blocked if any return false.

Current validations:
- `fullName`: at least 2 characters
- `businessName`: at least 1 character
- `phone`: 10+ digits (after stripping non-numeric)
- `email`: basic regex pattern match
- `revenue`: must be a non-empty selection

## Spam Protection
Two layers:
1. **Honeypot field**: `name="bot-field"` — hidden from humans, bots fill it → Netlify rejects it
2. **Netlify spam filter**: built-in Akismet-style filtering on all Netlify Forms

Do NOT remove either layer.

## Form Success State
After successful submit, the form element is hidden and `#formSuccess` is shown.
The success message is inside the form card div and handles the state inline.
No redirect to a separate page currently (though a `thank-you.html` could be added).

## Testing Forms Locally
Netlify Forms only work on deployed URLs — not on `file://` or `localhost`.
To test locally: use `netlify dev` CLI (spins up a local Netlify environment).
Or deploy a preview to test the form: `netlify deploy --dir .`

## Form Notifications
Configure in Netlify Dashboard → Your Site → Forms → lead-capture → Settings:
- Email notification: add your email
- Slack webhook: add your Slack webhook URL
- Zapier/Make: use the form webhook to connect to any automation
