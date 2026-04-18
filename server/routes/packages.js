const express = require('express');
const router = express.Router();
const repo = require('../repositories/packageRepo');
const auth = require('../middleware/auth');
const { adminOnly } = require('../middleware/roles');
const { requireFields } = require('../middleware/validate');

router.get('/', async (req, res) => {
  try {
    const pool = req.app.locals.mysql;
    const { segment } = req.query;
    if (!pool) return res.status(500).json({ message: 'mysql disabled' });
    const rows = await repo.listPackages(pool, segment);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message || 'Server error' });
  }
});

router.get('/:code', async (req, res) => {
  try {
    const pool = req.app.locals.mysql;
    if (!pool) return res.status(500).json({ message: 'mysql disabled' });
    const row = await repo.getPackageByCode(pool, req.params.code);
    if (!row) return res.status(404).json({ message: 'Not found' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ message: e.message || 'Server error' });
  }
});

router.post('/', auth, adminOnly, requireFields(['code','label','period_days','segment']), async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const row = await repo.createPackage(pool, req.body||{});
    res.status(201).json(row);
  }catch(e){ res.status(400).json({ message: e.message || 'Invalid data' }); }
});

router.put('/:id', auth, adminOnly, requireFields(['code','label','period_days','segment']), async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const id = Number(req.params.id);
    const row = await repo.updatePackage(pool, id, req.body||{});
    if (!row) return res.status(404).json({ message: 'Not found' });
    res.json(row);
  }catch(e){ res.status(400).json({ message: e.message || 'Invalid data' }); }
});

router.delete('/:id', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const id = Number(req.params.id);
    await repo.deletePackage(pool, id);
    res.json({ success:true });
  }catch(e){ res.status(500).json({ message: e.message || 'Server error' }); }
});

module.exports = router;
