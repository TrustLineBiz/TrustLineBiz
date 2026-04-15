const webpush = require('web-push');
const pool = require('../config/db');
const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_EMAIL } = require('../config/env');

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

async function notifyAll(payload) {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.log('Push skipped — VAPID keys not configured');
    return;
  }

  const { rows } = await pool.query('SELECT * FROM push_subscriptions');
  const message = JSON.stringify(payload);

  const results = await Promise.allSettled(
    rows.map((sub) =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: sub.keys },
        message
      ).catch(async (err) => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await pool.query('DELETE FROM push_subscriptions WHERE endpoint = $1', [sub.endpoint]);
        }
        throw err;
      })
    )
  );

  const failed = results.filter((r) => r.status === 'rejected').length;
  if (failed > 0) console.warn(`Push: ${failed}/${rows.length} failed`);
}

module.exports = { notifyAll };
