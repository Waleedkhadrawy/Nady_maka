async function ensurePackageSchema(pool){
  const [cols] = await pool.query("SELECT column_name AS \"Field\" FROM information_schema.columns WHERE table_name = 'membership_packages'");
  const have = new Set(cols.map(c=>c.Field));
  if (!have.has('allow_partner')){ await pool.query('ALTER TABLE membership_packages ADD COLUMN allow_partner BOOLEAN NOT NULL DEFAULT FALSE'); }
  if (!have.has('min_age')){ await pool.query('ALTER TABLE membership_packages ADD COLUMN min_age INT NULL'); }
  if (!have.has('max_age')){ await pool.query('ALTER TABLE membership_packages ADD COLUMN max_age INT NULL'); }
}

async function listPackages(pool, segment){
  await ensurePackageSchema(pool);
  if (segment) {
    const [rows] = await pool.query('SELECT id, code, label, price, currency, period_days, kind, segment, allow_partner, min_age, max_age FROM membership_packages WHERE active = TRUE AND segment = ? ORDER BY id', [segment]);
    return rows;
  }
  const [rows] = await pool.query('SELECT id, code, label, price, currency, period_days, kind, segment, allow_partner, min_age, max_age FROM membership_packages WHERE active = TRUE ORDER BY id');
  return rows;
}

async function getPackageByCode(pool, code){
  await ensurePackageSchema(pool);
  const [rows] = await pool.query('SELECT id, code, label, price, currency, period_days, kind, segment, allow_partner, min_age, max_age FROM membership_packages WHERE code = ? LIMIT 1', [code]);
  return rows[0] || null;
}

async function createPackage(pool, data){
  await ensurePackageSchema(pool);
  const { code, label, price, currency, period_days, kind, segment, active, allow_partner, min_age, max_age } = data;
  const [res] = await pool.query('INSERT INTO membership_packages (code,label,price,currency,period_days,kind,segment,active,allow_partner,min_age,max_age) VALUES (?,?,?,?,?,?,?,?,?,?,?)',[code,label,price||null,currency||'SAR',period_days,kind||'individual',segment,active!==undefined?!!active:true,allow_partner?1:0,min_age||null,max_age||null]);
  const [rows] = await pool.query('SELECT id, code, label, price, currency, period_days, kind, segment, active, allow_partner, min_age, max_age FROM membership_packages WHERE id=?',[res.insertId]);
  return rows[0];
}

async function updatePackage(pool, id, data){
  await ensurePackageSchema(pool);
  const { code, label, price, currency, period_days, kind, segment, active, allow_partner, min_age, max_age } = data;
  await pool.query('UPDATE membership_packages SET code=?, label=?, price=?, currency=?, period_days=?, kind=?, segment=?, active=?, allow_partner=?, min_age=?, max_age=? WHERE id=?',[code,label,price||null,currency||'SAR',period_days,kind||'individual',segment,active!==undefined?!!active:true,allow_partner?1:0,min_age||null,max_age||null,id]);
  const [rows] = await pool.query('SELECT id, code, label, price, currency, period_days, kind, segment, active, allow_partner, min_age, max_age FROM membership_packages WHERE id=?',[id]);
  return rows[0];
}

async function deletePackage(pool, id){
  await pool.query('DELETE FROM membership_packages WHERE id=?',[id]);
  return { success:true };
}

module.exports = { listPackages, getPackageByCode, createPackage, updatePackage, deletePackage };
