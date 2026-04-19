const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const repo = require('../repositories/membershipRepo');
const { requireFields } = require('../middleware/validate');
const { rateLimiter } = require('../middleware/rateLimiter');
const prepo = require('../repositories/paymentRepo');
const auth = require('../middleware/auth');
const { adminOnly } = require('../middleware/roles');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}
function isValidSaudiMobile(phone) {
  return /^05\d{8}$/.test(String(phone || '').trim());
}
function isValidNationalId(id) {
  return /^\d{10}$/.test(String(id || '').trim());
}

router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const pool = req.app.locals.mysql;
    if (!pool) return res.status(503).json({ message: 'database_unavailable' });
    const page = Math.max(parseInt(req.query.page || '1', 10) || 1, 1);
    const limit = Math.max(Math.min(parseInt(req.query.limit || '20', 10) || 20, 100), 1);
    const offset = (page - 1) * limit;
    const [items] = await pool.query(
      `SELECT m.id, m.member_id, m.package_id, m.join_date, m.expiry_date, m.status, m.note, p.code, p.label
       FROM memberships m
       LEFT JOIN membership_packages p ON p.id = m.package_id
       ORDER BY m.id DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    const [[countRow]] = await pool.query('SELECT COUNT(*) AS total FROM memberships');
    res.json({ items, page, limit, total: countRow?.total || 0 });
  } catch (e) {
    res.status(500).json({ message: e.message || 'server error' });
  }
});

// Public registration endpoint: creates a customer record from membership form
router.post('/public-register', rateLimiter({ windowMs: 60000, max: 30 }), requireFields(['user','membership']), async (req, res) => {
  try {
    const { user, partner, membership } = req.body;
    if (!user || !membership) return res.status(400).json({ message: 'invalid payload' });
    if (!user.username || !String(user.username).trim()) return res.status(400).json({ message: 'name_required' });
    if (!user.email || !isValidEmail(user.email)) return res.status(400).json({ message: 'invalid_email' });
    if (!user.phone || !isValidSaudiMobile(user.phone)) return res.status(400).json({ message: 'invalid_phone_sa' });
    if (!user.nationalId || !isValidNationalId(user.nationalId)) return res.status(400).json({ message: 'invalid_national_id' });
    if (!user.gender) return res.status(400).json({ message: 'gender_required' });
    if (!user.dob) return res.status(400).json({ message: 'dob_required' });
    if (!membership.value) return res.status(400).json({ message: 'package_required' });
    if (membership.amount !== undefined && membership.amount !== null && Number(membership.amount) < 0) {
      return res.status(400).json({ message: 'invalid_amount' });
    }
    const pool = req.app.locals.mysql;

    if (pool) {
      const pkg = await repo.getPackageByCode(pool, membership.value);
      if (!pkg) return res.status(400).json({ message: 'package not found' });
      const calcAge = (dob)=>{
        if (!dob) return null;
        const dt = new Date(dob);
        const now = new Date();
        let age = now.getFullYear() - dt.getFullYear();
        const m = now.getMonth() - dt.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < dt.getDate())) age--;
        return age;
      };
      const age = calcAge(user.dob);
      if (age !== null){
        if (pkg.min_age !== null && pkg.min_age !== undefined && age < pkg.min_age) return res.status(400).json({ message: 'age_not_eligible' });
        if (pkg.max_age !== null && pkg.max_age !== undefined && age > pkg.max_age) return res.status(400).json({ message: 'age_not_eligible' });
      }
      const today = new Date();
      const joinDate = today.toISOString().slice(0,10);
      const d = new Date(joinDate);
      d.setDate(d.getDate() + (pkg.period_days || 0));
      const expiryDate = d.toISOString().slice(0,10);

      let customer = await repo.findCustomerByEmail(pool, user.email);
      if (!customer) {
        customer = await repo.createCustomer(pool, {
          name: user.username,
          email: user.email,
          phone: user.phone,
          national_id: user.nationalId,
          job_title: user.jobTitle,
          address: user.address,
        });
      }
      let member = await repo.findMemberByCustomerId(pool, customer.id);
      if (!member) {
        member = await repo.createMember(pool, {
          customer_id: customer.id,
          name: user.username,
          email: user.email,
          phone: user.phone,
          gender: user.gender,
          dob: user.dob,
          national_id: user.nationalId,
          job_title: user.jobTitle,
          address: user.address,
          join_date: joinDate,
          type: 'primary'
        });
      }
      if (pkg.allow_partner && partner && partner.name) {
        const existing = await repo.findPartnerByMemberId(pool, member.id);
        if (!existing) await repo.createPartner(pool, { member_id: member.id, name: partner.name, email: partner.email, birth_date: partner.birthDate, phone: partner.phone });
        else await repo.updatePartner(pool, existing.id, { name: partner.name, email: partner.email, birth_date: partner.birthDate, phone: partner.phone });
      }
      const orepo = require('../repositories/orderRepo');
      const mem = await repo.createMembership(pool, { member_id: member.id, package_id: pkg.id, join_date: joinDate, expiry_date: expiryDate, status: 'pending', note: membership.note || null });
      const order = await orepo.createOrder(pool, { member_id: member.id, subject_type: 'main_membership', subject_id: mem.id, status: 'pending', amount: membership.amount||0, currency: membership.currency||'SAR', payment_method: membership.method||'manual', provider: null, provider_ref: null, expires_at: null });
      const payrepo = require('../repositories/paymentRepo');
      const pay = await payrepo.createPayment(pool, { membership_id: mem.id, amount: membership.amount||0, currency: membership.currency||'SAR', method: membership.method||'manual', status: 'initiated', ref: null });
      if ((membership.method||'manual') === 'manual'){
        await payrepo.updatePaymentStatus(pool, pay.id, 'paid');
        await orepo.updateOrderStatus(pool, order.id, 'paid');
        await repo.updateMembershipStatus(pool, mem.id, 'active');
        return res.json({ ok: true, id: mem.id, orderId: order.id, joinDate, expiryDate });
      }
      return res.json({ ok: true, id: mem.id, orderId: order.id, joinDate, expiryDate, payment_url: '#' });
    }

    const doc = await Customer.create({
      name: user.username,
      email: user.email,
      phone: user.phone,
      membershipType: membership.label,
      joinDate: new Date(membership.joinDate),
      expiryDate: new Date(membership.expiryDate),
      partner,
      notes: 'Registered via public membership form',
    });
    res.json({ ok: true, id: doc._id });
  } catch (e) {
    res.status(500).json({ message: e.message || 'server error' });
  }
});

// ─── Membership payments ────────────────────────────────────────────────────
router.get('/:id/payments', auth, adminOnly, async (req, res) => {
  try {
    const pool = req.app.locals.mysql;
    if (!pool) return res.status(503).json({ message: 'database_unavailable' });
    const id = Number(req.params.id);
    const rows = await prepo.listPaymentsByMembership(pool, id);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message || 'Server error' });
  }
});

// ─── Update membership status ────────────────────────────────────────────────
router.put('/:id/status', auth, adminOnly, async (req, res) => {
  try {
    const pool = req.app.locals.mysql;
    if (!pool) return res.status(503).json({ message: 'database_unavailable' });
    const id = Number(req.params.id);
    const { status } = req.body || {};
    const allowed = ['active', 'pending', 'expired', 'cancelled', 'suspended'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'invalid_status' });
    const row = await repo.updateMembershipStatus(pool, id, status);
    if (!row) return res.status(404).json({ message: 'not_found' });
    res.json(row);
  } catch (e) {
    res.status(400).json({ message: e.message || 'Invalid data' });
  }
});

module.exports = router;
