import type { Credential, Node, User } from "@repo/database";
import { httpHandler } from "./executors/http";
import { manualTriggerHandler } from "./executors/manual";

export async function runNode(
  node: Node,
  context: Record<string, any>,
  user: Partial<User>,
  credentials: Partial<Credential[]>,
): Promise<any> {
  switch (node.type) {
    case "HTTP_REQUEST":
      return httpHandler({
        node,
        inputs: context,
        credentials,
      });

    case "MANUAL_TRIGGER":
      if (!user.id) {
        throw new Error("User missing in execution");
      }
      return manualTriggerHandler({
        userId: user.id,
      });

    case "INITIAL":
      return null;

    default:
      throw new Error(`Unknown node: ${node.type}`);
  }
}
