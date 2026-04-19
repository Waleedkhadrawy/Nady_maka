async function ensureProfileSchema(pool){
  const [customerCols] = await pool.query("SHOW COLUMNS FROM customers");
  const haveCustomer = new Set(customerCols.map(c => c.Field));
  if (!haveCustomer.has('national_id')) await pool.query('ALTER TABLE customers ADD COLUMN national_id VARCHAR(32) NULL');
  if (!haveCustomer.has('job_title')) await pool.query('ALTER TABLE customers ADD COLUMN job_title VARCHAR(128) NULL');
  if (!haveCustomer.has('address')) await pool.query('ALTER TABLE customers ADD COLUMN address VARCHAR(255) NULL');

  const [memberCols] = await pool.query("SHOW COLUMNS FROM members");
  const haveMember = new Set(memberCols.map(c => c.Field));
  if (!haveMember.has('national_id')) await pool.query('ALTER TABLE members ADD COLUMN national_id VARCHAR(32) NULL');
  if (!haveMember.has('job_title')) await pool.query('ALTER TABLE members ADD COLUMN job_title VARCHAR(128) NULL');
  if (!haveMember.has('address')) await pool.query('ALTER TABLE members ADD COLUMN address VARCHAR(255) NULL');
}

async function getPackageByCode(pool, code){
  const [rows] = await pool.query('SELECT id, code, label, price, currency, period_days, kind, segment, allow_partner, min_age, max_age FROM membership_packages WHERE code = ? LIMIT 1', [code]);
  return rows[0] || null;
}

async function findCustomerByEmail(pool, email){
  await ensureProfileSchema(pool);
  if (!email) return null;
  const [rows] = await pool.query('SELECT id,name,email,phone,national_id,job_title,address FROM customers WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
}

async function createCustomer(pool, data){
  await ensureProfileSchema(pool);
  const { name, email, phone, national_id, job_title, address } = data;
  const [res] = await pool.query(
    'INSERT INTO customers (name,email,phone,national_id,job_title,address) VALUES (?,?,?,?,?,?)',
    [name, email || null, phone || null, national_id || null, job_title || null, address || null]
  );
  return { id: res.insertId };
}

async function findMemberByCustomerId(pool, customerId){
  await ensureProfileSchema(pool);
  const [rows] = await pool.query("SELECT id,name,email,phone,national_id,job_title,address FROM members WHERE customer_id = ? AND type = 'primary' LIMIT 1", [customerId]);
  return rows[0] || null;
}

async function createMember(pool, data){
  await ensureProfileSchema(pool);
  const { customer_id, name, email, phone, gender, dob, join_date, type, national_id, job_title, address } = data;
  const [res] = await pool.query(
    "INSERT INTO members (customer_id,name,email,phone,gender,dob,join_date,type,status,national_id,job_title,address) VALUES (?,?,?,?,?,?,?,?,'active',?,?,?)",
    [customer_id, name, email || null, phone || null, gender || null, dob || null, join_date, type || 'primary', national_id || null, job_title || null, address || null]
  );
  return { id: res.insertId };
}

async function findPartnerByMemberId(pool, memberId){
  const [rows] = await pool.query('SELECT id FROM partners WHERE member_id = ? LIMIT 1', [memberId]);
  return rows[0] || null;
}

async function createPartner(pool, data){
  const { member_id, name, email, birth_date, phone, relation } = data;
  const [res] = await pool.query('INSERT INTO partners (member_id,name,email,birth_date,phone,relation) VALUES (?,?,?,?,?,?)', [member_id, name || null, email || null, birth_date || null, phone || null, relation || null]);
  return { id: res.insertId };
}

async function updatePartner(pool, id, data){
  const { name, email, birth_date, phone, relation } = data;
  await pool.query('UPDATE partners SET name=?, email=?, birth_date=?, phone=?, relation=? WHERE id=?', [name || null, email || null, birth_date || null, phone || null, relation || null, id]);
  return { id };
}

async function createMembership(pool, data){
  const { member_id, package_id, join_date, expiry_date, status, note } = data;
  const [res] = await pool.query('INSERT INTO memberships (member_id,package_id,join_date,expiry_date,status,note) VALUES (?,?,?,?,?,?)', [member_id, package_id, join_date, expiry_date, status || 'active', note || null]);
  return { id: res.insertId };
}

async function listMembershipsByMember(pool, memberId){
  const [rows] = await pool.query(
    'SELECT m.id, m.member_id, m.package_id, m.join_date, m.expiry_date, m.status, m.note, p.code, p.label, p.period_days, p.segment FROM memberships m JOIN membership_packages p ON m.package_id = p.id WHERE m.member_id = ? ORDER BY m.created_at DESC',
    [memberId]
  );
  return rows;
}

async function createMembershipForMember(pool, memberId, packageCode, joinDate, status, note){
  const pkg = await getPackageByCode(pool, packageCode);
  if (!pkg) throw new Error('package not found');
  const jd = (joinDate || new Date().toISOString()).slice(0,10);
  const d = new Date(jd);
  d.setDate(d.getDate() + (pkg.period_days || 0));
  const ed = d.toISOString().slice(0,10);
  const res = await createMembership(pool, { member_id: memberId, package_id: pkg.id, join_date: jd, expiry_date: ed, status: status || 'active', note: note || null });
  return { id: res.id, join_date: jd, expiry_date: ed, package: { code: pkg.code, label: pkg.label } };
}

async function updateMembershipStatus(pool, id, status){
  await pool.query('UPDATE memberships SET status=? WHERE id=?',[status, id]);
  const [rows] = await pool.query('SELECT id, member_id, package_id, join_date, expiry_date, status, note FROM memberships WHERE id=?',[id]);
  const row = rows[0] || null;
  if (row && (status === 'expired' || status === 'cancelled')){
    const [[m]] = await pool.query('SELECT type FROM members WHERE id=?',[row.member_id]);
    if (m && m.type === 'primary'){
      await pool.query("UPDATE memberships SET status='expired' WHERE member_id IN (SELECT id FROM members WHERE parent_member_id=?) AND status='active'",[row.member_id]);
    }
  }
  return row;
}

module.exports = {
  ensureProfileSchema,
  getPackageByCode,
  findCustomerByEmail,
  createCustomer,
  findMemberByCustomerId,
  createMember,
  findPartnerByMemberId,
  createPartner,
  updatePartner,
  createMembership,
  listMembershipsByMember,
  createMembershipForMember,
  updateMembershipStatus,
};
