const express = require("express");
const connectToDatabase = require("../config/db");
const connectToRabbitMQ = require("../config/amqp");
require("dotenv").config();

const app = express();
const port = 3002;

app.use(express.json());

async function consumeUserData() {
  const { connection, channel, queue } = await connectToRabbitMQ(
    "user_to_order"
  );

  console.log("Waiting for user data...");

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const user = JSON.parse(msg.content.toString());
      console.log("Received User:", user);

      const orderDbConfig = {
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.ORDER_DB,
      };

      try {
        const db = await connectToDatabase(orderDbConfig);

        const [orders] = await db.query(
          "SELECT * FROM orders WHERE user_id = ?",
          [user.id]
        );
        console.log(`Fetched Orders by ${user.name}:`, orders);

        channel.ack(msg);
      } catch (error) {
        console.error("Error processing message:", error);
        channel.nack(msg, false, true);
      }
    }
  });
}

consumeUserData();

app.listen(port, () => {
  console.log(`Order service running at http://localhost:${port}`);
});
