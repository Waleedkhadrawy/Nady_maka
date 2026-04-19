const express = require('express');
const router = express.Router();
const repo = require('../repositories/reportRepo');
const auth = require('../middleware/auth');
const { adminOnly } = require('../middleware/roles');
const memberRepo = require('../repositories/memberRepo');
const membershipRepo = require('../repositories/membershipRepo');
const paymentRepo = require('../repositories/paymentRepo');
const activityRepo = require('../repositories/activityRepo');
const trainerRepo = require('../repositories/trainerRepo');
const eventRepo = require('../repositories/eventRepo');
const bookingRepo = require('../repositories/bookingRepo');

router.get('/', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const summary = await repo.getSummary(pool);
    res.json(summary);
  }catch(e){
    res.status(500).json({ message: e.message || 'Server error' });
  }
});

function esc(v){
  if (v === null || v === undefined) return '';
  const s = String(v).replace(/"/g,'""');
  return /[",\n]/.test(s) ? `"${s}"` : s;
}

router.get('/export', auth, adminOnly, async (req, res) => {
  try {
    const pool = req.app.locals.mysql;
    const type = String(req.query.type || '').trim();
    if (!type) return res.status(400).json({ message: 'missing_type' });
    let headers = [];
    let rows = [];
  const common = {
    page: 1,
    limit: 100000,
  };
    if (type === 'summary') {
      const s = await repo.getSummary(pool);
      headers = [
        'members_total','members_active','members_frozen','members_expired',
        'memberships_total','memberships_active','memberships_frozen','memberships_expired',
        'activities_total','trainers_total','events_upcoming','bookings_total','payments_count','payments_sum'
      ];
      rows = [[
        s.members.total, s.members.active, s.members.frozen, s.members.expired,
        s.memberships.total, s.memberships.active, s.memberships.frozen, s.memberships.expired,
        s.activities.total, s.trainers.total, s.events.upcoming, s.bookings.total, s.payments.count, s.payments.sum
      ]];
    } else if (type === 'memberships') {
      const [items] = await pool.query(
        `SELECT m.id, m.member_id, p.code AS package_code, p.label AS package_label, p.segment, p.period_days, m.join_date, m.expiry_date, m.status
         FROM memberships m JOIN membership_packages p ON m.package_id = p.id
         ORDER BY m.join_date DESC`
      );
      headers = ['id','member_id','package_code','package_label','segment','period_days','join_date','expiry_date','status'];
      rows = items.map(r => [r.id, r.member_id, r.package_code, r.package_label, r.segment, r.period_days, r.join_date, r.expiry_date, r.status]);
    } else if (type === 'members') {
      const filters = { q: req.query.q, type: req.query.member_type, status: req.query.status, sort: 'id', order: 'ASC', ...common };
      const items = await memberRepo.listMembers(pool, filters);
      headers = ['id','name','email','phone','gender','dob','type','status','join_date'];
      rows = items.map(r => [r._id, r.name, r.email, r.phone, r.gender, r.dob, r.type, r.status, r.join_date]);
    } else if (type === 'payments') {
      const filters = { from: req.query.from, to: req.query.to, q: req.query.q, status: req.query.status, method: req.query.method, sort: 'paid_at', order: 'DESC', ...common };
      const items = await paymentRepo.listPayments(pool, filters);
      headers = ['id','membership_id','amount','currency','method','status','ref','paid_at'];
      rows = items.map(p => [p.id, p.membership_id, p.amount, p.currency, p.method, p.status, p.ref, p.paid_at]);
    } else if (type === 'activities') {
      const filters = { q: req.query.q, category: req.query.category, age_group: req.query.age_group, status: req.query.status, sort: 'id', order: 'ASC', ...common };
      const items = await activityRepo.listActivities(pool, filters);
      headers = ['id','name','category','age_group','duration_minutes','price','currency','capacity','status'];
      rows = items.map(a => [a.id, a.name, a.category, a.age_group, a.duration_minutes, a.price, a.currency, a.capacity, a.status]);
    } else if (type === 'trainers') {
      const filters = { q: req.query.q, status: req.query.status, sort: 'id', order: 'ASC', ...common };
      const items = await trainerRepo.listTrainers(pool, filters);
      headers = ['id','name','email','phone','specialization','experience_years','certification','status'];
      rows = items.map(t => [t.id, t.name, t.email, t.phone, t.specialization, t.experience_years, t.certification, t.status]);
    } else if (type === 'events') {
      const filters = { q: req.query.q, status: req.query.status, category: req.query.category, from: req.query.from, to: req.query.to, sort: 'date', order: 'ASC', ...common };
      const items = await eventRepo.listEvents(pool, filters);
      headers = ['id','title','date','time','location','category','registration_fee','currency','max_participants','status'];
      rows = items.map(ev => [ev.id, ev.title, ev.date, ev.time, ev.location, ev.category, ev.registration_fee, ev.currency, ev.max_participants, ev.status]);
    } else if (type === 'bookings') {
      const filters = { q: req.query.q, status: req.query.status, from: req.query.from, to: req.query.to, sort: 'scheduled_at', order: 'DESC', ...common };
      const items = await bookingRepo.listBookings(pool, filters);
      headers = ['id','member_id','activity_id','event_id','scheduled_at','notes','status'];
      rows = items.map(b => [b.id, b.member_id, b.activity_id, b.event_id, b.scheduled_at, b.notes, b.status]);
    } else {
      return res.status(400).json({ message: 'invalid_type' });
    }
    const csv = [headers.map(esc).join(','), ...rows.map(r => r.map(esc).join(','))].join('\n');
    res.set('Content-Type', 'text/csv; charset=utf-8');
    res.set('Content-Disposition', `attachment; filename="${type}.csv"`);
    res.send(csv);
  } catch (e) {
    res.status(500).json({ message: e.message || 'Server error' });
  }
});

module.exports = router;
