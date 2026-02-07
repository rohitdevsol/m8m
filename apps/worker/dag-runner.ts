// dag-runner.ts

import type { Connection, Credential, Node, User } from "@repo/database";
import { runNode } from "./node-runner";
import { createGraph } from "./utils/graph";
import { buildContext } from "./utils/context";
import { getNodeName } from "./utils/get-node-name";

export async function runDag(
  nodes: Node[],
  edges: Connection[],
  user: Partial<User>,
  credentials: Partial<Credential[]>,
) {
  console.log("========: Started a new workflow execution :======");

  const ctx = buildContext();

  const { childrenMap, indegreeMap, readyQueue } = createGraph(nodes, edges);

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  let processed = 0;

  while (readyQueue.length) {
    const nodeId = readyQueue.shift()!;
    const node = nodeMap.get(nodeId);

    if (!node) continue;

    console.log("========: Running Node: ", node.id);
    console.log(`[Node] name: ${node.name}`);
    console.log(`[Context]`, ctx.get());
    const output = await runNode(node, ctx.get(), user, credentials);

    const name = getNodeName(node);
    ctx.addStep(name, output);

    console.log(`[DAG] Node ${node.name} done`);

    processed++;

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
