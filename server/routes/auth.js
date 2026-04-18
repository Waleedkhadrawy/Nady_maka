const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { findAdminByUsername, findAdminByEmail } = require('../repositories/adminRepo');
const { requireFields } = require('../middleware/validate');
const { rateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/login', rateLimiter({ windowMs: 60000, max: 60 }), requireFields(['password']), async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const identifier = (username || email || '').trim();
    if (!identifier) return res.status(400).json({ message: 'missing_identifier' });
    const pool = req.app.locals.mysql;
    const isProd = process.env.NODE_ENV === 'production';

    // Try DB first if available
    if (pool) {
      let admin = await findAdminByUsername(pool, identifier);
      if (!admin && identifier.includes('@')) {
        admin = await findAdminByEmail(pool, identifier);
      }
      if (admin) {
        const hash = admin.password_hash || '';
        if (hash && hash.startsWith('$2')) {
          const ok = await bcrypt.compare(password, hash);
          if (ok) {
            const secret = process.env.JWT_SECRET || 'dev_secret';
            const token = jwt.sign({ role: admin.role || 'admin', username: admin.username, id: admin.id }, secret, { expiresIn: '12h' });
            return res.json({ token });
          }
        } else if (!isProd && hash && password === hash) {
          const secret = process.env.JWT_SECRET || 'dev_secret';
          const token = jwt.sign({ role: admin.role || 'admin', username: admin.username, id: admin.id }, secret, { expiresIn: '12h' });
          return res.json({ token });
        }
      }
    }

    if (!isProd) {
      const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change_me';
      if (identifier === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const secret = process.env.JWT_SECRET || 'dev_secret';
        const token = jwt.sign({ role: 'admin', username: ADMIN_USERNAME }, secret, { expiresIn: '12h' });
        return res.json({ token });
      }
    }
    return res.status(401).json({ message: 'invalid_credentials' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'server_error' });
  }
});

module.exports = router;
