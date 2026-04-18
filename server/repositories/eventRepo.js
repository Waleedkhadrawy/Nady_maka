async function listEvents(pool, { q, status, category, from, to, sort='date', order='ASC', page=1, limit=20 } = {}){
  const allowedSort = new Set(['date','id','title']);
  const sortCol = allowedSort.has(String(sort)) ? String(sort) : 'date';
  const ord = String(order).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  const p = Math.max(parseInt(page)||1, 1);
  const l = Math.max(Math.min(parseInt(limit)||20, 100), 1);
  const where = [];
  const params = [];
  if (q){ where.push('(title LIKE ? OR location LIKE ? OR category LIKE ?)'); params.push(`%${q}%`,`%${q}%`,`%${q}%`); }
  if (status){ where.push('status = ?'); params.push(status); }
  if (category){ where.push('category = ?'); params.push(category); }
  if (from && to){ where.push('date BETWEEN ? AND ?'); params.push(from, to); }
  const whereSql = where.length ? (' WHERE ' + where.join(' AND ')) : '';
  const [rows] = await pool.query(
    `SELECT id,title,description,date,time,location,category,registration_fee,currency,max_participants,status
     FROM events${whereSql}
     ORDER BY ${sortCol} ${ord}
     LIMIT ? OFFSET ?`,
    [...params, l, (p-1)*l]
  );
  return rows;
}

async function eventsTotal(pool, { q, status, category, from, to } = {}){
  const where = [];
  const params = [];
  if (q){ where.push('(title LIKE ? OR location LIKE ? OR category LIKE ?)'); params.push(`%${q}%`,`%${q}%`,`%${q}%`); }
  if (status){ where.push('status = ?'); params.push(status); }
  if (category){ where.push('category = ?'); params.push(category); }
  if (from && to){ where.push('date BETWEEN ? AND ?'); params.push(from, to); }
  const whereSql = where.length ? (' WHERE ' + where.join(' AND ')) : '';
  const [[row]] = await pool.query(`SELECT COUNT(*) AS total FROM events${whereSql}`, params);
  return row.total || 0;
}

async function getEventById(pool,id){
  const [rows] = await pool.query('SELECT id,title,description,date,time,location,category,registration_fee,currency,max_participants,status FROM events WHERE id=? LIMIT 1',[id]);
  return rows[0] || null;
}

async function createEvent(pool,data){
  const { title, description, date, time, location, category, registration_fee, currency, max_participants, status } = data;
  const [res] = await pool.query('INSERT INTO events (title,description,date,time,location,category,registration_fee,currency,max_participants,status) VALUES (?,?,?,?,?,?,?,?,?,?)',[title, description||null, date, time||null, location||null, category||null, registration_fee||0, currency||'ريال', max_participants||null, status||'open']);
  return getEventById(pool,res.insertId);
}

async function updateEvent(pool,id,data){
  const { title, description, date, time, location, category, registration_fee, currency, max_participants, status } = data;
  await pool.query('UPDATE events SET title=?, description=?, date=?, time=?, location=?, category=?, registration_fee=?, currency=?, max_participants=?, status=? WHERE id=?',[title, description||null, date, time||null, location||null, category||null, registration_fee||0, currency||'ريال', max_participants||null, status||'open', id]);
  return getEventById(pool,id);
}

async function deleteEvent(pool,id){
  await pool.query('DELETE FROM events WHERE id=?',[id]);
  return { success:true };
}

async function countRegistrations(pool,eventId){
  const [rows] = await pool.query('SELECT COUNT(*) AS c FROM event_registrations WHERE event_id=?',[eventId]);
  return rows[0]?.c || 0;
}

async function createRegistration(pool,eventId,memberId){
  const [res] = await pool.query('INSERT INTO event_registrations (event_id,member_id) VALUES (?,?)',[eventId, memberId]);
  return { id: res.insertId };
}

module.exports = { listEvents, eventsTotal, getEventById, createEvent, updateEvent, deleteEvent, countRegistrations, createRegistration };
