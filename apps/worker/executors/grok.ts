import "dotenv/config";
import { prisma, type Node } from "@repo/database";

import { resolveTemplate } from "../utils/template";
import OpenAI from "openai";
import { decrypt } from "@repo/common";
import { grokSchema } from "@repo/types";

type GrokHandlerProps = {
  node: Partial<Node>;
  inputs: Record<string, any>;
  userId: string;
};

export const grokHandler = async ({
  node,
  inputs,
  userId,
}: GrokHandlerProps) => {
  const parsed = grokSchema.parse(node.data);
  const { model, userPrompt, credentialId, systemPrompt } = parsed;

  const credential = await prisma.credential.findFirstOrThrow({
    where: {
      id: credentialId,
      userId: userId,
      type: "GROK",
    },
  });

  const resolvedPrompt = resolveTemplate(userPrompt, inputs) as string;
  const resolvedSystemPrompt = resolveTemplate(systemPrompt, inputs) as string;

  console.log("[resolvedPrompt]", resolvedPrompt);
  console.log("[resolvedSystemPrompt]", resolvedSystemPrompt);

  const defaultSystemPrompt = `You are a helpful assistant. You answer as concisely as possible.`;

  const grok = new OpenAI({
    apiKey: decrypt(credential.value),
    baseURL: "https://api.x.ai/v1",
  });

  const completion = await grok.chat.completions.create({
    model: model,
    messages: [
      {
        role: "system",
        content:
          resolvedSystemPrompt.length > 0
            ? resolvedSystemPrompt
            : defaultSystemPrompt,
      },
      {
        role: "user",
        content: resolvedPrompt,
      },
    ],
  });

  return completion?.choices[0]?.message?.content ?? "";
};
