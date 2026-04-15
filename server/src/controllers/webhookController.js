const pool = require('../config/db');
const { qualify } = require('../services/qualificationService');
const pushService = require('../services/pushService');
const emailService = require('../services/emailService');
const { WEBHOOK_SECRET } = require('../config/env');

async function handleWebhook(req, res, next) {
  try {
    const secret = req.query.secret;
    if (secret !== WEBHOOK_SECRET) {
      return res.status(403).json({ error: 'Invalid webhook secret' });
    }

    const body = req.body;

    const lead = {
      name: body.name || body['your-name'] || 'Unknown',
      business_name: body.business_name || body['business-name'] || null,
      phone: body.phone || body['phone-number'] || null,
      email: body.email || null,
      credit_score_range: body.credit_score_range || body['credit-score-range'] || null,
      credit_score_exact: parseInt(body.credit_score_exact || body['credit-score'] || 0, 10) || null,
      monthly_revenue: parseFloat(body.monthly_revenue || body['monthly-revenue'] || 0) || null,
      funding_amount_needed: parseFloat(body.funding_amount || body['funding-amount'] || 0) || null,
      preferred_call_time: body.preferred_call_time || body['preferred-call-time'] || null,
      contact_preference: body.contact_preference || body['contact-preference'] || null,
      utm_source: body.utm_source || null,
      utm_medium: body.utm_medium || null,
      utm_campaign: body.utm_campaign || null,
      utm_content: body.utm_content || null,
    };

    const { status, reason } = qualify(lead);

    const { rows } = await pool.query(
      `INSERT INTO leads (
        name, business_name, phone, email,
        credit_score_range, credit_score_exact,
        monthly_revenue, funding_amount_needed,
        preferred_call_time, contact_preference,
        utm_source, utm_medium, utm_campaign, utm_content,
        qualification_status, disqualify_reason
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16
      ) RETURNING id`,
      [
        lead.name, lead.business_name, lead.phone, lead.email,
        lead.credit_score_range, lead.credit_score_exact,
        lead.monthly_revenue, lead.funding_amount_needed,
        lead.preferred_call_time, lead.contact_preference,
        lead.utm_source, lead.utm_medium, lead.utm_campaign, lead.utm_content,
        status, reason,
      ]
    );

    const leadId = rows[0].id;

    await pool.query(
      `INSERT INTO lead_events (lead_id, event_type, metadata) VALUES ($1, 'created', $2)`,
      [leadId, JSON.stringify({ qualification_status: status, utm_source: lead.utm_source })]
    );

    if (lead.email) {
      emailService.sendLeadConfirmation(lead).catch((e) => console.error('Email error:', e));
    }

    pushService.notifyAll({
      title: 'New Lead',
      body: `${lead.name}${lead.business_name ? ` — ${lead.business_name}` : ''}`,
      data: { leadId },
    }).catch((e) => console.error('Push error:', e));

    res.json({ ok: true, lead_id: leadId });
  } catch (err) {
    next(err);
  }
}

module.exports = { handleWebhook };
