import type { Node } from "@repo/database";
import { discordSchema } from "@repo/types";
import { resolveTemplate } from "../utils/template";

type discordHandlerProps = {
  node: Partial<Node>;
  inputs: Record<string, any>;
  userId: string;
};

export const discordHandler = async ({
  node,
  inputs,
  userId,
}: discordHandlerProps) => {
  const { content, webhookUrl, username } = discordSchema.parse(node.data);

  const resolvedContent = resolveTemplate(content, inputs);
  const resolvedWebhook = resolveTemplate(webhookUrl, inputs);

  if (!resolvedWebhook) {
    throw new Error("Discord webhook URL missing");
  }

  const payload: any = {
    content: resolvedContent,
  };

  if (username) payload.username = username;

  const res = await fetch(resolvedWebhook, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();

    throw new Error(`Discord webhook failed (${res.status}): ${text}`);
  }

  return {
    success: true,
    sentAt: new Date().toISOString(),
  };
};
