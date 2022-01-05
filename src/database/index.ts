import pg from "pg";
const Pool = pg.Pool;

export default new Pool({
  connectionString: process.env.POSTGRESQL_CONNECTION_STRING,
});
