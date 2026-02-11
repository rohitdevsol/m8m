import type { Node, User } from "@repo/database";
import { httpHandler } from "./executors/http";
import { geminiHandler } from "./executors/gemini";
import { openAIHandler } from "./executors/openai";
import { discordHandler } from "./executors/discord";
import { telegramHandler } from "./executors/telegram";
export async function runNode(
  node: Node,
  context: Record<string, any>,
  user: Partial<User>,
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
      });

    case "GEMINI":
      return geminiHandler({
        node,
        inputs: context,
        userId: user.id!,
      });

    case "OPENAI":
      return openAIHandler({
        node,
        inputs: context,
        userId: user.id!,
      });

    case "DISCORD":
      return discordHandler({
        node,
        inputs: context,
        userId: user.id!,
      });

    case "TELEGRAM":
      return telegramHandler({
        node,
        inputs: context,
      });

    case "INITIAL":
      return null;

    default:
      throw new Error(`Unknown node: ${node.type}`);
  }
}
