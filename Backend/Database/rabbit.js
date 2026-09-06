import amqp from "amqplib";

let connection;
let channel;

const connectRabbitMQ = async () => {
    try {
        connection = await amqp.connect(
            process.env.RABBITMQ_URL || "amqp://127.0.0.1:5672"
        );

        channel = await connection.createChannel();

        console.log("✅ RabbitMQ Connected");

        return channel;
    } catch (error) {
        console.error("❌ RabbitMQ Connection Error:", error.message);
        throw error;
    }
};

const getChannel = () => {
    if (!channel) {
        throw new Error("RabbitMQ channel is not initialized");
    }

    return channel;
};

export { connectRabbitMQ, getChannel }; 