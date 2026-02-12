// dag-runner.ts

import { prisma, type Connection, type Node, type User } from "@repo/database";
import { runNode } from "./node-runner";
import { createGraph } from "./utils/graph";
import { buildContext } from "./utils/context";
import { getNodeName } from "./utils/get-node-name";
import { toJsonSafe } from "./utils/json";
import { serializeError } from "./utils/error";
import { sleep } from "./utils/sleep";

const BASE_DELAY = 2000;

const TRIGGER_TYPES = new Set([
  "MANUAL_TRIGGER",
  "GOOGLE_FORM_TRIGGER",
  "STRIPE_TRIGGER",
  "WEBHOOK_TRIGGER",
]);

export async function runDag(
  executionId: string,
  nodes: Node[],
  edges: Connection[],
  user: Partial<User>,
  triggerData?: any,
) {
  console.log("========: Started a new workflow execution :======");

  const ctx = buildContext();

  const triggerNode = nodes.find((n) => TRIGGER_TYPES.has(n.type));

  if (triggerData && triggerNode) {
    const name = getNodeName(triggerNode);
    ctx.setTrigger(triggerData, name);
  }

  const { childrenMap, indegreeMap, readyQueue } = createGraph(nodes, edges);

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  let processed = 0;

  while (readyQueue.length) {
    const nodeId = readyQueue.shift()!;
    const node = nodeMap.get(nodeId);

    if (!node) continue;

    console.log("=--= Running Node =--=", node.id);
    console.log(`=--= Node name =--=: ${node.name}`);
    console.log(`=--= Context =--=`, ctx.get());

    const name = getNodeName(node);
    const inputContext = ctx.get();

    const run = await prisma.nodeRun.create({
      data: {
        executionId,
        nodeId: node.id,
        nodeName: name,
        status: "LOADING",
        startedAt: new Date(),
        input: toJsonSafe(inputContext),
        attempts: 0,
        maxAttempts: 3,
      },
    });

    const nodeRunId = run.id;
    const maxAttempts = run.maxAttempts;
    let attempt = 0;
    let output: any = null;
    let success = false;

    //retry one node
    while (attempt < maxAttempts) {
      attempt++;

      await prisma.nodeRun.update({
        where: { id: nodeRunId },
        data: {
          attempts: attempt,
          status: attempt === 1 ? "LOADING" : "RETRYING",
        },
      });

      try {
        console.log(`[Node] ${node.name} attempt ${attempt}/${maxAttempts}`);
        output = await runNode(node, ctx.get(), user);
        await prisma.nodeRun.update({
          where: { id: nodeRunId },
          data: {
            status: "SUCCESS",
            output: toJsonSafe(output),
            endedAt: new Date(),
          },
        });
        ctx.addStep(name, output);
        console.log(`[DAG] Node ${node.name} done`);
        processed++;
        success = true;

        break; //break the loop .. node succeded
      } catch (error) {
        const serialized = serializeError(error);
        const isLast = attempt >= maxAttempts;

        if (isLast) {
          await prisma.nodeRun.update({
            where: {
              id: nodeRunId,
            },
            data: {
              status: "ERROR",
              error: serialized.message,
              errorStack: serialized.stack
                ? serialized.stack
                : serialized.raw
                  ? JSON.stringify(serialized.raw, null, 2)
                  : null,
              endedAt: new Date(),
            },
          });
          console.error(`[Node Failed] ${node.name}`, serialized.message);

          throw error;
        }

        //if it is not last
        const delay = BASE_DELAY * Math.pow(2, attempt - 1);
        console.warn(
          `[Retry] ${node.name} attempt ${attempt} failed → retry in ${delay}ms`,
        );

        await sleep(delay);
      }
    }

    if (!success) {
      throw new Error(`Node ${node.name} did not succeed`);
    }

    const children = childrenMap[nodeId] ?? [];

    for (const child of children) {
      indegreeMap[child]!--;

      if (indegreeMap[child] === 0) {
        readyQueue.push(child);
      }
    }
  }

  if (processed !== nodes.length) {
    throw new Error("Cycle detected in workflow");
  }

  return ctx.get();
}
