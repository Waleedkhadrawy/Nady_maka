const express = require('express');
const router = express.Router();
const repo = require('../repositories/bookingRepo');
const auth = require('../middleware/auth');
const { adminOnly } = require('../middleware/roles');

const ALLOWED_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed', 'rejected'];

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

// ─── Create Booking ───────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const pool = req.app.locals.mysql;
    if (!pool) return res.status(503).json({ message: 'database_unavailable' });
    const body = req.body || {};
    const scheduled_at = resolveScheduledAt(body);
    if (!scheduled_at) return res.status(400).json({ message: 'invalid_scheduled_at' });

    // Validate past dates
    if (new Date(scheduled_at) < new Date()) {
      return res.status(400).json({ message: 'booking_in_past' });
    }

    if (!body.member_id) {
      if (!body.name || !String(body.name).trim()) return res.status(400).json({ message: 'name_required' });
      if (!body.phone || String(body.phone).replace(/\D/g, '').length < 8) return res.status(400).json({ message: 'invalid_phone' });
      if (!body.email || !isValidEmail(body.email)) return res.status(400).json({ message: 'invalid_email' });
      if (!body.service || !String(body.service).trim()) return res.status(400).json({ message: 'service_required' });
    }

    // Check for conflicting booking (same member/service ± 30 min)
    const conflict = await repo.checkBookingConflict(pool, {
      scheduled_at,
      service: body.service,
      member_id: body.member_id || null,
    });
    if (conflict) return res.status(409).json({ message: 'booking_conflict' });

    const row = await repo.createBooking(pool, {
      member_id: body.member_id,
      activity_id: body.activity_id,
      event_id: body.event_id,
      scheduled_at,
      notes: body.notes,
      status: 'pending',
      name: body.name,
      phone: body.phone,
      email: body.email,
      service: body.service,
    });
    res.status(201).json(row);
  } catch (e) {
    res.status(400).json({ message: e.message || 'Invalid data' });
  }
});

// ─── List Bookings (Admin only) ───────────────────────────────────────────────
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const pool = req.app.locals.mysql;
    if (!pool) return res.status(503).json({ message: 'database_unavailable' });
    const { q, status, from, to, sort, order } = req.query;
    const page  = parseInt(req.query.page  || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const filters = { q, status, from, to, sort, order, page, limit };
    const items = await repo.listBookings(pool, filters);
    const total = await repo.bookingsTotal(pool, filters);
    res.json({ items, page, limit, total });
  } catch (e) {
    res.status(500).json({ message: e.message || 'Server error' });
  }
});

// ─── Update Booking Status (Admin only) ──────────────────────────────────────
router.put('/:id/status', auth, adminOnly, async (req, res) => {
  try {
    const pool = req.app.locals.mysql;
    if (!pool) return res.status(503).json({ message: 'database_unavailable' });
    const id = Number(req.params.id);
    const { status } = req.body || {};
    if (!ALLOWED_STATUSES.includes(status)) return res.status(400).json({ message: 'invalid_status' });
    const row = await repo.updateBookingStatus(pool, id, status);
    if (!row) return res.status(404).json({ message: 'not_found' });
    res.json(row);
  } catch (e) {
    res.status(400).json({ message: e.message || 'Invalid data' });
  }
});

// ─── Delete Booking (Admin only) ──────────────────────────────────────────────
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const pool = req.app.locals.mysql;
    if (!pool) return res.status(503).json({ message: 'database_unavailable' });
    const id = Number(req.params.id);
    const deleted = await repo.deleteBooking(pool, id);
    if (!deleted) return res.status(404).json({ message: 'not_found' });
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ message: e.message || 'Server error' });
  }
});

module.exports = router;
