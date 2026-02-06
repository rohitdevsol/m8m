import { TOPIC_NAME, kafka } from "@repo/kafka/client";
import { prisma } from "@repo/database";
import { createGraph } from "./utils/graph";

//this is the consumer which will get the data from producer(via kafka)

(async () => {
  //create a consumer and producer
  const consumer = kafka.consumer({
    groupId: "main",
  });

  const producer = kafka.producer();
  //connect producer
  await producer.connect();

  //connect consumer
  await consumer.connect();

  //subscribe to a topic in kafka
  await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });

  //run the consumer
  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, message, partition }) => {
      //return if there is no message
      if (!message.value?.toString()) {
        return;
      }

      //parse the message value
      const data = JSON.parse(message.value.toString()) as {
        executionId: string;
      };
      const { executionId } = data;

      const executionDetails = await prisma.execution.findFirst({
        where: {
          id: executionId,
        },
        include: {
          workflow: {
            include: {
              //pick nodes and connections
              nodes: true,
              connections: true,
              //pick the user credentials
              user: {
                include: {
                  credentials: true,
                },
              },
            },
          },
        },
      });

      //check the execution status
      if (executionDetails?.status === "FAILED") {
        return;
      }

      const nodes = executionDetails?.workflow.nodes;
      const edges = executionDetails?.workflow.connections;

      if (!nodes?.length) {
        console.error("No nodes available");
        return;
      }
      if (!edges?.length) {
        console.error("No edges available");
        return;
      }

      const outputs: Record<string, any> = {};
      const { childrenMap, indegreeMap, readyQueue } = createGraph(
        nodes!,
        edges!,
      );

      while (readyQueue.length !== 0) {
        //get the nodeId
        const nodeId = readyQueue.shift()!;
        //find the node from nodes
        const node = nodes.find((n) => n.id === nodeId);
        if (!node) continue;

        //run some handler based on the nodeType

        //save the output

        // fixing for undefined
        const parent = childrenMap[nodeId] ?? [];
        for (const child of parent) {
          indegreeMap[child]!--;

          if (indegreeMap[child] === 0) {
            readyQueue.push(child);
          }
        }
      }
    },
  });
})();
