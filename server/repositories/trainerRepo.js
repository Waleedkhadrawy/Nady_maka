async function listTrainers(pool, { q, status, sort='id', order='ASC', page=1, limit=20 } = {}){
  const allowedSort = new Set(['id','name','experience_years']);
  const sortCol = allowedSort.has(String(sort)) ? String(sort) : 'id';
  const ord = String(order).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  const p = Math.max(parseInt(page)||1, 1);
  const l = Math.max(Math.min(parseInt(limit)||20, 100), 1);
  const where = [];
  const params = [];
  if (q){ where.push('(name LIKE ? OR email LIKE ? OR phone LIKE ? OR specialization LIKE ?)'); params.push(`%${q}%`,`%${q}%`,`%${q}%`,`%${q}%`); }
  if (status){ where.push('status = ?'); params.push(status); }
  const whereSql = where.length ? (' WHERE ' + where.join(' AND ')) : '';
  const [rows] = await pool.query(
    `SELECT id,name,email,phone,specialization,experience_years,certification,status
     FROM trainers${whereSql}
     ORDER BY ${sortCol} ${ord}
     LIMIT ? OFFSET ?`,
    [...params, l, (p-1)*l]
  );
  return rows;
}

async function trainersTotal(pool, { q, status } = {}){
  const where = [];
  const params = [];
  if (q){ where.push('(name LIKE ? OR email LIKE ? OR phone LIKE ? OR specialization LIKE ?)'); params.push(`%${q}%`,`%${q}%`,`%${q}%`,`%${q}%`); }
  if (status){ where.push('status = ?'); params.push(status); }
  const whereSql = where.length ? (' WHERE ' + where.join(' AND ')) : '';
  const [[row]] = await pool.query(`SELECT COUNT(*) AS total FROM trainers${whereSql}`, params);
  return row.total || 0;
}

async function getTrainerById(pool,id){
  const [rows] = await pool.query('SELECT id,name,email,phone,specialization,experience_years,certification,status FROM trainers WHERE id=? LIMIT 1',[id]);
  return rows[0] || null;
}

async function createTrainer(pool,data){
  const { name, email, phone, specialization, experience_years, certification, status } = data;
  const [res] = await pool.query('INSERT INTO trainers (name,email,phone,specialization,experience_years,certification,status) VALUES (?,?,?,?,?,?,?)',[name, email||null, phone||null, specialization||null, experience_years||null, certification||null, status||'active']);
  return getTrainerById(pool,res.insertId);
}

async function updateTrainer(pool,id,data){
  const { name, email, phone, specialization, experience_years, certification, status } = data;
  await pool.query('UPDATE trainers SET name=?, email=?, phone=?, specialization=?, experience_years=?, certification=?, status=? WHERE id=?',[name, email||null, phone||null, specialization||null, experience_years||null, certification||null, status||'active', id]);
  return getTrainerById(pool,id);
}

async function deleteTrainer(pool,id){
  await pool.query('DELETE FROM trainers WHERE id=?',[id]);
  return { success:true };
}

module.exports = { listTrainers, trainersTotal, getTrainerById, createTrainer, updateTrainer, deleteTrainer };
