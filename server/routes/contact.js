const express = require('express');
const router = express.Router();
const repo = require('../repositories/contactRepo');
const { requireFields } = require('../middleware/validate');
const { rateLimiter } = require('../middleware/rateLimiter');
const auth = require('../middleware/auth');
const { adminOnly } = require('../middleware/roles');

router.post('/', rateLimiter({ windowMs: 60000, max: 20 }), requireFields(['name','email','phone','subject','message']), async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const body = req.body || {};
    const row = await repo.createContactMessage(pool, body);
    res.status(201).json(row);
  }catch(e){
    res.status(400).json({ message: e.message || 'Invalid data' });
  }
});

module.exports = router;
router.get('/', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const { q, status } = req.query;
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '20');
    const data = await repo.listContactMessages(pool, { q, status, page, limit });
    res.json({ items: data.items, page, limit, total: data.total });
  }catch(e){
    res.status(500).json({ message: e.message || 'Server error' });
  }
});
