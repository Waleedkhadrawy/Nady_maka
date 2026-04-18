const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { adminOnly } = require('../middleware/roles');
const repo = require('../repositories/settingsRepo');

router.get('/', async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const row = await repo.getSettings(pool);
    res.json(row || {});
  }catch(e){
    res.status(500).json({ message: e.message || 'Server error' });
  }
});

router.put('/', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const row = await repo.upsertSettings(pool, req.body || {});
    res.json(row);
  }catch(e){
    res.status(400).json({ message: e.message || 'Invalid data' });
  }
});

module.exports = router;
