async function createBooking(pool, data){
  const { member_id, activity_id, event_id, scheduled_at, notes, status, name, phone, email, service } = data;
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
    const have = new Set(cols.map(c=>c.Field));
    const defs = [
      ['name','VARCHAR(128)'],
      ['phone','VARCHAR(64)'],
      ['email','VARCHAR(255)'],
      ['service','VARCHAR(255)']
    ];
    for (const [f,t] of defs){ if (!have.has(f)) await pool.query(`ALTER TABLE bookings ADD COLUMN ${f} ${t} NULL`); }
  } catch (e) {}
  const [res] = await pool.query('INSERT INTO bookings (member_id,activity_id,event_id,scheduled_at,notes,status,name,phone,email,service) VALUES (?,?,?,?,?,?,?,?,?,?)',[member_id||null, activity_id||null, event_id||null, scheduled_at||null, notes||null, status||'pending', name||null, phone||null, email||null, service||null]);
  return { id: res.insertId };
}

async function listBookings(pool, { q, status, from, to, sort='scheduled_at', order='DESC', page=1, limit=20 } = {}){
  const allowedSort = new Set(['scheduled_at','id']);
  const sortCol = allowedSort.has(String(sort)) ? String(sort) : 'scheduled_at';
  const ord = String(order).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  const p = Math.max(parseInt(page)||1, 1);
  const l = Math.max(Math.min(parseInt(limit)||20, 100), 1);
  const where = [];
  const params = [];
  if (q){ where.push('(notes LIKE ? OR name LIKE ? OR email LIKE ? OR phone LIKE ? OR service LIKE ? OR CAST(member_id AS TEXT) LIKE ? OR CAST(activity_id AS TEXT) LIKE ? OR CAST(event_id AS TEXT) LIKE ?)'); params.push(`%${q}%`,`%${q}%`,`%${q}%`,`%${q}%`,`%${q}%`,`%${q}%`,`%${q}%`,`%${q}%`); }
  if (status){ where.push('status = ?'); params.push(status); }
  if (from && to){ where.push('scheduled_at BETWEEN ? AND ?'); params.push(from, to); }
  const whereSql = where.length ? (' WHERE ' + where.join(' AND ')) : '';
  const [rows] = await pool.query(
    `SELECT id, member_id, activity_id, event_id, scheduled_at, notes, status, name, phone, email, service
     FROM bookings${whereSql}
     ORDER BY ${sortCol} ${ord}
     LIMIT ? OFFSET ?`,
    [...params, l, (p-1)*l]
  );
  return rows;
}

async function bookingsTotal(pool, { q, status, from, to } = {}){
  const where = [];
  const params = [];
  if (q){ where.push('(notes LIKE ? OR CAST(member_id AS TEXT) LIKE ? OR CAST(activity_id AS TEXT) LIKE ? OR CAST(event_id AS TEXT) LIKE ?)'); params.push(`%${q}%`,`%${q}%`,`%${q}%`,`%${q}%`); }
  if (status){ where.push('status = ?'); params.push(status); }
  if (from && to){ where.push('scheduled_at BETWEEN ? AND ?'); params.push(from, to); }
  const whereSql = where.length ? (' WHERE ' + where.join(' AND ')) : '';
  const [[row]] = await pool.query(`SELECT COUNT(*) AS total FROM bookings${whereSql}`, params);
  return row.total || 0;
}

module.exports = { createBooking, listBookings, bookingsTotal };
