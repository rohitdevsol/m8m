import { httpHandler } from "./executors/http";
import { manualTriggerHandler } from "./executors/manual";

export async function runNode(
  node: any,
  outputs: Record<string, any>,
  credentials: any[],
) {
  switch (node.type) {
    case "HTTP_REQUEST":
      return await httpHandler({
        node,
        inputs: outputs,
        credentials,
      });

    // case "MANUAL_TRIGGER":
    //   return await manualTriggerHandler({
    //     node,
    //     inputs: outputs,
    //   });

    case "INITIAL":
      return null;

    default:
      throw new Error(`Unknown node: ${node.type}`);
  }
}
