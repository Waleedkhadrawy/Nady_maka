const pg = require('pg');
const { Pool } = pg;

// Ensure PostgreSQL BIGINT (like COUNT(*)) is parsed as an integer in JS, not as a string
pg.types.setTypeParser(20, parseInt);

async function createPool() {
  const connectionString = process.env.SUPABASE_CONNECTION_STRING || process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.warn('====================================================');
    console.warn('WARNING: SUPABASE_CONNECTION_STRING is not set!');
    console.warn('Please add it to your .env file to connect to Supabase.');
    console.warn('====================================================');
  }

  const pool = new Pool({
    connectionString: connectionString,
    ssl: connectionString ? { rejectUnauthorized: false } : undefined,
  });

  // Create a wrapper for pool.query to simulate mysql2/promise behavior
  const originalQuery = pool.query.bind(pool);
  
  pool.query = async (sql, params = []) => {
    // 1. Translate ? into $1, $2, etc.
    let paramCount = 1;
    let pgSql = sql.replace(/\?/g, () => `$${paramCount++}`);
    
    // MySQL uses backticks ` for tables/columns, PostgreSQL uses double quotes "
    pgSql = pgSql.replace(/`/g, '"');

    // MySQL TINYINT(1) maps to BOOLEAN/SMALLINT, just in case we need to replace boolean checks (generally fine).

    // 2. MySQL `INSERT ...` returns `{ insertId: id }`. Postgres needs `RETURNING id`.
    const isInsert = /^\s*INSERT\s+INTO/i.test(pgSql);
    if (isInsert && !/\bRETURNING\b/i.test(pgSql)) {
      pgSql += ' RETURNING id';
    }

    try {
      const res = await originalQuery(pgSql, params);
      
      if (isInsert) {
        return [{ insertId: res.rows[0]?.id || null }, res.fields];
      }
      
      // For SELECT updates, res.rows is the array of data. mysql2 returns [rows, fields]
      // For UPDATE/DELETE, mysql2 returns [{ affectedRows }, fields]
      const isUpdateDelete = /^\s*(UPDATE|DELETE)\b/i.test(pgSql);
      if (isUpdateDelete) {
         return [{ affectedRows: res.rowCount }, res.fields];
      }

      return [res.rows, res.fields];

    } catch (e) {
      console.error(`PostgreSQL Error executing: ${pgSql}`, e.message);
      throw e;
    }
  };

  if (connectionString) {
    try {
      await pool.query('SELECT 1');
      console.log('PostgreSQL (Supabase) connection established');
    } catch (err) {
      console.warn('PostgreSQL connection test failed:', err.message);
    }
  }

  return pool;
}

module.exports = { createPool };
