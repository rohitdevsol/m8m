import { TOPIC_NAME, kafka } from "@repo/kafka/client";
import { prisma } from "@repo/database";

(async () => {
  //make a producer instance
  const producer = kafka.producer();
  //connect the producer
  await producer.connect();

  //put an infininte loop

  while (1) {
    try {
      //find out the entries from execution queue
      const pendingEntries = await prisma.executionQueue.findMany({
        where: {},
        take: 10,
      });

      //send them to kafka via producer

      producer.send({
        topic: TOPIC_NAME,
        messages: pendingEntries.map((entry) => {
          return {
            value: JSON.stringify({ executionId: entry.executionId, stage: 0 }),
          };
        }),
      });

      //delete those from execution queue
      await prisma.executionQueue.deleteMany({
        where: {
          executionId: {
            in: pendingEntries.map((entry) => entry.executionId),
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
})();
