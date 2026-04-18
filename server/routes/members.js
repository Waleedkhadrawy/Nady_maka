const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { adminOnly } = require('../middleware/roles');
const repo = require('../repositories/memberRepo');
const mrepo = require('../repositories/membershipRepo');
const prepo = require('../repositories/paymentRepo');

router.get('/', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const { q, type, status, sort, order } = req.query;
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '20');
    const filters = { q, type, status, sort, order, page, limit };
    const items = await repo.listMembers(pool, filters);
    const total = await repo.membersTotal(pool, filters);
    res.json({ items, page, limit, total });
  }catch(e){
    res.status(500).json({ message: e.message || 'Server error' });
  }
});

router.post('/', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const row = await repo.createMember(pool, req.body);
    res.status(201).json(row);
  }catch(e){
    res.status(400).json({ message: e.message || 'Invalid data' });
  }
});

router.put('/:id', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const id = Number(req.params.id);
    const row = await repo.updateMember(pool, id, req.body);
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
    await repo.deleteMember(pool, id);
    res.json({ success: true });
  }catch(e){
    res.status(500).json({ message: e.message || 'Server error' });
  }
});

module.exports = router;
router.get('/:id/memberships', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const id = Number(req.params.id);
    const rows = await mrepo.listMembershipsByMember(pool, id);
    res.json(rows);
  }catch(e){
    res.status(500).json({ message: e.message || 'Server error' });
  }
});

router.post('/:id/memberships', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const id = Number(req.params.id);
    const { package_code, join_date, status, note } = req.body;
    const row = await mrepo.createMembershipForMember(pool, id, package_code, join_date, status, note);
    res.status(201).json(row);
  }catch(e){
    res.status(400).json({ message: e.message || 'Invalid data' });
  }
});

router.post('/:id/memberships/checkout', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const id = Number(req.params.id);
    const { package_code, amount, currency, method, note } = req.body || {};
    const member = await repo.getMemberById(pool, id);
    if (!member) return res.status(404).json({ message: 'member_not_found' });
    const pkg = await mrepo.getPackageByCode(pool, package_code);
    if (!pkg) return res.status(400).json({ message: 'package_not_found' });
    if (member.type === 'sub' && pkg.segment !== 'sub') return res.status(400).json({ message: 'invalid_segment_for_sub_member' });
    if (member.type === 'primary' && pkg.segment === 'sub') return res.status(400).json({ message: 'invalid_segment_for_primary_member' });
    const created = await mrepo.createMembershipForMember(pool, id, package_code, new Date().toISOString(), 'active', note || null);
    const pay = await prepo.createPayment(pool, { membership_id: created.id, amount: amount || 0, currency: currency || 'SAR', method: method || 'manual', status: 'paid', ref: null });
    res.status(201).json({ id: created.id, join_date: created.join_date, expiry_date: created.expiry_date, payment_id: pay.id });
  }catch(e){
    res.status(400).json({ message: e.message || 'Invalid data' });
  }
});
