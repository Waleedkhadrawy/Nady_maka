let _schemaEnsured = false;

async function ensureBookingSchema(pool) {
  if (_schemaEnsured) return;
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      member_id INT NULL,
      activity_id INT NULL,
      event_id INT NULL,
      scheduled_at TIMESTAMP NULL,
      notes TEXT NULL,
      status VARCHAR(16) NOT NULL DEFAULT 'pending',
      name VARCHAR(128) NULL,
      phone VARCHAR(64) NULL,
      email VARCHAR(255) NULL,
      service VARCHAR(255) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);
    const [cols] = await pool.query("SELECT column_name AS \"Field\" FROM information_schema.columns WHERE table_name = 'bookings'");
    const have = new Set(cols.map(c => c.Field));
    const defs = [
      ['name', 'VARCHAR(128)', 'NULL'],
      ['phone', 'VARCHAR(64)', 'NULL'],
      ['email', 'VARCHAR(255)', 'NULL'],
      ['service', 'VARCHAR(255)', 'NULL'],
      ['created_at', 'TIMESTAMP', 'NOT NULL DEFAULT CURRENT_TIMESTAMP'],
    ];
    for (const [f, t, extra = ''] of defs) {
      if (!have.has(f)) {
        await pool.query(`ALTER TABLE bookings ADD COLUMN ${f} ${t} ${extra}`.trim());
      }
    }
    _schemaEnsured = true;
  } catch (e) {
    console.warn('ensureBookingSchema warning:', e.message);
  }
}

async function createBooking(pool, data) {
  await ensureBookingSchema(pool);
  const { member_id, activity_id, event_id, scheduled_at, notes, status, name, phone, email, service } = data;
  const [res] = await pool.query(
    'INSERT INTO bookings (member_id,activity_id,event_id,scheduled_at,notes,status,name,phone,email,service) VALUES (?,?,?,?,?,?,?,?,?,?)',
    [member_id||null, activity_id||null, event_id||null, scheduled_at||null, notes||null, status||'pending', name||null, phone||null, email||null, service||null]
  );
  return { id: res.insertId };
}

async function checkBookingConflict(pool, { scheduled_at, service, member_id }) {
  if (!scheduled_at) return false;
  const where = [];
  const params = [];
  // Same slot ± 30 minutes
  where.push("scheduled_at BETWEEN ? AND ?");
  const dt = new Date(scheduled_at);
  const from = new Date(dt.getTime() - 30 * 60 * 1000).toISOString();
  const to   = new Date(dt.getTime() + 30 * 60 * 1000).toISOString();
  params.push(from, to);
  if (service) { where.push("service = ?"); params.push(service); }
  if (member_id) { where.push("member_id = ?"); params.push(member_id); }
  where.push("status NOT IN ('cancelled','rejected')");
  const [[row]] = await pool.query(
    `SELECT COUNT(*) AS cnt FROM bookings WHERE ${where.join(' AND ')}`,
    params
  );
  return Number(row?.cnt || 0) > 0;
}

async function listBookings(pool, { q, status, from, to, sort='scheduled_at', order='DESC', page=1, limit=20 } = {}) {
  const allowedSort = new Set(['scheduled_at','id']);
  const sortCol = allowedSort.has(String(sort)) ? String(sort) : 'scheduled_at';
  const ord = String(order).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  const p = Math.max(parseInt(page)||1, 1);
  const l = Math.max(Math.min(parseInt(limit)||20, 100), 1);
  const where = [];
  const params = [];
  if (q) { where.push('(notes LIKE ? OR name LIKE ? OR email LIKE ? OR phone LIKE ? OR service LIKE ? OR CAST(member_id AS TEXT) LIKE ? OR CAST(activity_id AS TEXT) LIKE ? OR CAST(event_id AS TEXT) LIKE ?)'); params.push(`%${q}%`,`%${q}%`,`%${q}%`,`%${q}%`,`%${q}%`,`%${q}%`,`%${q}%`,`%${q}%`); }
  if (status) { where.push('status = ?'); params.push(status); }
  if (from && to) { where.push('scheduled_at BETWEEN ? AND ?'); params.push(from, to); }
  const whereSql = where.length ? (' WHERE ' + where.join(' AND ')) : '';
  const [rows] = await pool.query(
    `SELECT id, member_id, activity_id, event_id, scheduled_at, notes, status, name, phone, email, service, created_at
     FROM bookings${whereSql}
     ORDER BY ${sortCol} ${ord}
     LIMIT ? OFFSET ?`,
    [...params, l, (p-1)*l]
  );
  return rows;
}

async function bookingsTotal(pool, { q, status, from, to } = {}) {
  const where = [];
  const params = [];
  if (q) { where.push('(notes LIKE ? OR name LIKE ? OR email LIKE ? OR phone LIKE ? OR service LIKE ? OR CAST(member_id AS TEXT) LIKE ?)'); params.push(`%${q}%`,`%${q}%`,`%${q}%`,`%${q}%`,`%${q}%`,`%${q}%`); }
  if (status) { where.push('status = ?'); params.push(status); }
  if (from && to) { where.push('scheduled_at BETWEEN ? AND ?'); params.push(from, to); }
  const whereSql = where.length ? (' WHERE ' + where.join(' AND ')) : '';
  const [[row]] = await pool.query(`SELECT COUNT(*) AS total FROM bookings${whereSql}`, params);
  return Number(row?.total || 0);
}

async function updateBookingStatus(pool, id, status) {
  await pool.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
  const [[row]] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
  return row || null;
}

async function deleteBooking(pool, id) {
  const [[row]] = await pool.query('SELECT id FROM bookings WHERE id = ?', [id]);
  if (!row) return false;
  await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
  return true;
}

module.exports = { ensureBookingSchema, createBooking, checkBookingConflict, listBookings, bookingsTotal, updateBookingStatus, deleteBooking };
