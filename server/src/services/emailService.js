const nodemailer = require('nodemailer');
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = require('../config/env');

let transporter = null;

function getTransporter() {
  if (!SMTP_USER || !SMTP_PASS) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

async function sendLeadConfirmation(lead) {
  const t = getTransporter();
  if (!t) {
    console.log('Email skipped — SMTP not configured');
    return;
  }

  await t.sendMail({
    from: `"TrustLine" <${SMTP_USER}>`,
    to: lead.email,
    subject: 'We received your application — TrustLine Business Funding',
    text: `Hi ${lead.name},\n\nThank you for applying. We'll be in touch shortly.\n\nBest,\nTrustLine Team`,
    html: `<p>Hi ${lead.name},</p><p>Thank you for applying. We'll be in touch shortly.</p><p>Best,<br/>TrustLine Team</p>`,
  });
}

module.exports = { sendLeadConfirmation };
