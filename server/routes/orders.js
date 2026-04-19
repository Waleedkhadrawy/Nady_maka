const express = require('express');
const router = express.Router();
const orepo = require('../repositories/orderRepo');
const mrepo = require('../repositories/membershipRepo');
const prepo = require('../repositories/paymentRepo');
const auth = require('../middleware/auth');
const { adminOnly } = require('../middleware/roles');
const { rateLimiter } = require('../middleware/rateLimiter');

router.post('/', auth, adminOnly, rateLimiter({ windowMs: 60000, max: 60 }), async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const b = req.body || {};
    const data = {
      member_id: b.member_id || null,
      subject_type: b.subject_type,
      subject_id: b.subject_id,
      status: b.status || 'pending',
      amount: b.amount,
      currency: b.currency,
      payment_method: b.payment_method,
      provider: b.provider,
      provider_ref: b.provider_ref,
      expires_at: b.expires_at || null,
    };
    if (!data.subject_type || !data.subject_id){ return res.status(400).json({ message: 'invalid_payload' }); }
    const row = await orepo.createOrder(pool, data);
    res.status(201).json(row);
  }catch(e){ res.status(400).json({ message: e.message || 'invalid_data' }); }
});

router.get('/', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const { q, status, method } = req.query;
    const page = parseInt(req.query.page||'1');
    const limit = parseInt(req.query.limit||'20');
    const data = await orepo.listOrders(pool, { q, status, method, page, limit });
    res.json({ items: data.items, page, limit, total: data.total });
  }catch(e){ res.status(500).json({ message: e.message || 'server_error' }); }
});

router.put('/:id/status', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const id = parseInt(req.params.id||'0');
    const status = String((req.body||{}).status||'');
    if (!id || !status){ return res.status(400).json({ message: 'invalid_payload' }); }
    const before = await orepo.getOrderById(pool, id);
    const row = await orepo.updateOrderStatus(pool, id, status);
    if (before && row && String(before.subject_type) === 'main_membership' && before.subject_id) {
      const mid = Number(before.subject_id);
      if (status === 'paid') {
        await mrepo.updateMembershipStatus(pool, mid, 'active');
        const pays = await prepo.listPaymentsByMembership(pool, mid);
        const pendingPay = pays.find(p => String(p.status).toLowerCase() === 'initiated') || pays[0];
        if (pendingPay) await prepo.updatePaymentStatus(pool, pendingPay.id, 'paid');
      } else if (status === 'cancelled' || status === 'failed') {
        await mrepo.updateMembershipStatus(pool, mid, 'cancelled');
      }
    }
    res.json(row||{});
  }catch(e){ res.status(400).json({ message: e.message || 'invalid_data' }); }
});

module.exports = router;
