const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { adminOnly } = require('../middleware/roles');
const repo = require('../repositories/eventRepo');

router.get('/', async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const { q, status, category, from, to, sort, order } = req.query;
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '20');
    const filters = { q, status, category, from, to, sort, order, page, limit };
    const items = await repo.listEvents(pool, filters);
    const total = await repo.eventsTotal(pool, filters);
    res.json({ items, page, limit, total });
  }catch(e){
    res.status(500).json({ message: e.message || 'Server error' });
  }
});

router.post('/', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const row = await repo.createEvent(pool, req.body);
    res.status(201).json(row);
  }catch(e){
    res.status(400).json({ message: e.message || 'Invalid data' });
  }
});

router.put('/:id', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const id = Number(req.params.id);
    const row = await repo.updateEvent(pool, id, req.body);
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
    await repo.deleteEvent(pool, id);
    res.json({ success:true });
  }catch(e){
    res.status(500).json({ message: e.message || 'Server error' });
  }
});

router.post('/:id/register', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const id = Number(req.params.id);
    const { member_id } = req.body;
    const event = await repo.getEventById(pool, id);
    if(!event) return res.status(404).json({ message: 'Not found' });
    const count = await repo.countRegistrations(pool, id);
    if(event.max_participants && count >= event.max_participants) return res.status(400).json({ message: 'capacity_full' });
    const row = await repo.createRegistration(pool, id, Number(member_id));
    res.status(201).json(row);
  }catch(e){
    res.status(400).json({ message: e.message || 'Invalid data' });
  }
});

module.exports = router;
