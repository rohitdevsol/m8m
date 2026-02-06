import type { Credential, Node } from "@repo/database";
import { httpHandler } from "./executors/http";
import { manualTriggerHandler } from "./executors/manual";

function flattenInputs(inputs: Record<string, any>) {
  const result: Record<string, any> = {};

  for (const val of Object.values(inputs)) {
    if (val && typeof val === "object") {
      Object.assign(result, val);
    }
  }

  return result;
}

export async function runNode(
  node: Partial<Node>,
  outputs: Record<string, any>,
  credentials: Partial<Credential[]>,
) {
  const flatInputs = flattenInputs(outputs);
  switch (node.type) {
    case "HTTP_REQUEST":
      return await httpHandler({
        node,
        inputs: flatInputs,
        credentials,
      });
      break;

    case "MANUAL_TRIGGER":
      const { id: nodeId } = node;
      const output = await manualTriggerHandler({
        userId: credentials[0]?.userId!,
      });

      outputs[nodeId!] = output;
      break;

    case "INITIAL":
      return null;

    default:
      throw new Error(`Unknown node: ${node.type}`);
  }
}
