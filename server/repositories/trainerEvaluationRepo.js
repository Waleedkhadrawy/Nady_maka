async function ensureSchema(pool){
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS trainer_evaluations (
      id SERIAL PRIMARY KEY,
      member_name VARCHAR(128),
      membership_number VARCHAR(64),
      trainer_name VARCHAR(128) NOT NULL,
      session_date DATE,
      overall_rating SMALLINT,
      professionalism_rating SMALLINT,
      knowledge_rating SMALLINT,
      communication_rating SMALLINT,
      punctuality_rating SMALLINT,
      motivation_rating SMALLINT,
      positive_aspects TEXT,
      improvement_areas TEXT,
      additional_comments TEXT,
      recommend_trainer VARCHAR(16),
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);
    const [cols] = await pool.query("SELECT column_name AS \"Field\" FROM information_schema.columns WHERE table_name = 'trainer_evaluations'");
    const have = new Set(cols.map(c=>c.Field));
    const defs = [
      ['member_name', 'VARCHAR(128)'],
      ['membership_number', 'VARCHAR(64)'],
      ['trainer_name', 'VARCHAR(128)'],
      ['session_date', 'DATE'],
      ['overall_rating', 'SMALLINT'],
      ['professionalism_rating', 'SMALLINT'],
      ['knowledge_rating', 'SMALLINT'],
      ['communication_rating', 'SMALLINT'],
      ['punctuality_rating', 'SMALLINT'],
      ['motivation_rating', 'SMALLINT'],
      ['positive_aspects', 'TEXT'],
      ['improvement_areas', 'TEXT'],
      ['additional_comments', 'TEXT'],
      ['recommend_trainer', 'VARCHAR(16)']
    ];
    for (const [field, type] of defs){
      if (!have.has(field)){
        await pool.query(`ALTER TABLE trainer_evaluations ADD COLUMN ${field} ${type} NULL`);
      }
    }
  } catch (e) {}
}

async function createTrainerEvaluation(pool, data){
  await ensureSchema(pool);
  const [cols] = await pool.query("SELECT column_name AS \"Field\" FROM information_schema.columns WHERE table_name = 'trainer_evaluations'");
  const have = new Set(cols.map(c=>c.Field));
  const mapping = {
    member_name: data.member_name || 'N/A',
    membership_number: data.membership_number || 'NA',
    trainer_name: data.trainer_name || 'Unknown',
    session_date: data.session_date || new Date().toISOString().slice(0,10),
    overall_rating: (data.overall_rating !== undefined ? Math.max(1, Math.min(5, Number(data.overall_rating))) : 3),
    professionalism_rating: (data.professionalism_rating !== undefined ? Math.max(1, Math.min(5, Number(data.professionalism_rating))) : 3),
    knowledge_rating: (data.knowledge_rating !== undefined ? Math.max(1, Math.min(5, Number(data.knowledge_rating))) : 3),
    communication_rating: (data.communication_rating !== undefined ? Math.max(1, Math.min(5, Number(data.communication_rating))) : 3),
    punctuality_rating: (data.punctuality_rating !== undefined ? Math.max(1, Math.min(5, Number(data.punctuality_rating))) : 3),
    motivation_rating: (data.motivation_rating !== undefined ? Math.max(1, Math.min(5, Number(data.motivation_rating))) : 3),
    positive_aspects: data.positive_aspects || '',
    improvement_areas: data.improvement_areas || '',
    additional_comments: data.additional_comments || '',
    recommend_trainer: (['yes','no','maybe'].includes(data.recommend_trainer) ? data.recommend_trainer : 'maybe'),
  };
  const fields = Object.keys(mapping).filter(f => have.has(f));
  const values = fields.map(f => mapping[f]);
  const placeholders = fields.map(()=>'?').join(',');
  const sql = `INSERT INTO trainer_evaluations (${fields.join(',')}) VALUES (${placeholders})`;
  const [res] = await pool.query(sql, values);
  return { id: res.insertId };
}

async function deleteTrainerEvaluation(pool, id){
  await ensureSchema(pool);
  await pool.query('DELETE FROM trainer_evaluations WHERE id=?',[id]);
  return { success:true };
}

module.exports = { createTrainerEvaluation, deleteTrainerEvaluation };
async function listTrainerEvaluations(pool, { q, trainer_name, page=1, limit=20 } = {}){
  await ensureSchema(pool);
  const p = Math.max(parseInt(page)||1, 1);
  const l = Math.max(Math.min(parseInt(limit)||20, 100), 1);
  const where = [];
  const params = [];
  const [cols] = await pool.query("SELECT column_name AS \"Field\" FROM information_schema.columns WHERE table_name = 'trainer_evaluations'");
  const have = new Set(cols.map(c=>c.Field));
  const searchable = [];
  if (have.has('member_name')) searchable.push('member_name');
  if (have.has('trainer_name')) searchable.push('trainer_name');
  if (have.has('membership_number')) searchable.push('membership_number');
  if (have.has('additional_comments')) searchable.push('additional_comments');
  if (q && searchable.length){
    where.push('(' + searchable.map(f => `${f} LIKE ?`).join(' OR ') + ')');
    for (let i=0;i<searchable.length;i++){ params.push(`%${q}%`); }
  }
  if (trainer_name && have.has('trainer_name')){ where.push('trainer_name = ?'); params.push(trainer_name); }
  const whereSql = where.length ? (' WHERE ' + where.join(' AND ')) : '';
  const selectFields = ['id'];
  for (const f of ['member_name','membership_number','trainer_name','session_date','overall_rating','professionalism_rating','knowledge_rating','communication_rating','punctuality_rating','motivation_rating','recommend_trainer','created_at']){
    if (have.has(f)) selectFields.push(f);
    else selectFields.push(`NULL AS ${f}`);
  }
  const orderField = have.has('created_at') ? 'created_at' : 'id';
  const [rows] = await pool.query(`SELECT ${selectFields.join(',')} FROM trainer_evaluations${whereSql} ORDER BY ${orderField} DESC LIMIT ? OFFSET ?`, [...params, l, (p-1)*l]);
  const [[c]] = await pool.query(`SELECT COUNT(*) AS total FROM trainer_evaluations${whereSql}`, params);
  return { items: rows, total: c.total || 0 };
}

module.exports.listTrainerEvaluations = listTrainerEvaluations;
