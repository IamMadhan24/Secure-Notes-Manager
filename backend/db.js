const { Pool } = require("pg");
require("dotenv").config(); 

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, 
      }
    : {
        user: "postgres",
        host: "localhost",
        database: "notes_app",
        password: "Maddy24",
        port: 5432,
      }
);

module.exports = pool;
