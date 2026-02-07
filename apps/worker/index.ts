import "dotenv/config";
import { TOPIC_NAME, kafka } from "@repo/kafka/client";
import { prisma } from "@repo/database";
import { runExecution } from "./execution-runnner";
import { serializeError } from "./utils/error";

//this is the consumer which will get the data from producer(via kafka)

(async () => {
  //create a consumer and producer
  const consumer = kafka.consumer({
    groupId: "main",
  });

  //connect consumer
  await consumer.connect();

  //subscribe to a topic in kafka
  await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });

  //run the consumer
  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, message, partition }) => {
      if (!message.value) return;

      const { executionId } = JSON.parse(message.value.toString());

      try {
        await runExecution(executionId);
        await prisma.execution.update({
          where: { id: executionId },
          data: {
            status: "SUCCESS",
            completedAt: new Date(),
          },
        });
      } catch (err) {
        console.error("Execution failed:", err);

        const serialized = serializeError(err);

        await prisma.execution.update({
          where: { id: executionId },
          data: {
            status: "FAILED",
            errorStack: serialized.stack || null,
            error: serialized.message || "Unknown error",
          },
        });
      }

      // always commit
      await consumer.commitOffsets([
        {
          topic,
          partition,
          offset: (Number(message.offset) + 1).toString(),
        },
      ]);
    },
  });
})();
