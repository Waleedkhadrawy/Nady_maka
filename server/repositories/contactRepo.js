async function ensureContactSchema(pool){
  try{
    await pool.query(`CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name VARCHAR(128),
      email VARCHAR(255),
      phone VARCHAR(64),
      subject VARCHAR(255),
      message TEXT,
      status VARCHAR(32) NOT NULL DEFAULT 'new',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);
    const [cols] = await pool.query("SELECT column_name AS \"Field\" FROM information_schema.columns WHERE table_name = 'contact_messages'");
    const have = new Set(cols.map(c=>c.Field));
    const defs = [['name','VARCHAR(128)'],['email','VARCHAR(255)'],['phone','VARCHAR(64)'],['subject','VARCHAR(255)'],['message','TEXT'],['status','VARCHAR(32)'],['created_at','TIMESTAMP']];
    for (const [f,t] of defs){ if (!have.has(f)) await pool.query(`ALTER TABLE contact_messages ADD COLUMN ${f} ${t}`); }
  }catch(e){}
}

async function createContactMessage(pool, data){
  await ensureContactSchema(pool);
  const { name, email, phone, subject, message, status } = data;
  const [res] = await pool.query('INSERT INTO contact_messages (name,email,phone,subject,message,status) VALUES (?,?,?,?,?,?)',[name||null, email||null, phone||null, subject||null, message||null, status||'new']);
  return { id: res.insertId };
}

async function listContactMessages(pool, { q, status, page=1, limit=20 } = {}){
  await ensureContactSchema(pool);
  const p = Math.max(parseInt(page)||1, 1);
  const l = Math.max(Math.min(parseInt(limit)||20, 100), 1);
  const where = [];
  const params = [];
  if (q){ where.push('(name LIKE ? OR email LIKE ? OR phone LIKE ? OR subject LIKE ? OR message LIKE ?)'); params.push(`%${q}%`,`%${q}%`,`%${q}%`,`%${q}%`,`%${q}%`); }
  if (status){ where.push('status = ?'); params.push(status); }
  const whereSql = where.length ? (' WHERE ' + where.join(' AND ')) : '';
  const [rows] = await pool.query(`SELECT id,name,email,phone,subject,message,status,created_at FROM contact_messages${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, l, (p-1)*l]);
  const [[c]] = await pool.query(`SELECT COUNT(*) AS total FROM contact_messages${whereSql}`, params);
  return { items: rows, total: c.total || 0 };
}

module.exports = { createContactMessage, listContactMessages };
