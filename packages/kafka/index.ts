import { Kafka } from "kafkajs";

export const TOPIC_NAME = "m8m";
export const CLIENT_ID = "workflow-processor";
const BROKER_URL = "localhost:9092";

export const kafka = new Kafka({
  brokers: [BROKER_URL],
  clientId: CLIENT_ID,
});
