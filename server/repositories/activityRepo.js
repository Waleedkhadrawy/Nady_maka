async function listActivities(pool, { q, category, age_group, status, sort='id', order='ASC', page=1, limit=20 } = {}){
  const allowedSort = new Set(['id','name','price','capacity']);
  const sortCol = allowedSort.has(String(sort)) ? String(sort) : 'id';
  const ord = String(order).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  const p = Math.max(parseInt(page)||1, 1);
  const l = Math.max(Math.min(parseInt(limit)||20, 100), 1);
  const where = [];
  const params = [];
  if (q){ where.push('(name LIKE ? OR category LIKE ? OR age_group LIKE ?)'); params.push(`%${q}%`,`%${q}%`,`%${q}%`); }
  if (category){ where.push('category = ?'); params.push(category); }
  if (age_group){ where.push('age_group = ?'); params.push(age_group); }
  if (status){ where.push('status = ?'); params.push(status); }
  const whereSql = where.length ? (' WHERE ' + where.join(' AND ')) : '';
  const [rows] = await pool.query(
    `SELECT id,name,description,category,age_group,duration_minutes,price,currency,capacity,image,status
     FROM activities${whereSql}
     ORDER BY ${sortCol} ${ord}
     LIMIT ? OFFSET ?`,
    [...params, l, (p-1)*l]
  );
  return rows;
}

async function activitiesTotal(pool, { q, category, age_group, status } = {}){
  const where = [];
  const params = [];
  if (q){ where.push('(name LIKE ? OR category LIKE ? OR age_group LIKE ?)'); params.push(`%${q}%`,`%${q}%`,`%${q}%`); }
  if (category){ where.push('category = ?'); params.push(category); }
  if (age_group){ where.push('age_group = ?'); params.push(age_group); }
  if (status){ where.push('status = ?'); params.push(status); }
  const whereSql = where.length ? (' WHERE ' + where.join(' AND ')) : '';
  const [[row]] = await pool.query(`SELECT COUNT(*) AS total FROM activities${whereSql}`, params);
  return row.total || 0;
}

async function getActivityById(pool,id){
  const [rows] = await pool.query('SELECT id,name,description,category,age_group,duration_minutes,price,currency,capacity,image,status FROM activities WHERE id=? LIMIT 1',[id]);
  return rows[0] || null;
}

async function createActivity(pool,data){
  const { name, description, category, age_group, duration_minutes, price, currency, capacity, image, status } = data;
  const [res] = await pool.query('INSERT INTO activities (name,description,category,age_group,duration_minutes,price,currency,capacity,image,status) VALUES (?,?,?,?,?,?,?,?,?,?)',[name, description||null, category||null, age_group||null, duration_minutes||null, price||null, currency||'ريال', capacity||null, image||null, status||'available']);
  return getActivityById(pool, res.insertId);
}

async function updateActivity(pool,id,data){
  const { name, description, category, age_group, duration_minutes, price, currency, capacity, image, status } = data;
  await pool.query('UPDATE activities SET name=?, description=?, category=?, age_group=?, duration_minutes=?, price=?, currency=?, capacity=?, image=?, status=? WHERE id=?',[name, description||null, category||null, age_group||null, duration_minutes||null, price||null, currency||'ريال', capacity||null, image||null, status||'available', id]);
  return getActivityById(pool,id);
}

async function deleteActivity(pool,id){
  await pool.query('DELETE FROM activities WHERE id=?',[id]);
  return { success:true };
}

async function clearActivitySchedules(pool, activityId){
  await pool.query('DELETE FROM activity_schedules WHERE activity_id=?',[activityId]);
}

async function addActivitySchedule(pool, sched){
  const { activity_id, day_of_week, start_time, end_time } = sched;
  await pool.query('INSERT INTO activity_schedules (activity_id,day_of_week,start_time,end_time) VALUES (?,?,?,?)',[activity_id, day_of_week, start_time, end_time]);
}

async function addActivityTrainer(pool, activityId, trainerId){
  await pool.query('INSERT IGNORE INTO activity_trainers (activity_id, trainer_id) VALUES (?,?)',[activityId, trainerId]);
  return { success:true };
}

async function countEnrollments(pool, activityId){
  const [rows] = await pool.query('SELECT COUNT(*) AS c FROM enrollments WHERE activity_id=?',[activityId]);
  return rows[0]?.c || 0;
}

async function addEnrollment(pool, memberId, activityId){
  const [res] = await pool.query('INSERT INTO enrollments (member_id, activity_id) VALUES (?,?)',[memberId, activityId]);
  return { id: res.insertId };
}

module.exports = { listActivities, activitiesTotal, getActivityById, createActivity, updateActivity, deleteActivity, clearActivitySchedules, addActivitySchedule, addActivityTrainer, countEnrollments, addEnrollment };
