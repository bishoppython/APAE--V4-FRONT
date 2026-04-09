const path = require("path");
const Database = require("better-sqlite3");
const dotenv = require("dotenv");
dotenv.config();

const dbFile = process.env.DB_FILE || path.join(__dirname, "database.sqlite");
const db = new Database(dbFile);

module.exports = db;
