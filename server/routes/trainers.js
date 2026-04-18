const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { adminOnly } = require('../middleware/roles');
const repo = require('../repositories/trainerRepo');

router.get('/', async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const { q, status, sort, order } = req.query;
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '20');
    const filters = { q, status, sort, order, page, limit };
    const items = await repo.listTrainers(pool, filters);
    const total = await repo.trainersTotal(pool, filters);
    res.json({ items, page, limit, total });
  }catch(e){
    res.status(500).json({ message: e.message || 'Server error' });
  }
});

router.post('/', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const row = await repo.createTrainer(pool, req.body);
    res.status(201).json(row);
  }catch(e){
    res.status(400).json({ message: e.message || 'Invalid data' });
  }
});

router.put('/:id', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const id = Number(req.params.id);
    const row = await repo.updateTrainer(pool, id, req.body);
    if(!row) return res.status(404).json({ message: 'Not found' });
    res.json(row);
  }catch(e){
    res.status(400).json({ message: e.message || 'Invalid data' });
  }
});

router.delete('/:id', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const id = Number(req.params.id);
    await repo.deleteTrainer(pool, id);
    res.json({ success:true });
  }catch(e){
    res.status(500).json({ message: e.message || 'Server error' });
  }
});

module.exports = router;
