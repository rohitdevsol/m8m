import type { Connection, Credential, Node } from "@repo/database";
import { runNode } from "./node-runner";
import { createGraph } from "./utils/graph";

export async function runDag(
  nodes: Node[],
  edges: Connection[],
  credentials: Partial<Credential[]>,
) {
  const outputs: Record<string, any> = {};

  const { childrenMap, indegreeMap, readyQueue } = createGraph(nodes, edges);

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  let processed = 0;

  while (readyQueue.length > 0) {
    const nodeId = readyQueue.shift()!;
    const node = nodeMap.get(nodeId);

    if (!node) continue;

    console.log("Running:", node.type);

    const result = await runNode(node, outputs, credentials);
    console.log(`[DAG] Node ${nodeId} done`);

    outputs[nodeId] = result;
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

  return outputs;
}
