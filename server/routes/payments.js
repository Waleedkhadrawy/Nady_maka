const express = require('express');
const router = express.Router();
const mrepo = require('../repositories/membershipRepo');
const prepo = require('../repositories/paymentRepo');
const orepo = require('../repositories/orderRepo');
const auth = require('../middleware/auth');
const { adminOnly } = require('../middleware/roles');
const { requireFields } = require('../middleware/validate');
const { rateLimiter } = require('../middleware/rateLimiter');

router.post('/checkout', rateLimiter({ windowMs: 60000, max: 20 }), requireFields(['user','membership']), async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const body = req.body || {};
    const { user, partner, membership, amount, currency, method, note, ref } = body;
    if (!user || !membership) return res.status(400).json({ message: 'invalid payload' });
    const pkg = await mrepo.getPackageByCode(pool, membership.value);
    if (!pkg) return res.status(400).json({ message: 'package not found' });
    const calcAge = (dob)=>{
      if (!dob) return null;
      const d = new Date(dob);
      const todayD = new Date();
      let age = todayD.getFullYear() - d.getFullYear();
      const m = todayD.getMonth() - d.getMonth();
      if (m < 0 || (m === 0 && todayD.getDate() < d.getDate())) age--;
      return age;
    };
    const age = calcAge(user.dob);
    if (age !== null){
      if (pkg.min_age !== null && pkg.min_age !== undefined && age < pkg.min_age) return res.status(400).json({ message: 'age_not_eligible' });
      if (pkg.max_age !== null && pkg.max_age !== undefined && age > pkg.max_age) return res.status(400).json({ message: 'age_not_eligible' });
    }
    const today = new Date().toISOString().slice(0,10);
    let customer = await mrepo.findCustomerByEmail(pool, user.email);
    if (!customer) customer = await mrepo.createCustomer(pool, { name: user.username, email: user.email, phone: user.phone });
    let member = await mrepo.findMemberByCustomerId(pool, customer.id);
    if (!member) member = await mrepo.createMember(pool, { customer_id: customer.id, name: user.username, email: user.email, phone: user.phone, gender: user.gender, dob: user.dob, join_date: today, type: 'primary' });
    if (pkg.allow_partner && partner && partner.name) {
      const existing = await mrepo.findPartnerByMemberId(pool, member.id);
      if (!existing) await mrepo.createPartner(pool, { member_id: member.id, name: partner.name, email: partner.email, birth_date: partner.birthDate, phone: partner.phone });
      else await mrepo.updatePartner(pool, existing.id, { name: partner.name, email: partner.email, birth_date: partner.birthDate, phone: partner.phone });
    }
    const created = await mrepo.createMembershipForMember(pool, member.id, pkg.code, today, 'pending', note||null);
    const order = await orepo.createOrder(pool, {
      member_id: member.id,
      subject_type: 'main_membership',
      subject_id: created.id,
      status: 'pending',
      amount: amount || 0,
      currency: currency || 'SAR',
      payment_method: method || 'manual',
      provider: null,
      provider_ref: ref || null,
      expires_at: null,
    });
    const pay = await prepo.createPayment(pool, { membership_id: created.id, amount: amount || 0, currency: currency || 'SAR', method: method || 'manual', status: 'initiated', ref: ref || null });
    if ((method||'manual') === 'manual'){
      await prepo.updatePaymentStatus(pool, pay.id, 'paid');
      await orepo.updateOrderStatus(pool, order.id, 'paid');
      await mrepo.updateMembershipStatus(pool, created.id, 'active');
      return res.status(201).json({ id: created.id, orderId: order.id, status: 'active', joinDate: created.join_date, expiryDate: created.expiry_date, paymentId: pay.id });
    }
    res.status(201).json({ id: created.id, orderId: order.id, status: 'pending', paymentId: pay.id, payment_url: '#'});
  }catch(e){
    res.status(400).json({ message: e.message || 'Invalid data' });
  }
});

module.exports = router;
router.get('/', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const { from, to, q, status, method, sort, order } = req.query;
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '20');
    const filters = { from, to, q, status, method, sort, order, page, limit };
    const rows = await prepo.listPayments(pool, filters);
    const summary = await prepo.paymentsSummary(pool, filters);
    const total = await prepo.paymentsTotal(pool, filters);
    res.json({ items: rows, summary, page, limit, total });
  }catch(e){
    res.status(500).json({ message: e.message || 'Server error' });
  }
});

router.post('/webhook/:provider', async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const provider = req.params.provider;
    const b = req.body || {};
    const orderId = parseInt(b.order_id||'0');
    const status = String(b.status||'');
    if (!orderId || !status) return res.status(400).json({ message: 'invalid_payload' });
    const order = await orepo.getOrderById(pool, orderId);
    if (!order) return res.status(404).json({ message: 'order_not_found' });
    if (status === 'captured'){
      await orepo.updateOrderStatus(pool, orderId, 'paid');
      await mrepo.updateMembershipStatus(pool, order.subject_id, 'active');
      return res.status(200).json({ ok: true });
    }
    if (status === 'failed'){
      await orepo.updateOrderStatus(pool, orderId, 'failed');
      return res.status(200).json({ ok: true });
    }
    res.status(200).json({ ok: true });
  }catch(e){ res.status(500).json({ message: e.message || 'server_error' }); }
});
