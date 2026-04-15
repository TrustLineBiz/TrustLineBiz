const pool = require('../config/db');

async function subscribe(req, res, next) {
  try {
    const { endpoint, keys } = req.body;
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ error: 'endpoint and keys (p256dh, auth) required' });
    }

    await pool.query(
      `INSERT INTO push_subscriptions (user_id, endpoint, keys)
       VALUES ($1, $2, $3)
       ON CONFLICT (endpoint) DO UPDATE SET keys = EXCLUDED.keys`,
      [req.user.id, endpoint, JSON.stringify(keys)]
    );

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function unsubscribe(req, res, next) {
  try {
    const { endpoint } = req.body;
    await pool.query('DELETE FROM push_subscriptions WHERE endpoint = $1', [endpoint]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { subscribe, unsubscribe };
