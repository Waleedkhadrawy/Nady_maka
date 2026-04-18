function rowToApi(row){
  return {
    _id: row.id,
    customer_id: row.customer_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    gender: row.gender,
    dob: row.dob,
    type: row.type,
    parent_member_id: row.parent_member_id,
    relation: row.relation,
    status: row.status,
    join_date: row.join_date,
  };
}

async function listMembers(pool, { q, type, status, sort='id', order='DESC', page=1, limit=20 } = {}){
  const allowedSort = new Set(['id','join_date','name']);
  const sortCol = allowedSort.has(String(sort)) ? String(sort) : 'id';
  const ord = String(order).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  const p = Math.max(parseInt(page)||1, 1);
  const l = Math.max(Math.min(parseInt(limit)||20, 100), 1);
  const where = [];
  const params = [];
  if (q){ where.push('(name LIKE ? OR email LIKE ? OR phone LIKE ? OR CAST(id AS TEXT) LIKE ?)'); params.push(`%${q}%`,`%${q}%`,`%${q}%`,`%${q}%`); }
  if (type){ where.push('type = ?'); params.push(type); }
  if (status){ where.push('status = ?'); params.push(status); }
  const whereSql = where.length ? (' WHERE ' + where.join(' AND ')) : '';
  const [rows] = await pool.query(
    `SELECT id,customer_id,name,email,phone,gender,dob,type,parent_member_id,relation,status,join_date
     FROM members${whereSql}
     ORDER BY ${sortCol} ${ord}
     LIMIT ? OFFSET ?`,
    [...params, l, (p-1)*l]
  );
  return rows.map(rowToApi);
}

async function membersTotal(pool, { q, type, status } = {}){
  const where = [];
  const params = [];
  if (q){ where.push('(name LIKE ? OR email LIKE ? OR phone LIKE ? OR CAST(id AS TEXT) LIKE ?)'); params.push(`%${q}%`,`%${q}%`,`%${q}%`,`%${q}%`); }
  if (type){ where.push('type = ?'); params.push(type); }
  if (status){ where.push('status = ?'); params.push(status); }
  const whereSql = where.length ? (' WHERE ' + where.join(' AND ')) : '';
  const [[row]] = await pool.query(`SELECT COUNT(*) AS total FROM members${whereSql}`, params);
  return row.total || 0;
}

async function getMemberById(pool,id){
  const [rows] = await pool.query('SELECT id,customer_id,name,email,phone,gender,dob,type,parent_member_id,relation,status,join_date FROM members WHERE id=? LIMIT 1',[id]);
  return rows[0] ? rowToApi(rows[0]) : null;
}

async function createMember(pool,data){
  const { customer_id, name, email, phone, gender, dob, type, parent_member_id, relation, status, join_date } = data;
  const [res] = await pool.query('INSERT INTO members (customer_id,name,email,phone,gender,dob,type,parent_member_id,relation,status,join_date) VALUES (?,?,?,?,?,?,?,?,?,?,?)',[customer_id||null,name,email||null,phone||null,gender||null,dob||null,type||'primary',parent_member_id||null,relation||null,status||'active',join_date||null]);
  return getMemberById(pool,res.insertId);
}

async function updateMember(pool,id,data){
  const { customer_id, name, email, phone, gender, dob, type, parent_member_id, relation, status, join_date } = data;
  await pool.query('UPDATE members SET customer_id=?, name=?, email=?, phone=?, gender=?, dob=?, type=?, parent_member_id=?, relation=?, status=?, join_date=? WHERE id=?',[customer_id||null,name,email||null,phone||null,gender||null,dob||null,type||'primary',parent_member_id||null,relation||null,status||'active',join_date||null,id]);
  return getMemberById(pool,id);
}

async function deleteMember(pool,id){
  await pool.query('DELETE FROM members WHERE id=?',[id]);
  return { success: true };
}

module.exports = { listMembers, membersTotal, getMemberById, createMember, updateMember, deleteMember };
