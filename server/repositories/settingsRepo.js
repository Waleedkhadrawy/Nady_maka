async function getSettings(pool){
  const [rows] = await pool.query('SELECT id,site_name,site_name_en,description,description_en,contact_phone,contact_email,address,address_en,social_media,working_hours FROM settings ORDER BY id LIMIT 1');
  if (!rows[0]) return null;
  const r = rows[0];
  return {
    id: r.id,
    site_name: r.site_name,
    site_name_en: r.site_name_en,
    description: r.description,
    description_en: r.description_en,
    contact_phone: r.contact_phone,
    contact_email: r.contact_email,
    address: r.address,
    address_en: r.address_en,
    social_media: typeof r.social_media === 'string' ? JSON.parse(r.social_media) : r.social_media,
    working_hours: typeof r.working_hours === 'string' ? JSON.parse(r.working_hours) : r.working_hours,
  };
}

async function upsertSettings(pool, data){
  const cur = await getSettings(pool);
  const sm = JSON.stringify(data.social_media||{});
  const wh = JSON.stringify(data.working_hours||{});
  if (!cur) {
    const [res] = await pool.query('INSERT INTO settings (site_name,site_name_en,description,description_en,contact_phone,contact_email,address,address_en,social_media,working_hours) VALUES (?,?,?,?,?,?,?,?,?,?)',[
      data.site_name||null, data.site_name_en||null, data.description||null, data.description_en||null, data.contact_phone||null, data.contact_email||null, data.address||null, data.address_en||null, sm, wh
    ]);
    return getSettings(pool);
  }
  await pool.query('UPDATE settings SET site_name=?, site_name_en=?, description=?, description_en=?, contact_phone=?, contact_email=?, address=?, address_en=?, social_media=?, working_hours=? WHERE id=?',[
    data.site_name||null, data.site_name_en||null, data.description||null, data.description_en||null, data.contact_phone||null, data.contact_email||null, data.address||null, data.address_en||null, sm, wh, cur.id
  ]);
  return getSettings(pool);
}

module.exports = { getSettings, upsertSettings };

