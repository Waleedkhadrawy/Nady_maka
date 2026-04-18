async function findUserByEmail(pool, email){
  const [rows] = await pool.query('SELECT id, first_name, last_name, email, phone, password_hash FROM users WHERE email=? LIMIT 1',[email]);
  return rows[0] || null;
}

async function createUser(pool, data){
  const { first_name, last_name, email, phone, password_hash } = data;
  const [res] = await pool.query('INSERT INTO users (first_name,last_name,email,phone,password_hash) VALUES (?,?,?,?,?)',[first_name||null,last_name||null,email,phone||null,password_hash]);
  return { id: res.insertId };
}

module.exports = { findUserByEmail, createUser };

