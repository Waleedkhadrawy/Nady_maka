function toRowToApi(row){
  return {
    _id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    membershipType: row.membership_type,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function listCustomers(pool){
  const [rows] = await pool.query('SELECT id,name,email,phone,membership_type,notes,created_at,updated_at FROM customers ORDER BY created_at DESC');
  return rows.map(toRowToApi);
}

async function createCustomer(pool, data){
  const { name, email, phone, membershipType, notes } = data;
  const [res] = await pool.query('INSERT INTO customers (name,email,phone,membership_type,notes) VALUES (?,?,?,?,?)', [name, email || null, phone || null, membershipType || null, notes || null]);
  const id = res.insertId;
  const [rows] = await pool.query('SELECT id,name,email,phone,membership_type,notes,created_at,updated_at FROM customers WHERE id=?', [id]);
  return toRowToApi(rows[0]);
}

async function updateCustomer(pool, id, data){
  const { name, email, phone, membershipType, notes } = data;
  await pool.query('UPDATE customers SET name=?, email=?, phone=?, membership_type=?, notes=? WHERE id=?', [name, email || null, phone || null, membershipType || null, notes || null, id]);
  const [rows] = await pool.query('SELECT id,name,email,phone,membership_type,notes,created_at,updated_at FROM customers WHERE id=?', [id]);
  return toRowToApi(rows[0]);
}

async function deleteCustomer(pool, id){
  await pool.query('DELETE FROM customers WHERE id=?', [id]);
  return { success: true };
}

module.exports = { listCustomers, createCustomer, updateCustomer, deleteCustomer };

