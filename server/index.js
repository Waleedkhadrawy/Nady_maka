const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/db');
const { createPool } = require('./config/postgres');
const auth = require('./middleware/auth');
const { adminOnly } = require('./middleware/roles');

dotenv.config();

const app = express();
const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map(s=>s.trim()).filter(Boolean);
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : '*'}));
app.use(express.json());

if (process.env.USE_MONGO === 'true'){
  const uri = process.env.MONGODB_URI;
  const isPlaceholder = (s) => !s || /[<>]/.test(s);
  if (!uri || isPlaceholder(uri)) {
    console.warn('MongoDB disabled or URI invalid');
  } else {
    connectDB(uri)
      .then(() => console.log('MongoDB connected'))
      .catch((err) => {
        console.error('MongoDB connection error:', err.message);
      });
  }
}

// Database Pool (PostgreSQL / Supabase via Adapter)
(async () => {
  try {
    const pool = await createPool();
    // Keep the property name `mysql` internally to avoid breaking all repositories
    app.locals.mysql = pool; 
  } catch (e) {
    console.warn('Database pool connection failed:', e.message);
  }
})();

app.get('/api/_debug/customers-count', async (req, res) => {
  try {
    const pool = req.app.locals.mysql;
    if (!pool) return res.json({ mysql: false });
    const [rows] = await pool.query('SELECT COUNT(*) AS c FROM customers');
    res.json({ count: rows[0]?.c ?? 0 });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/memberships', require('./routes/memberships'));
app.use('/api/membership-packages', require('./routes/packages'));
app.use('/api/members', require('./routes/members'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/trainers', require('./routes/trainers'));
app.use('/api/events', require('./routes/events'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/surveys', require('./routes/surveys'));
app.use('/api/forms', require('./routes/forms'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/member-auth', require('./routes/memberAuth'));
app.use('/api/member', require('./routes/memberProfile'));
app.use('/api/trainer-evaluations', require('./routes/trainerEvaluations'));

// Compatibility admin listing endpoints used by dashboard/test scripts
app.get('/api/memberships', auth, adminOnly, async (req, res) => {
  try {
    const pool = req.app.locals.mysql;
    if (!pool) return res.status(503).json({ message: 'database_unavailable' });
    const page = Math.max(parseInt(req.query.page || '1', 10) || 1, 1);
    const limit = Math.max(Math.min(parseInt(req.query.limit || '20', 10) || 20, 100), 1);
    const offset = (page - 1) * limit;
    const [items] = await pool.query(
      `SELECT m.id, m.member_id, m.package_id, m.join_date, m.expiry_date, m.status, m.note, p.code, p.label
       FROM memberships m
       LEFT JOIN membership_packages p ON p.id = m.package_id
       ORDER BY m.id DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    const [[countRow]] = await pool.query('SELECT COUNT(*) AS total FROM memberships');
    res.json({ items, page, limit, total: countRow?.total || 0 });
  } catch (e) {
    res.status(500).json({ message: e.message || 'server_error' });
  }
});

app.get('/api/surveys', auth, adminOnly, async (req, res) => {
  try {
    const pool = req.app.locals.mysql;
    if (!pool) return res.status(503).json({ message: 'database_unavailable' });
    const page = Math.max(parseInt(req.query.page || '1', 10) || 1, 1);
    const limit = Math.max(Math.min(parseInt(req.query.limit || '20', 10) || 20, 100), 1);
    const offset = (page - 1) * limit;
    const [items] = await pool.query(
      `SELECT id, member_id, data, created_at
       FROM surveys
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    const [[countRow]] = await pool.query('SELECT COUNT(*) AS total FROM surveys');
    res.json({ items, page, limit, total: countRow?.total || 0 });
  } catch (e) {
    res.status(500).json({ message: e.message || 'server_error' });
  }
});

if (process.env.NODE_ENV === 'production') {
  const buildPath = path.resolve(__dirname, '..', 'build');
  app.use(express.static(buildPath));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET){
  console.warn('JWT_SECRET missing in production');
}
app.use((err, req, res, next)=>{
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'server_error' });
});
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}

module.exports = app;
