const fs = require('fs');
let sql = fs.readFileSync('database.txt', 'utf8');

// Strip out MySQL specific encodings and ops
sql = sql.replace(/SET NAMES .*;/g, '');
sql = sql.replace(/SET FOREIGN_KEY_CHECKS=0;/g, '');
sql = sql.replace(/SET FOREIGN_KEY_CHECKS=1;/g, '');
sql = sql.replace(/DROP DATABASE IF EXISTS .*/g, '');
sql = sql.replace(/CREATE DATABASE .*/g, '');
sql = sql.replace(/USE .*;/g, '');
sql = sql.replace(/START TRANSACTION;/g, 'BEGIN;');

// Data types
sql = sql.replace(/BIGINT UNSIGNED NOT NULL AUTO_INCREMENT/g, 'BIGSERIAL NOT NULL');
sql = sql.replace(/INT UNSIGNED NOT NULL AUTO_INCREMENT/g, 'SERIAL NOT NULL');
sql = sql.replace(/INT AUTO_INCREMENT/g, 'SERIAL');
sql = sql.replace(/BIGINT UNSIGNED/g, 'BIGINT');
sql = sql.replace(/DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP/g, 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
sql = sql.replace(/DATETIME/g, 'TIMESTAMP');
sql = sql.replace(/TINYINT\(1\)/g, 'BOOLEAN');
sql = sql.replace(/TINYINT/g, 'SMALLINT');

// Table endings
sql = sql.replace(/\) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;/g, ');');

// Keys and Indexing (MySQL allows inline indexes, PostgreSQL usually needs CREATE INDEX)
// We will strip inline KEY definitions from the CREATE TABLE, except for UNIQUE and PRIMARY KEY
// Because we're just setting up test tables, stripping `KEY ...` is totally fine.
sql = sql.replace(/,\s*KEY\s+\w+\s+\([^)]+\)/g, '');

// Unique keys usually take the form `UNIQUE KEY unique_name (cols...)` -> Postgres `UNIQUE (cols...)`
sql = sql.replace(/UNIQUE KEY[\s\w]+(\([^)]+\))/g, 'UNIQUE $1');

// ENUM types logic
sql = sql.replace(/ENUM\('admin','super'\)/g, "VARCHAR(64)");
sql = sql.replace(/ENUM\('primary','sub'\)/g, "VARCHAR(64)");
sql = sql.replace(/ENUM\('adult','junior','sub'\)/g, "VARCHAR(64)");

// Triggers for updated_at
const triggerCode = `
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';
`;
let triggers = '';
const matches = sql.matchAll(/CREATE TABLE ([a-z_]+)\s*\([\s\S]*?updated_at CLONED_DEFAULT/g); // wait, let's just use simple match
const tablesWithUpdated = ['admins', 'customers', 'users'];
for (const t of tablesWithUpdated) {
  triggers += `CREATE TRIGGER update_${t}_modtime BEFORE UPDATE ON ${t} FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();\n`;
}

sql = sql.replace(/BEGIN;/, 'BEGIN;\n' + triggerCode);
sql = sql.replace(/COMMIT;/, triggers + '\nCOMMIT;');

// Append Test user
const testUserSql = `
INSERT INTO users (first_name, last_name, email, phone, password_hash) 
VALUES ('تجربة', 'مستخدم', 'test@example.com', '+966500000000', '$2b$10$Zl9qkM4o4xwzqvQHk3dVqu3e7Jv6p1Hc3hZr0iD1bJk5uUu3kEwzS');

INSERT INTO members (customer_id, name, email, phone, gender, status, join_date, type) 
VALUES (NULL, 'مستخدم تجربة', 'test@example.com', '+966500000000', 'male', 'active', CURRENT_DATE, 'primary');
`;

sql = sql.replace('COMMIT;', testUserSql + '\nCOMMIT;');

fs.writeFileSync('supabase_schema.sql', sql);
console.log('Done!');
