require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../src/config/db');

async function seed() {
  const email = process.env.SEED_EMAIL || 'admin@trustlinebiz.com';
  const password = process.env.SEED_PASSWORD || 'changeme123';
  const name = process.env.SEED_NAME || 'Admin';

  const hash = await bcrypt.hash(password, 12);
  const { rows } = await pool.query(
    `INSERT INTO users (email, password_hash, name, role)
     VALUES ($1, $2, $3, 'admin')
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
     RETURNING id, email, name, role`,
    [email, hash, name]
  );

  console.log('Seeded user:', rows[0]);
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
