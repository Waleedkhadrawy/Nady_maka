const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { adminOnly } = require('../middleware/roles');
const repo = require('../repositories/activityRepo');
const tRepo = require('../repositories/trainerRepo');

router.get('/', async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const { q, category, age_group, status, sort, order } = req.query;
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '20');
    const filters = { q, category, age_group, status, sort, order, page, limit };
    const items = await repo.listActivities(pool, filters);
    const total = await repo.activitiesTotal(pool, filters);
    res.json({ items, page, limit, total });
  }catch(e){
    res.status(500).json({ message: e.message || 'Server error' });
  }
});

router.post('/', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const row = await repo.createActivity(pool, req.body);
    res.status(201).json(row);
  }catch(e){
    res.status(400).json({ message: e.message || 'Invalid data' });
  }
});

router.put('/:id', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const id = Number(req.params.id);
    const row = await repo.updateActivity(pool, id, req.body);
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
    await repo.deleteActivity(pool, id);
    res.json({ success:true });
  }catch(e){
    res.status(500).json({ message: e.message || 'Server error' });
  }
});

router.post('/:id/schedules', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const id = Number(req.params.id);
    const activity = await repo.getActivityById(pool,id);
    if(!activity) return res.status(404).json({ message: 'Not found' });
    const schedules = Array.isArray(req.body) ? req.body : [];
    await repo.clearActivitySchedules(pool, id);
    for(const s of schedules){
      await repo.addActivitySchedule(pool, { activity_id: id, day_of_week: Number(s.day_of_week), start_time: s.start_time, end_time: s.end_time });
    }
    res.json({ success:true });
  }catch(e){
    res.status(400).json({ message: e.message || 'Invalid data' });
  }
});

router.post('/:id/trainers/:trainerId', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const id = Number(req.params.id);
    const tid = Number(req.params.trainerId);
    const activity = await repo.getActivityById(pool,id);
    const trainer = await tRepo.getTrainerById(pool,tid);
    if(!activity || !trainer) return res.status(404).json({ message: 'Not found' });
    await repo.addActivityTrainer(pool, id, tid);
    res.json({ success:true });
  }catch(e){
    res.status(400).json({ message: e.message || 'Invalid data' });
  }
});

router.post('/:id/enroll', auth, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const id = Number(req.params.id);
    const { member_id } = req.body;
    const activity = await repo.getActivityById(pool,id);
    if(!activity) return res.status(404).json({ message: 'Not found' });
    const count = await repo.countEnrollments(pool, id);
    if(activity.capacity && count >= activity.capacity) return res.status(400).json({ message: 'capacity_full' });
    const row = await repo.addEnrollment(pool, Number(member_id), id);
    res.status(201).json(row);
  }catch(e){
    res.status(400).json({ message: e.message || 'Invalid data' });
  }
});

module.exports = router;
