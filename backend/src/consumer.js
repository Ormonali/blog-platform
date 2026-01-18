import { Kafka } from "kafkajs";
import pino from "pino";
import dotenv from "dotenv";

dotenv.config();
const log = pino({ transport: { target: "pino-pretty" } });

const KAFKA_BROKER = process.env.KAFKA_BROKER;
const KAFKA_TOPIC = process.env.KAFKA_TOPIC;
const KAFKA_CLIENT_ID = "blog-consumer-service";

const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: [KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: "blog-group" });

const run = async () => {
  await consumer.connect();
  log.info("Consumer connected to Kafka.");

  await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      const { type, payload } = event;

      log.info(`[CONSUMER] Received event: ${type}`);

      // Logique métier basée sur le type d'événement
      switch (type) {
        case "post.created":
          log.info(`New post notification: "${payload.title}" (ID: ${payload.id})`);
          break;
        case "post.updated":
          log.info(`Post modification alert: ID ${payload.id} has been changed.`);
          break;
        case "post.deleted":
          log.warn(`Cleanup task: Removing resources related to post ID ${payload.id}`);
          break;
        default:
          log.info("Unknown event type received.");
      }
    },
  });
};

run().catch((err) => log.error(err, "Consumer error"));