import amqp from "amqplib";

const queue = "tasks";

export async function connectRabbitMQ() {
  const url =
    process.env.RABBITMQ_URL ||
    "amqp://guest:guest@127.0.0.1:5672";

  const connection = await amqp.connect(url);
  const publisherChannel = await connection.createChannel();
  const consumerChannel = await connection.createChannel();

  await publisherChannel.assertQueue(queue, { durable: false });

  await consumerChannel.assertQueue(queue, { durable: false });
  await consumerChannel.consume(queue, (message) => {
    if (message) {
      console.log(message.content.toString());
      consumerChannel.ack(message);
    }
  });

  await publisherChannel.sendToQueue(
    queue,
    Buffer.from("something to do")
  );

  console.log("✅ RabbitMQ connected on port 25672");

  return connection;
}