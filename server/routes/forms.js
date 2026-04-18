const express = require('express');
const router = express.Router();
const repo = require('../repositories/dynamicFormRepo');
const auth = require('../middleware/auth');
const { adminOnly } = require('../middleware/roles');
const { rateLimiter } = require('../middleware/rateLimiter');

router.get('/:code', async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const code = req.params.code;
    const row = await repo.getFormByCode(pool, code);
    if (!row || !row.is_active) return res.status(404).json({ message: 'not_found' });
    res.json({ code: row.code, title: row.title, schema: row.schema_json });
  }catch(e){ res.status(500).json({ message: e.message || 'server_error' }); }
});

router.post('/:code/submit', rateLimiter({ windowMs: 60000, max: 30 }), async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const code = req.params.code;
    const payload = req.body || {};
    const row = await repo.submitForm(pool, code, { member_id: payload.member_id, payload });
    res.status(201).json(row);
  }catch(e){ res.status(400).json({ message: e.message || 'invalid_data' }); }
});

router.get('/', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const rows = await repo.listForms(pool);
    res.json(rows);
  }catch(e){ res.status(500).json({ message: e.message || 'server_error' }); }
});

router.post('/', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const data = req.body || {};
    const row = await repo.createForm(pool, data);
    res.status(201).json(row);
  }catch(e){ res.status(400).json({ message: e.message || 'invalid_data' }); }
});

router.put('/:id', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const id = parseInt(req.params.id||'0');
    const data = req.body || {};
    const row = await repo.updateForm(pool, id, data);
    res.json(row);
  }catch(e){ res.status(400).json({ message: e.message || 'invalid_data' }); }
});

router.delete('/:id', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const id = parseInt(req.params.id||'0');
    const row = await repo.deleteForm(pool, id);
    res.json(row);
  }catch(e){ res.status(400).json({ message: e.message || 'invalid_data' }); }
});

router.get('/:id/submissions', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const id = parseInt(req.params.id||'0');
    const page = parseInt(req.query.page||'1');
    const limit = parseInt(req.query.limit||'20');
    const data = await repo.listSubmissions(pool, id, { page, limit });
    res.json({ items: data.items, page, limit, total: data.total });
  }catch(e){ res.status(500).json({ message: e.message || 'server_error' }); }
});

module.exports = router;
