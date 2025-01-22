const mysql = require("mysql2/promise");
const Redis = require("ioredis");
require("dotenv").config();

const redis = new Redis();

const db = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DATABASE,
});

async function getAllUsers() {
  const redisKey = process.env.REDIS_KEY;

  try {
    const cachedData = await redis.get(redisKey);
    if (cachedData) {
      console.log("Data retrieved from Redis cache.");
      return JSON.parse(cachedData);
    }

    console.log("Data not found in Redis. Querying the database...");
    const [rows] = await db.query("SELECT * FROM users");

    if (rows.length === 0) {
      console.log("No users found.");
      return [];
    }

    await redis.set(redisKey, JSON.stringify(rows), "EX", 5);
    console.log("Data cached in Redis for 5 seconds.");

    return rows;
  } catch (error) {
    console.error("Error retrieving users data:", error);
  }
}

(async () => {
  const users = await getAllUsers();

  if (users.length > 0) {
    console.log("Users Data:", users);
  } else {
    console.log("No users data found.");
  }

  redis.disconnect();
  db.end();
})();
