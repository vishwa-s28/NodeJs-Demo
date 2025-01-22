const express = require("express");
const connectToDatabase = require("../config/db");
const connectToRabbitMQ = require("../config/amqp");
require("dotenv").config();
const app = express();
const port = 3001;

app.use(express.json());

app.get("/api/users", async (req, res) => {
  try {
    const userDbConfig = {
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.USER_DB,
    };

    const db = await connectToDatabase(userDbConfig);
    const [users] = await db.query("SELECT * FROM users");

    const { connection, channel, queue } = await connectToRabbitMQ(
      "user_to_order"
    );
    users.forEach((user) => {
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(user)), {
        persistent: true,
      });
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

app.listen(port, () => {
  console.log(`User service running at http://localhost:${port}`);
});
