const pgp = require("pg-promise")();

const config = {
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: 5432,
    ssl: {
        rejectUnauthorized: false // This makes queries to the Render PostgreSQL DB work
    }
};

const connection = pgp(config);

module.exports = connection;