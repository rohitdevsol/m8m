import type { Credential, Node, User } from "@repo/database";
import { httpHandler } from "./executors/http";
import { geminiHandler } from "./executors/gemini";
import { openAIHandler } from "./executors/openai";
export async function runNode(
  node: Node,
  context: Record<string, any>,
  user: Partial<User>,
  credentials: Partial<Credential[]>,
): Promise<any> {
  switch (node.type) {
    case "MANUAL_TRIGGER":
    case "GOOGLE_FORM_TRIGGER":
    case "STRIPE_TRIGGER":
      return context.trigger;

    case "HTTP_REQUEST":
      return httpHandler({
        node,
        inputs: context,
        credentials,
      });

    case "GEMINI":
      return geminiHandler({
        node,
        inputs: context,
        credentials,
      });

    case "OPENAI":
      return openAIHandler({
        node,
        inputs: context,
        credentials,
      });

    case "INITIAL":
      return null;

    default:
      throw new Error(`Unknown node: ${node.type}`);
  }
}
