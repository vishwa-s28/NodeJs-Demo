const mysql = require("mysql2/promise");

async function connectToDatabase({ host, user, password, database }) {
  const db = await mysql.createConnection({
    host,
    user,
    password,
    database,
  });
  // console.log(`Connected to database: ${database}`);
  return db;
}

module.exports = connectToDatabase;
