const amqp = require("amqplib");

async function connectToRabbitMQ(queueName) {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  console.log(`Connected to RabbitMQ and queue: ${queueName}`);

  await channel.assertQueue(queueName, { durable: true });

  return { connection, channel, queue: queueName };
}

module.exports = connectToRabbitMQ;
