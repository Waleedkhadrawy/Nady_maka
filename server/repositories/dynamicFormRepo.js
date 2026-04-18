async function ensureSchema(pool){
  await pool.query(`CREATE TABLE IF NOT EXISTS dynamic_forms (
    id SERIAL PRIMARY KEY,
    code VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    schema_json JSON NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS form_submissions (
    id SERIAL PRIMARY KEY,
    form_id INT NOT NULL,
    member_id INT NULL,
    data_json JSON NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
}

async function listForms(pool){
  await ensureSchema(pool);
  const [rows] = await pool.query('SELECT id, code, title, is_active, created_at FROM dynamic_forms ORDER BY id');
  return rows;
}

async function getFormByCode(pool, code){
  await ensureSchema(pool);
  const [rows] = await pool.query('SELECT id, code, title, schema_json, is_active FROM dynamic_forms WHERE code=? LIMIT 1',[code]);
  return rows[0] || null;
}

async function createForm(pool, data){
  await ensureSchema(pool);
  const { code, title, schema_json, is_active } = data;
  const [res] = await pool.query('INSERT INTO dynamic_forms (code,title,schema_json,is_active) VALUES (?,?,?,?)',[code,title,JSON.stringify(schema_json||{}), is_active!==undefined? !!is_active : true]);
  const [rows] = await pool.query('SELECT id, code, title, schema_json, is_active FROM dynamic_forms WHERE id=?',[res.insertId]);
  return rows[0] || null;
}

async function updateForm(pool, id, data){
  await ensureSchema(pool);
  const { code, title, schema_json, is_active } = data;
  await pool.query('UPDATE dynamic_forms SET code=?, title=?, schema_json=?, is_active=? WHERE id=?',[code,title,JSON.stringify(schema_json||{}), is_active!==undefined? !!is_active : true, id]);
  const [rows] = await pool.query('SELECT id, code, title, schema_json, is_active FROM dynamic_forms WHERE id=?',[id]);
  return rows[0] || null;
}

async function deleteForm(pool, id){
  await ensureSchema(pool);
  await pool.query('DELETE FROM form_submissions WHERE form_id=?',[id]);
  await pool.query('DELETE FROM dynamic_forms WHERE id=?',[id]);
  return { success:true };
}

async function submitForm(pool, code, data){
  await ensureSchema(pool);
  const form = await getFormByCode(pool, code);
  if (!form || !form.is_active) throw new Error('form_not_found');
  const [res] = await pool.query('INSERT INTO form_submissions (form_id,member_id,data_json) VALUES (?,?,?)',[form.id, data.member_id||null, JSON.stringify(data.payload||{})]);
  return { id: res.insertId };
}

async function listSubmissions(pool, formId, { page=1, limit=20 }={}){
  await ensureSchema(pool);
  const p = Math.max(parseInt(page)||1,1);
  const l = Math.max(Math.min(parseInt(limit)||20,100),1);
  const [rows] = await pool.query('SELECT id, member_id, data_json, created_at FROM form_submissions WHERE form_id=? ORDER BY created_at DESC LIMIT ? OFFSET ?',[formId, l, (p-1)*l]);
  const [[c]] = await pool.query('SELECT COUNT(*) AS total FROM form_submissions WHERE form_id=?',[formId]);
  return { items: rows, total: c.total || 0 };
}

module.exports = { ensureSchema, listForms, getFormByCode, createForm, updateForm, deleteForm, submitForm, listSubmissions };
