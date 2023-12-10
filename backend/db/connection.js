//console.log("Database URL:", DATABASE_URL);

const pgp = require("pg-promise")();

const config = {
    user: 'db_setup_user',
    host: 'dpg-cl2ttvot3kic73d47ah0-a.oregon-postgres.render.com',
    database: 'db_setup',
    password: 'nwMVuDobYm69OopH5eXn2hj58SkuNVkq',
    port: 5432,
    ssl: {
        rejectUnauthorized: false // This makes queries to the Render PostgreSQL DB work
    }
};

const connection = pgp(config);

module.exports = connection;