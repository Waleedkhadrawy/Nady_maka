async function ensureUserSchema(pool){
  const [cols] = await pool.query("SELECT column_name AS \"Field\" FROM information_schema.columns WHERE table_name = 'users'");
  const have = new Set(cols.map(c=>c.Field));
  const defs = [
    ['national_id', 'VARCHAR(32)'],
    ['job_title', 'VARCHAR(128)'],
    ['address', 'VARCHAR(255)'],
  ];
  for (const [field, type] of defs){
    if (!have.has(field)){
      await pool.query(`ALTER TABLE users ADD COLUMN ${field} ${type} NULL`);
    }
  }
}

async function findUserByEmail(pool, email){
  await ensureUserSchema(pool);
  const [rows] = await pool.query('SELECT id, first_name, last_name, email, phone, national_id, job_title, address, password_hash FROM users WHERE email=? LIMIT 1',[email]);
  return rows[0] || null;
}

async function createUser(pool, data){
  await ensureUserSchema(pool);
  const { first_name, last_name, email, phone, national_id, job_title, address, password_hash } = data;
  const [res] = await pool.query(
    'INSERT INTO users (first_name,last_name,email,phone,national_id,job_title,address,password_hash) VALUES (?,?,?,?,?,?,?,?)',
    [first_name||null,last_name||null,email,phone||null,national_id||null,job_title||null,address||null,password_hash]
  );
  return { id: res.insertId };
}

module.exports = { ensureUserSchema, findUserByEmail, createUser };

