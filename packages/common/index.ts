import Cryptr from "cryptr";
import type { Node, Connection } from "@repo/database";

const cryptr = new Cryptr(process.env.ENCRYPTION_KEY!);

export const encrypt = (text: string) => {
  return cryptr.encrypt(text);
};

export const decrypt = (text: string) => {
  return cryptr.decrypt(text);
};

export function snapshotWorkflow(nodes: Node[], connections: Connection[]) {
  return {
    nodes: nodes.map((n) => ({
      id: n.id,
      name: n.name,
      type: n.type,
      position: n.position,
      data: n.data,
    })),
    connections: connections.map((c) => ({
      id: c.id,
      fromNodeId: c.fromNodeId,
      toNodeId: c.toNodeId,
      fromOutput: c.fromOutput,
      toInput: c.toInput,
    })),
  };
}
