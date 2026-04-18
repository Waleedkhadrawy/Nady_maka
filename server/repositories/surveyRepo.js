async function createSurvey(pool, data){
  const { member_id, payload } = data;
  const [res] = await pool.query('INSERT INTO surveys (member_id,data) VALUES (?,?)',[member_id||null, JSON.stringify(payload||{})]);
  return { id: res.insertId };
}

module.exports = { createSurvey };

