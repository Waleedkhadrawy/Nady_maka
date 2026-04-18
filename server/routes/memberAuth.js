const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const urepo = require('../repositories/userRepo');
const mrepo = require('../repositories/membershipRepo');
const { requireFields } = require('../middleware/validate');
const { rateLimiter } = require('../middleware/rateLimiter');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

router.post('/register', rateLimiter({ windowMs: 60000, max: 20 }), requireFields(['email','password']), async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    if (!pool) return res.status(503).json({ message: 'database_unavailable' });
    const { first_name, last_name, email, phone, password, gender, dob } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'invalid_payload' });
    if (!isValidEmail(email)) return res.status(400).json({ message: 'invalid_email' });
    if (String(password).length < 8) return res.status(400).json({ message: 'weak_password' });
    if (!first_name || !String(first_name).trim()) return res.status(400).json({ message: 'first_name_required' });
    if (!last_name || !String(last_name).trim()) return res.status(400).json({ message: 'last_name_required' });
    const exists = await urepo.findUserByEmail(pool, email);
    if (exists) return res.status(400).json({ message: 'user_exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await urepo.createUser(pool, { first_name, last_name, email, phone, password_hash: hash });
    let customer = await mrepo.findCustomerByEmail(pool, email);
    if (!customer) customer = await mrepo.createCustomer(pool, { name: `${first_name||''} ${last_name||''}`.trim() || email, email, phone });
    let member = await mrepo.findMemberByCustomerId(pool, customer.id);
    if (!member) member = await mrepo.createMember(pool, { customer_id: customer.id, name: `${first_name||''} ${last_name||''}`.trim() || email, email, phone, gender, dob, join_date: new Date().toISOString().slice(0,10), type: 'primary' });
    const token = jwt.sign({ role: 'member', user_id: user.id, member_id: member.id, email }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '12h' });
    res.status(201).json({ token });
  }catch(e){ res.status(400).json({ message: e.message || 'Invalid data' }); }
});

router.post('/login', rateLimiter({ windowMs: 60000, max: 60 }), requireFields(['email','password']), async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    if (!pool) return res.status(503).json({ message: 'database_unavailable' });
    const { email, password } = req.body || {};
    if (!isValidEmail(email)) return res.status(400).json({ message: 'invalid_email' });
    const user = await urepo.findUserByEmail(pool, email);
    if (!user) return res.status(401).json({ message: 'invalid_credentials' });
    const ok = await bcrypt.compare(password, user.password_hash || '');
    if (!ok) return res.status(401).json({ message: 'invalid_credentials' });
    const member = await mrepo.findCustomerByEmail(pool, email).then(c=> c ? mrepo.findMemberByCustomerId(pool, c.id) : null);
    const token = jwt.sign({ role: 'member', user_id: user.id, member_id: member?.id || null, email }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '12h' });
    res.json({ token });
  }catch(e){ res.status(400).json({ message: e.message || 'Invalid data' }); }
});

module.exports = router;
