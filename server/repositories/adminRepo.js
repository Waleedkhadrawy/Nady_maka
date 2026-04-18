async function findAdminByUsername(pool, username) {
  const [rows] = await pool.query('SELECT id, username, password_hash, email, role FROM admins WHERE username = ? LIMIT 1', [username]);
  return rows[0] || null;
}

async function findAdminByEmail(pool, email) {
  const [rows] = await pool.query('SELECT id, username, password_hash, email, role FROM admins WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
}

module.exports = { findAdminByUsername, findAdminByEmail };
