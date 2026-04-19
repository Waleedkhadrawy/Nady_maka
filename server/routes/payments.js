const express = require('express');
const router = express.Router();
const mrepo = require('../repositories/membershipRepo');
const prepo = require('../repositories/paymentRepo');
const orepo = require('../repositories/orderRepo');
const auth = require('../middleware/auth');
const { adminOnly } = require('../middleware/roles');
const { requireFields } = require('../middleware/validate');
const { rateLimiter } = require('../middleware/rateLimiter');
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}
function isValidSaudiMobile(phone) {
  return /^05\d{8}$/.test(String(phone || '').trim());
}
function isValidNationalId(id) {
  return /^\d{10}$/.test(String(id || '').trim());
}
function normalizePaymentMethod(method) {
  const value = String(method || '').trim().toLowerCase();
  if (value === 'manual') return 'cash';
  return value || 'cash';
}

router.post('/checkout', rateLimiter({ windowMs: 60000, max: 20 }), requireFields(['user','membership']), async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const body = req.body || {};
    const { user, partner, membership, amount, currency, method, note, ref } = body;
    if (!user || !membership) return res.status(400).json({ message: 'invalid payload' });
    if (!user.username || !String(user.username).trim()) return res.status(400).json({ message: 'name_required' });
    if (!user.email || !isValidEmail(user.email)) return res.status(400).json({ message: 'invalid_email' });
    if (!user.phone || !isValidSaudiMobile(user.phone)) return res.status(400).json({ message: 'invalid_phone_sa' });
    if (!user.nationalId || !isValidNationalId(user.nationalId)) return res.status(400).json({ message: 'invalid_national_id' });
    if (!user.gender) return res.status(400).json({ message: 'gender_required' });
    if (!user.dob) return res.status(400).json({ message: 'dob_required' });
    if (!membership.value) return res.status(400).json({ message: 'package_required' });
    const paymentMethod = normalizePaymentMethod(method || body?.payment?.method);
    if (!['cash', 'card', 'bank_transfer'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'invalid_payment_method' });
    }
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
    if (!customer) {
      customer = await mrepo.createCustomer(pool, {
        name: user.username,
        email: user.email,
        phone: user.phone,
        national_id: user.nationalId,
        job_title: user.jobTitle,
        address: user.address
      });
    }
    let member = await mrepo.findMemberByCustomerId(pool, customer.id);
    if (!member) {
      member = await mrepo.createMember(pool, {
        customer_id: customer.id,
        name: user.username,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dob: user.dob,
        national_id: user.nationalId,
        job_title: user.jobTitle,
        address: user.address,
        join_date: today,
        type: 'primary'
      });
    }
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
      payment_method: paymentMethod,
      provider: null,
      provider_ref: ref || null,
      expires_at: null,
    });
    const pay = await prepo.createPayment(pool, { membership_id: created.id, amount: amount || 0, currency: currency || 'SAR', method: paymentMethod, status: 'initiated', ref: ref || null });
    // كل الطرق تبقى قيد المراجعة حتى يوافق الأدمن من «إدارة الطلبات» (أو Webhook للدفع الإلكتروني)
    res.status(201).json({
      id: created.id,
      orderId: order.id,
      status: 'pending',
      joinDate: created.join_date,
      expiryDate: created.expiry_date,
      paymentId: pay.id,
      payment_url: paymentMethod === 'card' ? '#' : null,
    });
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
