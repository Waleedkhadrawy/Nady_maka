const express = require('express');
const router = express.Router();
const { memberOnly } = require('../middleware/roles');
const mrepo = require('../repositories/memberRepo');
const pkrepo = require('../repositories/packageRepo');
const msrepo = require('../repositories/membershipRepo');
const prepo = require('../repositories/paymentRepo');
const arepo = require('../repositories/activityRepo');
const erepo = require('../repositories/eventRepo');
const brepo = require('../repositories/bookingRepo');

router.get('/profile', memberOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const mid = Number(req.user.member_id);
    const me = await mrepo.getMemberById(pool, mid);
    const subs = await pool.query('SELECT id, name, email, phone, gender, dob, type, relation, status FROM members WHERE parent_member_id=? ORDER BY id',[mid]).then(r=>r[0]);
    const memberships = await msrepo.listMembershipsByMember(pool, mid);
    res.json({ me, subs, memberships });
  }catch(e){ res.status(500).json({ message: e.message || 'Server error' }); }
});

router.put('/profile', memberOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const mid = Number(req.user.member_id);
    const row = await mrepo.updateMember(pool, mid, req.body||{});
    res.json(row);
  }catch(e){ res.status(400).json({ message: e.message || 'Invalid data' }); }
});

router.get('/sub-members', memberOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const mid = Number(req.user.member_id);
    const [rows] = await pool.query('SELECT id, name, email, phone, gender, dob, type, relation, status FROM members WHERE parent_member_id=? ORDER BY id',[mid]);
    res.json(rows);
  }catch(e){ res.status(500).json({ message: e.message || 'Server error' }); }
});

router.post('/sub-members', memberOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const mid = Number(req.user.member_id);
    const data = req.body||{};
    const row = await mrepo.createMember(pool, { customer_id: null, name: data.name, email: data.email, phone: data.phone, gender: data.gender, dob: data.dob, type: 'sub', parent_member_id: mid, relation: data.relation, status: 'active', join_date: new Date().toISOString().slice(0,10) });
    res.status(201).json(row);
  }catch(e){ res.status(400).json({ message: e.message || 'Invalid data' }); }
});

router.post('/memberships/checkout', memberOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const mid = Number(req.user.member_id);
    const { package_code, amount, currency, method, note } = req.body||{};
    const pkg = await pkrepo.getPackageByCode(pool, package_code);
    if (!pkg) return res.status(400).json({ message: 'package_not_found' });
    if (pkg.segment === 'sub') return res.status(400).json({ message: 'invalid_segment_for_primary_member' });
    const calcAge = (dob)=>{
      if (!dob) return null;
      const dt = new Date(dob);
      const now = new Date();
      let age = now.getFullYear() - dt.getFullYear();
      const m = now.getMonth() - dt.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < dt.getDate())) age--;
      return age;
    };
    const me = await mrepo.getMemberById(pool, mid);
    const age = calcAge(me?.dob);
    if (age !== null){
      if (pkg.min_age !== null && pkg.min_age !== undefined && age < pkg.min_age) return res.status(400).json({ message: 'age_not_eligible' });
      if (pkg.max_age !== null && pkg.max_age !== undefined && age > pkg.max_age) return res.status(400).json({ message: 'age_not_eligible' });
    }
    const created = await msrepo.createMembershipForMember(pool, mid, package_code, new Date().toISOString(), 'pending', note||null);
    const orepo = require('../repositories/orderRepo');
    const order = await orepo.createOrder(pool, {
      member_id: mid,
      subject_type: 'main_membership',
      subject_id: created.id,
      status: 'pending',
      amount: amount || 0,
      currency: currency || 'SAR',
      payment_method: method || 'manual',
      provider: null,
      provider_ref: null,
      expires_at: null,
    });
    const pay = await prepo.createPayment(pool, { membership_id: created.id, amount: amount||0, currency: currency||'SAR', method: method||'manual', status: 'initiated', ref: null });
    if ((method||'manual') === 'manual'){
      await prepo.updatePaymentStatus(pool, pay.id, 'paid');
      await orepo.updateOrderStatus(pool, order.id, 'paid');
      await msrepo.updateMembershipStatus(pool, created.id, 'active');
      return res.status(201).json({ id: created.id, order_id: order.id, status: 'active', join_date: created.join_date, expiry_date: created.expiry_date, payment_id: pay.id });
    }
    res.status(201).json({ id: created.id, order_id: order.id, status: 'pending', payment_id: pay.id, payment_url: '#' });
  }catch(e){ res.status(400).json({ message: e.message || 'Invalid data' }); }
});

router.post('/sub-members/:subId/memberships/checkout', memberOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const subId = Number(req.params.subId);
    const { package_code, amount, currency, method, note } = req.body||{};
    const sub = await mrepo.getMemberById(pool, subId);
    if (!sub || sub.type !== 'sub') return res.status(404).json({ message: 'sub_member_not_found' });
    const mid = Number(req.user.member_id);
    const [[primaryActive]] = await pool.query("SELECT COUNT(*) AS c FROM memberships WHERE member_id=? AND status='active'",[mid]);
    if (!primaryActive || !primaryActive.c){ return res.status(400).json({ message: 'primary_membership_not_active' }); }
    const pkg = await pkrepo.getPackageByCode(pool, package_code);
    if (!pkg || pkg.segment !== 'sub') return res.status(400).json({ message: 'invalid_segment_for_sub_member' });
    const calcAge = (dob)=>{
      if (!dob) return null;
      const dt = new Date(dob);
      const now = new Date();
      let age = now.getFullYear() - dt.getFullYear();
      const m = now.getMonth() - dt.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < dt.getDate())) age--;
      return age;
    };
    const age = calcAge(sub?.dob);
    if (age !== null){
      if (pkg.min_age !== null && pkg.min_age !== undefined && age < pkg.min_age) return res.status(400).json({ message: 'age_not_eligible' });
      if (pkg.max_age !== null && pkg.max_age !== undefined && age > pkg.max_age) return res.status(400).json({ message: 'age_not_eligible' });
    }
    const created = await msrepo.createMembershipForMember(pool, subId, package_code, new Date().toISOString(), 'pending', note||null);
    const orepo = require('../repositories/orderRepo');
    const order = await orepo.createOrder(pool, {
      member_id: subId,
      subject_type: 'dependent_membership',
      subject_id: created.id,
      status: 'pending',
      amount: amount || 0,
      currency: currency || 'SAR',
      payment_method: method || 'manual',
      provider: null,
      provider_ref: null,
      expires_at: null,
    });
    const pay = await prepo.createPayment(pool, { membership_id: created.id, amount: amount||0, currency: currency||'SAR', method: method||'manual', status: 'initiated', ref: null });
    if ((method||'manual') === 'manual'){
      await prepo.updatePaymentStatus(pool, pay.id, 'paid');
      await orepo.updateOrderStatus(pool, order.id, 'paid');
      await msrepo.updateMembershipStatus(pool, created.id, 'active');
      return res.status(201).json({ id: created.id, order_id: order.id, status: 'active', join_date: created.join_date, expiry_date: created.expiry_date, payment_id: pay.id });
    }
    res.status(201).json({ id: created.id, order_id: order.id, status: 'pending', payment_id: pay.id, payment_url: '#' });
  }catch(e){ res.status(400).json({ message: e.message || 'Invalid data' }); }
});

module.exports = router;
router.get('/activities/enrollments', memberOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const mid = Number(req.user.member_id);
    const [rows] = await pool.query('SELECT e.id, e.activity_id, a.name, e.enrolled_at FROM enrollments e JOIN activities a ON e.activity_id=a.id WHERE e.member_id=? ORDER BY e.enrolled_at DESC',[mid]);
    res.json(rows);
  }catch(e){ res.status(500).json({ message: e.message || 'Server error' }); }
});

router.post('/activities/:id/enroll', memberOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const mid = Number(req.user.member_id);
    const aid = Number(req.params.id);
    const activity = await arepo.getActivityById(pool, aid);
    if (!activity) return res.status(404).json({ message: 'not_found' });
    const count = await arepo.countEnrollments(pool, aid);
    if (activity.capacity && count >= activity.capacity) return res.status(400).json({ message: 'capacity_full' });
    const row = await arepo.addEnrollment(pool, mid, aid);
    res.status(201).json(row);
  }catch(e){ res.status(400).json({ message: e.message || 'Invalid data' }); }
});

router.get('/events/registrations', memberOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const mid = Number(req.user.member_id);
    const [rows] = await pool.query('SELECT r.id, r.event_id, e.title, r.registered_at FROM event_registrations r JOIN events e ON r.event_id=e.id WHERE r.member_id=? ORDER BY r.registered_at DESC',[mid]);
    res.json(rows);
  }catch(e){ res.status(500).json({ message: e.message || 'Server error' }); }
});

router.post('/events/:id/register', memberOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const mid = Number(req.user.member_id);
    const eid = Number(req.params.id);
    const event = await erepo.getEventById(pool, eid);
    if (!event) return res.status(404).json({ message: 'not_found' });
    const count = await erepo.countRegistrations(pool, eid);
    if (event.max_participants && count >= event.max_participants) return res.status(400).json({ message: 'capacity_full' });
    const row = await erepo.createRegistration(pool, eid, mid);
    res.status(201).json(row);
  }catch(e){ res.status(400).json({ message: e.message || 'Invalid data' }); }
});

router.get('/bookings', memberOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const mid = Number(req.user.member_id);
    const [rows] = await pool.query('SELECT id, activity_id, event_id, scheduled_at, notes, status FROM bookings WHERE member_id=? ORDER BY scheduled_at DESC',[mid]);
    res.json(rows);
  }catch(e){ res.status(500).json({ message: e.message || 'Server error' }); }
});

router.post('/bookings', memberOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const mid = Number(req.user.member_id);
    const body = req.body||{};
    const scheduled_at = body.date && body.time ? `${body.date} ${body.time}` : body.scheduled_at || null;
    const row = await brepo.createBooking(pool, { member_id: mid, activity_id: body.activity_id, event_id: body.event_id, scheduled_at, notes: body.notes, status: 'pending' });
    res.status(201).json(row);
  }catch(e){ res.status(400).json({ message: e.message || 'Invalid data' }); }
});

router.get('/payments', memberOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const mid = Number(req.user.member_id);
    const [rows] = await pool.query('SELECT p.id, p.membership_id, p.amount, p.currency, p.method, p.status, p.ref, p.paid_at FROM payments p JOIN memberships m ON p.membership_id=m.id WHERE m.member_id=? ORDER BY p.paid_at DESC',[mid]);
    res.json(rows);
  }catch(e){ res.status(500).json({ message: e.message || 'Server error' }); }
});
