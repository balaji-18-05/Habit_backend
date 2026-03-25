require('dotenv').config();
const express = require('express');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── CORS Middleware (manual – reliable on Vercel serverless) ────────────────
const allowedOrigins = [
  'https://hackwithhabits.vercel.app',
  'http://localhost:5173',
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Preflight – respond immediately
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

app.use(express.json());

// ── Ensure DB is connected before every request (critical for serverless) ───
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/habits', require('./routes/habits'));
app.use('/api/history', require('./routes/history'));

// ── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Global error handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start (local dev only, Vercel uses module.exports) ───────────────────────
const PORT = process.env.PORT || 3001;

if (!process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}

// Export for Vercel serverless
module.exports = app;