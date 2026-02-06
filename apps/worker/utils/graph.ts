import type { Node, Connection } from "@repo/database";

type GraphState = {
  indegreeMap: Record<string, number>;
  childrenMap: Record<string, string[]>;
  readyQueue: string[];
};

export function createGraph(
  nodes: Node[],
  connections: Connection[],
): GraphState {
  const indegreeMap: Record<string, number> = {};
  const childrenMap: Record<string, string[]> = {};
  const readyQueue: string[] = [];

  for (const node of nodes) {
    indegreeMap[node.id] = 0;
    childrenMap[node.id] = [];
  }

  for (const edge of connections) {
    const from = edge.fromNodeId;
    const to = edge.toNodeId;
    childrenMap[from]!.push(to);
    indegreeMap[to]!++;
  }

  for (const node of nodes) {
    if (indegreeMap[node.id] === 0) {
      readyQueue.push(node.id);
    }
  }

  return {
    indegreeMap,
    childrenMap,
    readyQueue,
  };
}
