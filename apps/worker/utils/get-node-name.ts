import type { Node } from "@repo/database";

export const getNodeName = (node: Node) => {
  if (node.type === "MANUAL_TRIGGER") return "manual";

  const name = (node.data as any)?.name;
  if (!name) {
    throw new Error(`Node ${node.id} has no name`);
  }
  return name;
};
