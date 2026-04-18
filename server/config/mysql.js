const mysql = require('mysql2/promise');

async function createPool() {
  const {
    MYSQL_HOST = '127.0.0.1',
    MYSQL_PORT = '3306',
    MYSQL_USER = 'root',
    MYSQL_PASSWORD = '',
    MYSQL_DB = 'makkah_yard',
  } = process.env;

  const pool = await mysql.createPool({
    host: MYSQL_HOST,
    port: Number(MYSQL_PORT),
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
  });
  return pool;
}

module.exports = { createPool };
