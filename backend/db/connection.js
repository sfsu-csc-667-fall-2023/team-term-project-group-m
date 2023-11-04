const pgp = require("pg-promis")();
const connection = pgp(process.env.DATABASE_URL);

module.exports = connection;