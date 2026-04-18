async function ensureOrdersSchema(pool){
  await pool.query(`CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    member_id INT NULL,
    subject_type VARCHAR(32) NOT NULL,
    subject_id INT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    currency VARCHAR(8) NOT NULL DEFAULT 'SAR',
    payment_method VARCHAR(16) NOT NULL DEFAULT 'manual',
    provider VARCHAR(32) NULL,
    provider_ref VARCHAR(128) NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
}

async function createOrder(pool, data){
  await ensureOrdersSchema(pool);
  const { member_id, subject_type, subject_id, status, amount, currency, payment_method, provider, provider_ref, expires_at } = data;
  const [res] = await pool.query(
    'INSERT INTO orders (member_id,subject_type,subject_id,status,amount,currency,payment_method,provider,provider_ref,expires_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
    [member_id||null, subject_type, subject_id, status||'pending', amount||0, currency||'SAR', payment_method||'manual', provider||null, provider_ref||null, expires_at||null]
  );
  return { id: res.insertId };
}

async function updateOrderStatus(pool, id, status){
  await ensureOrdersSchema(pool);
  await pool.query('UPDATE orders SET status=? WHERE id=?', [status, id]);
  const [rows] = await pool.query('SELECT * FROM orders WHERE id=?', [id]);
  return rows[0] || null;
}

async function getOrderById(pool, id){
  await ensureOrdersSchema(pool);
  const [rows] = await pool.query('SELECT * FROM orders WHERE id=?', [id]);
  return rows[0] || null;
}

async function listOrders(pool, { q, status, method, page=1, limit=20 } = {}){
  await ensureOrdersSchema(pool);
  const p = Math.max(parseInt(page)||1, 1);
  const l = Math.max(Math.min(parseInt(limit)||20, 100), 1);
  const where = [];
  const params = [];
  if (status){ where.push('status = ?'); params.push(status); }
  if (method){ where.push('payment_method = ?'); params.push(method); }
  if (q){ where.push('(provider_ref LIKE ? OR CAST(subject_id AS TEXT) LIKE ?)'); params.push(`%${q}%`, `%${q}%`); }
  const whereSql = where.length ? (' WHERE ' + where.join(' AND ')) : '';
  const [rows] = await pool.query(`SELECT * FROM orders${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, l, (p-1)*l]);
  const [[c]] = await pool.query(`SELECT COUNT(*) AS total FROM orders${whereSql}`, params);
  return { items: rows, total: c.total || 0 };
}

module.exports = { ensureOrdersSchema, createOrder, updateOrderStatus, getOrderById, listOrders };
