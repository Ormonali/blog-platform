import { Kafka } from "kafkajs";
import pino from "pino";

const log = pino({ transport: { target: "pino-pretty" } });

const KAFKA_BROKER = process.env.KAFKA_BROKER;
const KAFKA_TOPIC = process.env.KAFKA_TOPIC;
const KAFKA_CLIENT_ID = "blog-backend";

const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: [KAFKA_BROKER],
});

export const kafkaProducer = kafka.producer();

export async function initKafka() {
  log.info("Connecting Kafka producer...");
  await kafkaProducer.connect();
  log.info("Kafka producer connected.");
}

export async function sendPostCreatedEvent(post) {
  await kafkaProducer.send({
    topic: KAFKA_TOPIC,
    messages: [
      {
        value: JSON.stringify({ type: "post.created", payload: post }),
      },
    ],
  });
  log.info({ post_id: post.id }, `Event sent to Kafka on topic: ${KAFKA_TOPIC}`);
}