const express = require('express');
const router = express.Router();
const repo = require('../repositories/surveyRepo');
const { rateLimiter } = require('../middleware/rateLimiter');
const auth = require('../middleware/auth');
const { adminOnly } = require('../middleware/roles');

router.get('/', auth, adminOnly, async (req, res) => {
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
    res.status(500).json({ message: e.message || 'server error' });
  }
});

router.post('/', rateLimiter({ windowMs: 60000, max: 30 }), async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const body = req.body || {};
    const row = await repo.createSurvey(pool, { member_id: body.member_id, payload: body });
    res.status(201).json(row);
  }catch(e){
    res.status(400).json({ message: e.message || 'Invalid data' });
  }
});

module.exports = router;
