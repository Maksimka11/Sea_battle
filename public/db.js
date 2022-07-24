const pg = require('pg');

const Pool = pg.Pool;
const pool = new Pool({
  user: 'postgres',
  password: '1234',
  host: 'localhost',
  port: 5432,
  database: 'database_development'
});
module.exports = pool;