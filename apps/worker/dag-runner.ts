// dag-runner.ts

import {
  prisma,
  type Connection,
  type Credential,
  type Node,
  type User,
} from "@repo/database";
import { runNode } from "./node-runner";
import { createGraph } from "./utils/graph";
import { buildContext } from "./utils/context";
import { getNodeName } from "./utils/get-node-name";
import { toJsonSafe } from "./utils/json";

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
  credentials: Partial<Credential[]>,
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

    console.log("========: Running Node:", node.id);
    console.log(`[Node] name: ${node.name}`);
    console.log(`[Context]`, ctx.get());

    const name = getNodeName(node);
    const inputContext = ctx.get();

    let nodeRunId: string | null = null;

    try {
      const run = await prisma.nodeRun.create({
        data: {
          executionId,
          nodeId: node.id,
          nodeName: name,
          status: "LOADING",
          startedAt: new Date(),
          input: toJsonSafe(inputContext),
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 3000));
      nodeRunId = run.id;
      const output = await runNode(node, inputContext, user, credentials);

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
    } catch (err) {
      console.error(`[Node Failed] ${node.name}`, err);

      if (nodeRunId) {
        await prisma.nodeRun.update({
          where: { id: nodeRunId },
          data: {
            status: "ERROR",
            error:
              err instanceof Error ? err.stack || err.message : String(err),
            endedAt: new Date(),
          },
        });
      }

      throw err;
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
