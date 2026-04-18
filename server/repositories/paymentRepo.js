async function createPayment(pool, data){
  const { membership_id, amount, currency, method, status, ref } = data;
  const [res] = await pool.query('INSERT INTO payments (membership_id, amount, currency, method, status, ref) VALUES (?,?,?,?,?,?)',[membership_id, amount||0, currency||'SAR', method||'manual', status||'paid', ref||null]);
  return { id: res.insertId };
}

async function listPaymentsByMembership(pool, membershipId){
  const [rows] = await pool.query('SELECT id, amount, currency, method, status, ref, paid_at FROM payments WHERE membership_id=? ORDER BY paid_at DESC',[membershipId]);
  return rows;
}

async function listPayments(pool, { from, to, q, status, method, sort='paid_at', order='DESC', page=1, limit=20 } = {}){
  const allowedSort = new Set(['paid_at','amount','id']);
  const sortCol = allowedSort.has(String(sort)) ? String(sort) : 'paid_at';
  const ord = String(order).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  const p = Math.max(parseInt(page)||1, 1);
  const l = Math.max(Math.min(parseInt(limit)||20, 100), 1);

  let where = [];
  const params = [];
  if (from && to){ where.push('paid_at BETWEEN ? AND ?'); params.push(from, to); }
  if (status){ where.push('status = ?'); params.push(status); }
  if (method){ where.push('method = ?'); params.push(method); }
  if (q){ where.push('(ref LIKE ? OR CAST(membership_id AS TEXT) LIKE ?)'); params.push(`%${q}%`, `%${q}%`); }
  const whereSql = where.length ? (' WHERE ' + where.join(' AND ')) : '';

  const [rows] = await pool.query(
    `SELECT id, membership_id, amount, currency, method, status, ref, paid_at
     FROM payments${whereSql}
     ORDER BY ${sortCol} ${ord}
     LIMIT ? OFFSET ?`,
    [...params, l, (p-1)*l]
  );
  return rows;
}

async function paymentsSummary(pool, { from, to, status, method, q } = {}){
  let sql = 'SELECT COUNT(*) AS count, COALESCE(SUM(amount),0) AS sum FROM payments';
  const where = [];
  const params = [];
  if (from && to){ where.push('paid_at BETWEEN ? AND ?'); params.push(from, to); }
  if (status){ where.push('status = ?'); params.push(status); }
  if (method){ where.push('method = ?'); params.push(method); }
  if (q){ where.push('(ref LIKE ? OR CAST(membership_id AS TEXT) LIKE ?)'); params.push(`%${q}%`, `%${q}%`); }
  if (where.length){ sql += ' WHERE ' + where.join(' AND '); }
  const [[row]] = await pool.query(sql, params);
  return row;
}

async function paymentsTotal(pool, { from, to, status, method, q } = {}){
  let sql = 'SELECT COUNT(*) AS total FROM payments';
  const where = [];
  const params = [];
  if (from && to){ where.push('paid_at BETWEEN ? AND ?'); params.push(from, to); }
  if (status){ where.push('status = ?'); params.push(status); }
  if (method){ where.push('method = ?'); params.push(method); }
  if (q){ where.push('(ref LIKE ? OR CAST(membership_id AS TEXT) LIKE ?)'); params.push(`%${q}%`, `%${q}%`); }
  if (where.length){ sql += ' WHERE ' + where.join(' AND '); }
  const [[row]] = await pool.query(sql, params);
  return row.total || 0;
}

async function updatePaymentStatus(pool, id, status){
  await pool.query('UPDATE payments SET status=? WHERE id=?', [status, id]);
  const [rows] = await pool.query('SELECT id, membership_id, amount, currency, method, status, ref, paid_at FROM payments WHERE id=?', [id]);
  return rows[0] || null;
}

module.exports = { createPayment, listPaymentsByMembership, listPayments, paymentsSummary, paymentsTotal, updatePaymentStatus };
