const express = require('express');
const router = express.Router();
const repo = require('../repositories/bookingRepo');
const auth = require('../middleware/auth');
const { adminOnly } = require('../middleware/roles');

function resolveScheduledAt(body = {}) {
  const composed = body.date && body.time ? `${body.date} ${body.time}` : body.scheduled_at;
  if (!composed) return null;
  const dt = new Date(composed);
  if (Number.isNaN(dt.getTime())) return null;
  return dt.toISOString();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

router.post('/', async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    if (!pool) return res.status(503).json({ message: 'database_unavailable' });
    const body = req.body || {};
    const scheduled_at = resolveScheduledAt(body);
    if (!scheduled_at) return res.status(400).json({ message: 'invalid_scheduled_at' });
    if (!body.member_id) {
      if (!body.name || !String(body.name).trim()) return res.status(400).json({ message: 'name_required' });
      if (!body.phone || String(body.phone).replace(/\D/g, '').length < 8) return res.status(400).json({ message: 'invalid_phone' });
      if (!body.email || !isValidEmail(body.email)) return res.status(400).json({ message: 'invalid_email' });
      if (!body.service || !String(body.service).trim()) return res.status(400).json({ message: 'service_required' });
    }
    const row = await repo.createBooking(pool, { member_id: body.member_id, activity_id: body.activity_id, event_id: body.event_id, scheduled_at, notes: body.notes, status: 'pending', name: body.name, phone: body.phone, email: body.email, service: body.service });
    res.status(201).json(row);
  }catch(e){
    res.status(400).json({ message: e.message || 'Invalid data' });
  }
});

router.get('/', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const { q, status, from, to, sort, order } = req.query;
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '20');
    const filters = { q, status, from, to, sort, order, page, limit };
    const items = await repo.listBookings(pool, filters);
    const total = await repo.bookingsTotal(pool, filters);
    res.json({ items, page, limit, total });
  }catch(e){
    res.status(500).json({ message: e.message || 'Server error' });
  }
});

module.exports = router;
