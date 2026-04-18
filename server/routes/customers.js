const express = require('express');
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');
const { adminOnly } = require('../middleware/roles');
const repo = require('../repositories/customerRepo');

const router = express.Router();

// Public: list customers (optional: could be protected; keep protected)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const pool = req.app.locals.mysql;
    if (pool) {
      const items = await repo.listCustomers(pool);
      return res.json(items);
    }
    const items = await Customer.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const pool = req.app.locals.mysql;
    if (pool) {
      const item = await repo.createCustomer(pool, req.body);
      return res.status(201).json(item);
    }
    const item = await Customer.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid data' });
  }
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const pool = req.app.locals.mysql;
    if (pool) {
      const id = Number(req.params.id);
      const item = await repo.updateCustomer(pool, id, req.body);
      if (!item) return res.status(404).json({ message: 'Not found' });
      return res.json(item);
    }
    const item = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid data' });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const pool = req.app.locals.mysql;
    if (pool) {
      const id = Number(req.params.id);
      await repo.deleteCustomer(pool, id);
      return res.json({ success: true });
    }
    const item = await Customer.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
