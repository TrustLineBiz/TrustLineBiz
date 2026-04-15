require('./config/env');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://app.trustlinebiz.com']
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/webhook', require('./routes/webhook'));
app.use('/api/leads', require('./routes/leads'));

app.use(require('./middleware/errorHandler'));

module.exports = app;
